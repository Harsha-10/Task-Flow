
import React, { useMemo } from 'react';
import { useBugs } from '@/hooks/useBugs';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Bug, Clock, CheckCircle, AlertTriangle, Users, TrendingUp, Target, Zap, Sparkles, Activity } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, AreaChart, Area, BarChart, Bar } from 'recharts';

const Dashboard: React.FC = () => {
  const { bugs, allBugs, timeEntries } = useBugs();
  const { user } = useAuth();

  const stats = useMemo(() => {
    const relevantBugs = user?.role === 'manager' ? allBugs : bugs;
    
    return {
      total: relevantBugs.length,
      open: relevantBugs.filter(bug => bug.status === 'open').length,
      inProgress: relevantBugs.filter(bug => bug.status === 'in-progress').length,
      closed: relevantBugs.filter(bug => bug.status === 'closed').length,
      pendingReview: relevantBugs.filter(bug => bug.status === 'pending-review').length,
      totalTime: relevantBugs.reduce((sum, bug) => sum + bug.actualHours, 0)
    };
  }, [bugs, allBugs, user?.role]);

  
  const trendData = useMemo(() => {
    const last7Days = Array.from({ length: 7 }, (_, i) => {
      const date = new Date();
      date.setDate(date.getDate() - (6 - i));
      return date;
    });

    return last7Days.map((date, index) => {
      const dateStr = date.toISOString().split('T')[0];
      const activeBugs = Math.floor(Math.random() * 8) + 3 + index; 
      const resolved = Math.floor(Math.random() * 4) + 1;
      
      return {
        date: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
        activeBugs,
        resolved,
        productivity: Math.floor((resolved / activeBugs) * 100)
      };
    });
  }, []);

  const pieData = [
    { name: 'Open', value: stats.open, color: '#ef4444', gradient: 'from-red-400 to-red-600' },
    { name: 'In Progress', value: stats.inProgress, color: '#f59e0b', gradient: 'from-amber-400 to-orange-600' },
    { name: 'Pending Review', value: stats.pendingReview, color: '#8b5cf6', gradient: 'from-purple-400 to-violet-600' },
    { name: 'Closed', value: stats.closed, color: '#10b981', gradient: 'from-emerald-400 to-green-600' }
  ];

  const priorityStats = useMemo(() => {
    const relevantBugs = user?.role === 'manager' ? allBugs : bugs;
    return {
      critical: relevantBugs.filter(bug => bug.priority === 'critical').length,
      high: relevantBugs.filter(bug => bug.priority === 'high').length,
      medium: relevantBugs.filter(bug => bug.priority === 'medium').length,
      low: relevantBugs.filter(bug => bug.priority === 'low').length
    };
  }, [bugs, allBugs, user?.role]);

  const performanceData = useMemo(() => {
    return [
      { day: 'Mon', completed: 8, assigned: 12 },
      { day: 'Tue', completed: 12, assigned: 15 },
      { day: 'Wed', completed: 10, assigned: 13 },
      { day: 'Thu', completed: 15, assigned: 18 },
      { day: 'Fri', completed: 9, assigned: 11 },
      { day: 'Sat', completed: 6, assigned: 8 },
      { day: 'Sun', completed: 4, assigned: 5 },
    ];
  }, []);

  return (
    <div className="space-y-8 animate-fade-in">
      <div className="relative overflow-hidden bg-gradient-to-br from-indigo-50 via-white to-purple-50 rounded-3xl p-8 border border-indigo-100 shadow-2xl">
        <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-indigo-200/20 to-purple-200/20 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-gradient-to-tr from-pink-200/20 to-orange-200/20 rounded-full blur-3xl"></div>
        
        <div className="relative space-y-4">
          <div className="flex items-center space-x-3">
            <div className="p-3 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-2xl shadow-lg animate-pulse-glow">
              <Sparkles className="h-8 w-8 text-white" />
            </div>
            <div>
              <h1 className="text-5xl font-bold bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
                Welcome, {user.name}!
              </h1>
              <p className="text-xl text-slate-600 font-medium mt-2">
                {user?.role === 'manager' 
                  ? 'Strategic oversight and team performance analytics' 
                  : 'Your personalized productivity command center'
                }
              </p>
            </div>
          </div>
        </div>
      </div>

      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="border-0 shadow-2xl bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 hover:scale-105 transition-all duration-300 cursor-pointer group relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-500/5 to-indigo-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 relative z-10">
            <CardTitle className="text-sm font-semibold text-slate-700">Total Issues</CardTitle>
            <div className="p-3 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-xl shadow-lg group-hover:shadow-xl transition-shadow">
              <Target className="h-6 w-6 text-white" />
            </div>
          </CardHeader>
          <CardContent className="relative z-10">
            <div className="text-4xl font-bold text-blue-700 mb-2">{stats.total}</div>
            <div className="flex items-center space-x-2">
              <Activity className="h-4 w-4 text-blue-500" />
              <p className="text-sm text-blue-600 font-medium">
                {user?.role === 'manager' ? 'Across all teams' : 'Your assignments'}
              </p>
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-2xl bg-gradient-to-br from-amber-50 via-orange-50 to-red-50 hover:scale-105 transition-all duration-300 cursor-pointer group relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-amber-500/5 to-orange-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 relative z-10">
            <CardTitle className="text-sm font-semibold text-slate-700">Active Work</CardTitle>
            <div className="p-3 bg-gradient-to-r from-amber-500 to-orange-600 rounded-xl shadow-lg group-hover:shadow-xl transition-shadow">
              <Zap className="h-6 w-6 text-white" />
            </div>
          </CardHeader>
          <CardContent className="relative z-10">
            <div className="text-4xl font-bold text-amber-700 mb-2">{stats.inProgress}</div>
            <div className="flex items-center space-x-2">
              <TrendingUp className="h-4 w-4 text-amber-500" />
              <p className="text-sm text-amber-600 font-medium">
                In development pipeline
              </p>
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-2xl bg-gradient-to-br from-purple-50 via-violet-50 to-pink-50 hover:scale-105 transition-all duration-300 cursor-pointer group relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-purple-500/5 to-pink-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 relative z-10">
            <CardTitle className="text-sm font-semibold text-slate-700">Pending Review</CardTitle>
            <div className="p-3 bg-gradient-to-r from-purple-500 to-pink-600 rounded-xl shadow-lg group-hover:shadow-xl transition-shadow">
              <Users className="h-6 w-6 text-white" />
            </div>
          </CardHeader>
          <CardContent className="relative z-10">
            <div className="text-4xl font-bold text-purple-700 mb-2">{stats.pendingReview}</div>
            <div className="flex items-center space-x-2">
              <CheckCircle className="h-4 w-4 text-purple-500" />
              <p className="text-sm text-purple-600 font-medium">
                Awaiting approval
              </p>
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-2xl bg-gradient-to-br from-emerald-50 via-green-50 to-teal-50 hover:scale-105 transition-all duration-300 cursor-pointer group relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/5 to-teal-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 relative z-10">
            <CardTitle className="text-sm font-semibold text-slate-700">Time Invested</CardTitle>
            <div className="p-3 bg-gradient-to-r from-emerald-500 to-teal-600 rounded-xl shadow-lg group-hover:shadow-xl transition-shadow">
              <Clock className="h-6 w-6 text-white" />
            </div>
          </CardHeader>
          <CardContent className="relative z-10">
            <div className="text-4xl font-bold text-emerald-700 mb-2">{stats.totalTime}h</div>
            <div className="flex items-center space-x-2">
              <Target className="h-4 w-4 text-emerald-500" />
              <p className="text-sm text-emerald-600 font-medium">
                Development hours
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="border-0 shadow-2xl bg-gradient-to-br from-red-50 to-pink-50 hover:scale-105 transition-all duration-300 cursor-pointer group relative overflow-hidden">
          <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-red-200/30 to-pink-200/30 rounded-full blur-2xl"></div>
          <CardContent className="pt-6 relative z-10">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-gradient-to-r from-red-500 to-pink-600 rounded-2xl shadow-lg group-hover:shadow-xl transition-shadow">
                <AlertTriangle className="h-8 w-8 text-white" />
              </div>
              <div className="text-right">
                <div className="text-4xl font-bold text-red-600">{priorityStats.critical}</div>
                <div className="w-16 h-1 bg-gradient-to-r from-red-400 to-pink-500 rounded-full ml-auto"></div>
              </div>
            </div>
            <p className="text-sm text-red-700 font-semibold">Critical Priority</p>
            <p className="text-xs text-red-600/80">Requires immediate attention</p>
          </CardContent>
        </Card>
        
        <Card className="border-0 shadow-2xl bg-gradient-to-br from-orange-50 to-amber-50 hover:scale-105 transition-all duration-300 cursor-pointer group relative overflow-hidden">
          <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-orange-200/30 to-amber-200/30 rounded-full blur-2xl"></div>
          <CardContent className="pt-6 relative z-10">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-gradient-to-r from-orange-500 to-amber-600 rounded-2xl shadow-lg group-hover:shadow-xl transition-shadow">
                <Zap className="h-8 w-8 text-white" />
              </div>
              <div className="text-right">
                <div className="text-4xl font-bold text-orange-600">{priorityStats.high}</div>
                <div className="w-16 h-1 bg-gradient-to-r from-orange-400 to-amber-500 rounded-full ml-auto"></div>
              </div>
            </div>
            <p className="text-sm text-orange-700 font-semibold">High Priority</p>
            <p className="text-xs text-orange-600/80">Next in development queue</p>
          </CardContent>
        </Card>
        
        <Card className="border-0 shadow-2xl bg-gradient-to-br from-yellow-50 to-orange-50 hover:scale-105 transition-all duration-300 cursor-pointer group relative overflow-hidden">
          <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-yellow-200/30 to-orange-200/30 rounded-full blur-2xl"></div>
          <CardContent className="pt-6 relative z-10">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-gradient-to-r from-yellow-500 to-orange-600 rounded-2xl shadow-lg group-hover:shadow-xl transition-shadow">
                <Clock className="h-8 w-8 text-white" />
              </div>
              <div className="text-right">
                <div className="text-4xl font-bold text-yellow-600">{priorityStats.medium}</div>
                <div className="w-16 h-1 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full ml-auto"></div>
              </div>
            </div>
            <p className="text-sm text-yellow-700 font-semibold">Medium Priority</p>
            <p className="text-xs text-yellow-600/80">Standard workflow items</p>
          </CardContent>
        </Card>
        
        <Card className="border-0 shadow-2xl bg-gradient-to-br from-green-50 to-emerald-50 hover:scale-105 transition-all duration-300 cursor-pointer group relative overflow-hidden">
          <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-green-200/30 to-emerald-200/30 rounded-full blur-2xl"></div>
          <CardContent className="pt-6 relative z-10">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-gradient-to-r from-green-500 to-emerald-600 rounded-2xl shadow-lg group-hover:shadow-xl transition-shadow">
                <CheckCircle className="h-8 w-8 text-white" />
              </div>
              <div className="text-right">
                <div className="text-4xl font-bold text-green-600">{priorityStats.low}</div>
                <div className="w-16 h-1 bg-gradient-to-r from-green-400 to-emerald-500 rounded-full ml-auto"></div>
              </div>
            </div>
            <p className="text-sm text-green-700 font-semibold">Low Priority</p>
            <p className="text-xs text-green-600/80">Future enhancements</p>
          </CardContent>
        </Card>
      </div>

      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        <Card className="lg:col-span-2 border-0 shadow-2xl bg-white/90 backdrop-blur-sm hover:shadow-3xl transition-all duration-300 rounded-2xl overflow-hidden">
          <CardHeader className="bg-gradient-to-r from-indigo-50 to-purple-50 border-b border-indigo-100">
            <CardTitle className="flex items-center space-x-3">
              <div className="p-3 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-xl shadow-lg">
                <TrendingUp className="h-6 w-6 text-white" />
              </div>
              <div>
                <span className="text-xl font-bold text-slate-800">Development Velocity</span>
                <p className="text-sm text-slate-600 font-normal">Weekly progression and resolution trends</p>
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <ResponsiveContainer width="100%" height={320}>
              <AreaChart data={trendData}>
                <defs>
                  <linearGradient id="activeGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#6366f1" stopOpacity={0.4}/>
                    <stop offset="95%" stopColor="#6366f1" stopOpacity={0.1}/>
                  </linearGradient>
                  <linearGradient id="resolvedGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.4}/>
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0.1}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" opacity={0.5} />
                <XAxis dataKey="date" stroke="#64748b" fontSize={12} tickLine={false} />
                <YAxis stroke="#64748b" fontSize={12} tickLine={false} />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'white', 
                    border: 'none', 
                    borderRadius: '16px', 
                    boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
                    padding: '12px'
                  }} 
                />
                <Area
                  type="monotone"
                  dataKey="activeBugs"
                  stroke="#6366f1"
                  strokeWidth={3}
                  fill="url(#activeGradient)"
                  name="Active Issues"
                />
                <Area
                  type="monotone"
                  dataKey="resolved"
                  stroke="#10b981"
                  strokeWidth={3}
                  fill="url(#resolvedGradient)"
                  name="Resolved"
                />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        
        <Card className="border-0 shadow-2xl bg-white/90 backdrop-blur-sm hover:shadow-3xl transition-all duration-300 rounded-2xl overflow-hidden">
          <CardHeader className="bg-gradient-to-r from-purple-50 to-pink-50 border-b border-purple-100">
            <CardTitle className="flex items-center space-x-3">
              <div className="p-3 bg-gradient-to-r from-purple-500 to-pink-600 rounded-xl shadow-lg">
                <Target className="h-6 w-6 text-white" />
              </div>
              <div>
                <span className="text-xl font-bold text-slate-800">Status Overview</span>
                <p className="text-sm text-slate-600 font-normal">Current distribution</p>
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent className="p-10">
            <ResponsiveContainer width="100%" height={360}>
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={110}
                  dataKey="value"
                  labelLine={false}
                  label={({ cx, cy, midAngle, innerRadius, outerRadius, percent, name, index }) => {
                    if (percent === 0) return null;

                    const RADIAN = Math.PI / 180;
                    const radius = percent > 0.08
                      ? innerRadius + (outerRadius - innerRadius) / 2 
                      : outerRadius + 10;
                    const x = cx + radius * Math.cos(-midAngle * RADIAN);
                    const y = cy + radius * Math.sin(-midAngle * RADIAN);

                    return (
                      <text
                        x={x}
                        y={y}
                        fill={'slate-800' }
                        textAnchor="middle"
                        dominantBaseline="central"
                        style={{
                          fontSize: '12px',
                          fontWeight: 600,
                          fontFamily: 'Inter, sans-serif',
                          textShadow: percent > 0.08 ? '0 1px 2px rgba(0, 0, 0, 0.3)' : 'none',
                          pointerEvents: 'none',
                        }}
                      >
                        {`${name} ${Math.round(percent * 100)}%`}
                      </text>
                    );
                  }}
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>

                <Tooltip
                  contentStyle={{
                    backgroundColor: 'white',
                    border: 'none',
                    borderRadius: '12px',
                    boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)',
                  }}
                />
              </PieChart>
          </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      
      <Card className="border-0 shadow-2xl bg-white/90 backdrop-blur-sm hover:shadow-3xl transition-all duration-300 rounded-2xl overflow-hidden">
        <CardHeader className="bg-gradient-to-r from-green-50 to-emerald-50 border-b border-green-100">
          <CardTitle className="flex items-center space-x-3">
            <div className="p-3 bg-gradient-to-r from-green-500 to-emerald-600 rounded-xl shadow-lg">
              <BarChart className="h-6 w-6 text-white" />
            </div>
            <div>
              <span className="text-xl font-bold text-slate-800">Weekly Performance</span>
              <p className="text-sm text-slate-600 font-normal">Task completion vs assignment rates</p>
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={performanceData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" opacity={0.5} />
              <XAxis dataKey="day" stroke="#64748b" fontSize={12} tickLine={false} />
              <YAxis stroke="#64748b" fontSize={12} tickLine={false} />
              <Tooltip 
                contentStyle={{
                  backgroundColor: 'white',
                  border: 'none',
                  borderRadius: '12px',
                  boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)',
                  padding: '12px'
                }}
              />
              <Bar dataKey="assigned" fill="#6366f1" name="Assigned" radius={[4, 4, 0, 0]} />
              <Bar dataKey="completed" fill="#10b981" name="Completed" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      
    </div>
  );
};

export default Dashboard;
