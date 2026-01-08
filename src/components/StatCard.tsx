import { LucideIcon } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';

interface StatCardProps {
  title: string;
  value: number;
  icon: LucideIcon;
  variant: 'total' | 'applied' | 'interview' | 'offer' | 'rejected';
}

const variantStyles = {
  total: 'from-primary/10 to-primary/5 border-primary/20',
  applied: 'from-blue-50 to-blue-100/50 border-blue-200 dark:from-blue-950/30 dark:to-blue-900/20 dark:border-blue-800',
  interview: 'from-amber-50 to-amber-100/50 border-amber-200 dark:from-amber-950/30 dark:to-amber-900/20 dark:border-amber-800',
  offer: 'from-emerald-50 to-emerald-100/50 border-emerald-200 dark:from-emerald-950/30 dark:to-emerald-900/20 dark:border-emerald-800',
  rejected: 'from-red-50 to-red-100/50 border-red-200 dark:from-red-950/30 dark:to-red-900/20 dark:border-red-800',
};

const iconStyles = {
  total: 'text-primary',
  applied: 'text-blue-600 dark:text-blue-400',
  interview: 'text-amber-600 dark:text-amber-400',
  offer: 'text-emerald-600 dark:text-emerald-400',
  rejected: 'text-red-600 dark:text-red-400',
};

export const StatCard = ({ title, value, icon: Icon, variant }: StatCardProps) => {
  return (
    <Card className={cn(
      'bg-gradient-to-br border transition-all duration-200 hover:shadow-md',
      variantStyles[variant]
    )}>
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-muted-foreground">{title}</p>
            <p className="text-3xl font-bold mt-1">{value}</p>
          </div>
          <div className={cn('p-3 rounded-xl bg-white/50 dark:bg-black/20', iconStyles[variant])}>
            <Icon className="h-6 w-6" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
