import React, { useState, useMemo } from 'react';
import { useBugs } from '@/hooks/useBugs';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Clock, Plus, Timer } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const TimeTracker: React.FC = () => {
  const { bugs, timeEntries, addTimeEntry } = useBugs();
  const { user } = useAuth();
  const { toast } = useToast();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  
  const [timeEntry, setTimeEntry] = useState({
    issueId: '',
    hours: '',
    description: '',
    date: new Date().toISOString().split('T')[0]
  });

  const relevantBugs = useMemo(() => {
    if (user?.role === 'manager') {
      return bugs;
    }
    return bugs.filter(bug => bug.assigneeId === user?.id);
  }, [bugs, user]);

  const relevantTimeEntries = useMemo(() => {
    if (user?.role === 'manager') {
      return timeEntries;
    }
    return timeEntries.filter(entry => entry.userId === user?.id);
  }, [timeEntries, user]);

  const totalTimeByBug = useMemo(() => {
    const timeMap = new Map<string, number>();
    relevantTimeEntries.forEach(entry => {
      const current = timeMap.get(entry.issueId) || 0;
      timeMap.set(entry.issueId, current + entry.hours);
    });
    return timeMap;
  }, [relevantTimeEntries]);

  const totalTimeSpent = useMemo(() => {
    return relevantTimeEntries.reduce((sum, entry) => sum + entry.hours, 0);
  }, [relevantTimeEntries]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!timeEntry.issueId || !timeEntry.hours || !timeEntry.description.trim()) {
      toast({
        title: 'Validation Error',
        description: 'Please fill in all required fields.',
        variant: 'destructive'
      });
      return;
    }

    const hours = parseFloat(timeEntry.hours);
    if (hours <= 0 || hours > 24) {
      toast({
        title: 'Invalid Hours',
        description: 'Hours must be between 0 and 24.',
        variant: 'destructive'
      });
      return;
    }

    addTimeEntry({
      issueId: timeEntry.issueId,
      userId: user?.id || '',
      hours,
      description: timeEntry.description.trim(),
      date: new Date(timeEntry.date)
    });

    toast({
      title: 'Time Logged',
      description: `Successfully logged ${hours} hours.`,
    });

    setTimeEntry({
      issueId: '',
      hours: '',
      description: '',
      date: new Date().toISOString().split('T')[0]
    });
    setIsDialogOpen(false);
  };

  const getBugTitle = (issueId: string) => {
    const bug = bugs.find(b => b.id === issueId);
    return bug ? bug.title : 'Unknown Bug';
  };

  const getUserName = (userId: string) => {
    
    const userMap: { [key: string]: string } = {
      '1': 'John',
      '2': 'Jane',
      '3': 'Bob'
    };
    return userMap[userId] || 'Unknown User';
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Time Tracker</h1>
          <p className="text-gray-600 mt-2">
            {user?.role === 'manager' 
              ? 'Monitor time spent across all team bugs' 
              : 'Track time spent on your assigned bugs'
            }
          </p>
        </div>
        
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Log Time
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Log Time Entry</DialogTitle>
              <DialogDescription>
                Record time spent working on a bug.
              </DialogDescription>
            </DialogHeader>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="issueId">Bug *</Label>
                <Select 
                  value={timeEntry.issueId} 
                  onValueChange={(value) => setTimeEntry(prev => ({ ...prev, issueId: value }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select a bug" />
                  </SelectTrigger>
                  <SelectContent>
                    {relevantBugs.map(bug => (
                      <SelectItem key={bug.id} value={bug.id}>
                        {bug.title} ({bug.status})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="hours">Hours *</Label>
                  <Input
                    id="hours"
                    type="number"
                    min="0.1"
                    max="24"
                    step="0.1"
                    value={timeEntry.hours}
                    onChange={(e) => setTimeEntry(prev => ({ ...prev, hours: e.target.value }))}
                    placeholder="Enter hours"
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="date">Date *</Label>
                  <Input
                    id="date"
                    type="date"
                    value={timeEntry.date}
                    onChange={(e) => setTimeEntry(prev => ({ ...prev, date: e.target.value }))}
                    required
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="description">Description *</Label>
                <Textarea
                  id="description"
                  value={timeEntry.description}
                  onChange={(e) => setTimeEntry(prev => ({ ...prev, description: e.target.value }))}
                  placeholder="Describe what you worked on"
                  rows={3}
                  required
                />
              </div>

              <div className="flex justify-end space-x-2">
                <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit">
                  Log Time
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Time Logged</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalTimeSpent}h</div>
            <p className="text-xs text-muted-foreground">
              Across all tracked bugs
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Bugs</CardTitle>
            <Timer className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {relevantBugs.filter(bug => bug.status === 'in-progress').length}
            </div>
            <p className="text-xs text-muted-foreground">
              Currently in progress
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Average Time/Bug</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {relevantBugs.length > 0 ? (totalTimeSpent / relevantBugs.length).toFixed(1) : 0}h
            </div>
            <p className="text-xs text-muted-foreground">
              Per bug worked on
            </p>
          </CardContent>
        </Card>
      </div>

      
      <Card>
        <CardHeader>
          <CardTitle>Recent Time Entries</CardTitle>
          <CardDescription>
            Your logged time entries for bug tracking
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Date</TableHead>
                <TableHead>Bug</TableHead>
                {user?.role === 'manager' && <TableHead>User</TableHead>}
                <TableHead>Hours</TableHead>
                <TableHead>Description</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {relevantTimeEntries
                .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
                .slice(0, 10)
                .map((entry) => (
                <TableRow key={entry.id}>
                  <TableCell>
                    {new Date(entry.date).toLocaleDateString()}
                  </TableCell>
                  <TableCell className="font-medium">
                    {getBugTitle(entry.issueId)}
                  </TableCell>
                  {user?.role === 'manager' && (
                    <TableCell>{getUserName(entry.userId)}</TableCell>
                  )}
                  <TableCell>{entry.hours}h</TableCell>
                  <TableCell className="max-w-xs truncate">
                    {entry.description}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          
          {relevantTimeEntries.length === 0 && (
            <div className="text-center py-12 text-gray-500">
              <Clock className="h-12 w-12 mx-auto mb-4 text-gray-300" />
              <p className="text-lg font-medium">No time entries yet</p>
              <p className="mt-2">Start logging time to track your progress on bugs.</p>
            </div>
          )}
        </CardContent>
      </Card>

      
      <Card>
        <CardHeader>
          <CardTitle>Time by Bug</CardTitle>
          <CardDescription>
            Total time spent on each bug
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Bug Title</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Estimated</TableHead>
                <TableHead>Actual</TableHead>
                <TableHead>Difference</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {relevantBugs.map((bug) => {
                const actualTime = totalTimeByBug.get(bug.id) || 0;
                const estimatedTime = bug.estimatedHours || 0;
                const difference = actualTime - estimatedTime;
                
                return (
                  <TableRow key={bug.id}>
                    <TableCell className="font-medium">{bug.title}</TableCell>
                    <TableCell>
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        bug.status === 'closed' ? 'bg-green-100 text-green-800' :
                        bug.status === 'in-progress' ? 'bg-yellow-100 text-yellow-800' :
                        bug.status === 'pending-approval' ? 'bg-purple-100 text-purple-800' :
                        'bg-blue-100 text-blue-800'
                      }`}>
                        {bug.status.replace('-', ' ')}
                      </span>
                    </TableCell>
                    <TableCell>{estimatedTime}h</TableCell>
                    <TableCell>{actualTime}h</TableCell>
                    <TableCell>
                      <span className={difference > 0 ? 'text-red-600' : difference < 0 ? 'text-green-600' : 'text-gray-600'}>
                        {difference > 0 ? '+' : ''}{difference.toFixed(1)}h
                      </span>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default TimeTracker;
