import { useState, useEffect } from 'react';
import { WEBHOOKS } from '@/config/webhooks';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ArrowLeft, RefreshCw, TrendingUp, Users, FileText, Mail, X } from 'lucide-react';
import {
    AreaChart,
    Area,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    BarChart,
    Bar,
    PieChart,
    Pie,
    Cell,
    Legend
} from 'recharts';

interface Props {
    onBack: () => void;
}

export default function DashboardPage({ onBack }: Props) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const [data, setData] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [searchQuery, setSearchQuery] = useState('');

    const fetchData = async () => {
        setLoading(true);
        try {
            const res = await fetch(WEBHOOKS.FETCH_INVOICES);
            const json = await res.json();
            setData(Array.isArray(json) ? json : []);
        } catch (err) {
            console.error('Failed to fetch data', err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    // filtering
    const filteredData = data.filter(item => {
        const date = item.invoiceDate || '';
        const invNo = (item.invoiceNumber || '').toLowerCase();
        const query = searchQuery.toLowerCase();

        if (startDate && date < startDate) return false;
        if (endDate && date > endDate) return false;
        if (query && !invNo.includes(query)) return false;

        return true;
    });

    // calculations
    const totalRevenue = filteredData.reduce((acc, curr) => acc + (Number(curr.total) || 0), 0);
    const totalInvoices = filteredData.length;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const avgInvoiceValue = totalInvoices > 0 ? totalRevenue / totalInvoices : 0;
    const sentCount = filteredData.filter(d => (d.gmailStatus || '').toLowerCase() === 'yes').length;
    const sentRate = totalInvoices > 0 ? (sentCount / totalInvoices) * 100 : 0;

    // chart data preparation
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const revenueByDate = filteredData.reduce((acc: any, curr) => {
        const date = curr.invoiceDate || 'Unknown';
        acc[date] = (acc[date] || 0) + (Number(curr.total) || 0);
        return acc;
    }, {});

    const revenueTrendData = Object.keys(revenueByDate)
        .sort()
        .map(date => ({ date, amount: revenueByDate[date] }));

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const revenueByClient = filteredData.reduce((acc: any, curr) => {
        const client = curr.clientName || 'Unknown';
        acc[client] = (acc[client] || 0) + (Number(curr.total) || 0);
        return acc;
    }, {});

    const clientData = Object.keys(revenueByClient)
        .map(client => ({ name: client, value: revenueByClient[client] }))
        .sort((a, b) => b.value - a.value)
        .slice(0, 5); // top 5 clients

    const statusData = [
        { name: 'Sent', value: sentCount },
        { name: 'Not Sent', value: totalInvoices - sentCount },
    ];

    const COLORS = ['#10b981', '#f59e0b'];

    return (
        <div className="min-h-screen bg-background p-4 md:p-8">
            <div className="max-w-6xl mx-auto space-y-6">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <Button variant="ghost" size="icon" onClick={onBack}>
                            <ArrowLeft className="w-5 h-5" />
                        </Button>
                        <h1 className="text-2xl font-display font-bold text-foreground">Analytics Dashboard</h1>
                    </div>
                    <Button variant="outline" size="sm" onClick={fetchData} className="gap-1.5 h-9">
                        <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} /> Refresh
                    </Button>
                </div>

                {/* Filters */}
                <div className="glass-panel p-4 rounded-lg flex flex-wrap gap-4 items-end">
                    <div className="w-full sm:w-auto">
                        <Label className="text-xs mb-1.5 block">Start Date</Label>
                        <Input
                            type="date"
                            value={startDate}
                            onChange={e => setStartDate(e.target.value)}
                            className="h-9 w-full sm:w-[140px]"
                        />
                    </div>
                    <div className="w-full sm:w-auto">
                        <Label className="text-xs mb-1.5 block">End Date</Label>
                        <Input
                            type="date"
                            value={endDate}
                            onChange={e => setEndDate(e.target.value)}
                            className="h-9 w-full sm:w-[140px]"
                        />
                    </div>
                    <div className="flex-1 min-w-[200px]">
                        <Label className="text-xs mb-1.5 block">Search Invoice No.</Label>
                        <Input
                            type="text"
                            placeholder="e.g. INV-001"
                            value={searchQuery}
                            onChange={e => setSearchQuery(e.target.value)}
                            className="h-9 w-full"
                        />
                    </div>
                    {(startDate || endDate || searchQuery) && (
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => { setStartDate(''); setEndDate(''); setSearchQuery(''); }}
                            className="h-9 text-muted-foreground hover:text-destructive"
                        >
                            <X className="w-4 h-4 mr-1" /> Clear
                        </Button>
                    )}
                </div>

                {/* KPI Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
                            <TrendingUp className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">AED {totalRevenue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</div>
                            <p className="text-xs text-muted-foreground">Across all invoices</p>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Total Invoices</CardTitle>
                            <FileText className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{totalInvoices}</div>
                            <p className="text-xs text-muted-foreground">Invoices generated</p>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Avg. Invoice Value</CardTitle>
                            <Users className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">AED {avgInvoiceValue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</div>
                            <p className="text-xs text-muted-foreground">Per invoice</p>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Email Sent Rate</CardTitle>
                            <Mail className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{sentRate.toFixed(1)}%</div>
                            <p className="text-xs text-muted-foreground">{sentCount} of {totalInvoices} sent</p>
                        </CardContent>
                    </Card>
                </div>

                {/* Charts Row 1 */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <Card className="col-span-1">
                        <CardHeader>
                            <CardTitle>Revenue Trend</CardTitle>
                        </CardHeader>
                        <CardContent className="h-[300px]">
                            <ResponsiveContainer width="100%" height="100%">
                                <AreaChart data={revenueTrendData}>
                                    <defs>
                                        <linearGradient id="colorAmount" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="#8884d8" stopOpacity={0.8} />
                                            <stop offset="95%" stopColor="#8884d8" stopOpacity={0} />
                                        </linearGradient>
                                    </defs>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} />
                                    <XAxis dataKey="date" tickLine={false} axisLine={false} tickMargin={10} minTickGap={30} fontSize={12} />
                                    <YAxis tickLine={false} axisLine={false} tickFormatter={(value) => `AED ${value}`} fontSize={12} />
                                    <Tooltip
                                        // eslint-disable-next-line @typescript-eslint/no-explicit-any
                                        formatter={(value: any) => [`AED ${Number(value).toFixed(2)}`, 'Revenue']}
                                        contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
                                    />
                                    <Area type="monotone" dataKey="amount" stroke="#8884d8" fillOpacity={1} fill="url(#colorAmount)" />
                                </AreaChart>
                            </ResponsiveContainer>
                        </CardContent>
                    </Card>

                    <Card className="col-span-1">
                        <CardHeader>
                            <CardTitle>Top Clients by Revenue</CardTitle>
                        </CardHeader>
                        <CardContent className="h-[300px]">
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={clientData} layout="vertical" margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                                    <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} />
                                    <XAxis type="number" hide />
                                    <YAxis dataKey="name" type="category" width={100} tick={{ fontSize: 12 }} interval={0} />
                                    <Tooltip
                                        // eslint-disable-next-line @typescript-eslint/no-explicit-any
                                        formatter={(value: any) => [`AED ${Number(value).toFixed(2)}`, 'Revenue']}
                                        cursor={{ fill: 'transparent' }}
                                        contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
                                    />
                                    <Bar dataKey="value" fill="#3b82f6" radius={[0, 4, 4, 0]} barSize={20} />
                                </BarChart>
                            </ResponsiveContainer>
                        </CardContent>
                    </Card>
                </div>

                {/* Charts Row 2 */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <Card className="col-span-1">
                        <CardHeader>
                            <CardTitle>Email Status</CardTitle>
                        </CardHeader>
                        <CardContent className="h-[250px] flex items-center justify-center">
                            <ResponsiveContainer width="100%" height="100%">
                                <PieChart>
                                    <Pie
                                        data={statusData}
                                        cx="50%"
                                        cy="50%"
                                        innerRadius={60}
                                        outerRadius={80}
                                        paddingAngle={5}
                                        dataKey="value"
                                    >
                                        {statusData.map((_entry, index) => (
                                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                        ))}
                                    </Pie>
                                    <Tooltip />
                                    <Legend verticalAlign="bottom" height={36} />
                                </PieChart>
                            </ResponsiveContainer>
                        </CardContent>
                    </Card>

                    <Card className="col-span-1 md:col-span-2">
                        <CardHeader>
                            <CardTitle>Recent Activity</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
                                {filteredData.slice(0, 5).map((inv: any, i: number) => (
                                    <div key={i} className="flex items-center justify-between border-b pb-2 last:border-0 last:pb-0">
                                        <div>
                                            <p className="font-medium text-sm">{inv.invoiceNumber}</p>
                                            <p className="text-xs text-muted-foreground">{inv.clientName}</p>
                                        </div>
                                        <div className="text-right">
                                            <p className="font-bold text-sm">AED {Number(inv.total).toFixed(2)}</p>
                                            <p className="text-xs text-muted-foreground">{inv.invoiceDate}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}
