import { useEffect, useMemo, useState } from 'react';
import { Users, Package, FileText, Gavel, TrendingUp, AlertCircle, CheckCircle, XCircle } from 'lucide-react';
import { Card } from './ui/card';
import { LineChart, Line, AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

type ApiListResponse<T> = {
  status: string;
  data: T[];
};

type ApiBidsResponse = {
  status: string;
  data: {
    faremerBid?: any[]; // Note: API uses 'faremerBid' spelling
    consumerBid?: any[];
  };
};

type User = {
  _id: string;
  user_name: string;
};

type Listing = {
  _id: string;
  product_name: string;
  product_quantity: number;
  quantity_unit: string;
  createdAt?: string;
};

type RequestItem = {
  _id: string;
  product_name: string;
  product_quantity: number;
  quantity_unit: string;
  when?: string;
  createdAt?: string;
};

type FarmerBid = {
  _id: string;
  farmer_name?: string;
  quantity?: number;
  price_per_unit?: number;
  message?: string;
  status?: string;
  createdAt?: string;
};

type ConsumerBid = {
  _id: string;
  requested_quantity?: number;
  bid_price?: number;
  message?: string;
  status?: string;
  createdAt?: string;
};

const trendData = [
  { month: 'Jan', users: 8400, listings: 2100, requests: 900 },
  { month: 'Feb', users: 9200, listings: 2400, requests: 1000 },
  { month: 'Mar', users: 10100, listings: 2700, requests: 1100 },
  { month: 'Apr', users: 11000, listings: 3000, requests: 1150 },
  { month: 'May', users: 11900, listings: 3200, requests: 1200 },
  { month: 'Jun', users: 12847, listings: 3429, requests: 1256 },
];

// Bid distribution colors by status
const BID_COLORS = {
  Pending: '#00d9ff',
  Accepted: '#00FF99',
  Rejected: '#ff4466',
} as const;

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
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [users, setUsers] = useState<User[]>([]);
  const [listings, setListings] = useState<Listing[]>([]);
  const [requests, setRequests] = useState<RequestItem[]>([]);
  const [farmerBids, setFarmerBids] = useState<FarmerBid[]>([]);
  const [consumerBids, setConsumerBids] = useState<ConsumerBid[]>([]);

  // Derived counts
  const totalUsers = users.length;
  const activeListings = listings.length;
  const openRequests = requests.length;
  // Bid status counts
  const bidCounts = useMemo(() => {
    const all = [...(farmerBids ?? []), ...(consumerBids ?? [])];
    return all.reduce(
      (acc, b: { status?: string }) => {
        const s = (b.status || '').toLowerCase();
        if (s === 'pending') acc.pending += 1;
        else if (s === 'accepted' || s === 'approved') acc.accepted += 1;
        else if (s === 'rejected' || s === 'declined') acc.rejected += 1;
        return acc;
      },
      { pending: 0, accepted: 0, rejected: 0 }
    );
  }, [farmerBids, consumerBids]);
  const pendingBidsCount = bidCounts.pending;

  useEffect(() => {
    const controller = new AbortController();
    const signal = controller.signal;

    async function fetchAll() {
      try {
        setLoading(true);
        setError(null);

        const base = 'https://taza-bazar-backend.onrender.com/api/v1/admin';

        // Read JWT from common storage keys and add Authorization header when available
        const token = (typeof window !== 'undefined' && (localStorage.getItem('adminToken') || localStorage.getItem('token') || localStorage.getItem('authToken'))) || '';
        const headers: Record<string, string> = {
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        };

        const [usersRes, listRes, reqRes, bidsRes] = await Promise.all([
          fetch(`${base}/allUser`, { method: 'GET', signal, headers }),
          fetch(`${base}/allList`, { method: 'GET', signal, headers }),
          fetch(`${base}/allReq`, { method: 'GET', signal, headers }),
          fetch(`${base}/allBid`, { method: 'GET', signal, headers }),
        ]);

        if (!usersRes.ok || !listRes.ok || !reqRes.ok || !bidsRes.ok) {
          throw new Error('Failed to fetch one or more resources');
        }

        const usersJson = (await usersRes.json()) as ApiListResponse<User>;
        const listJson = (await listRes.json()) as ApiListResponse<Listing>;
        const reqJson = (await reqRes.json()) as ApiListResponse<RequestItem>;
        const bidsJson = (await bidsRes.json()) as ApiBidsResponse;

        setUsers(Array.isArray(usersJson.data) ? usersJson.data : []);
        setListings(Array.isArray(listJson.data) ? listJson.data : []);
        setRequests(Array.isArray(reqJson.data) ? reqJson.data : []);
        setFarmerBids(Array.isArray(bidsJson.data?.faremerBid) ? (bidsJson.data?.faremerBid as FarmerBid[]) : []);
        setConsumerBids(Array.isArray(bidsJson.data?.consumerBid) ? (bidsJson.data?.consumerBid as ConsumerBid[]) : []);
      } catch (err: any) {
        if (err?.name !== 'AbortError') {
          setError(err?.message || 'Something went wrong while loading dashboard data');
        }
      } finally {
        setLoading(false);
      }
    }

    fetchAll();
    return () => controller.abort();
  }, []);

  const kpiData = useMemo(
    () => [
      { label: 'Total Users', value: totalUsers.toLocaleString(), icon: Users },
      { label: 'Active Listings', value: activeListings.toLocaleString(), icon: Package },
      { label: 'Open Requests', value: openRequests.toLocaleString(), icon: FileText },
      { label: 'Pending Bids', value: pendingBidsCount.toLocaleString(), icon: Gavel },
    ],
    [totalUsers, activeListings, openRequests, pendingBidsCount]
  );

  // Dynamic bid distribution for PieChart
  const bidStatusData = useMemo(() => [
    { name: 'Pending', value: bidCounts.pending, color: BID_COLORS.Pending },
    { name: 'Accepted', value: bidCounts.accepted, color: BID_COLORS.Accepted },
    { name: 'Rejected', value: bidCounts.rejected, color: BID_COLORS.Rejected },
  ], [bidCounts]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-primary mb-2">Dashboard</h1>
        <p className="text-muted-foreground">Welcome to the admin control center</p>
        {loading && (
          <p className="text-xs text-muted-foreground mt-1">Loading latest metrics…</p>
        )}
        {error && (
          <p className="text-xs text-destructive mt-1">{error}</p>
        )}
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
                  {/* Optional: trend placeholder removed since values are live counts */}
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

      {/* Open Requests and Pending Bids */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Open Requests */}
        <Card className="p-6 bg-card neon-border">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-foreground">Open Requests</h3>
            <span className="px-3 py-1 rounded-full bg-primary/20 text-primary text-sm neon-glow-sm">
              {openRequests} total
            </span>
          </div>
          <div className="space-y-3">
            {requests.slice(0, 6).map((req) => (
              <div key={req._id} className="p-4 rounded-xl bg-muted/50 border border-border hover:border-primary/50 transition-all duration-300">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <p className="text-sm text-foreground mb-1">{req.product_name}</p>
                    <p className="text-xs text-muted-foreground">
                      {req.product_quantity} {req.quantity_unit}
                    </p>
                  </div>
                  <div className="text-right">
                    <span className="text-xs text-muted-foreground">
                      {req.when ? new Date(req.when).toLocaleString() : req.createdAt ? new Date(req.createdAt).toLocaleString() : ''}
                    </span>
                  </div>
                </div>
              </div>
            ))}
            {requests.length === 0 && !loading && (
              <p className="text-sm text-muted-foreground">No open requests right now.</p>
            )}
          </div>
        </Card>

        {/* Pending Bids */}
        <Card className="p-6 bg-card neon-border">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-foreground">Pending Bids</h3>
            <span className="px-3 py-1 rounded-full bg-primary/20 text-primary text-sm neon-glow-sm">
              {pendingBidsCount} total
            </span>
          </div>
          <div className="space-y-3">
            {farmerBids.filter(b => (b.status || '').toLowerCase() === 'pending').slice(0, 3).map((bid) => (
              <div key={`farmer-${bid._id}`} className="p-4 rounded-xl bg-muted/50 border border-border">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <p className="text-sm text-foreground mb-1">Farmer Bid{bid.farmer_name ? ` • ${bid.farmer_name}` : ''}</p>
                    <p className="text-xs text-muted-foreground">
                      Qty: {bid.quantity ?? '-'} @ {bid.price_per_unit ?? '-'}
                    </p>
                    {bid.message && <p className="text-xs text-muted-foreground mt-1">{bid.message}</p>}
                  </div>
                  <div className="text-right">
                    <span className="text-xs text-muted-foreground">{bid.createdAt ? new Date(bid.createdAt).toLocaleString() : ''}</span>
                  </div>
                </div>
              </div>
            ))}
            {consumerBids.filter(b => (b.status || '').toLowerCase() === 'pending').slice(0, 3).map((bid) => (
              <div key={`consumer-${bid._id}`} className="p-4 rounded-xl bg-muted/50 border border-border">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <p className="text-sm text-foreground mb-1">Consumer Bid</p>
                    <p className="text-xs text-muted-foreground">
                      Qty: {bid.requested_quantity ?? '-'} @ {bid.bid_price ?? '-'}
                    </p>
                    {bid.message && <p className="text-xs text-muted-foreground mt-1">{bid.message}</p>}
                  </div>
                  <div className="text-right">
                    <span className="text-xs text-muted-foreground">{bid.createdAt ? new Date(bid.createdAt).toLocaleString() : ''}</span>
                  </div>
                </div>
              </div>
            ))}
            {pendingBidsCount === 0 && !loading && (
              <p className="text-sm text-muted-foreground">No pending bids right now.</p>
            )}
          </div>
        </Card>
      </div>
    </div>
  );
}
