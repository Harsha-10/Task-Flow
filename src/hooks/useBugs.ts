import { useState, useEffect } from 'react';
import { Issue, WorkSession } from '@/types';
import { useAuth } from '@/contexts/AuthContext';

const mockBugs: Issue[] = [
  {
    id: '1',
    title: 'Login button not working',
    description: 'The login button is not responding when clicked on mobile devices',
    priority: 'high',
    status: 'open',
    assigneeId: '1',
    assigneeName: 'John',
    createdBy: 'Jane',
    createdAt: new Date('2025-06-01'),
    updatedAt: new Date('2025-06-15'),
    dueDate: new Date('2025-06-20'),
    estimatedHours: 8,
    actualHours: 0,
    tags: ['frontend', 'mobile'],
    project: 'Main App'
  },
  {
    id: '2',
    title: 'Database connection timeout',
    description: 'Users experiencing timeout errors when trying to access their profiles',
    priority: 'critical',
    status: 'in-progress',
    assigneeId: '3',
    assigneeName: 'Bob',
    createdBy: 'Jane',
    createdAt: new Date('2025-06-05'),
    updatedAt: new Date('2025-06-15'),
    dueDate: new Date('2025-06-10'),
    estimatedHours: 12,
    actualHours: 6,
    tags: ['backend', 'database'],
    project: 'User Service'
  },
  {
    id: '3',
    title: 'UI alignment issues',
    description: 'Text and buttons are misaligned on the dashboard page',
    priority: 'medium',
    status: 'pending-review',
    assigneeId: '1',
    assigneeName: 'John',
    createdBy: 'Jane',
    createdAt: new Date('2025-06-10'),
    updatedAt: new Date('2025-06-15'),
    dueDate: new Date('2025-06-25'),
    estimatedHours: 4,
    actualHours: 4,
    tags: ['frontend', 'ui'],
    project: 'Main App'
  },
  {
    id: '4',
    title: 'API rate limiting not working',
    description: 'Rate limiting middleware is not properly restricting requests',
    priority: 'high',
    status: 'closed',
    assigneeId: '3',
    assigneeName: 'Bob',
    createdBy: 'Jane',
    createdAt: new Date('2025-06-02'),
    updatedAt: new Date('2025-06-08'),
    dueDate: new Date('2025-06-07'),
    estimatedHours: 6,
    actualHours: 5,
    tags: ['backend', 'security'],
    project: 'API Gateway'
  },
  {
    id: '5',
    title: 'Mobile app crashes on startup',
    description: 'App crashes immediately after launch on iOS devices',
    priority: 'critical',
    status: 'open',
    assigneeId: '1',
    assigneeName: 'John',
    createdBy: 'Bob',
    createdAt: new Date('2025-06-14'),
    updatedAt: new Date('2025-06-15'),
    dueDate: new Date('2025-06-18'),
    estimatedHours: 10,
    actualHours: 0,
    tags: ['mobile', 'ios'],
    project: 'Mobile App'
  },
  {
    id: '6',
    title: 'Email notifications delayed',
    description: 'Users reporting 5-10 minute delays in receiving notifications',
    priority: 'medium',
    status: 'in-progress',
    assigneeId: '3',
    assigneeName: 'Bob',
    createdBy: 'John',
    createdAt: new Date('2025-06-11'),
    updatedAt: new Date('2025-06-15'),
    dueDate: new Date('2025-06-22'),
    estimatedHours: 8,
    actualHours: 3,
    tags: ['backend', 'email'],
    project: 'Notification Service'
  },
  {
    id: '7',
    title: 'Dashboard charts not updating',
    description: 'Real-time charts on dashboard showing stale data',
    priority: 'high',
    status: 'pending-review',
    assigneeId: '1',
    assigneeName: 'John',
    createdBy: 'Bob',
    createdAt: new Date('2025-06-09'),
    updatedAt: new Date('2025-06-15'),
    dueDate: new Date('2025-06-16'),
    estimatedHours: 5,
    actualHours: 5,
    tags: ['frontend', 'data'],
    project: 'Main App'
  },
  {
    id: '8',
    title: 'User profile image upload failing',
    description: 'Large profile images (>5MB) failing to upload',
    priority: 'low',
    status: 'closed',
    assigneeId: '3',
    assigneeName: 'Bob',
    createdBy: 'Jane',
    createdAt: new Date('2025-06-03'),
    updatedAt: new Date('2025-06-06'),
    dueDate: new Date('2025-06-05'),
    estimatedHours: 3,
    actualHours: 2,
    tags: ['frontend', 'upload'],
    project: 'User Service'
  },
  {
    id: '9',
    title: 'Search results pagination broken',
    description: 'Pagination controls not working on search results page',
    priority: 'high',
    status: 'closed',
    assigneeId: '1',
    assigneeName: 'John',
    createdBy: 'Bob',
    createdAt: new Date('2025-06-04'),
    updatedAt: new Date('2025-06-07'),
    dueDate: new Date('2025-06-08'),
    estimatedHours: 4,
    actualHours: 4,
    tags: ['frontend', 'search'],
    project: 'Main App'
  },
  {
    id: '10',
    title: 'Password reset email not sending',
    description: 'Users not receiving password reset emails',
    priority: 'critical',
    status: 'closed',
    assigneeId: '3',
    assigneeName: 'Bob',
    createdBy: 'Jane',
    createdAt: new Date('2025-06-06'),
    updatedAt: new Date('2025-06-09'),
    dueDate: new Date('2025-06-09'),
    estimatedHours: 6,
    actualHours: 7,
    tags: ['backend', 'email', 'security'],
    project: 'User Service'
  },
  {
    id: '11',
    title: 'Mobile app dark mode flickering',
    description: 'Screen flickers when switching between light and dark mode',
    priority: 'medium',
    status: 'closed',
    assigneeId: '1',
    assigneeName: 'John',
    createdBy: 'Bob',
    createdAt: new Date('2025-06-07'),
    updatedAt: new Date('2025-06-11'),
    dueDate: new Date('2025-06-12'),
    estimatedHours: 3,
    actualHours: 2,
    tags: ['mobile', 'ui'],
    project: 'Mobile App'
  },
  {
    id: '12',
    title: 'API documentation outdated',
    description: 'API documentation not reflecting latest endpoint changes',
    priority: 'low',
    status: 'closed',
    assigneeId: '3',
    assigneeName: 'Bob',
    createdBy: 'John',
    createdAt: new Date('2025-06-08'),
    updatedAt: new Date('2025-06-10'),
    dueDate: new Date('2025-06-11'),
    estimatedHours: 2,
    actualHours: 2,
    tags: ['documentation', 'api'],
    project: 'API Gateway'
  },
  {
    id: '13',
    title: 'Performance regression in dashboard',
    description: 'Dashboard loading time increased by 200% after latest update',
    priority: 'high',
    status: 'in-progress',
    assigneeId: '1',
    assigneeName: 'John',
    createdBy: 'Jane',
    createdAt: new Date('2025-06-13'),
    updatedAt: new Date('2025-06-15'),
    dueDate: new Date('2025-06-19'),
    estimatedHours: 8,
    actualHours: 2,
    tags: ['frontend', 'performance'],
    project: 'Main App'
  },
  {
    id: '14',
    title: 'Webhook delivery failures',
    description: 'External service webhooks failing to deliver',
    priority: 'critical',
    status: 'open',
    assigneeId: '3',
    assigneeName: 'Bob',
    createdBy: 'John',
    createdAt: new Date('2025-06-15'),
    updatedAt: new Date('2025-06-15'),
    dueDate: new Date('2025-06-17'),
    estimatedHours: 5,
    actualHours: 0,
    tags: ['backend', 'integration'],
    project: 'Notification Service'
  },
  {
    id: '15',
    title: 'User preferences not saving',
    description: 'User settings and preferences reset after logout',
    priority: 'medium',
    status: 'pending-review',
    assigneeId: '1',
    assigneeName: 'John',
    createdBy: 'Bob',
    createdAt: new Date('2025-06-12'),
    updatedAt: new Date('2025-06-15'),
    dueDate: new Date('2025-06-21'),
    estimatedHours: 6,
    actualHours: 6,
    tags: ['frontend', 'user-settings'],
    project: 'User Service'
  }
];

const mockTimeEntries: WorkSession[] = [
  {
    id: '1',
    issueId: '1',
    userId: '1',
    hours: 4,
    description: 'Initial investigation of mobile login issues',
    date: new Date('2025-06-01')
  },
  {
    id: '2',
    issueId: '4',
    userId: '3',
    hours: 3,
    description: 'Analyzing rate limiting middleware',
    date: new Date('2025-06-02')
  },
  {
    id: '3',
    issueId: '4',
    userId: '3',
    hours: 2,
    description: 'Implementing rate limit fixes',
    date: new Date('2025-06-03')
  },
  {
    id: '4',
    issueId: '9',
    userId: '1',
    hours: 2,
    description: 'Debugging pagination controls',
    date: new Date('2025-06-04')
  },
  {
    id: '5',
    issueId: '9',
    userId: '1',
    hours: 2,
    description: 'Fixing pagination implementation',
    date: new Date('2025-06-05')
  },
  {
    id: '6',
    issueId: '10',
    userId: '3',
    hours: 4,
    description: 'Investigating email delivery issues',
    date: new Date('2025-06-06')
  },
  {
    id: '7',
    issueId: '10',
    userId: '3',
    hours: 3,
    description: 'Fixing email service integration',
    date: new Date('2025-06-07')
  },
  {
    id: '8',
    issueId: '11',
    userId: '1',
    hours: 2,
    description: 'Investigating dark mode flickering',
    date: new Date('2025-06-08')
  },
  {
    id: '9',
    issueId: '12',
    userId: '3',
    hours: 2,
    description: 'Updating API documentation',
    date: new Date('2025-06-09')
  },
  {
    id: '10',
    issueId: '2',
    userId: '3',
    hours: 3,
    description: 'Analyzing database connection issues',
    date: new Date('2025-06-10')
  },
  {
    id: '11',
    issueId: '11',
    userId: '1',
    hours: 2,
    description: 'Fixing dark mode transitions',
    date: new Date('2025-06-11')
  },
  {
    id: '12',
    issueId: '13',
    userId: '1',
    hours: 2,
    description: 'Profiling dashboard performance',
    date: new Date('2025-06-12')
  },
  {
    id: '13',
    issueId: '15',
    userId: '1',
    hours: 3,
    description: 'Implementing preferences persistence',
    date: new Date('2025-06-13')
  },
  {
    id: '14',
    issueId: '15',
    userId: '1',
    hours: 3,
    description: 'Testing preferences across sessions',
    date: new Date('2025-06-14')
  },
  {
    id: '15',
    issueId: '14',
    userId: '3',
    hours: 3,
    description: 'Investigating webhook delivery issues',
    date: new Date('2025-06-15')
  },
  {
    id: '16',
    issueId: '5',
    userId: '1',
    hours: 4,
    description: 'Debugging iOS crash on startup',
    date: new Date('2025-06-16')
  },
  {
    id: '17',
    issueId: '13',
    userId: '1',
    hours: 3,
    description: 'Optimizing dashboard queries',
    date: new Date('2025-06-17')
  },
  {
    id: '18',
    issueId: '6',
    userId: '3',
    hours: 3,
    description: 'Investigating notification delays',
    date: new Date('2025-06-18')
  },
  {
    id: '19',
    issueId: '5',
    userId: '1',
    hours: 4,
    description: 'Fixing iOS crash and testing',
    date: new Date('2025-06-19')
  },
  {
    id: '20',
    issueId: '7',
    userId: '1',
    hours: 3,
    description: 'Implementing real-time updates',
    date: new Date('2025-06-20')
  },
  {
    id: '21',
    issueId: '3',
    userId: '1',
    hours: 2,
    description: 'Fixing alignment issues',
    date: new Date('2025-06-21')
  }
];

export const useBugs = () => {
  const { user } = useAuth();
  const [bugs, setBugs] = useState<Issue[]>([]);
  const [timeEntries, setTimeEntries] = useState<WorkSession[]>([]);

  useEffect(() => {
    const savedBugs = localStorage.getItem('bugs');
    const savedTimeEntries = localStorage.getItem('timeEntries');
    
    setBugs(savedBugs ? JSON.parse(savedBugs) : mockBugs);
    setTimeEntries(savedTimeEntries ? JSON.parse(savedTimeEntries) : mockTimeEntries);
  }, []);

  const saveBugs = (newBugs: Issue[]) => {
    setBugs(newBugs);
    localStorage.setItem('bugs', JSON.stringify(newBugs));
  };

  const saveTimeEntries = (newTimeEntries: WorkSession[]) => {
    setTimeEntries(newTimeEntries);
    localStorage.setItem('timeEntries', JSON.stringify(newTimeEntries));
  };

  const createBug = (bugData: Omit<Issue, 'id' | 'createdAt' | 'updatedAt'>) => {
    const newBug: Issue = {
      ...bugData,
      id: Date.now().toString(),
      createdAt: new Date(),
      updatedAt: new Date()
    };
    saveBugs([...bugs, newBug]);
  };

  const updateBug = (id: string, updates: Partial<Issue>) => {
    const updatedBugs = bugs.map(bug => 
      bug.id === id 
        ? { ...bug, ...updates, updatedAt: new Date() }
        : bug
    );
    saveBugs(updatedBugs);
  };

  const deleteBug = (id: string) => {
    const filteredBugs = bugs.filter(bug => bug.id !== id);
    saveBugs(filteredBugs);
    
    const filteredTimeEntries = timeEntries.filter(entry => entry.issueId !== id);
    saveTimeEntries(filteredTimeEntries);
  };

  const addTimeEntry = (timeEntry: Omit<WorkSession, 'id'>) => {
    const newTimeEntry: WorkSession = {
      ...timeEntry,
      id: Date.now().toString()
    };
    saveTimeEntries([...timeEntries, newTimeEntry]);
    const bug = bugs.find(b => b.id === timeEntry.issueId);
    if (bug) {
      const totalHours = timeEntries
        .filter(entry => entry.issueId === timeEntry.issueId)
        .reduce((sum, entry) => sum + entry.hours, 0) + timeEntry.hours;
      
      updateBug(timeEntry.issueId, { actualHours: totalHours });
    }
  };

  const getFilteredBugs = () => {
    if (user?.role === 'manager') {
      return bugs;
    }
    return bugs.filter(bug => bug.assigneeId === user?.id);
  };

  return {
    bugs: getFilteredBugs(),
    allBugs: bugs,
    timeEntries,
    createBug,
    updateBug,
    deleteBug,
    addTimeEntry
  };
};
