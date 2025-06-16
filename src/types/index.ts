export interface Issue {
  id: string;
  title: string;
  description: string;
  priority: 'low' | 'medium' | 'high' | 'critical';
  status: 'open' | 'in-progress' | 'closed' | 'pending-review' | 'pending-approval';
  assigneeId: string;
  assigneeName: string;
  createdBy: string;
  createdAt: Date;
  updatedAt: Date;
  dueDate?: Date;
  estimatedHours?: number;
  actualHours: number;
  tags: string[];
  project: string;
}

export interface WorkSession {
  id: string;
  issueId: string;
  userId: string;
  hours: number;
  description: string;
  date: Date;
}

export interface MetricsOverview {
  totalIssues: number;
  openIssues: number;
  inProgressIssues: number;
  closedIssues: number;
  pendingReviewIssues: number;
  totalTimeSpent: number;
}
