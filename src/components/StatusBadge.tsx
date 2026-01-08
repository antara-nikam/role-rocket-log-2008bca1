import { Badge } from '@/components/ui/badge';
import { JobStatus } from '@/types/job-application';
import { cn } from '@/lib/utils';

interface StatusBadgeProps {
  status: JobStatus;
  className?: string;
}

const statusStyles: Record<JobStatus, string> = {
  Applied: 'status-applied',
  Interview: 'status-interview',
  Offer: 'status-offer',
  Rejected: 'status-rejected',
};

export const StatusBadge = ({ status, className }: StatusBadgeProps) => {
  return (
    <Badge 
      variant="secondary" 
      className={cn('font-medium', statusStyles[status], className)}
    >
      {status}
    </Badge>
  );
};
