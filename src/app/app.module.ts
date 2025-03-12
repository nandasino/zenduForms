import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppComponent } from './app.component';
import { NgxPaginationModule } from 'ngx-pagination';
import { RouterModule } from '@angular/router';
import { routes } from './app.routes';
import { FormsModule } from '@angular/forms';
import { SubmissionsComponent } from './components/submissions/submissions.component';
import { provideHttpClient } from '@angular/common/http';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { DatePipe } from '@angular/common';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { MasterComponent } from './components/master/master.component';
import { HeaderComponent } from './components/header/header.component';
import { GoogleMapsModule } from '@angular/google-maps';

@NgModule({
  declarations: [
    AppComponent,
    SubmissionsComponent,
    MasterComponent,
    HeaderComponent
  ],
  imports: [
    BrowserModule,
    NgxPaginationModule,
    FormsModule,
    RouterModule.forRoot(routes),
    NgxDatatableModule,
    GoogleMapsModule
  ],
  providers: [provideHttpClient(), provideAnimationsAsync(),DatePipe],
  bootstrap: [AppComponent]
})
export class AppModule { }
