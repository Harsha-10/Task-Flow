import React, { useState, useMemo } from 'react';
import { useBugs } from '@/hooks/useBugs';
import { useAuth } from '@/contexts/AuthContext';
import { Issue } from '@/types';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Plus, Search, Filter, Edit, Trash2, CheckCircle, XCircle, Clock, MoreHorizontal } from 'lucide-react';
import BugForm from './BugForm';
import { useToast } from '@/hooks/use-toast';

const BugList: React.FC = () => {
  const { bugs, updateBug, deleteBug } = useBugs();
  const { user } = useAuth();
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [priorityFilter, setPriorityFilter] = useState<string>('all');
  const [selectedBug, setSelectedBug] = useState<Issue | null>(null);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);

  const filteredBugs = useMemo(() => {
    return bugs.filter(bug => {
      const matchesSearch = bug.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           bug.description.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesStatus = statusFilter === 'all' || bug.status === statusFilter;
      const matchesPriority = priorityFilter === 'all' || bug.priority === priorityFilter;
      
      return matchesSearch && matchesStatus && matchesPriority;
    });
  }, [bugs, searchTerm, statusFilter, priorityFilter]);

  const getPriorityColor = (priority: Issue['priority']) => {
    switch (priority) {
      case 'critical':
        return 'bg-red-50 text-red-800 border-red-200 hover:bg-red-100 transition-colors duration-200 cursor-pointer';
      case 'high':
        return 'bg-orange-50 text-orange-800 border-orange-200 hover:bg-orange-100 transition-colors duration-200 cursor-pointer';
      case 'medium':
        return 'bg-yellow-50 text-yellow-800 border-yellow-200 hover:bg-yellow-100 transition-colors duration-200 cursor-pointer';
      case 'low':
        return 'bg-green-50 text-green-800 border-green-200 hover:bg-green-100 transition-colors duration-200 cursor-pointer';
      default:
        return 'bg-gray-50 text-gray-800 border-gray-200 hover:bg-gray-100 transition-colors duration-200 cursor-pointer';
    }
  };

  const getStatusColor = (status: Issue['status']) => {
    switch (status) {
      case 'open':
        return 'bg-blue-50 text-blue-800 border-blue-200 hover:bg-blue-100 transition-colors duration-200 cursor-pointer';
      case 'in-progress':
        return 'bg-purple-50 text-purple-800 border-purple-200 hover:bg-purple-100 transition-colors duration-200 cursor-pointer';
      case 'pending-review':
        return 'bg-indigo-50 text-indigo-800 border-indigo-200 hover:bg-indigo-100 transition-colors duration-200 cursor-pointer';
      case 'closed':
        return 'bg-green-50 text-green-800 border-green-200 hover:bg-green-100 transition-colors duration-200 cursor-pointer';
      case 'pending-approval':
        return 'bg-yellow-50 text-yellow-800 border-yellow-200 hover:bg-yellow-100 transition-colors duration-200 cursor-pointer';
      default:
        return 'bg-gray-50 text-gray-800 border-gray-200 hover:bg-gray-100 transition-colors duration-200 cursor-pointer';
    }
  };

  const handleStatusChange = (bug: Issue, newStatus: string) => {
    updateBug(bug.id, { status: newStatus as Issue['status'] });
    toast({
      title: 'Bug Updated',
      description: `Bug status changed to ${newStatus.replace('-', ' ')}`,
    });
  };

  const handleDelete = (bug: Issue) => {
    if (window.confirm('Are you sure you want to delete this bug?')) {
      deleteBug(bug.id);
      toast({
        title: 'Bug Deleted',
        description: 'The bug has been successfully deleted.',
      });
    }
  };

  const canModifyBug = (bug: Issue) => {
    return user?.role === 'manager' || bug.assigneeId === user?.id;
  };

  const canApproveBug = (bug: Issue) => {
    return user?.role === 'manager' && bug.status === 'pending-approval';
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Bug Management</h1>
          <p className="text-gray-600 mt-2">Track and manage your bugs efficiently</p>
        </div>
        
        {user?.role === 'developer' && (
          <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Create Bug
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Create New Bug</DialogTitle>
                <DialogDescription>
                  Fill in the details to create a new bug report.
                </DialogDescription>
              </DialogHeader>
              <BugForm onClose={() => setIsCreateDialogOpen(false)} />
            </DialogContent>
          </Dialog>
        )}
      </div>

      
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Search bugs..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline">
                  <Filter className="h-4 w-4 mr-2" />
                  Status: {statusFilter === 'all' ? 'All' : statusFilter.replace('-', ' ')}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem onClick={() => setStatusFilter('all')}>All</DropdownMenuItem>
                <DropdownMenuItem onClick={() => setStatusFilter('open')}>Open</DropdownMenuItem>
                <DropdownMenuItem onClick={() => setStatusFilter('in-progress')}>In Progress</DropdownMenuItem>
                <DropdownMenuItem onClick={() => setStatusFilter('pending-approval')}>Pending Approval</DropdownMenuItem>
                <DropdownMenuItem onClick={() => setStatusFilter('closed')}>Closed</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline">
                  <Filter className="h-4 w-4 mr-2" />
                  Priority: {priorityFilter === 'all' ? 'All' : priorityFilter}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem onClick={() => setPriorityFilter('all')}>All</DropdownMenuItem>
                <DropdownMenuItem onClick={() => setPriorityFilter('critical')}>Critical</DropdownMenuItem>
                <DropdownMenuItem onClick={() => setPriorityFilter('high')}>High</DropdownMenuItem>
                <DropdownMenuItem onClick={() => setPriorityFilter('medium')}>Medium</DropdownMenuItem>
                <DropdownMenuItem onClick={() => setPriorityFilter('low')}>Low</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </CardContent>
      </Card>

      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {filteredBugs.map((bug) => (
          <Card key={bug.id} className="hover:shadow-md transition-shadow">
            <CardHeader>
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <CardTitle className="text-lg">{bug.title}</CardTitle>
                  <CardDescription className="mt-2">{bug.description}</CardDescription>
                </div>
                
                {canModifyBug(bug) && (
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="sm">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem 
                        onClick={() => {
                          setSelectedBug(bug);
                          setIsEditDialogOpen(true);
                        }}
                      >
                        <Edit className="h-4 w-4 mr-2" />
                        Edit
                      </DropdownMenuItem>
                      
                      {bug.status === 'open' && (
                        <DropdownMenuItem 
                          onClick={() => handleStatusChange(bug, 'in-progress')}
                        >
                          <Clock className="h-4 w-4 mr-2" />
                          Start Progress
                        </DropdownMenuItem>
                      )}
                      
                      {bug.status === 'in-progress' && user?.role === 'developer' && (
                        <DropdownMenuItem 
                          onClick={() => handleStatusChange(bug, 'pending-approval')}
                        >
                          <CheckCircle className="h-4 w-4 mr-2" />
                          Mark for Review
                        </DropdownMenuItem>
                      )}
                      
                      {canApproveBug(bug) && (
                        <>
                          <DropdownMenuItem 
                            onClick={() => handleStatusChange(bug, 'closed')}
                          >
                            <CheckCircle className="h-4 w-4 mr-2" />
                            Approve & Close
                          </DropdownMenuItem>
                          <DropdownMenuItem 
                            onClick={() => handleStatusChange(bug, 'open')}
                          >
                            <XCircle className="h-4 w-4 mr-2" />
                            Reopen
                          </DropdownMenuItem>
                        </>
                      )}
                      
                      <DropdownMenuItem 
                        onClick={() => handleDelete(bug)}
                        className="text-red-600"
                      >
                        <Trash2 className="h-4 w-4 mr-2" />
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                )}
              </div>
            </CardHeader>
            
            <CardContent>
              <div className="space-y-4">
                <div className="flex flex-wrap gap-2">
                  <Badge className={getPriorityColor(bug.priority)}>
                    {bug.priority}
                  </Badge>
                  <Badge className={getStatusColor(bug.status)}>
                    {bug.status.replace('-', ' ')}
                  </Badge>
                  {bug.tags.map(tag => (
                    <Badge key={tag} variant="outline">
                      {tag}
                    </Badge>
                  ))}
                </div>
                
                <div className="grid grid-cols-2 gap-4 text-sm text-gray-600">
                  <div>
                    <span className="font-medium">Assignee:</span> {bug.assigneeName}
                  </div>
                  <div>
                    <span className="font-medium">Project:</span> {bug.project}
                  </div>
                  <div>
                    <span className="font-medium">Created:</span> {new Date(bug.createdAt).toLocaleDateString()}
                  </div>
                  <div>
                    <span className="font-medium">Time Spent:</span> {bug.actualHours}h
                  </div>
                </div>
                
                {bug.dueDate && (
                  <div className="text-sm">
                    <span className="font-medium text-gray-600">Due Date:</span>
                    <span className={`ml-2 ${new Date(bug.dueDate) < new Date() ? 'text-red-600 font-medium' : 'text-gray-600'}`}>
                      {new Date(bug.dueDate).toLocaleDateString()}
                    </span>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredBugs.length === 0 && (
        <Card>
          <CardContent className="pt-6 text-center py-12">
            <div className="text-gray-500">
              <p className="text-lg font-medium">No bugs found</p>
              <p className="mt-2">Try adjusting your search or filter criteria.</p>
            </div>
          </CardContent>
        </Card>
      )}

      
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Edit Bug</DialogTitle>
            <DialogDescription>
              Update the bug details below.
            </DialogDescription>
          </DialogHeader>
          {selectedBug && (
            <BugForm 
              bug={selectedBug} 
              onClose={() => {
                setIsEditDialogOpen(false);
                setSelectedBug(null);
              }} 
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default BugList;
