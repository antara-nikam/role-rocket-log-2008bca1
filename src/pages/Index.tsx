import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, FileText, Send, CalendarCheck, Trophy, XCircle, BarChart3, Clock, Download, LogOut } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { StatCard } from '@/components/StatCard';
import { FilterBar } from '@/components/FilterBar';
import { JobApplicationCard } from '@/components/JobApplicationCard';
import { JobApplicationForm } from '@/components/JobApplicationForm';
import { EmptyState } from '@/components/EmptyState';
import { FollowUpReminder } from '@/components/FollowUpReminder';
import { useJobApplications } from '@/hooks/useJobApplications';
import { useAuth } from '@/hooks/useAuth';
import { exportToCSV } from '@/utils/exportToCsv';
import { JobApplication, JobApplicationFormData, JobStatus, JobType } from '@/types/job-application';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { toast } from 'sonner';

const Index = () => {
  const navigate = useNavigate();
  const { user, signOut } = useAuth();
  const { applications, isLoading, addApplication, updateApplication, deleteApplication } = useJobApplications();
  
  const [formOpen, setFormOpen] = useState(false);
  const [editingApplication, setEditingApplication] = useState<JobApplication | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<JobStatus | 'all'>('all');
  const [typeFilter, setTypeFilter] = useState<JobType | 'all'>('all');

  const stats = useMemo(() => ({
    total: applications.length,
    applied: applications.filter(a => a.status === 'Applied').length,
    interview: applications.filter(a => a.status === 'Interview').length,
    offer: applications.filter(a => a.status === 'Offer').length,
    rejected: applications.filter(a => a.status === 'Rejected').length,
  }), [applications]);

  const filteredApplications = useMemo(() => {
    return applications.filter(app => {
      const matchesSearch = 
        app.company_name.toLowerCase().includes(search.toLowerCase()) ||
        app.job_role.toLowerCase().includes(search.toLowerCase());
      const matchesStatus = statusFilter === 'all' || app.status === statusFilter;
      const matchesType = typeFilter === 'all' || app.job_type === typeFilter;
      return matchesSearch && matchesStatus && matchesType;
    });
  }, [applications, search, statusFilter, typeFilter]);

  const hasFilters = search !== '' || statusFilter !== 'all' || typeFilter !== 'all';

  const handleSubmit = (data: JobApplicationFormData) => {
    if (editingApplication) {
      updateApplication.mutate({ ...data, id: editingApplication.id }, {
        onSuccess: () => {
          setFormOpen(false);
          setEditingApplication(null);
        },
      });
    } else {
      addApplication.mutate(data, {
        onSuccess: () => {
          setFormOpen(false);
        },
      });
    }
  };

  const handleEdit = (application: JobApplication) => {
    setEditingApplication(application);
    setFormOpen(true);
  };

  const handleDelete = (id: string) => {
    setDeleteId(id);
  };

  const confirmDelete = () => {
    if (deleteId) {
      deleteApplication.mutate(deleteId);
      setDeleteId(null);
    }
  };

  const clearFilters = () => {
    setSearch('');
    setStatusFilter('all');
    setTypeFilter('all');
  };

  const handleExport = () => {
    if (applications.length === 0) {
      toast.error('No applications to export');
      return;
    }
    exportToCSV(applications);
    toast.success('Applications exported successfully!');
  };

  const handleSignOut = async () => {
    await signOut();
    toast.success('Signed out successfully');
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card/50 backdrop-blur-sm sticky top-0 z-10">
        <div className="container max-w-6xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-primary rounded-lg">
                <FileText className="h-5 w-5 text-primary-foreground" />
              </div>
              <div>
                <h1 className="text-xl font-bold">Job Tracker</h1>
                <p className="text-sm text-muted-foreground hidden sm:block">{user?.email}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" onClick={() => navigate('/analytics')}>
                <BarChart3 className="h-4 w-4 mr-2" />
                <span className="hidden sm:inline">Analytics</span>
              </Button>
              <Button variant="outline" size="sm" onClick={() => navigate('/timeline')}>
                <Clock className="h-4 w-4 mr-2" />
                <span className="hidden sm:inline">Timeline</span>
              </Button>
              <Button variant="outline" size="sm" onClick={handleExport}>
                <Download className="h-4 w-4 mr-2" />
                <span className="hidden sm:inline">Export</span>
              </Button>
              <Button variant="ghost" size="icon" onClick={handleSignOut}>
                <LogOut className="h-4 w-4" />
              </Button>
              <Button onClick={() => { setEditingApplication(null); setFormOpen(true); }}>
                <Plus className="h-4 w-4 mr-2" />
                <span className="hidden sm:inline">Add Application</span>
                <span className="sm:hidden">Add</span>
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="container max-w-6xl mx-auto px-4 py-8">
        {/* Follow-up Reminders */}
        <div className="mb-6">
          <FollowUpReminder applications={applications} />
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
          <StatCard title="Total" value={stats.total} icon={FileText} variant="total" />
          <StatCard title="Applied" value={stats.applied} icon={Send} variant="applied" />
          <StatCard title="Interview" value={stats.interview} icon={CalendarCheck} variant="interview" />
          <StatCard title="Offers" value={stats.offer} icon={Trophy} variant="offer" />
          <StatCard title="Rejected" value={stats.rejected} icon={XCircle} variant="rejected" />
        </div>

        {/* Filter Bar */}
        <div className="mb-6">
          <FilterBar
            search={search}
            onSearchChange={setSearch}
            statusFilter={statusFilter}
            onStatusFilterChange={setStatusFilter}
            typeFilter={typeFilter}
            onTypeFilterChange={setTypeFilter}
            onClearFilters={clearFilters}
            hasFilters={hasFilters}
          />
        </div>

        {/* Applications List */}
        {isLoading ? (
          <div className="grid gap-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="h-32 bg-muted animate-pulse rounded-lg" />
            ))}
          </div>
        ) : filteredApplications.length === 0 ? (
          <EmptyState 
            onAddClick={() => { setEditingApplication(null); setFormOpen(true); }} 
            hasFilters={hasFilters}
          />
        ) : (
          <div className="grid gap-4">
            {filteredApplications.map(application => (
              <JobApplicationCard
                key={application.id}
                application={application}
                onEdit={handleEdit}
                onDelete={handleDelete}
              />
            ))}
          </div>
        )}
      </main>

      {/* Add/Edit Form Modal */}
      <JobApplicationForm
        open={formOpen}
        onOpenChange={(open) => {
          setFormOpen(open);
          if (!open) setEditingApplication(null);
        }}
        onSubmit={handleSubmit}
        editingApplication={editingApplication}
        isLoading={addApplication.isPending || updateApplication.isPending}
      />

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Application?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete this job application from your tracker.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default Index;
