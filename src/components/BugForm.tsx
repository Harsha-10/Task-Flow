import React, { useState } from 'react';
import { useBugs } from '@/hooks/useBugs';
import { useAuth } from '@/contexts/AuthContext';
import { Issue } from '@/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';

interface BugFormProps {
  bug?: Issue;
  onClose: () => void;
}

const BugForm: React.FC<BugFormProps> = ({ bug, onClose }) => {
  const { createBug, updateBug } = useBugs();
  const { user } = useAuth();
  const { toast } = useToast();
  
  const [formData, setFormData] = useState({
    title: bug?.title || '',
    description: bug?.description || '',
    priority: bug?.priority || 'medium',
    status: bug?.status || 'open',
    assigneeId: bug?.assigneeId || user?.id || '',
    assigneeName: bug?.assigneeName || user?.name || '',
    dueDate: bug?.dueDate ? new Date(bug.dueDate).toISOString().split('T')[0] : '',
    estimatedHours: bug?.estimatedHours?.toString() || '',
    project: bug?.project || '',
    tags: bug?.tags?.join(', ') || ''
  });

  
  const assignees = [
    { id: '1', name: 'John' },
    { id: '2', name: 'Jane' },
    { id: '3', name: 'Bob' }
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.title.trim() || !formData.description.trim()) {
      toast({
        title: 'Validation Error',
        description: 'Title and description are required.',
        variant: 'destructive'
      });
      return;
    }

    const selectedAssignee = assignees.find(a => a.id === formData.assigneeId);
    
    const bugData = {
      title: formData.title.trim(),
      description: formData.description.trim(),
      priority: formData.priority as Issue['priority'],
      status: formData.status as Issue['status'],
      assigneeId: formData.assigneeId,
      assigneeName: selectedAssignee?.name || formData.assigneeName,
      createdBy: user?.name || '',
      dueDate: formData.dueDate ? new Date(formData.dueDate) : undefined,
      estimatedHours: formData.estimatedHours ? parseInt(formData.estimatedHours) : undefined,
      actualHours: bug?.actualHours || 0,
      project: formData.project.trim() || 'General',
      tags: formData.tags.split(',').map(tag => tag.trim()).filter(tag => tag.length > 0)
    };

    if (bug) {
      updateBug(bug.id, bugData);
      toast({
        title: 'Bug Updated',
        description: 'The bug has been successfully updated.',
      });
    } else {
      createBug(bugData);
      toast({
        title: 'Bug Created',
        description: 'A new bug has been successfully created.',
      });
    }
    
    onClose();
  };

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className="p-3 sm:p-4 bg-gradient-to-br from-white to-slate-50 rounded-lg sm:rounded-xl border-0">
      <div className="space-y-1 sm:space-y-2 mb-4 sm:mb-6">
        <h2 className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
          {bug ? 'Update Issue' : 'Create New Issue'}
        </h2>
        <p className="text-xs sm:text-sm text-slate-600">
          {bug ? 'Modify the issue details below' : 'Fill in the details to create a new issue'}
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-3 sm:space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
          <div className="sm:col-span-2">
            <Label htmlFor="title" className="text-xs sm:text-sm font-semibold text-slate-700">Title *</Label>
            <Input
              id="title"
              value={formData.title}
              onChange={(e) => handleChange('title', e.target.value)}
              placeholder="Enter issue title"
              className="mt-1 h-8 sm:h-9 border-slate-200 focus:border-indigo-500 focus:ring-indigo-500 rounded-md sm:rounded-lg text-sm"
              required
            />
          </div>

          <div className="sm:col-span-2">
            <Label htmlFor="description" className="text-xs sm:text-sm font-semibold text-slate-700">Description *</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => handleChange('description', e.target.value)}
              placeholder="Describe the issue in detail"
              rows={3}
              className="mt-1 border-slate-200 focus:border-indigo-500 focus:ring-indigo-500 rounded-md sm:rounded-lg text-sm"
              required
            />
          </div>

          <div>
            <Label htmlFor="priority" className="text-xs sm:text-sm font-semibold text-slate-700">Priority</Label>
            <Select value={formData.priority} onValueChange={(value) => handleChange('priority', value)}>
              <SelectTrigger className="mt-1 h-8 sm:h-9 border-slate-200 focus:border-indigo-500 rounded-md sm:rounded-lg text-sm">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="low">Low</SelectItem>
                <SelectItem value="medium">Medium</SelectItem>
                <SelectItem value="high">High</SelectItem>
                <SelectItem value="critical">Critical</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="status" className="text-xs sm:text-sm font-semibold text-slate-700">Status</Label>
            <Select value={formData.status} onValueChange={(value) => handleChange('status', value)}>
              <SelectTrigger className="mt-1 h-8 sm:h-9 border-slate-200 focus:border-indigo-500 rounded-md sm:rounded-lg text-sm">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="open">Open</SelectItem>
                <SelectItem value="in-progress">In Progress</SelectItem>
                <SelectItem value="pending-review">Pending Review</SelectItem>
                <SelectItem value="closed">Closed</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="assignee" className="text-xs sm:text-sm font-semibold text-slate-700">Assignee</Label>
            <Select value={formData.assigneeId} onValueChange={(value) => {
              const assignee = assignees.find(a => a.id === value);
              handleChange('assigneeId', value);
              if (assignee) {
                handleChange('assigneeName', assignee.name);
              }
            }}>
              <SelectTrigger className="mt-1 h-8 sm:h-9 border-slate-200 focus:border-indigo-500 rounded-md sm:rounded-lg text-sm">
                <SelectValue placeholder="Select assignee" />
              </SelectTrigger>
              <SelectContent>
                {assignees.map(assignee => (
                  <SelectItem key={assignee.id} value={assignee.id}>
                    {assignee.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="project" className="text-xs sm:text-sm font-semibold text-slate-700">Project</Label>
            <Input
              id="project"
              value={formData.project}
              onChange={(e) => handleChange('project', e.target.value)}
              placeholder="Enter project name"
              className="mt-1 h-8 sm:h-9 border-slate-200 focus:border-indigo-500 focus:ring-indigo-500 rounded-md sm:rounded-lg text-sm"
            />
          </div>

          <div>
            <Label htmlFor="dueDate" className="text-xs sm:text-sm font-semibold text-slate-700">Due Date</Label>
            <Input
              id="dueDate"
              type="date"
              value={formData.dueDate}
              onChange={(e) => handleChange('dueDate', e.target.value)}
              className="mt-1 h-8 sm:h-9 border-slate-200 focus:border-indigo-500 focus:ring-indigo-500 rounded-md sm:rounded-lg text-sm"
            />
          </div>

          <div>
            <Label htmlFor="estimatedHours" className="text-xs sm:text-sm font-semibold text-slate-700">Estimated Hours</Label>
            <Input
              id="estimatedHours"
              type="number"
              min="0"
              step="0.5"
              value={formData.estimatedHours}
              onChange={(e) => handleChange('estimatedHours', e.target.value)}
              placeholder="Enter estimated hours"
              className="mt-1 h-8 sm:h-9 border-slate-200 focus:border-indigo-500 focus:ring-indigo-500 rounded-md sm:rounded-lg text-sm"
            />
          </div>

          <div className="sm:col-span-2">
            <Label htmlFor="tags" className="text-xs sm:text-sm font-semibold text-slate-700">Tags</Label>
            <Input
              id="tags"
              value={formData.tags}
              onChange={(e) => handleChange('tags', e.target.value)}
              placeholder="Enter tags separated by commas (e.g., frontend, urgent, mobile)"
              className="mt-1 h-8 sm:h-9 border-slate-200 focus:border-indigo-500 focus:ring-indigo-500 rounded-md sm:rounded-lg text-sm"
            />
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 pt-4 pb-2 mt-4 border-t border-slate-100">
          <Button 
            type="button" 
            variant="outline" 
            onClick={onClose}
            className="w-full sm:w-auto h-8 sm:h-9 px-3 sm:px-4 border-slate-300 text-slate-700 hover:bg-slate-50 rounded-md sm:rounded-lg text-sm transition-all duration-200"
          >
            Cancel
          </Button>
          <Button 
            type="submit"
            className="w-full sm:w-auto h-8 sm:h-9 px-3 sm:px-4 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white rounded-md sm:rounded-lg text-sm transition-all duration-200"
          >
            {bug ? 'Update Issue' : 'Create Issue'}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default BugForm;
