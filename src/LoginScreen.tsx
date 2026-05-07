import React, { useState } from 'react';
import { useAuth } from './AuthProvider';
import { Button } from './shared/ui/Button';
import { Input } from './shared/ui/Input';
import { Shirt, ArrowLeft } from 'lucide-react';

export function LoginScreen({ onBack }: { onBack?: () => void }) {
  const { signIn, signInWithEmail, signUpWithEmail, loading } = useAuth();
  const [isLoginMode, setIsLoginMode] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    if (!email || !password) {
      setError('يرجى تعبئة جميع الحقول المطلوبة');
      return;
    }

    if (!isLoginMode && !name) {
      setError('يرجى إدخال الاسم');
      return;
    }

    setIsSubmitting(true);
    try {
      if (isLoginMode) {
        await signInWithEmail(email, password);
      } else {
        await signUpWithEmail(email, password, name);
      }
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
          {isLoginMode ? 'تسجيل الدخول للوصول إلى لوحة التحكم' : 'إنشاء حساب جديد في النظام'}
        </p>
        
        {error && (
          <div className="bg-red-50 text-red-600 p-3 rounded-xl text-sm mb-6 border border-red-100">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4 mb-6 text-right">
          {!isLoginMode && (
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">الاسم</label>
              <Input 
                type="text" 
                placeholder="أدخل اسمك الكامل" 
                value={name} 
                onChange={(e) => setName(e.target.value)}
                disabled={isSubmitting}
              />
            </div>
          )}
          
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
            className="w-full py-6 text-lg font-medium mt-2"
            disabled={isSubmitting}
          >
            {isSubmitting ? 'جاري المعالجة...' : (isLoginMode ? 'تسجيل الدخول' : 'إنشاء حساب')}
          </Button>
        </form>

        <div className="flex items-center gap-4 mb-6">
          <div className="h-px bg-slate-200 flex-1"></div>
          <span className="text-sm text-slate-400 font-medium">أو</span>
          <div className="h-px bg-slate-200 flex-1"></div>
        </div>

        <Button 
          type="button"
          onClick={signIn} 
          variant="outline"
          className="w-full py-6 text-lg font-medium flex items-center justify-center gap-3 mb-6"
          disabled={isSubmitting}
        >
          <svg className="w-5 h-5" viewBox="0 0 24 24">
            <path
              fill="currentColor"
              d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
            />
            <path
              fill="currentColor"
              d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
            />
            <path
              fill="currentColor"
              d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
            />
            <path
              fill="currentColor"
              d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
            />
          </svg>
          المتابعة باستخدام جوجل
        </Button>

        <p className="text-sm text-slate-500">
          {isLoginMode ? 'ليس لديك حساب؟ ' : 'لديك حساب بالفعل؟ '}
          <button 
            type="button"
            onClick={() => {
              setIsLoginMode(!isLoginMode);
              setError('');
            }}
            className="text-indigo-600 font-medium hover:underline"
          >
            {isLoginMode ? 'إنشاء حساب جديد' : 'تسجيل الدخول'}
          </button>
        </p>
      </div>
    </div>
  );
}
