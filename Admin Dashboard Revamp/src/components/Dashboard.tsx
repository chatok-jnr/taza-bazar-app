import { Users, Package, FileText, Gavel, TrendingUp, AlertCircle, CheckCircle, XCircle } from 'lucide-react';
import { Card } from './ui/card';
import { LineChart, Line, AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

const kpiData = [
  { label: 'Total Users', value: '12,847', change: '+12.5%', icon: Users, trend: 'up' },
  { label: 'Active Listings', value: '3,429', change: '+8.3%', icon: Package, trend: 'up' },
  { label: 'Open Requests', value: '1,256', change: '-3.2%', icon: FileText, trend: 'down' },
  { label: 'Pending Bids', value: '847', change: '+15.7%', icon: Gavel, trend: 'up' },
];

const trendData = [
  { month: 'Jan', users: 8400, listings: 2100, requests: 900 },
  { month: 'Feb', users: 9200, listings: 2400, requests: 1000 },
  { month: 'Mar', users: 10100, listings: 2700, requests: 1100 },
  { month: 'Apr', users: 11000, listings: 3000, requests: 1150 },
  { month: 'May', users: 11900, listings: 3200, requests: 1200 },
  { month: 'Jun', users: 12847, listings: 3429, requests: 1256 },
];

const bidStatusData = [
  { name: 'Pending', value: 847, color: '#00d9ff' },
  { name: 'Accepted', value: 3421, color: '#00FF99' },
  { name: 'Rejected', value: 1234, color: '#ff4466' },
];

const moderationQueue = [
  { id: 1, type: 'Listing', title: 'Organic Tomatoes - 50kg', status: 'pending', user: 'John Farmer', time: '5m ago' },
  { id: 2, type: 'Request', title: 'Need Fresh Vegetables', status: 'pending', user: 'Jane Consumer', time: '12m ago' },
  { id: 3, type: 'Report', title: 'Spam listing reported', status: 'review', user: 'Mike Buyer', time: '23m ago' },
  { id: 4, type: 'Listing', title: 'Fresh Milk - Daily Supply', status: 'pending', user: 'Sarah Dairy', time: '1h ago' },
];

const recentActivity = [
  { id: 1, action: 'Approved listing', item: 'Premium Rice - 100kg', admin: 'Admin A', time: '2m ago', type: 'success' },
  { id: 2, action: 'Rejected request', item: 'Suspicious bulk order', admin: 'Admin B', time: '15m ago', type: 'error' },
  { id: 3, action: 'Suspended user', item: 'user@example.com', admin: 'Admin A', time: '1h ago', type: 'warning' },
  { id: 4, action: 'Featured listing', item: 'Organic Wheat - Premium', admin: 'Admin C', time: '2h ago', type: 'success' },
];

export function Dashboard() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-primary mb-2">Dashboard</h1>
        <p className="text-muted-foreground">Welcome to the admin control center</p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {kpiData.map((kpi, index) => {
          const Icon = kpi.icon;
          return (
            <Card key={index} className="p-6 bg-card neon-border hover:neon-glow-sm transition-all duration-300">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <p className="text-sm text-muted-foreground mb-1">{kpi.label}</p>
                  <h2 className="text-foreground mb-2">{kpi.value}</h2>
                  <div className={`flex items-center gap-1 text-sm ${kpi.trend === 'up' ? 'text-primary' : 'text-destructive'}`}>
                    <TrendingUp className="w-4 h-4" />
                    <span>{kpi.change}</span>
                  </div>
                </div>
                <div className="w-12 h-12 rounded-xl bg-primary/20 flex items-center justify-center neon-glow-sm">
                  <Icon className="w-6 h-6 text-primary" />
                </div>
              </div>
            </Card>
          );
        })}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Trend Chart */}
        <Card className="p-6 bg-card neon-border">
          <h3 className="text-foreground mb-4">Growth Trends</h3>
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={trendData}>
              <defs>
                <linearGradient id="colorUsers" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#00FF99" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#00FF99" stopOpacity={0}/>
                </linearGradient>
                <linearGradient id="colorListings" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#00d9ff" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#00d9ff" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(0, 255, 153, 0.1)" />
              <XAxis dataKey="month" stroke="#7a9388" />
              <YAxis stroke="#7a9388" />
              <Tooltip
                contentStyle={{ backgroundColor: '#111917', border: '1px solid rgba(0, 255, 153, 0.3)', borderRadius: '0.5rem' }}
                labelStyle={{ color: '#e8f5f1' }}
              />
              <Area type="monotone" dataKey="users" stroke="#00FF99" strokeWidth={2} fillOpacity={1} fill="url(#colorUsers)" />
              <Area type="monotone" dataKey="listings" stroke="#00d9ff" strokeWidth={2} fillOpacity={1} fill="url(#colorListings)" />
            </AreaChart>
          </ResponsiveContainer>
        </Card>

        {/* Bid Status */}
        <Card className="p-6 bg-card neon-border">
          <h3 className="text-foreground mb-4">Bid Distribution</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={bidStatusData}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={100}
                paddingAngle={5}
                dataKey="value"
              >
                {bidStatusData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{ backgroundColor: '#111917', border: '1px solid rgba(0, 255, 153, 0.3)', borderRadius: '0.5rem' }}
                labelStyle={{ color: '#e8f5f1' }}
              />
            </PieChart>
          </ResponsiveContainer>
          <div className="flex justify-center gap-6 mt-4">
            {bidStatusData.map((item, index) => (
              <div key={index} className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }} />
                <span className="text-sm text-muted-foreground">{item.name}: {item.value}</span>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* Queues and Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Moderation Queue */}
        <Card className="p-6 bg-card neon-border">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-foreground">Moderation Queue</h3>
            <span className="px-3 py-1 rounded-full bg-primary/20 text-primary text-sm neon-glow-sm">
              {moderationQueue.length} pending
            </span>
          </div>
          <div className="space-y-3">
            {moderationQueue.map((item) => (
              <div key={item.id} className="p-4 rounded-xl bg-muted/50 border border-border hover:border-primary/50 transition-all duration-300">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="px-2 py-0.5 rounded text-xs bg-primary/20 text-primary">{item.type}</span>
                      <span className="text-xs text-muted-foreground">{item.time}</span>
                    </div>
                    <p className="text-sm text-foreground mb-1">{item.title}</p>
                    <p className="text-xs text-muted-foreground">by {item.user}</p>
                  </div>
                  <div className="flex gap-2">
                    <button className="p-2 rounded-lg bg-primary/20 hover:bg-primary/30 text-primary transition-all duration-300 hover:scale-110">
                      <CheckCircle className="w-4 h-4" />
                    </button>
                    <button className="p-2 rounded-lg bg-destructive/20 hover:bg-destructive/30 text-destructive transition-all duration-300 hover:scale-110">
                      <XCircle className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* Recent Activity */}
        <Card className="p-6 bg-card neon-border">
          <h3 className="text-foreground mb-4">Recent Admin Activity</h3>
          <div className="space-y-3">
            {recentActivity.map((activity) => (
              <div key={activity.id} className="p-4 rounded-xl bg-muted/50 border border-border">
                <div className="flex items-start gap-3">
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                    activity.type === 'success' ? 'bg-primary/20 text-primary' :
                    activity.type === 'error' ? 'bg-destructive/20 text-destructive' :
                    'bg-secondary/20 text-secondary'
                  }`}>
                    {activity.type === 'success' ? <CheckCircle className="w-4 h-4" /> :
                     activity.type === 'error' ? <XCircle className="w-4 h-4" /> :
                     <AlertCircle className="w-4 h-4" />}
                  </div>
                  <div className="flex-1">
                    <p className="text-sm text-foreground mb-1">{activity.action}</p>
                    <p className="text-xs text-muted-foreground mb-1">{activity.item}</p>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <span>{activity.admin}</span>
                      <span>•</span>
                      <span>{activity.time}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}
