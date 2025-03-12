import { Component, inject, OnInit, HostListener } from '@angular/core';
import { SubmissionsService } from '../../services/submissions.service';
import { SubmissionModel } from '../../model/interface/submission.model';
import { DatePipe } from '@angular/common';
import { jsPDF } from 'jspdf';
import 'jspdf-autotable';

@Component({
  selector: 'app-submissions',
  templateUrl: './submissions.component.html',
  styleUrl: './submissions.component.css',
})
export class SubmissionsComponent implements OnInit {
  constructor(
    private datePipe: DatePipe,
    private submissionService: SubmissionsService
  ) {}

  type: string = "";
  status: string = "";
  currentComponent: string = "Map";
  selectedDate: string = "";
  searchTerm: string = '';
  submissionList: SubmissionModel[] = [];
  filteredSubmissionList: SubmissionModel[] = [];
  p: number = 1;
  itemsPerPage: number = 10;
  totalSubmissions: number = 0;
  loadedItems: number = 10;
  geocoder = new google.maps.Geocoder();
  zoom = 12;
  markerPositions: google.maps.LatLngLiteral[] = [];
  center: google.maps.LatLngLiteral = { lat: 0, lng: 0 };
  taskTypes: string[] = [];
  statusOptions: string[] = [];

  get startIndex(): number {
    return (this.p - 1) * this.itemsPerPage + 1;
  }

  get endIndex(): number {
    return Math.min(this.p * this.itemsPerPage, this.totalSubmissions);
  }

  ngOnInit(): void {
    this.submissionService.getSubmissions().subscribe((result: SubmissionModel[]) => {
      this.submissionList = result;
      this.filteredSubmissionList = result;
      this.totalSubmissions = result.length;
      this.taskTypes = [...new Set(this.submissionList.map(submission => submission.task?.type))];
      this.statusOptions = [...new Set(this.submissionList.map(submission => submission.status?.type))];
      this.loadMarkers();
      this.setMapCenter();
    });
  }

  loadMarkers() {
    this.markerPositions = []; 
    this.filteredSubmissionList.forEach(submission => {
      const address = submission.customer_address;
      
      this.geocoder.geocode({ address }, (results, status) => {
        if (status === 'OK' && results && results[0]) {
          const position = results[0].geometry.location;
          
          this.markerPositions.push({
            lat: position.lat(),
            lng: position.lng(),
          });
        } else {
          console.error('Geocode was not successful: ' + status);
        }
      });
    });
  }

  setMapCenter() {
    if (this.submissionList.length > 0) {
      const firstAddress = this.submissionList[0].customer_address;
      this.geocoder.geocode({ address: firstAddress }, (results, status) => {
        if (status === 'OK' && results && results[0]) {
          const position = results[0].geometry.location;
          this.center = {
            lat: position.lat(),
            lng: position.lng(),
          };
        } else {
          console.error('It was not possible to geocode the first address: ' + status);
        }
      });
    }
  }

  centerMapToAddress(address: string) {
    this.geocoder.geocode({ address: address }, (results, status) => {
      if (status === 'OK' && results && results[0]) {
        const position = results[0].geometry.location;
        this.center = {
          lat: position.lat(),
          lng: position.lng(),
        };
        this.zoom = 20;
      } else {
        console.error('It was not possible to geocode the address: ' + status);
      }
    });
  }  

  changeTab(tabName: string) {
    this.currentComponent = tabName;
  }

  selectAllTasks(event: any) {
    const isChecked = event.target.checked;
    this.submissionList.forEach(submission => {
      submission.selected = isChecked;
    });
  }

  @HostListener("window:scroll", ["$event"])
  onScroll(event: any) {
    const element = event.target;
    if (element.offsetHeight + element.scrollTop >= element.scrollHeight) {
      this.loadMore();
    }
  }

  loadMore() {
    if (this.loadedItems < this.submissionList.length) {
      this.loadedItems += 10;
    }
  }

  filterList() {
    this.filteredSubmissionList = this.submissionList.filter(submission => {
      const taskMatch = this.type ? submission.task.type === this.type : true;
      const statusMatch = this.status ? submission.status.type === this.status : true;
      const searchMatch = this.searchTerm ? submission.task.title.toLowerCase().includes(this.searchTerm.toLowerCase()) : true;
      const dateMatch = this.selectedDate ? this.datePipe.transform(submission.due_date, 'yyyy-MM-dd') === this.selectedDate : true;
  
      return taskMatch && statusMatch && searchMatch && dateMatch;
    });
    this.loadMarkers(); 
  }
  
  generatePDF() {
    const doc = new jsPDF();
    doc.setFontSize(16);
    doc.text('Submissions', 10, 10); 
    let y = 20;
  
    this.filteredSubmissionList.forEach(submission => {
      doc.setFontSize(12);
      doc.text('Task: ' + submission.task.title, 10, y);
      y += 10;
  
      doc.text('Status: ' + submission.status.title, 10, y);
      y += 10;
  
      doc.text('Customer Address: ' + submission.customer_address, 10, y);
      y += 10;
  
      doc.text('From: ' + submission.from, 10, y);
      y += 10;
  
      doc.text('To: ' + submission.to, 10, y);
      y += 10;
  
      doc.text('Due Date: ' + this.datePipe.transform(submission.due_date, 'MMM d, yyyy'), 10, y);
      y += 15;
  
      if (y > 250) {
        doc.addPage();
        y = 20; 
      }
    });

    doc.save('submissions_report.pdf');
  }
  
}
