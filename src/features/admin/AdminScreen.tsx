import React, { useMemo, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../../shared/ui/Card';
import { formatCurrency } from '../../shared/utils';
import { TrendingUp, Users, Package, AlertTriangle } from 'lucide-react';
import { useAllOrders } from '../../data/hooks/useOrders';
import { useCustomers } from '../../data/hooks/useCustomers';
import { format, subDays, subMonths, isSameDay, parseISO } from 'date-fns';
import { ar } from 'date-fns/locale';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from 'recharts';

export function AdminScreen() {
  const { data: orders = [], isLoading: isLoadingOrders } = useAllOrders();
  const { data: customers = [], isLoading: isLoadingCustomers } = useCustomers();
  const [timeFilter, setTimeFilter] = useState<'week' | 'month' | '6months' | 'year'>('week');

  const stats = useMemo(() => {
    const today = new Date();
    const yesterday = subDays(today, 1);

    // Revenue
    const todayRevenue = orders
      .filter(o => isSameDay(parseISO(o.createdAt), today) && o.status !== 'CANCELLED')
      .reduce((sum, o) => sum + o.totals.total, 0);
    
    const yesterdayRevenue = orders
      .filter(o => isSameDay(parseISO(o.createdAt), yesterday) && o.status !== 'CANCELLED')
      .reduce((sum, o) => sum + o.totals.total, 0);

    const revenueTrend = yesterdayRevenue === 0 
      ? '+100%' 
      : `${((todayRevenue - yesterdayRevenue) / yesterdayRevenue * 100).toFixed(0)}%`;

    // Active Orders
    const activeOrders = orders.filter(o => 
      ['RECEIVED', 'SORTED', 'IN_PROGRESS', 'QC_REVIEW', 'READY'].includes(o.status)
    ).length;

    // Overdue Orders
    const overdueOrders = orders.filter(o => 
      ['RECEIVED', 'SORTED', 'IN_PROGRESS', 'QC_REVIEW'].includes(o.status) && 
      new Date(o.dueAt) < today
    ).length;

    return [
      { 
        title: 'إيرادات اليوم', 
        value: formatCurrency(todayRevenue), 
        icon: TrendingUp, 
        trend: revenueTrend.startsWith('-') ? revenueTrend : `+${revenueTrend}`,
        alert: false
      },
      { 
        title: 'الطلبات النشطة', 
        value: activeOrders.toString(), 
        icon: Package, 
        trend: 'مباشر',
        alert: false
      },
      { 
        title: 'إجمالي العملاء', 
        value: customers.length.toString(), 
        icon: Users, 
        trend: 'مستقر',
        alert: false
      },
      { 
        title: 'تجاوزات الوقت', 
        value: overdueOrders.toString(), 
        icon: AlertTriangle, 
        trend: overdueOrders > 0 ? 'تنبيه' : 'جيد', 
        alert: overdueOrders > 0 
      },
    ];
  }, [orders, customers]);

  const chartData = useMemo(() => {
    const data = [];
    const today = new Date();

    if (timeFilter === 'week') {
      for (let i = 6; i >= 0; i--) {
        const date = subDays(today, i);
        const dayOrders = orders.filter(o => isSameDay(parseISO(o.createdAt), date) && o.status !== 'CANCELLED');
        const revenue = dayOrders.reduce((sum, o) => sum + o.totals.total, 0);
        data.push({
          name: format(date, 'EEEE', { locale: ar }),
          revenue: revenue
        });
      }
    } else if (timeFilter === 'month') {
      for (let i = 29; i >= 0; i--) {
        const date = subDays(today, i);
        const dayOrders = orders.filter(o => isSameDay(parseISO(o.createdAt), date) && o.status !== 'CANCELLED');
        const revenue = dayOrders.reduce((sum, o) => sum + o.totals.total, 0);
        data.push({
          name: format(date, 'd MMM', { locale: ar }),
          revenue: revenue
        });
      }
    } else if (timeFilter === '6months') {
      for (let i = 5; i >= 0; i--) {
        const date = subMonths(today, i);
        const monthOrders = orders.filter(o => {
            const oDate = parseISO(o.createdAt);
            return oDate.getMonth() === date.getMonth() && oDate.getFullYear() === date.getFullYear() && o.status !== 'CANCELLED';
        });
        const revenue = monthOrders.reduce((sum, o) => sum + o.totals.total, 0);
        data.push({
          name: format(date, 'MMMM', { locale: ar }),
          revenue: revenue
        });
      }
    } else if (timeFilter === 'year') {
      for (let i = 11; i >= 0; i--) {
        const date = subMonths(today, i);
        const monthOrders = orders.filter(o => {
            const oDate = parseISO(o.createdAt);
            return oDate.getMonth() === date.getMonth() && oDate.getFullYear() === date.getFullYear() && o.status !== 'CANCELLED';
        });
        const revenue = monthOrders.reduce((sum, o) => sum + o.totals.total, 0);
        data.push({
          name: format(date, 'MMM', { locale: ar }),
          revenue: revenue
        });
      }
    }
    return data;
  }, [orders, timeFilter]);

  const recentLogs = useMemo(() => {
    // Mocking recent activity based on latest orders
    return orders
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      .slice(0, 5)
      .map(o => ({
        time: format(parseISO(o.createdAt), 'hh:mm a', { locale: ar }),
        action: `تم إنشاء طلب جديد ${o.orderNo}`,
        user: 'النظام'
      }));
  }, [orders]);

  if (isLoadingOrders || isLoadingCustomers) {
    return <div className="p-4 md:p-8">جاري تحميل التقارير...</div>;
  }

  return (
    <div className="p-4 md:p-8 h-full flex flex-col overflow-y-auto">
      <div className="mb-6 md:mb-8">
        <h2 className="text-2xl font-bold tracking-tight">لوحة تحكم الإدارة</h2>
        <p className="text-slate-500">نظرة عامة على أداء الفرع والإحصائيات المجمعة.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-6 md:mb-8">
        {stats.map((stat, i) => {
          const Icon = stat.icon;
          return (
            <Card key={i}>
              <CardContent className="p-6">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-sm font-medium text-slate-500 mb-1">{stat.title}</p>
                    <h3 className="text-3xl font-bold text-slate-900" dir="ltr">{stat.value}</h3>
                  </div>
                  <div className={`p-2 rounded-lg ${stat.alert ? 'bg-red-100 text-red-600' : 'bg-slate-100 text-slate-600'}`}>
                    <Icon size={20} />
                  </div>
                </div>
                <div className="mt-4 flex items-center text-xs">
                  <span className={`font-medium ${stat.alert ? 'text-red-600' : 'text-emerald-600'}`} dir="ltr">
                    {stat.trend}
                  </span>
                  {stat.title === 'إيرادات اليوم' && <span className="text-slate-500 mr-2">مقارنة بالأمس</span>}
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        <Card className="lg:col-span-2">
          <CardHeader className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <CardTitle>الإيرادات</CardTitle>
            <div className="flex bg-slate-100 rounded-lg p-1 text-sm overflow-x-auto w-full sm:w-auto">
              <button 
                className={`flex-1 sm:flex-none px-3 py-1.5 rounded-md transition-colors ${timeFilter === 'week' ? 'bg-white shadow-sm font-medium text-slate-900' : 'text-slate-500 hover:text-slate-700'}`}
                onClick={() => setTimeFilter('week')}
              >
                أسبوع
              </button>
              <button 
                className={`flex-1 sm:flex-none px-3 py-1.5 rounded-md transition-colors ${timeFilter === 'month' ? 'bg-white shadow-sm font-medium text-slate-900' : 'text-slate-500 hover:text-slate-700'}`}
                onClick={() => setTimeFilter('month')}
              >
                شهر
              </button>
              <button 
                className={`flex-1 sm:flex-none px-3 py-1.5 rounded-md transition-colors ${timeFilter === '6months' ? 'bg-white shadow-sm font-medium text-slate-900' : 'text-slate-500 hover:text-slate-700'}`}
                onClick={() => setTimeFilter('6months')}
              >
                6 أشهر
              </button>
              <button 
                className={`flex-1 sm:flex-none px-3 py-1.5 rounded-md transition-colors ${timeFilter === 'year' ? 'bg-white shadow-sm font-medium text-slate-900' : 'text-slate-500 hover:text-slate-700'}`}
                onClick={() => setTimeFilter('year')}
              >
                سنة
              </button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="h-72 w-full" dir="ltr">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={chartData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#0f172a" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#0f172a" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748b' }} dy={10} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748b' }} dx={-10} tickFormatter={(val) => `${val} ر.ع`} />
                  <Tooltip 
                    contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                    formatter={(value: number) => [`${value.toFixed(3)} ر.ع`, 'الإيرادات']}
                  />
                  <Area type="monotone" dataKey="revenue" stroke="#0f172a" strokeWidth={2} fillOpacity={1} fill="url(#colorRevenue)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>حالة النظام</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <div>
                <div className="flex justify-between text-sm mb-2">
                  <span className="font-medium">الوظائف السحابية (Cloud Functions)</span>
                  <span className="text-emerald-600 font-medium">تعمل</span>
                </div>
                <div className="w-full bg-slate-100 rounded-full h-2">
                  <div className="bg-emerald-500 h-2 rounded-full" style={{ width: '100%' }}></div>
                </div>
              </div>
              <div>
                <div className="flex justify-between text-sm mb-2">
                  <span className="font-medium">طابور إشعارات الرسائل (SMS)</span>
                  <span className="text-slate-500">0 قيد الانتظار</span>
                </div>
                <div className="w-full bg-slate-100 rounded-full h-2">
                  <div className="bg-slate-300 h-2 rounded-full" style={{ width: '0%' }}></div>
                </div>
              </div>
              <div>
                <div className="flex justify-between text-sm mb-2">
                  <span className="font-medium">مهمة التجميع اليومية</span>
                  <span className="text-slate-500">آخر تشغيل: 2:00 ص</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>سجل النشاطات الأخير (إنشاء الطلبات)</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentLogs.map((log, i) => (
                <div key={i} className="flex gap-4 text-sm border-b border-slate-100 pb-4 last:border-0 last:pb-0">
                  <div className="text-slate-400 font-mono w-20">{log.time}</div>
                  <div className="flex-1 text-slate-700">{log.action}</div>
                  <div className="text-slate-500 text-xs bg-slate-100 px-2 py-1 rounded">{log.user}</div>
                </div>
              ))}
              {recentLogs.length === 0 && (
                <div className="text-center text-slate-500 py-4">لا توجد نشاطات حديثة</div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
