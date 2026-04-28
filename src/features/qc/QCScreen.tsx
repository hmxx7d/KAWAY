import React from 'react';
import { useActiveOrdersRealtime, useUpdateOrderStatus, useUpdateOrder } from '../../data/hooks/useOrders';
import { Badge } from '../../shared/ui/Badge';
import { Button } from '../../shared/ui/Button';
import { Card, CardContent, CardHeader, CardTitle } from '../../shared/ui/Card';
import { formatCurrency } from '../../shared/utils';

export function QCScreen() {
  const { data: orders = [], isLoading } = useActiveOrdersRealtime();
  const updateStatus = useUpdateOrderStatus();
  const updateOrder = useUpdateOrder();

  // In a real app, we'd fetch READY orders specifically.
  // We use the active orders and filter for READY or QC_REVIEW.
  const qcOrders = orders.filter(o => o.status === 'QC_REVIEW');
  const readyOrders = orders.filter(o => o.status === 'READY');

  if (isLoading) return <div className="p-4 md:p-8">جاري تحميل طلبات الجودة والجاهزة...</div>;

  return (
    <div className="p-4 md:p-8 h-full flex flex-col gap-6 md:gap-8 overflow-auto lg:overflow-hidden">
      <div className="shrink-0">
        <h2 className="text-2xl font-bold tracking-tight mb-2">مراقبة الجودة والتسليم</h2>
        <p className="text-slate-500">مراجعة القطع وتحديدها كجاهزة لاستلام العميل.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8 flex-1 lg:min-h-0 pb-6 lg:pb-0">
        {/* QC Review Column */}
        <Card className="flex flex-col h-[500px] lg:h-full shrink-0">
          <CardHeader className="border-b border-slate-100 bg-slate-50">
            <div className="flex justify-between items-center">
              <CardTitle>بانتظار فحص الجودة</CardTitle>
              <Badge variant="warning">{qcOrders.length}</Badge>
            </div>
          </CardHeader>
          <CardContent className="flex-1 overflow-auto p-4 space-y-4">
            {qcOrders.length === 0 ? (
              <div className="h-full flex items-center justify-center text-slate-400 text-sm">
                لا توجد طلبات بانتظار الفحص
              </div>
            ) : (
              qcOrders.map(order => (
                <div key={order.id} className="border border-slate-200 rounded-lg p-4 bg-white">
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <span className="font-mono text-sm font-bold text-slate-900">{order.orderNo}</span>
                      <p className="text-sm font-medium text-slate-700">{order.customerName}</p>
                    </div>
                    <Badge variant="outline">{order.items.length} قطع</Badge>
                  </div>
                  
                  <div className="space-y-2 mb-4">
                    {order.items.map(item => (
                      <div key={item.id} className="flex justify-between items-center text-sm bg-slate-50 p-2 rounded">
                        <span className="text-slate-700">{item.serviceName}</span>
                        <span className="font-mono text-xs text-slate-500">{item.tagCode}</span>
                      </div>
                    ))}
                  </div>

                  <div className="flex gap-2">
                    <Button 
                      className="flex-1" 
                      variant="outline"
                      onClick={() => updateStatus.mutate({ orderId: order.id, status: 'IN_PROGRESS' })}
                      disabled={updateStatus.isPending}
                    >
                      فشل (إعادة عمل)
                    </Button>
                    <Button 
                      className="flex-1" 
                      onClick={() => updateStatus.mutate({ orderId: order.id, status: 'READY' })}
                      disabled={updateStatus.isPending}
                    >
                      اجتياز الجودة
                    </Button>
                  </div>
                </div>
              ))
            )}
          </CardContent>
        </Card>

        {/* Ready for Pickup Column */}
        <Card className="flex flex-col h-[500px] lg:h-full shrink-0">
          <CardHeader className="border-b border-slate-100 bg-emerald-50">
            <div className="flex justify-between items-center">
              <CardTitle className="text-emerald-900">جاهز للاستلام</CardTitle>
              <Badge variant="success">{readyOrders.length}</Badge>
            </div>
          </CardHeader>
          <CardContent className="flex-1 overflow-auto p-4 space-y-4">
            {readyOrders.length === 0 ? (
              <div className="h-full flex items-center justify-center text-slate-400 text-sm">
                لا توجد طلبات جاهزة للاستلام
              </div>
            ) : (
              readyOrders.map(order => (
                <div key={order.id} className="border border-emerald-200 rounded-lg p-4 bg-white">
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <span className="font-mono text-sm font-bold text-slate-900">{order.orderNo}</span>
                      <p className="text-sm font-medium text-slate-700">{order.customerName}</p>
                    </div>
                    <div className="text-left">
                      <p className="text-sm font-bold text-slate-900" dir="ltr">{formatCurrency(order.totals.balance)}</p>
                      <p className="text-xs text-slate-500">المتبقي</p>
                    </div>
                  </div>

                  <Button 
                    className="w-full bg-emerald-600 hover:bg-emerald-700 text-white" 
                    onClick={() => updateOrder.mutate({ 
                      orderId: order.id, 
                      updates: { 
                        status: 'DELIVERED',
                        totals: {
                          ...order.totals,
                          paid: order.totals.total,
                          balance: 0
                        }
                      } 
                    })}
                    disabled={updateOrder.isPending}
                  >
                    تأكيد التسليم والدفع
                  </Button>
                </div>
              ))
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
