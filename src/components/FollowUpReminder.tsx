import { useMemo } from 'react';
import { Bell, Calendar, X } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { JobApplication } from '@/types/job-application';
import { format, parseISO, isToday, isTomorrow, isPast, differenceInDays } from 'date-fns';

interface FollowUpReminderProps {
  applications: JobApplication[];
  onDismiss?: (id: string) => void;
}

export const FollowUpReminder = ({ applications, onDismiss }: FollowUpReminderProps) => {
  const reminders = useMemo(() => {
    return applications
      .filter(app => app.follow_up_date && (app.status === 'Applied' || app.status === 'Interview'))
      .map(app => {
        const followUpDate = parseISO(app.follow_up_date!);
        const daysUntil = differenceInDays(followUpDate, new Date());
        const isOverdue = isPast(followUpDate) && !isToday(followUpDate);
        
        return {
          ...app,
          followUpDate,
          daysUntil,
          isOverdue,
          isToday: isToday(followUpDate),
          isTomorrow: isTomorrow(followUpDate),
        };
      })
      .filter(app => app.daysUntil <= 7 || app.isOverdue)
      .sort((a, b) => a.followUpDate.getTime() - b.followUpDate.getTime());
  }, [applications]);

  if (reminders.length === 0) {
    return null;
  }

  return (
    <Card className="border-amber-200 bg-amber-50/50 dark:border-amber-900 dark:bg-amber-900/20">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-lg">
          <Bell className="h-5 w-5 text-amber-600" />
          Follow-up Reminders
          <Badge variant="secondary" className="ml-2">{reminders.length}</Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {reminders.map(reminder => (
          <div 
            key={reminder.id} 
            className={`flex items-center justify-between p-3 rounded-lg ${
              reminder.isOverdue 
                ? 'bg-red-100 dark:bg-red-900/30' 
                : reminder.isToday 
                  ? 'bg-amber-100 dark:bg-amber-900/30'
                  : 'bg-white dark:bg-card'
            }`}
          >
            <div className="flex items-center gap-3">
              <Calendar className={`h-4 w-4 ${
                reminder.isOverdue ? 'text-red-600' : 'text-amber-600'
              }`} />
              <div>
                <p className="font-medium text-sm">{reminder.company_name} - {reminder.job_role}</p>
                <p className={`text-xs ${
                  reminder.isOverdue 
                    ? 'text-red-600 font-medium' 
                    : 'text-muted-foreground'
                }`}>
                  {reminder.isOverdue 
                    ? `Overdue by ${Math.abs(reminder.daysUntil)} day${Math.abs(reminder.daysUntil) > 1 ? 's' : ''}`
                    : reminder.isToday 
                      ? 'Follow up today!'
                      : reminder.isTomorrow
                        ? 'Follow up tomorrow'
                        : `Follow up in ${reminder.daysUntil} days`
                  }
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs text-muted-foreground">
                {format(reminder.followUpDate, 'MMM d')}
              </span>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
};
