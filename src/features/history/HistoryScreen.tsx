import React, { useState } from 'react';
import { useDeliveredOrders } from '../../data/hooks/useOrders';
import { Card, CardContent, CardHeader, CardTitle } from '../../shared/ui/Card';
import { Button } from '../../shared/ui/Button';
import { formatCurrency } from '../../shared/utils';
import { format, isToday, isThisWeek, isThisMonth } from 'date-fns';
import { Download, Filter, Search } from 'lucide-react';
import { Input } from '../../shared/ui/Input';
import { Badge } from '../../shared/ui/Badge';

type FilterType = 'ALL' | 'TODAY' | 'WEEK' | 'MONTH';

export function HistoryScreen() {
  const { data: orders = [], isLoading } = useDeliveredOrders();
  const [filter, setFilter] = useState<FilterType>('ALL');
  const [search, setSearch] = useState('');

  const filteredOrders = orders.filter(order => {
    // Search filter
    const searchMatch = 
      order.orderNo.toLowerCase().includes(search.toLowerCase()) || 
      order.customerName.toLowerCase().includes(search.toLowerCase()) ||
      order.customerPhone.includes(search);
    
    if (!searchMatch) return false;

    // Date filter
    const date = new Date(order.createdAt);
    if (filter === 'TODAY') return isToday(date);
    if (filter === 'WEEK') return isThisWeek(date);
    if (filter === 'MONTH') return isThisMonth(date);
    
    return true;
  });

  const handleExport = () => {
    const headers = ['رقم الطلب', 'اسم العميل', 'رقم الهاتف', 'عدد القطع', 'الإجمالي', 'تاريخ الإنشاء'];
    const rows = filteredOrders.map(o => [
      o.orderNo, 
      o.customerName, 
      o.customerPhone, 
      o.itemCount, 
      o.totals.total, 
      format(new Date(o.createdAt), 'yyyy-MM-dd HH:mm')
    ]);
    
    // Add BOM for Arabic Excel support
    const csvContent = '\uFEFF' + [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    
    link.href = url;
    link.download = `تقرير_الطلبات_المسلمة_${format(new Date(), 'yyyy-MM-dd')}.csv`;
    link.click();
  };

  if (isLoading) return <div className="p-4 md:p-8">جاري تحميل سجل الطلبات...</div>;

  return (
    <div className="p-4 md:p-8 h-full flex flex-col">
      <div className="mb-6 flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">سجل الطلبات المسلمة</h2>
          <p className="text-slate-500">أرشيف لجميع الطلبات التي تم تسليمها للعملاء.</p>
        </div>
        <Button onClick={handleExport} className="flex items-center justify-center gap-2 w-full sm:w-auto" variant="outline">
          <Download size={16} />
          تصدير التقرير (CSV)
        </Button>
      </div>

      <Card className="flex-1 flex flex-col min-h-0">
        <CardHeader className="border-b border-slate-100 bg-slate-50/50 pb-4">
          <div className="flex flex-col md:flex-row justify-between gap-4">
            <div className="flex flex-wrap items-center gap-2 bg-white border border-slate-200 rounded-lg p-1">
              <button 
                onClick={() => setFilter('ALL')}
                className={`px-3 py-1.5 text-sm font-medium rounded-md transition-colors flex-1 sm:flex-none ${filter === 'ALL' ? 'bg-slate-900 text-white' : 'text-slate-600 hover:bg-slate-100'}`}
              >
                الكل
              </button>
              <button 
                onClick={() => setFilter('TODAY')}
                className={`px-3 py-1.5 text-sm font-medium rounded-md transition-colors flex-1 sm:flex-none ${filter === 'TODAY' ? 'bg-slate-900 text-white' : 'text-slate-600 hover:bg-slate-100'}`}
              >
                اليوم
              </button>
              <button 
                onClick={() => setFilter('WEEK')}
                className={`px-3 py-1.5 text-sm font-medium rounded-md transition-colors flex-1 sm:flex-none ${filter === 'WEEK' ? 'bg-slate-900 text-white' : 'text-slate-600 hover:bg-slate-100'}`}
              >
                هذا الأسبوع
              </button>
              <button 
                onClick={() => setFilter('MONTH')}
                className={`px-3 py-1.5 text-sm font-medium rounded-md transition-colors flex-1 sm:flex-none ${filter === 'MONTH' ? 'bg-slate-900 text-white' : 'text-slate-600 hover:bg-slate-100'}`}
              >
                هذا الشهر
              </button>
            </div>
            
            <div className="relative w-full md:w-64">
              <Search className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
              <Input 
                placeholder="بحث برقم الطلب أو العميل..." 
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pr-9 w-full"
              />
            </div>
          </div>
        </CardHeader>
        <CardContent className="flex-1 overflow-auto p-0">
          {filteredOrders.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-slate-400 p-8">
              <Filter size={48} className="mb-4 opacity-20" />
              <p>لا توجد طلبات مطابقة للبحث أو الفلتر الحالي.</p>
            </div>
          ) : (
            <table className="w-full text-sm text-right min-w-[800px]">
              <thead className="bg-slate-50 text-slate-500 sticky top-0 border-b border-slate-100">
                <tr>
                  <th className="px-6 py-3 font-medium">رقم الطلب</th>
                  <th className="px-6 py-3 font-medium">العميل</th>
                  <th className="px-6 py-3 font-medium">تاريخ الإنشاء</th>
                  <th className="px-6 py-3 font-medium">القطع</th>
                  <th className="px-6 py-3 font-medium">الإجمالي</th>
                  <th className="px-6 py-3 font-medium">الحالة</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredOrders.map(order => (
                  <tr key={order.id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="px-6 py-4 font-mono font-medium text-slate-900">{order.orderNo}</td>
                    <td className="px-6 py-4">
                      <div className="font-medium text-slate-900">{order.customerName}</div>
                      <div className="text-xs text-slate-500" dir="ltr">{order.customerPhone}</div>
                    </td>
                    <td className="px-6 py-4 text-slate-600" dir="ltr">
                      {format(new Date(order.createdAt), 'yyyy-MM-dd HH:mm')}
                    </td>
                    <td className="px-6 py-4 text-slate-600">{order.itemCount}</td>
                    <td className="px-6 py-4 font-mono font-medium text-slate-900" dir="ltr">
                      {formatCurrency(order.totals.total)}
                    </td>
                    <td className="px-6 py-4">
                      <Badge variant="success">تم التسليم</Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
