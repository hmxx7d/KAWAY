import React from 'react';
import { Shirt, LayoutDashboard, QrCode, MonitorSmartphone, CheckCircle, Smartphone, Zap, Shield, BarChart3, Users, Star, ArrowLeft } from 'lucide-react';
import { Button } from '../../shared/ui/Button';

export function LandingPage({ onLogin }: { onLogin: () => void }) {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans" dir="rtl">
      {/* 1. Navbar */}
      <nav className="fixed top-0 inset-x-0 z-50 bg-white/80 backdrop-blur-md border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            {/* Logo */}
            <div className="flex items-center gap-3">
              <div className="bg-slate-900 text-white p-2.5 rounded-xl shadow-sm">
                <Shirt size={24} className="text-blue-400" />
              </div>
              <span className="font-bold text-2xl tracking-tight text-slate-900">نظام الكي الذكي</span>
            </div>
            
            {/* Desktop Links */}
            <div className="hidden md:flex items-center gap-8 font-medium text-slate-600">
              <a href="#features" className="hover:text-blue-600 transition-colors">المميزات</a>
              <a href="#how-it-works" className="hover:text-blue-600 transition-colors">آلية العمل</a>
              <a href="#pricing" className="hover:text-blue-600 transition-colors">الباقات</a>
              <a href="#contact" className="hover:text-blue-600 transition-colors">تواصل معنا</a>
            </div>

            {/* CTA */}
            <div className="flex items-center gap-4">
              <Button onClick={onLogin} className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-full font-semibold shadow-md hover:shadow-lg transition-all">
                تسجيل الدخول / جرب مجاناً
              </Button>
            </div>
          </div>
        </div>
      </nav>

      {/* 2. Hero Section */}
      <section className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-blue-50 to-slate-50 -z-10" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="text-center max-w-4xl mx-auto">
            <h1 className="text-5xl lg:text-7xl font-extrabold text-slate-900 leading-tight mb-8">
              حوّل مغسلتك إلى منشأة ذكية <span className="text-blue-600">بضغطة زر</span>
            </h1>
            <p className="text-xl text-slate-600 mb-12 leading-relaxed max-w-3xl mx-auto">
              منصة سحابية متكاملة لربط الكاشير بخط الإنتاج، تتيح لك السيطرة الكاملة على سير العمل، العملاء، والأرباح في مكان واحد.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Button onClick={onLogin} size="lg" className="bg-blue-600 hover:bg-blue-700 text-white rounded-full px-8 h-14 text-lg font-bold shadow-xl shadow-blue-600/20">
                ابدأ تجربتك المجانية
                <ArrowLeft className="mr-2" size={20} />
              </Button>
              <a href="https://wa.me/96899100882" target="_blank" rel="noopener noreferrer" className="inline-flex items-center justify-center h-14 px-8 rounded-full border-2 border-slate-200 text-slate-700 font-bold text-lg hover:border-slate-300 hover:bg-slate-100 transition-colors bg-white">
                تواصل مع المطور
              </a>
            </div>
          </div>
          
          {/* Mockup Placeholder */}
          <div className="mt-20 relative mx-auto max-w-5xl">
            <div className="rounded-2xl border border-slate-200/50 bg-white/50 p-2 shadow-2xl backdrop-blur-sm">
              <div className="rounded-xl overflow-hidden border border-slate-200 bg-slate-50 aspect-video relative flex shadow-inner text-right" dir="rtl">
                
                {/* Mockup Sidebar */}
                <div className="hidden sm:flex w-1/4 max-w-[240px] bg-white border-l border-slate-200 p-4 flex-col gap-6 relative z-10">
                  <div className="flex items-center gap-3 mb-2 px-2">
                    <div className="bg-slate-900 text-white p-1.5 rounded-lg">
                      <Shirt size={16} />
                    </div>
                    <div className="h-4 bg-slate-800 rounded w-20"></div>
                  </div>
                  
                  <div className="flex flex-col gap-2">
                    <div className="flex items-center gap-3 px-3 py-2 rounded-md bg-blue-50 border border-blue-100">
                      <LayoutDashboard size={16} className="text-blue-600" />
                      <div className="h-3 bg-blue-600 rounded w-16"></div>
                    </div>
                    <div className="flex items-center gap-3 px-3 py-2 rounded-md">
                      <div className="w-4 h-4 bg-slate-200 rounded-full"></div>
                      <div className="h-3 bg-slate-200 rounded w-20"></div>
                    </div>
                    <div className="flex items-center gap-3 px-3 py-2 rounded-md">
                      <div className="w-4 h-4 bg-slate-200 rounded-full"></div>
                      <div className="h-3 bg-slate-200 rounded w-16"></div>
                    </div>
                    <div className="flex items-center gap-3 px-3 py-2 rounded-md">
                      <div className="w-4 h-4 bg-slate-200 rounded-full"></div>
                      <div className="h-3 bg-slate-200 rounded w-24"></div>
                    </div>
                  </div>
                </div>

                {/* Mockup Main Content */}
                <div className="flex-1 p-4 sm:p-6 flex flex-col gap-4 sm:gap-6 relative z-10 overflow-hidden">
                  
                  {/* Top Bar */}
                  <div className="flex justify-between items-center bg-white p-3 rounded-xl border border-slate-200 shadow-sm">
                    <div className="h-4 sm:h-5 bg-slate-200 rounded w-24 sm:w-32"></div>
                    <div className="flex gap-2">
                      <div className="h-8 w-20 sm:w-24 bg-blue-100 rounded-lg"></div>
                      <div className="h-8 w-8 bg-slate-100 rounded-full"></div>
                    </div>
                  </div>

                  {/* Stats Cards */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
                    {[...Array(4)].map((_, i) => (
                      <div key={i} className="bg-white p-3 sm:p-4 rounded-xl border border-slate-200 shadow-sm">
                        <div className="flex justify-between items-start mb-3">
                          <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center">
                            <div className="w-4 h-4 bg-slate-300 rounded-full"></div>
                          </div>
                          <div className="h-4 bg-emerald-100 rounded w-10"></div>
                        </div>
                        <div className="h-5 sm:h-6 bg-slate-800 rounded w-12 sm:w-16 mb-2"></div>
                        <div className="h-2 sm:h-3 bg-slate-200 rounded w-16 sm:w-20"></div>
                      </div>
                    ))}
                  </div>

                  {/* Active Orders Table area */}
                  <div className="bg-white rounded-xl border border-slate-200 shadow-sm flex-1 p-4 sm:p-5 flex flex-col">
                    <div className="flex justify-between items-center mb-4 sm:mb-6">
                      <div className="h-4 bg-slate-800 rounded w-24 sm:w-32"></div>
                      <div className="h-3 bg-slate-200 rounded w-16"></div>
                    </div>
                    
                    <div className="flex flex-col gap-3">
                      {[...Array(3)].map((_, i) => (
                        <div key={i} className="flex justify-between items-center p-3 border border-slate-100 rounded-lg hover:bg-slate-50">
                          <div className="flex gap-3 sm:gap-4 items-center">
                            <div className="w-10 h-10 bg-slate-100 rounded-lg hidden sm:block"></div>
                            <div className="flex flex-col gap-2">
                              <div className="h-3 sm:h-4 bg-slate-800 rounded w-24 sm:w-32"></div>
                              <div className="flex gap-2">
                                <div className="h-2 bg-slate-200 rounded w-12"></div>
                                <div className="h-2 bg-slate-200 rounded w-16"></div>
                              </div>
                            </div>
                          </div>
                          <div className="flex flex-col items-end gap-2">
                            <div className="h-5 w-16 sm:w-20 bg-emerald-100 rounded-full"></div>
                            <div className="h-2 bg-slate-200 rounded w-10"></div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  {/* Subtle Gradient Overlay to make it feel like a mockup */}
                  <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-slate-50 to-transparent pointer-events-none z-20"></div>
                </div>

              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. Features Section */}
      <section id="features" className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-slate-900 sm:text-4xl">لماذا تختار نظام الكي الذكي؟</h2>
            <p className="mt-4 text-lg text-slate-600">مميزات صُممت خصيصاً لتسهيل إدارة مغسلتك ومضاعفة إنتاجيتك.</p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="bg-slate-50 rounded-2xl p-8 border border-slate-100 hover:shadow-lg transition-shadow">
              <div className="w-14 h-14 bg-blue-100 rounded-xl flex items-center justify-center mb-6 text-blue-600">
                <QrCode size={28} />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-3">نقطة بيع ذكية (POS)</h3>
              <p className="text-slate-600 leading-relaxed">استلام الطلبات في ثوانٍ والتعرف التلقائي على العملاء بواسطة رقم الهاتف.</p>
            </div>
            
            <div className="bg-slate-50 rounded-2xl p-8 border border-slate-100 hover:shadow-lg transition-shadow">
              <div className="w-14 h-14 bg-emerald-100 rounded-xl flex items-center justify-center mb-6 text-emerald-600">
                <LayoutDashboard size={28} />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-3">لوحة إنتاج بصرية (Kanban)</h3>
              <p className="text-slate-600 leading-relaxed">تتبع حالة الملابس مباشرة (مستلم، قيد العمل، جاهز، مسلم) بسهولة ووضوح.</p>
            </div>
            
            <div className="bg-slate-50 rounded-2xl p-8 border border-slate-100 hover:shadow-lg transition-shadow">
              <div className="w-14 h-14 bg-indigo-100 rounded-xl flex items-center justify-center mb-6 text-indigo-600">
                <CheckCircle size={28} />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-3">مراقبة الجودة (QC)</h3>
              <p className="text-slate-600 leading-relaxed">نظام تدقيق متكامل لضمان تسليم الملابس بأعلى جودة وبدون أخطاء للعملاء.</p>
            </div>
            
            <div className="bg-slate-50 rounded-2xl p-8 border border-slate-100 hover:shadow-lg transition-shadow">
              <div className="w-14 h-14 bg-amber-100 rounded-xl flex items-center justify-center mb-6 text-amber-600">
                <BarChart3 size={28} />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-3">تقارير إدارية</h3>
              <p className="text-slate-600 leading-relaxed">إحصائيات مالية دقيقة ورسوم بيانية لنمو أرباحك وتتبع أداء الفروع والموظفين.</p>
            </div>
          </div>
        </div>
      </section>

      {/* 4. How it works */}
      <section id="how-it-works" className="py-24 bg-slate-900 text-white overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="text-center mb-16 relative z-10">
            <h2 className="text-3xl font-bold sm:text-4xl text-white">آلية عمل بسيطة وفعالة</h2>
            <p className="mt-4 text-lg text-slate-400">نظام يعمل بتناغم تام من لحظة استلام القطعة حتى تسليمها.</p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-12 relative z-10 text-center">
            {/* Step 1 */}
            <div className="relative">
              <div className="w-20 h-20 mx-auto bg-slate-800 rounded-2xl flex items-center justify-center mb-6 border border-slate-700 shadow-xl relative z-10">
                <span className="absolute -top-3 -right-3 w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white font-bold text-sm border-4 border-slate-900">1</span>
                <MonitorSmartphone size={32} className="text-blue-400" />
              </div>
              <h3 className="text-xl font-bold mb-3 text-white">استلم الطلب</h3>
              <p className="text-slate-400">سجل بيانات الاستلام بسرعة باستخدام الكاشير الذكي الخاص بنا.</p>
              
              <div className="hidden md:block absolute top-10 right-[50%] w-full h-[2px] bg-gradient-to-l from-slate-700 to-transparent -z-10" />
            </div>
            
            {/* Step 2 */}
            <div className="relative">
              <div className="w-20 h-20 mx-auto bg-slate-800 rounded-2xl flex items-center justify-center mb-6 border border-slate-700 shadow-xl relative z-10">
                <span className="absolute -top-3 -right-3 w-8 h-8 bg-emerald-500 rounded-full flex items-center justify-center text-white font-bold text-sm border-4 border-slate-900">2</span>
                <Zap size={32} className="text-emerald-400" />
              </div>
              <h3 className="text-xl font-bold mb-3 text-white">تابع الإنتاج</h3>
              <p className="text-slate-400">تتبع مسار الملابس وتأكد من الجودة عبر شاشات الإنتاج والكانبان.</p>
              
              <div className="hidden md:block absolute top-10 right-[50%] w-full h-[2px] bg-gradient-to-l from-slate-700 to-transparent -z-10" />
            </div>
            
            {/* Step 3 */}
            <div className="relative">
              <div className="w-20 h-20 mx-auto bg-slate-800 rounded-2xl flex items-center justify-center mb-6 border border-slate-700 shadow-xl relative z-10">
                <span className="absolute -top-3 -right-3 w-8 h-8 bg-amber-500 rounded-full flex items-center justify-center text-white font-bold text-sm border-4 border-slate-900">3</span>
                <Users size={32} className="text-amber-400" />
              </div>
              <h3 className="text-xl font-bold mb-3 text-white">سلّم واربح</h3>
              <p className="text-slate-400">إشعار العميل باستلام ملابسه وجمع البيانات لتحليلات الأرباح.</p>
            </div>
          </div>
        </div>
      </section>

      {/* 5. Pricing Section */}
      <section id="pricing" className="py-24 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-slate-900 sm:text-4xl">باقات تناسب حجم عملك</h2>
            <p className="mt-4 text-lg text-slate-600">اختر الباقة المناسبة للبدء في تحويل مسار مغسلتك رقمياً.</p>
          </div>
          
          <div className="grid lg:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {/* Single Branch Package */}
            <div className="bg-white rounded-3xl p-8 border border-slate-200 shadow-sm relative flex flex-col hover:border-blue-200 hover:shadow-md transition-all">
              <h3 className="text-2xl font-bold text-slate-900 mb-2">فرع واحد</h3>
              <p className="text-slate-500 mb-6">للمحلات الفردية والناشئة.</p>
              <div className="mb-8">
                <span className="text-4xl font-extrabold text-slate-900">8</span>
                <span className="text-slate-500"> ر.ع / شهرياً</span>
              </div>
              <ul className="space-y-4 mb-8 flex-1">
                <li className="flex items-center gap-3 text-slate-700"><CheckCircle className="text-emerald-500 shrink-0" size={20} /> نقطة بيع ذكية (POS)</li>
                <li className="flex items-center gap-3 text-slate-700"><CheckCircle className="text-emerald-500 shrink-0" size={20} /> لوحة الإنتاج (Kanban)</li>
                <li className="flex items-center gap-3 text-slate-700"><CheckCircle className="text-emerald-500 shrink-0" size={20} /> نظام مراقبة الجودة (QC)</li>
                <li className="flex items-center gap-3 text-slate-700"><CheckCircle className="text-emerald-500 shrink-0" size={20} /> نظام ولاء العملاء</li>
                <li className="flex items-center gap-3 text-slate-700"><CheckCircle className="text-emerald-500 shrink-0" size={20} /> تقارير إدارية ومالية شاملة</li>
              </ul>
              <Button onClick={onLogin} variant="outline" className="w-full text-lg h-12 rounded-xl">ابدأ تجربتك المجانية</Button>
            </div>
            
            {/* Multi Branch Package (Highlighted) */}
            <div className="bg-slate-900 rounded-3xl p-8 shadow-2xl relative flex flex-col transform lg:-translate-y-4 lg:scale-105 border border-slate-800">
              <div className="absolute top-0 inset-x-0 -translate-y-1/2 flex justify-center">
                <span className="bg-emerald-500 text-white text-sm font-bold tracking-widest uppercase px-4 py-1 rounded-full shadow-lg">القيمة الأفضل</span>
              </div>
              <h3 className="text-2xl font-bold text-white mb-2">أكثر من ٣ محلات</h3>
              <p className="text-slate-400 mb-6">للسلاسل والعمليات الكبيرة.</p>
              <div className="mb-8 flex flex-col">
                <div>
                  <span className="text-4xl font-extrabold text-white">18</span>
                  <span className="text-slate-400"> ر.ع / شهرياً</span>
                </div>
                <span className="text-emerald-400 text-sm mt-1 font-medium">لكافة المحلات (سعر ثابت)</span>
              </div>
              <ul className="space-y-4 mb-8 flex-1">
                <li className="flex items-center gap-3 text-white font-medium"><CheckCircle className="text-emerald-400 shrink-0" size={20} /> جميع مميزات منصة الكي الذكي</li>
                <li className="flex items-center gap-3 text-white font-medium"><CheckCircle className="text-emerald-400 shrink-0" size={20} /> إدارة الفروع المتعددة بحساب واحد</li>
                <li className="flex items-center gap-3 text-slate-200"><CheckCircle className="text-emerald-400 shrink-0" size={20} /> تقارير مجمعة لكل الفروع</li>
                <li className="flex items-center gap-3 text-slate-200"><CheckCircle className="text-emerald-400 shrink-0" size={20} /> نقل الموظفين بين الفروع</li>
                <li className="flex items-center gap-3 text-slate-200"><CheckCircle className="text-emerald-400 shrink-0" size={20} /> دعم فني مخصص</li>
              </ul>
              <Button onClick={onLogin} className="w-full text-lg h-12 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white shadow-xl shadow-emerald-500/20 border-0">اشترك الآن</Button>
            </div>
          </div>
        </div>
      </section>

      {/* 6. Footer & Contact */}
      <footer id="contact" className="bg-slate-900 pt-20 pb-10 border-t border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-2xl md:text-3xl font-bold text-white mb-4">صُنع بشغف لخدمة رواد الأعمال</h2>
            <p className="text-slate-400 max-w-2xl mx-auto">نحن هنا لمساعدتك في بناء مغسلة عصرية تواكب التطور وترفع من جودة خدماتك لعملائك.</p>
          </div>
          
          <div className="bg-slate-800/50 rounded-3xl p-8 md:p-12 border border-slate-700/50 max-w-3xl mx-auto text-center backdrop-blur-sm">
            <div className="w-20 h-20 bg-emerald-500/10 rounded-full flex items-center justify-center mx-auto mb-6">
              <Shirt size={40} className="text-emerald-400" />
            </div>
            
            <h3 className="text-2xl font-bold text-white mb-2">المطور: حمود الكعبي</h3>
            <div className="text-slate-300 font-mono text-xl mb-8" dir="ltr">+968 9910 0882</div>
            
            <a 
              href="https://wa.me/96899100882?text=مرحباً،%20أريد%20الاستفسار%20عن%20نظام%20الكي%20الذكي" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="inline-flex items-center justify-center gap-3 bg-emerald-500 hover:bg-emerald-600 text-white px-8 py-4 rounded-xl text-lg font-bold shadow-lg shadow-emerald-500/20 transition-all hover:scale-105 w-full sm:w-auto"
            >
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.888-.788-1.487-1.761-1.663-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51a12.8 12.8 0 0 0-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.015-1.04 2.476 0 1.46 1.064 2.871 1.212 3.07.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413z" />
              </svg>
              تواصل معي على الواتساب للاستفسار أو طلب عرض أسعار
            </a>
          </div>
          
          <div className="mt-16 pt-8 border-t border-slate-800 text-center text-slate-500 text-sm flex flex-col md:flex-row justify-between items-center gap-4">
            <p>جميع الحقوق محفوظة &copy; {new Date().getFullYear()} نظام الكي الذكي</p>
            <div className="flex gap-4">
              <a href="#" className="hover:text-white transition-colors">سياسة الخصوصية</a>
              <a href="#" className="hover:text-white transition-colors">الشروط والأحكام</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
