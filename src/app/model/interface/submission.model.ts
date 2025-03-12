export interface TaskModel {
    title: string;
    type: string;
  }
  
  export interface StatusModel {
    title: string;
    type: string;
  }
  
  export interface SubmissionModel {
    id: number;
    task: TaskModel;
    status: StatusModel;
    from: string;
    to: string;
    customer_address: string;
    due_date: string;
    selected: boolean;
  }
  
  export interface SubmissionResponseModel {
    data: SubmissionModel[];
  }
  