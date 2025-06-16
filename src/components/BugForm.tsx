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
    <div className="p-6 bg-gradient-to-br from-white to-slate-50 rounded-2xl border-0 shadow-2xl animate-scale-in">
      <div className="space-y-2 mb-8">
        <h2 className="text-3xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
          {bug ? 'Update Issue' : 'Create New Issue'}
        </h2>
        <p className="text-slate-600">
          {bug ? 'Modify the issue details below' : 'Fill in the details to create a new issue'}
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="md:col-span-2">
            <Label htmlFor="title" className="text-sm font-semibold text-slate-700">Title *</Label>
            <Input
              id="title"
              value={formData.title}
              onChange={(e) => handleChange('title', e.target.value)}
              placeholder="Enter issue title"
              className="mt-2 border-slate-200 focus:border-indigo-500 focus:ring-indigo-500 rounded-xl"
              required
            />
          </div>

          <div className="md:col-span-2">
            <Label htmlFor="description" className="text-sm font-semibold text-slate-700">Description *</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => handleChange('description', e.target.value)}
              placeholder="Describe the issue in detail"
              rows={4}
              className="mt-2 border-slate-200 focus:border-indigo-500 focus:ring-indigo-500 rounded-xl"
              required
            />
          </div>

          <div>
            <Label htmlFor="priority" className="text-sm font-semibold text-slate-700">Priority</Label>
            <Select value={formData.priority} onValueChange={(value) => handleChange('priority', value)}>
              <SelectTrigger className="mt-2 border-slate-200 focus:border-indigo-500 rounded-xl">
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
            <Label htmlFor="status" className="text-sm font-semibold text-slate-700">Status</Label>
            <Select value={formData.status} onValueChange={(value) => handleChange('status', value)}>
              <SelectTrigger className="mt-2 border-slate-200 focus:border-indigo-500 rounded-xl">
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
            <Label htmlFor="assignee" className="text-sm font-semibold text-slate-700">Assignee</Label>
            <Select value={formData.assigneeId} onValueChange={(value) => {
              const assignee = assignees.find(a => a.id === value);
              handleChange('assigneeId', value);
              if (assignee) {
                handleChange('assigneeName', assignee.name);
              }
            }}>
              <SelectTrigger className="mt-2 border-slate-200 focus:border-indigo-500 rounded-xl">
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
            <Label htmlFor="project" className="text-sm font-semibold text-slate-700">Project</Label>
            <Input
              id="project"
              value={formData.project}
              onChange={(e) => handleChange('project', e.target.value)}
              placeholder="Enter project name"
              className="mt-2 border-slate-200 focus:border-indigo-500 focus:ring-indigo-500 rounded-xl"
            />
          </div>

          <div>
            <Label htmlFor="dueDate" className="text-sm font-semibold text-slate-700">Due Date</Label>
            <Input
              id="dueDate"
              type="date"
              value={formData.dueDate}
              onChange={(e) => handleChange('dueDate', e.target.value)}
              className="mt-2 border-slate-200 focus:border-indigo-500 focus:ring-indigo-500 rounded-xl"
            />
          </div>

          <div>
            <Label htmlFor="estimatedHours" className="text-sm font-semibold text-slate-700">Estimated Hours</Label>
            <Input
              id="estimatedHours"
              type="number"
              min="0"
              step="0.5"
              value={formData.estimatedHours}
              onChange={(e) => handleChange('estimatedHours', e.target.value)}
              placeholder="Enter estimated hours"
              className="mt-2 border-slate-200 focus:border-indigo-500 focus:ring-indigo-500 rounded-xl"
            />
          </div>

          <div className="md:col-span-2">
            <Label htmlFor="tags" className="text-sm font-semibold text-slate-700">Tags</Label>
            <Input
              id="tags"
              value={formData.tags}
              onChange={(e) => handleChange('tags', e.target.value)}
              placeholder="Enter tags separated by commas (e.g., frontend, urgent, mobile)"
              className="mt-2 border-slate-200 focus:border-indigo-500 focus:ring-indigo-500 rounded-xl"
            />
          </div>
        </div>

        <div className="flex justify-end space-x-4 pt-6 border-t border-slate-200">
          <Button 
            type="button" 
            variant="outline" 
            onClick={onClose}
            className="px-6 py-2 border-slate-300 text-slate-700 hover:bg-slate-50 rounded-xl transition-all duration-200"
          >
            Cancel
          </Button>
          <Button 
            type="submit"
            className="px-6 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white rounded-xl transition-all duration-200 transform hover:scale-105"
          >
            {bug ? 'Update Issue' : 'Create Issue'}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default BugForm;
