import { Briefcase, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface EmptyStateProps {
  onAddClick: () => void;
  hasFilters?: boolean;
}

export const EmptyState = ({ onAddClick, hasFilters }: EmptyStateProps) => {
  if (hasFilters) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center">
        <div className="p-4 bg-muted rounded-full mb-4">
          <Briefcase className="h-8 w-8 text-muted-foreground" />
        </div>
        <h3 className="text-lg font-medium mb-2">No applications found</h3>
        <p className="text-muted-foreground max-w-sm">
          Try adjusting your search or filters to find what you're looking for.
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      <div className="p-4 bg-primary/10 rounded-full mb-4">
        <Briefcase className="h-8 w-8 text-primary" />
      </div>
      <h3 className="text-lg font-medium mb-2">No applications yet</h3>
      <p className="text-muted-foreground mb-6 max-w-sm">
        Start tracking your job search by adding your first application.
      </p>
      <Button onClick={onAddClick}>
        <Plus className="h-4 w-4 mr-2" />
        Add Your First Application
      </Button>
    </div>
  );
};
