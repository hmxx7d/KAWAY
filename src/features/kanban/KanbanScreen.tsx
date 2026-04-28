import React, { useState } from 'react';
import { useActiveOrdersRealtime, useUpdateOrderStatus, useUpdateOrder } from '../../data/hooks/useOrders';
import { Badge } from '../../shared/ui/Badge';
import { format } from 'date-fns';
import { Order, OrderStatus } from '../../domain/models';
import { Clock, AlertCircle, Edit2, XCircle } from 'lucide-react';
import { Input } from '../../shared/ui/Input';
import { Button } from '../../shared/ui/Button';
import { Card, CardContent, CardHeader, CardTitle } from '../../shared/ui/Card';

const COLUMNS: { id: OrderStatus; title: string }[] = [
  { id: 'RECEIVED', title: 'مستلم' },
  { id: 'IN_PROGRESS', title: 'قيد العمل' },
  { id: 'READY', title: 'جاهز للتسليم' },
];

export function KanbanScreen() {
  const { data: orders = [], isLoading } = useActiveOrdersRealtime();
  const updateStatus = useUpdateOrderStatus();
  const updateOrder = useUpdateOrder();
  
  const [editingOrder, setEditingOrder] = useState<Order | null>(null);

  if (isLoading) return <div className="p-8">جاري تحميل لوحة الإنتاج...</div>;

  const handleMove = (orderId: string, currentStatus: OrderStatus) => {
    const currentIndex = COLUMNS.findIndex(c => c.id === currentStatus);
    const order = orders.find(o => o.id === orderId);
    
    if (currentIndex < COLUMNS.length - 1) {
      updateStatus.mutate({ orderId, status: COLUMNS[currentIndex + 1].id });
    } else if (currentStatus === 'READY' && order) {
      updateOrder.mutate({ 
        orderId, 
        updates: { 
          status: 'DELIVERED',
          totals: {
            ...order.totals,
            paid: order.totals.total,
            balance: 0
          }
        } 
      });
    }
  };

  const handleMoveBack = (orderId: string, currentStatus: OrderStatus) => {
    const currentIndex = COLUMNS.findIndex(c => c.id === currentStatus);
    if (currentIndex > 0) {
      updateStatus.mutate({ orderId, status: COLUMNS[currentIndex - 1].id });
    }
  };

  const handleCancel = (orderId: string) => {
    if (window.confirm('هل أنت متأكد من إلغاء هذا الطلب؟')) {
      updateStatus.mutate({ orderId, status: 'CANCELLED' });
    }
  };

  const handleSaveEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingOrder) return;
    
    updateOrder.mutate({
      orderId: editingOrder.id,
      updates: {
        customerName: editingOrder.customerName,
        customerPhone: editingOrder.customerPhone,
        priority: editingOrder.priority,
      }
    });
    setEditingOrder(null);
  };

  // Only count orders that are in the kanban columns
  const kanbanOrdersCount = orders.filter(o => COLUMNS.some(c => c.id === o.status)).length;

  return (
    <div className="p-4 md:p-8 h-full flex flex-col relative">
      <div className="mb-6 flex flex-col sm:flex-row sm:justify-between sm:items-end gap-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">لوحة الإنتاج (كانبان)</h2>
          <p className="text-slate-500">عرض حي لعمليات الكي الذكي.</p>
        </div>
        <div className="flex gap-2">
          <Badge variant="outline" className="bg-white">إجمالي الطلبات النشطة: {kanbanOrdersCount}</Badge>
        </div>
      </div>

      <div className="flex-1 flex gap-4 md:gap-6 overflow-x-auto pb-4 snap-x">
        {COLUMNS.map(column => {
          const columnOrders = orders.filter(o => o.status === column.id);
          
          return (
            <div key={column.id} className="flex-shrink-0 w-[85vw] sm:w-80 flex flex-col bg-slate-100 rounded-xl p-4 snap-center">
              <div className="flex justify-between items-center mb-4 px-1">
                <h3 className="font-semibold text-slate-700 text-sm uppercase tracking-wider">{column.title}</h3>
                <Badge variant="secondary">{columnOrders.length}</Badge>
              </div>
              
              <div className="flex-1 overflow-y-auto space-y-3 pl-1">
                {columnOrders.map(order => (
                  <OrderCard 
                    key={order.id} 
                    order={order} 
                    onMove={() => handleMove(order.id, order.status)}
                    onMoveBack={column.id !== 'RECEIVED' ? () => handleMoveBack(order.id, order.status) : undefined}
                    onCancel={column.id === 'RECEIVED' ? () => handleCancel(order.id) : undefined}
                    onEdit={column.id === 'RECEIVED' ? () => setEditingOrder(order) : undefined}
                    isMoving={updateStatus.isPending && updateStatus.variables?.orderId === order.id}
                  />
                ))}
                {columnOrders.length === 0 && (
                  <div className="h-24 border-2 border-dashed border-slate-200 rounded-lg flex items-center justify-center text-slate-400 text-sm">
                    فارغ
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Edit Modal */}
      {editingOrder && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <Card className="w-full max-w-md">
            <CardHeader>
              <CardTitle>تعديل الطلب {editingOrder.orderNo}</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSaveEdit} className="space-y-4">
                <div>
                  <label className="text-xs font-medium text-slate-500 mb-1 block">اسم العميل</label>
                  <Input 
                    value={editingOrder.customerName}
                    onChange={e => setEditingOrder({...editingOrder, customerName: e.target.value})}
                  />
                </div>
                <div>
                  <label className="text-xs font-medium text-slate-500 mb-1 block">رقم الهاتف</label>
                  <Input 
                    value={editingOrder.customerPhone}
                    onChange={e => setEditingOrder({...editingOrder, customerPhone: e.target.value})}
                    dir="ltr"
                    className="text-right"
                  />
                </div>
                <div>
                  <label className="text-xs font-medium text-slate-500 mb-1 block">الأولوية</label>
                  <select 
                    className="w-full flex h-10 rounded-md border border-slate-200 bg-white px-3 py-2 text-sm ring-offset-white file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-slate-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-950 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                    value={editingOrder.priority}
                    onChange={e => setEditingOrder({...editingOrder, priority: e.target.value as 'NORMAL' | 'URGENT'})}
                  >
                    <option value="NORMAL">عادي</option>
                    <option value="URGENT">عاجل</option>
                  </select>
                </div>
                <div className="flex gap-3 pt-4">
                  <Button type="button" variant="outline" className="flex-1" onClick={() => setEditingOrder(null)}>
                    إلغاء
                  </Button>
                  <Button type="submit" className="flex-1" disabled={updateOrder.isPending}>
                    {updateOrder.isPending ? 'جاري الحفظ...' : 'حفظ التعديلات'}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}

const OrderCard: React.FC<{ 
  order: Order, 
  onMove: () => void, 
  onMoveBack?: () => void, 
  onCancel?: () => void,
  onEdit?: () => void,
  isMoving: boolean 
}> = ({ order, onMove, onMoveBack, onCancel, onEdit, isMoving }) => {
  const isUrgent = order.priority === 'URGENT';
  const isOverdue = new Date(order.dueAt) < new Date();

  return (
    <div className={`bg-white p-4 rounded-lg border shadow-sm transition-all ${isMoving ? 'opacity-50 scale-95' : 'hover:shadow-md'} ${isUrgent ? 'border-amber-300' : 'border-slate-200'}`}>
      <div className="flex justify-between items-start mb-2">
        <span className="font-mono text-xs font-bold text-slate-900">{order.orderNo}</span>
        <div className="flex gap-1">
          {isUrgent && <Badge variant="warning" className="text-[10px] px-1.5 py-0">عاجل</Badge>}
          {onEdit && (
            <button onClick={onEdit} className="text-slate-400 hover:text-blue-600 transition-colors" title="تعديل">
              <Edit2 size={14} />
            </button>
          )}
          {onCancel && (
            <button onClick={onCancel} className="text-slate-400 hover:text-red-600 transition-colors" title="إلغاء الطلب">
              <XCircle size={14} />
            </button>
          )}
        </div>
      </div>
      
      <p className="text-sm font-medium text-slate-700 mb-1">{order.customerName}</p>
      <p className="text-xs text-slate-500 mb-3">{order.itemCount} قطع</p>
      
      <div className="flex items-center gap-1.5 text-xs text-slate-500 mb-4">
        {isOverdue ? <AlertCircle size={14} className="text-red-500" /> : <Clock size={14} />}
        <span className={isOverdue ? "text-red-600 font-medium" : ""} dir="ltr">
          التسليم: {format(new Date(order.dueAt), 'MMM d, h:mm a')}
        </span>
      </div>

      <div className="flex gap-2">
        {onMoveBack && (
          <button 
            onClick={onMoveBack}
            disabled={isMoving}
            className="flex-1 py-1.5 bg-white hover:bg-slate-50 border border-slate-200 rounded text-xs font-medium text-slate-500 transition-colors"
          >
            السابق
          </button>
        )}
        <button 
          onClick={onMove}
          disabled={isMoving}
          className="flex-[2] py-1.5 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded text-xs font-medium text-slate-700 transition-colors"
        >
          {order.status === 'READY' ? 'تسليم للعميل' : 'التالي'}
        </button>
      </div>
    </div>
  );
}
