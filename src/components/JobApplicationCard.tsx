import { Pencil, Trash2, Building2, Briefcase, Calendar } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { StatusBadge } from './StatusBadge';
import { JobApplication } from '@/types/job-application';
import { format } from 'date-fns';

interface JobApplicationCardProps {
  application: JobApplication;
  onEdit: (application: JobApplication) => void;
  onDelete: (id: string) => void;
}

export const JobApplicationCard = ({ application, onEdit, onDelete }: JobApplicationCardProps) => {
  return (
    <Card className="card-hover animate-fade-in">
      <CardContent className="p-5">
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-2">
              <h3 className="font-semibold text-lg truncate">{application.company_name}</h3>
              <StatusBadge status={application.status} />
            </div>
            
            <div className="space-y-1.5 text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <Briefcase className="h-4 w-4 shrink-0" />
                <span className="truncate">{application.job_role}</span>
                <span className="px-2 py-0.5 bg-secondary rounded text-xs font-medium">
                  {application.job_type}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 shrink-0" />
                <span>{format(new Date(application.application_date), 'MMM d, yyyy')}</span>
              </div>
            </div>
            
            {application.notes && (
              <p className="mt-3 text-sm text-muted-foreground line-clamp-2 bg-muted/50 p-2 rounded">
                {application.notes}
              </p>
            )}
          </div>
          
          <div className="flex gap-1 shrink-0">
            <Button 
              variant="ghost" 
              size="icon" 
              className="h-8 w-8 text-muted-foreground hover:text-primary"
              onClick={() => onEdit(application)}
            >
              <Pencil className="h-4 w-4" />
            </Button>
            <Button 
              variant="ghost" 
              size="icon" 
              className="h-8 w-8 text-muted-foreground hover:text-destructive"
              onClick={() => onDelete(application.id)}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
