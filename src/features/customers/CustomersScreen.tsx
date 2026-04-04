import React, { useState } from 'react';
import { useCustomers, useCreateCustomer, useUpdateCustomer } from '../../data/hooks/useCustomers';
import { Card, CardContent, CardHeader, CardTitle } from '../../shared/ui/Card';
import { Button } from '../../shared/ui/Button';
import { Input } from '../../shared/ui/Input';
import { Edit2, Plus, Users } from 'lucide-react';
import { Customer } from '../../domain/models';

export function CustomersScreen() {
  const { data: customers = [], isLoading } = useCustomers();
  const createCustomer = useCreateCustomer();
  const updateCustomer = useUpdateCustomer();

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingCustomer, setEditingCustomer] = useState<Customer | null>(null);
  
  const [formData, setFormData] = useState({ name: '', phone: '' });

  const handleOpenAdd = () => {
    setFormData({ name: '', phone: '' });
    setIsAddModalOpen(true);
  };

  const handleOpenEdit = (customer: Customer) => {
    setFormData({ name: customer.name, phone: customer.phone });
    setEditingCustomer(customer);
  };

  const handleCloseModal = () => {
    setIsAddModalOpen(false);
    setEditingCustomer(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name || !formData.phone) {
      alert('الرجاء إدخال اسم العميل ورقم الهاتف');
      return;
    }

    try {
      if (editingCustomer) {
        await updateCustomer.mutateAsync({
          customerId: editingCustomer.id,
          updates: { name: formData.name, phone: formData.phone }
        });
      } else {
        await createCustomer.mutateAsync({
          name: formData.name,
          phone: formData.phone
        });
      }
      handleCloseModal();
    } catch (error: any) {
      console.error('Error saving customer:', error);
      alert('حدث خطأ أثناء حفظ بيانات العميل. يرجى التأكد من الصلاحيات والمحاولة مرة أخرى.');
    }
  };

  if (isLoading) return <div className="p-4 md:p-8">جاري تحميل العملاء...</div>;

  return (
    <div className="p-4 md:p-8 h-full flex flex-col">
      <div className="mb-6 flex flex-col sm:flex-row sm:justify-between sm:items-end gap-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">إدارة العملاء</h2>
          <p className="text-slate-500">عرض وإدارة بيانات عملاء الكي الذكي.</p>
        </div>
        <Button onClick={handleOpenAdd} className="flex items-center justify-center gap-2 w-full sm:w-auto">
          <Plus size={16} />
          إضافة عميل جديد
        </Button>
      </div>

      <Card className="flex-1 overflow-hidden flex flex-col">
        <CardContent className="p-0 overflow-auto flex-1">
          <table className="w-full text-sm text-right min-w-[600px]">
            <thead className="bg-slate-50 text-slate-500 sticky top-0 border-b border-slate-100">
              <tr>
                <th className="px-6 py-3 font-medium">اسم العميل</th>
                <th className="px-6 py-3 font-medium">رقم الهاتف</th>
                <th className="px-6 py-3 font-medium">إجمالي الطلبات</th>
                <th className="px-6 py-3 font-medium">نقاط الولاء</th>
                <th className="px-6 py-3 font-medium w-24">إجراءات</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {customers.map(customer => (
                <tr key={customer.id} className="hover:bg-slate-50/50 transition-colors">
                  <td className="px-6 py-4 font-medium text-slate-900 flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-500">
                      <Users size={14} />
                    </div>
                    {customer.name}
                  </td>
                  <td className="px-6 py-4 font-mono text-slate-600" dir="ltr">
                    {customer.phone}
                  </td>
                  <td className="px-6 py-4 text-slate-600">
                    {customer.totalOrders}
                  </td>
                  <td className="px-6 py-4 text-slate-600">
                    {customer.loyaltyPoints}
                  </td>
                  <td className="px-6 py-4">
                    <button 
                      onClick={() => handleOpenEdit(customer)}
                      className="text-slate-400 hover:text-blue-600 transition-colors p-2 rounded-md hover:bg-blue-50"
                      title="تعديل العميل"
                    >
                      <Edit2 size={16} />
                    </button>
                  </td>
                </tr>
              ))}
              {customers.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-6 py-8 text-center text-slate-500">
                    لا يوجد عملاء حالياً.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </CardContent>
      </Card>

      {/* Add/Edit Modal */}
      {(isAddModalOpen || editingCustomer) && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <Card className="w-full max-w-md">
            <CardHeader>
              <CardTitle>{editingCustomer ? 'تعديل بيانات العميل' : 'إضافة عميل جديد'}</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="text-xs font-medium text-slate-500 mb-1 block">اسم العميل</label>
                  <Input 
                    value={formData.name}
                    onChange={e => setFormData({...formData, name: e.target.value})}
                    placeholder="مثال: أحمد علي"
                    required
                  />
                </div>
                <div>
                  <label className="text-xs font-medium text-slate-500 mb-1 block">رقم الهاتف</label>
                  <Input 
                    value={formData.phone}
                    onChange={e => setFormData({...formData, phone: e.target.value})}
                    placeholder="مثال: +96890000000"
                    dir="ltr"
                    className="text-right"
                    required
                  />
                </div>
                <div className="flex gap-3 pt-4">
                  <Button type="button" variant="outline" className="flex-1" onClick={handleCloseModal}>
                    إلغاء
                  </Button>
                  <Button 
                    type="submit" 
                    className="flex-1" 
                    disabled={createCustomer.isPending || updateCustomer.isPending}
                  >
                    {createCustomer.isPending || updateCustomer.isPending ? 'جاري الحفظ...' : 'حفظ'}
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
