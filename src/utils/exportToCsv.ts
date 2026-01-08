import { JobApplication } from '@/types/job-application';
import { format } from 'date-fns';

export const exportToCSV = (applications: JobApplication[], filename?: string) => {
  const headers = [
    'Company Name',
    'Job Role',
    'Job Type',
    'Status',
    'Application Date',
    'Follow-up Date',
    'Notes',
    'Created At',
    'Updated At',
  ];

  const rows = applications.map(app => [
    app.company_name,
    app.job_role,
    app.job_type,
    app.status,
    app.application_date,
    app.follow_up_date || '',
    app.notes || '',
    format(new Date(app.created_at), 'yyyy-MM-dd HH:mm:ss'),
    format(new Date(app.updated_at), 'yyyy-MM-dd HH:mm:ss'),
  ]);

  const csvContent = [
    headers.join(','),
    ...rows.map(row => 
      row.map(cell => {
        // Escape quotes and wrap in quotes if contains comma or newline
        const escaped = String(cell).replace(/"/g, '""');
        return /[,\n"]/.test(escaped) ? `"${escaped}"` : escaped;
      }).join(',')
    ),
  ].join('\n');

  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);
  
  link.setAttribute('href', url);
  link.setAttribute('download', filename || `job-applications-${format(new Date(), 'yyyy-MM-dd')}.csv`);
  link.style.visibility = 'hidden';
  
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  
  URL.revokeObjectURL(url);
};
