import { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Circle, CheckCircle2, XCircle, Clock, Trophy } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { StatusBadge } from '@/components/StatusBadge';
import { useJobApplications } from '@/hooks/useJobApplications';
import { format, parseISO } from 'date-fns';
import { JobStatus } from '@/types/job-application';

const statusIcons: Record<JobStatus, typeof Circle> = {
  Applied: Circle,
  Interview: Clock,
  Offer: Trophy,
  Rejected: XCircle,
};

const Timeline = () => {
  const navigate = useNavigate();
  const { applications, isLoading } = useJobApplications();

  const sortedApplications = useMemo(() => {
    return [...applications].sort((a, b) => 
      new Date(b.application_date).getTime() - new Date(a.application_date).getTime()
    );
  }, [applications]);

  const groupedByDate = useMemo(() => {
    const groups: Record<string, typeof applications> = {};
    sortedApplications.forEach(app => {
      const date = app.application_date;
      if (!groups[date]) {
        groups[date] = [];
      }
      groups[date].push(app);
    });
    return groups;
  }, [sortedApplications]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background p-8">
        <div className="max-w-3xl mx-auto space-y-4">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="h-24 bg-muted animate-pulse rounded-lg" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b bg-card/50 backdrop-blur-sm sticky top-0 z-10">
        <div className="container max-w-3xl mx-auto px-4 py-4">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" onClick={() => navigate('/')}>
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <div>
              <h1 className="text-xl font-bold">Timeline View</h1>
              <p className="text-sm text-muted-foreground">Your application journey</p>
            </div>
          </div>
        </div>
      </header>

      <main className="container max-w-3xl mx-auto px-4 py-8">
        {applications.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center">
              <p className="text-muted-foreground">No applications yet. Start tracking your job search!</p>
              <Button className="mt-4" onClick={() => navigate('/')}>
                Add Your First Application
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="relative">
            {/* Timeline line */}
            <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-border" />

            {Object.entries(groupedByDate).map(([date, apps]) => (
              <div key={date} className="mb-8">
                {/* Date header */}
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-12 h-12 rounded-full bg-primary flex items-center justify-center text-primary-foreground font-semibold text-sm z-10">
                    {format(parseISO(date), 'd')}
                  </div>
                  <div>
                    <p className="font-semibold">{format(parseISO(date), 'EEEE')}</p>
                    <p className="text-sm text-muted-foreground">{format(parseISO(date), 'MMMM d, yyyy')}</p>
                  </div>
                </div>

                {/* Applications for this date */}
                <div className="ml-16 space-y-3">
                  {apps.map(app => {
                    const StatusIcon = statusIcons[app.status];
                    return (
                      <Card key={app.id} className="card-hover">
                        <CardContent className="p-4">
                          <div className="flex items-start justify-between">
                            <div className="flex items-start gap-3">
                              <StatusIcon className={`h-5 w-5 mt-0.5 ${
                                app.status === 'Offer' ? 'text-emerald-600' :
                                app.status === 'Rejected' ? 'text-red-600' :
                                app.status === 'Interview' ? 'text-amber-600' :
                                'text-blue-600'
                              }`} />
                              <div>
                                <h3 className="font-semibold">{app.job_role}</h3>
                                <p className="text-sm text-muted-foreground">{app.company_name}</p>
                                {app.notes && (
                                  <p className="text-sm text-muted-foreground mt-2 italic">"{app.notes}"</p>
                                )}
                              </div>
                            </div>
                            <StatusBadge status={app.status} />
                          </div>
                        </CardContent>
                      </Card>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

export default Timeline;
