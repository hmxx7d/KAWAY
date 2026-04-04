import React, { useState } from 'react';
import { useServices, useCreateService, useUpdateService } from '../../data/hooks/useServices';
import { Card, CardContent, CardHeader, CardTitle } from '../../shared/ui/Card';
import { Button } from '../../shared/ui/Button';
import { Input } from '../../shared/ui/Input';
import { formatCurrency } from '../../shared/utils';
import { Edit2, Plus } from 'lucide-react';
import { Service } from '../../domain/models';

export function ServicesScreen() {
  const { data: services = [], isLoading } = useServices();
  const createService = useCreateService();
  const updateService = useUpdateService();

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingService, setEditingService] = useState<Service | null>(null);
  
  const [formData, setFormData] = useState({ name: '', price: '' });

  const handleOpenAdd = () => {
    setFormData({ name: '', price: '' });
    setIsAddModalOpen(true);
  };

  const handleOpenEdit = (service: Service) => {
    setFormData({ name: service.name, price: service.price.toString() });
    setEditingService(service);
  };

  const handleCloseModal = () => {
    setIsAddModalOpen(false);
    setEditingService(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const price = parseFloat(formData.price);
    
    if (!formData.name || isNaN(price)) {
      alert('الرجاء إدخال اسم الخدمة والسعر بشكل صحيح');
      return;
    }

    try {
      if (editingService) {
        await updateService.mutateAsync({
          serviceId: editingService.id,
          updates: { name: formData.name, price }
        });
      } else {
        await createService.mutateAsync({
          name: formData.name,
          price
        });
      }
      handleCloseModal();
    } catch (error: any) {
      console.error('Error saving service:', error);
      alert('حدث خطأ أثناء حفظ الخدمة. يرجى التأكد من الصلاحيات والمحاولة مرة أخرى.');
    }
  };

  if (isLoading) return <div className="p-4 md:p-8">جاري تحميل الخدمات...</div>;

  return (
    <div className="p-4 md:p-8 h-full flex flex-col">
      <div className="mb-6 flex flex-col sm:flex-row sm:justify-between sm:items-end gap-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">إدارة الخدمات</h2>
          <p className="text-slate-500">إضافة وتعديل خدمات الكي الذكي وأسعارها.</p>
        </div>
        <Button onClick={handleOpenAdd} className="flex items-center justify-center gap-2 w-full sm:w-auto">
          <Plus size={16} />
          إضافة خدمة جديدة
        </Button>
      </div>

      <Card className="flex-1 overflow-hidden flex flex-col">
        <CardContent className="p-0 overflow-auto flex-1">
          <table className="w-full text-sm text-right min-w-[500px]">
            <thead className="bg-slate-50 text-slate-500 sticky top-0 border-b border-slate-100">
              <tr>
                <th className="px-6 py-3 font-medium">اسم الخدمة</th>
                <th className="px-6 py-3 font-medium">السعر</th>
                <th className="px-6 py-3 font-medium w-24">إجراءات</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {services.map(service => (
                <tr key={service.id} className="hover:bg-slate-50/50 transition-colors">
                  <td className="px-6 py-4 font-medium text-slate-900">{service.name}</td>
                  <td className="px-6 py-4 font-mono text-slate-900" dir="ltr">
                    {formatCurrency(service.price)}
                  </td>
                  <td className="px-6 py-4">
                    <button 
                      onClick={() => handleOpenEdit(service)}
                      className="text-slate-400 hover:text-blue-600 transition-colors p-2 rounded-md hover:bg-blue-50"
                      title="تعديل الخدمة"
                    >
                      <Edit2 size={16} />
                    </button>
                  </td>
                </tr>
              ))}
              {services.length === 0 && (
                <tr>
                  <td colSpan={3} className="px-6 py-8 text-center text-slate-500">
                    لا توجد خدمات مضافة حالياً.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </CardContent>
      </Card>

      {/* Add/Edit Modal */}
      {(isAddModalOpen || editingService) && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <Card className="w-full max-w-md">
            <CardHeader>
              <CardTitle>{editingService ? 'تعديل الخدمة' : 'إضافة خدمة جديدة'}</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="text-xs font-medium text-slate-500 mb-1 block">اسم الخدمة</label>
                  <Input 
                    value={formData.name}
                    onChange={e => setFormData({...formData, name: e.target.value})}
                    placeholder="مثال: غسيل وكي قميص"
                    required
                  />
                </div>
                <div>
                  <label className="text-xs font-medium text-slate-500 mb-1 block">السعر (ر.ع.)</label>
                  <Input 
                    type="number"
                    step="0.100"
                    min="0"
                    value={formData.price}
                    onChange={e => setFormData({...formData, price: e.target.value})}
                    placeholder="مثال: 1.500"
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
                    disabled={createService.isPending || updateService.isPending}
                  >
                    {createService.isPending || updateService.isPending ? 'جاري الحفظ...' : 'حفظ'}
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
