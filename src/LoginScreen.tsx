import React, { useState } from 'react';
import { useAuth } from './AuthProvider';
import { Button } from './shared/ui/Button';
import { Input } from './shared/ui/Input';
import { Shirt, ArrowLeft } from 'lucide-react';

export function LoginScreen({ onBack }: { onBack?: () => void }) {
  const { signInWithEmail, loading } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    if (!email || !password) {
      setError('يرجى تعبئة جميع الحقول المطلوبة');
      return;
    }

    setIsSubmitting(true);
    try {
      await signInWithEmail(email, password);
    } catch (err: any) {
      console.error(err);
      if (err.code === 'auth/invalid-credential' || err.code === 'auth/user-not-found' || err.code === 'auth/wrong-password') {
        setError('البريد الإلكتروني أو كلمة المرور غير صحيحة');
      } else if (err.code === 'auth/email-already-in-use') {
        setError('البريد الإلكتروني مستخدم مسبقاً');
      } else if (err.code === 'auth/weak-password') {
        setError('كلمة المرور ضعيفة، يجب أن تكون 6 أحرف على الأقل');
      } else {
        setError(err.message || 'حدث خطأ أثناء العملية');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="animate-pulse flex flex-col items-center">
          <Shirt size={48} className="text-slate-300 mb-4" />
          <div className="text-slate-500 font-medium">جاري التحميل...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 p-4 relative" dir="rtl">
      {onBack && (
        <button 
          onClick={onBack}
          className="absolute top-6 right-6 flex items-center gap-2 text-slate-500 hover:text-slate-900 transition-colors"
        >
          <ArrowLeft size={20} className="rotate-180" />
          <span className="font-medium">العودة</span>
        </button>
      )}
      <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 text-center border border-slate-100">
        <div className="bg-slate-900 text-white w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg">
          <Shirt size={32} />
        </div>
        <h1 className="text-2xl font-bold text-slate-900 mb-2 tracking-tight">نظام الكي الذكي</h1>
        <p className="text-slate-500 mb-8">
          تسجيل الدخول للوصول إلى لوحة التحكم
        </p>
        
        {error && (
          <div className="bg-red-50 text-red-600 p-3 rounded-xl text-sm mb-6 border border-red-100">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4 mb-6 text-right">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">البريد الإلكتروني</label>
            <Input 
              type="email" 
              placeholder="example@email.com" 
              value={email} 
              onChange={(e) => setEmail(e.target.value)}
              dir="ltr"
              className="text-right"
              disabled={isSubmitting}
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">كلمة المرور</label>
            <Input 
              type="password" 
              placeholder="••••••••" 
              value={password} 
              onChange={(e) => setPassword(e.target.value)}
              dir="ltr"
              className="text-right"
              disabled={isSubmitting}
            />
          </div>

          <Button 
            type="submit" 
            className="w-full py-6 text-lg font-medium mt-4"
            disabled={isSubmitting}
          >
            {isSubmitting ? 'جاري المعالجة...' : 'تسجيل الدخول'}
          </Button>
        </form>
      </div>
    </div>
  );
}
