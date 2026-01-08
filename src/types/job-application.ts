export type JobStatus = 'Applied' | 'Interview' | 'Offer' | 'Rejected';
export type JobType = 'Internship' | 'Full-time';

export interface JobApplication {
  id: string;
  company_name: string;
  job_role: string;
  job_type: JobType;
  application_date: string;
  status: JobStatus;
  notes: string | null;
  created_at: string;
  updated_at: string;
}

export interface JobApplicationFormData {
  company_name: string;
  job_role: string;
  job_type: JobType;
  application_date: string;
  status: JobStatus;
  notes: string;
}
