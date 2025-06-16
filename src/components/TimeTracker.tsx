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
    <div className="space-y-4 sm:space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Time Tracking</h1>
          <p className="text-sm sm:text-base text-gray-600 mt-1 sm:mt-2">Monitor and log time spent on issues</p>
        </div>
        
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button className="w-full sm:w-auto">
              <Plus className="h-4 w-4 mr-2" />
              Log Time
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl w-[95vw] sm:w-full">
            <DialogHeader>
              <DialogTitle>Log Time Entry</DialogTitle>
              <DialogDescription>
                Record time spent on a bug or issue.
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="issue">Bug/Issue</Label>
                  <Select
                    value={timeEntry.issueId}
                    onValueChange={(value) => setTimeEntry(prev => ({ ...prev, issueId: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select a bug" />
                    </SelectTrigger>
                    <SelectContent>
                      {relevantBugs
                        .filter(bug => bug.status !== 'closed')
                        .map(bug => (
                          <SelectItem key={bug.id} value={bug.id}>
                            {bug.title}
                          </SelectItem>
                        ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="hours">Hours Spent</Label>
                  <Input
                    id="hours"
                    type="number"
                    min="0.5"
                    step="0.5"
                    value={timeEntry.hours}
                    onChange={(e) => setTimeEntry(prev => ({ ...prev, hours: e.target.value }))}
                    placeholder="Enter hours"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="date">Date</Label>
                <Input
                  id="date"
                  type="date"
                  value={timeEntry.date}
                  onChange={(e) => setTimeEntry(prev => ({ ...prev, date: e.target.value }))}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={timeEntry.description}
                  onChange={(e) => setTimeEntry(prev => ({ ...prev, description: e.target.value }))}
                  placeholder="What did you work on?"
                  rows={3}
                />
              </div>

              <div className="flex justify-end gap-3">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsDialogOpen(false)}
                >
                  Cancel
                </Button>
                <Button type="submit">
                  Save Time Entry
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
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

        <Card className="sm:col-span-2 lg:col-span-1">
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
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="whitespace-nowrap">Date</TableHead>
                  <TableHead className="whitespace-nowrap">Bug</TableHead>
                  {user?.role === 'manager' && <TableHead className="whitespace-nowrap">User</TableHead>}
                  <TableHead className="whitespace-nowrap">Hours</TableHead>
                  <TableHead className="min-w-[200px]">Description</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {relevantTimeEntries
                  .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
                  .slice(0, 10)
                  .map((entry) => (
                  <TableRow key={entry.id}>
                    <TableCell className="whitespace-nowrap">
                      {new Date(entry.date).toLocaleDateString()}
                    </TableCell>
                    <TableCell className="font-medium whitespace-nowrap">
                      {getBugTitle(entry.issueId)}
                    </TableCell>
                    {user?.role === 'manager' && (
                      <TableCell className="whitespace-nowrap">{getUserName(entry.userId)}</TableCell>
                    )}
                    <TableCell className="whitespace-nowrap">{entry.hours}h</TableCell>
                    <TableCell className="max-w-[200px] truncate">
                      {entry.description}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
          
          {relevantTimeEntries.length === 0 && (
            <div className="text-center py-8 sm:py-12 text-gray-500">
              <Clock className="h-8 w-8 sm:h-12 sm:w-12 mx-auto mb-3 sm:mb-4 text-gray-300" />
              <p className="text-base sm:text-lg font-medium">No time entries yet</p>
              <p className="mt-1 sm:mt-2 text-sm sm:text-base">Start logging time to track your progress on bugs.</p>
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
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="whitespace-nowrap">Bug Title</TableHead>
                  <TableHead className="whitespace-nowrap">Status</TableHead>
                  <TableHead className="whitespace-nowrap">Estimated</TableHead>
                  <TableHead className="whitespace-nowrap">Actual</TableHead>
                  <TableHead className="whitespace-nowrap">Difference</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {relevantBugs.map((bug) => {
                  const actualTime = totalTimeByBug.get(bug.id) || 0;
                  const estimatedTime = bug.estimatedHours || 0;
                  const difference = actualTime - estimatedTime;
                  
                  return (
                    <TableRow key={bug.id}>
                      <TableCell className="font-medium min-w-[200px] max-w-[300px] truncate">
                        {bug.title}
                      </TableCell>
                      <TableCell className="whitespace-nowrap">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          bug.status === 'closed' ? 'bg-green-100 text-green-800' :
                          bug.status === 'in-progress' ? 'bg-yellow-100 text-yellow-800' :
                          bug.status === 'pending-approval' ? 'bg-purple-100 text-purple-800' :
                          'bg-blue-100 text-blue-800'
                        }`}>
                          {bug.status.replace('-', ' ')}
                        </span>
                      </TableCell>
                      <TableCell className="whitespace-nowrap">{estimatedTime}h</TableCell>
                      <TableCell className="whitespace-nowrap">{actualTime}h</TableCell>
                      <TableCell className="whitespace-nowrap">
                        <span className={difference > 0 ? 'text-red-600' : difference < 0 ? 'text-green-600' : 'text-gray-600'}>
                          {difference > 0 ? '+' : ''}{difference.toFixed(1)}h
                        </span>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default TimeTracker;
