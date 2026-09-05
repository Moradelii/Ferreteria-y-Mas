import React from 'react';
import { AppProvider, useApp } from './lib/store';
import { Header } from './components/Header';
import { Hero } from './components/Hero';
import { WoodEstimator } from './components/WoodEstimator';
import { ProjectCalculator } from './components/ProjectCalculator';
import { Catalog } from './components/Catalog';
import { ProductDetailModal } from './components/ProductDetailModal';
import { CartDrawer } from './components/CartDrawer';
import { CheckoutModal } from './components/CheckoutModal';
import { OrderSuccessModal } from './components/OrderSuccessModal';
import { QuoteModal } from './components/QuoteModal';
import { ContactSection } from './components/ContactSection';
import { Footer } from './components/Footer';
import { AdminCMS } from './components/AdminCMS';
import { 
  CheckCircle2, 
  AlertCircle, 
  Info, 
  AlertTriangle, 
  Sparkles,
  TreePine,
  Hammer,
  ShieldCheck,
  Award,
  Factory
} from 'lucide-react';

const ToastContainer: React.FC = () => {
  const { toast } = useApp();
  if (!toast) return null;

  const bgStyles = {
    success: 'bg-emerald-800 text-white border-emerald-700',
    error: 'bg-rose-800 text-white border-rose-700',
    warning: 'bg-amber-600 text-white border-amber-500',
    info: 'bg-slate-900 text-white border-slate-700'
  }[toast.type];

  const Icon = {
    success: CheckCircle2,
    error: AlertCircle,
    warning: AlertTriangle,
    info: Info
  }[toast.type];

  return (
    <div className="fixed bottom-5 right-5 z-60 animate-in fade-in slide-in-from-bottom-5 duration-300">
      <div className={`px-4 py-3 rounded-xl border shadow-xl flex items-center gap-2.5 text-xs font-semibold ${bgStyles}`}>
        <Icon className="w-4 h-4 shrink-0" />
        <span>{toast.message}</span>
      </div>
    </div>
  );
};

const AboutSection: React.FC = () => {
  return (
    <section id="nosotros" className="py-16 bg-slate-100 text-slate-900 border-t border-slate-200">
      <div className="max-w-7xl mx-auto px-4 space-y-12">
        <div className="max-w-2xl">
          <div className="inline-flex items-center gap-1.5 text-xs font-bold text-amber-700 bg-amber-100 px-2.5 py-1 rounded-md uppercase tracking-wider mb-2">
            <TreePine className="w-3.5 h-3.5" />
            Nuestra Trayectoria en La Ceiba
          </div>
          <h2 className="text-3xl font-black text-slate-950 tracking-tight">
            Compromiso con la Calidad Forestal y la Construcción Sólida
          </h2>
          <p className="text-sm text-slate-600 mt-2 leading-relaxed">
            Desde nuestras instalaciones en la Carretera CA-13 frente a El Sauce, abastecemos a contratistas residenciales, hoteleros de Cayos Cochinos y artesanos de Atlántida con madera certificada y tratada al alto vacío.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-2xl border border-slate-200 space-y-3 shadow-xs">
            <div className="w-10 h-10 rounded-xl bg-amber-500/15 text-amber-700 flex items-center justify-center">
              <Award className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-slate-900 text-base">Preservación CCA Garantizada</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Cumplimos los estándares internacionales AWPA para maderas expuestas a la intemperie caribeña. Cero comején y resistencia probada ante el sol y la lluvia constante de La Ceiba.
            </p>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-slate-200 space-y-3 shadow-xs">
            <div className="w-10 h-10 rounded-xl bg-amber-500/15 text-amber-700 flex items-center justify-center">
              <Factory className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-slate-900 text-base">Taller de Dimensionado Propio</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Equipados con sierras radiales industriales, cepillos mecánicos y perfiladoras para entregar la madera lista para montaje, ahorrándote tiempo de mano de obra en tu proyecto.
            </p>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-slate-200 space-y-3 shadow-xs">
            <div className="w-10 h-10 rounded-xl bg-amber-500/15 text-amber-700 flex items-center justify-center">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-slate-900 text-base">Legalidad y Facturación SAR</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Toda nuestra madera cuenta con guías de transporte forestal del Instituto de Conservación Forestal (ICF) y emitimos facturas fiscales con CAI válido para empresas y personas naturales.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

const OffersBanner: React.FC = () => {
  const { setSelectedCategoryFilter, setActiveNavTab } = useApp();

  return (
    <div className="bg-linear-to-r from-amber-600 via-amber-500 to-amber-600 text-slate-950 py-3 px-4 border-y border-amber-400 font-semibold text-xs">
      <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <span className="bg-slate-950 text-white px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-wider">
            Promoción
          </span>
          <span>Descuento del 10% en pedidos de más de 300 pies tablares de Pino Tratado para pérgolas y decks.</span>
        </div>
        <button
          onClick={() => {
            setActiveNavTab('cotizador');
            const el = document.getElementById('cotizador');
            if (el) el.scrollIntoView({ behavior: 'smooth' });
          }}
          className="underline font-black text-slate-950 hover:text-white cursor-pointer"
        >
          Cotizar por volumen →
        </button>
      </div>
    </div>
  );
};

const MainAppLayout: React.FC = () => {
  const { currentView, activeNavTab } = useApp();

  if (currentView === 'admin') {
    return <AdminCMS />;
  }

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col selection:bg-amber-400 selection:text-slate-950">
      {/* Universal Header */}
      <Header />

      {/* Main Content Areas based on Active Navigation Tab */}
      <main className="flex-1">
        {activeNavTab === 'inicio' && (
          <>
            <Hero />
            <OffersBanner />
            <div id="cotizador" className="py-2">
              <WoodEstimator />
            </div>
            <div id="proyectos" className="py-2">
              <ProjectCalculator />
            </div>
            <div id="catalogo" className="py-2">
              <Catalog />
            </div>
            <div id="nosotros">
              <AboutSection />
            </div>
            <div id="contacto">
              <ContactSection />
            </div>
          </>
        )}

        {activeNavTab === 'catalogo' && (
          <div className="py-6 space-y-6">
            <Catalog />
          </div>
        )}

        {activeNavTab === 'servicios' && (
          <div className="space-y-6 pt-6">
            <div className="max-w-7xl mx-auto px-4">
              <div className="bg-slate-900 text-white p-6 sm:p-8 rounded-2xl border border-slate-800 shadow-xl">
                <span className="text-xs font-mono font-bold text-amber-400 uppercase tracking-widest">
                  Taller & Maestría Forestal
                </span>
                <h1 className="text-2xl sm:text-3xl font-black mt-1">Servicios Industriales para Madera</h1>
                <p className="text-sm text-slate-300 mt-2 max-w-2xl leading-relaxed">
                  Corte longitudinal y transversal a la medida, cepillado en cuatro caras (S4S), inmunización y tratamiento CCA a presión, y dimensionamiento estructural para cubiertas, pérgolas y decks.
                </p>
              </div>
            </div>
            <ProjectCalculator />
            <WoodEstimator />
          </div>
        )}

        {activeNavTab === 'madera' && (
          <div className="space-y-4 pt-6">
            <div className="max-w-7xl mx-auto px-4">
              <div className="bg-slate-900 text-white p-6 rounded-2xl">
                <span className="text-xs font-mono font-bold text-amber-400 uppercase tracking-widest">
                  División Forestal
                </span>
                <h1 className="text-2xl sm:text-3xl font-black mt-1">Maderas Estructurales & Pino Tratado</h1>
                <p className="text-xs text-slate-300 mt-1 max-w-2xl">
                  Selección de maderas aserradas, secadas y tratadas al vacío para proyectos residenciales y comerciales en La Ceiba.
                </p>
              </div>
            </div>
            <WoodEstimator />
            <Catalog defaultCategory="madera_dimensionada" />
          </div>
        )}

        {activeNavTab === 'ferreteria' && (
          <div className="space-y-4 pt-6">
            <div className="max-w-7xl mx-auto px-4">
              <div className="bg-slate-900 text-white p-6 rounded-2xl">
                <span className="text-xs font-mono font-bold text-amber-400 uppercase tracking-widest">
                  Fijaciones & Herrajes
                </span>
                <h1 className="text-2xl sm:text-3xl font-black mt-1">Ferretería Especializada para Madera</h1>
                <p className="text-xs text-slate-300 mt-1 max-w-2xl">
                  Tornillería galvanizada de alta resistencia al salitre, bases de poste para pérgolas, clavos helicoidales y selladores marinos.
                </p>
              </div>
            </div>
            <Catalog defaultCategory="tornilleria" />
          </div>
        )}

        {activeNavTab === 'cotizador' && (
          <div className="py-6 space-y-6">
            <WoodEstimator />
          </div>
        )}

        {activeNavTab === 'proyectos' && (
          <div className="py-6 space-y-6">
            <ProjectCalculator />
          </div>
        )}

        {activeNavTab === 'ofertas' && (
          <div className="py-6 space-y-6">
            <OffersBanner />
            <div className="max-w-7xl mx-auto px-4">
              <div className="bg-slate-900 text-white p-6 rounded-2xl">
                <span className="text-xs font-mono font-bold text-amber-400 uppercase tracking-widest">
                  Precios de Mayorista
                </span>
                <h1 className="text-2xl sm:text-3xl font-black mt-1">Ofertas y Lotes de Madera Disponibles</h1>
                <p className="text-xs text-slate-300 mt-1">
                  Descuentos especiales por paquete completo en pino tratado y láminas de plywood.
                </p>
              </div>
            </div>
            <Catalog />
          </div>
        )}

        {activeNavTab === 'nosotros' && (
          <div className="py-6">
            <AboutSection />
          </div>
        )}

        {activeNavTab === 'contacto' && (
          <div className="py-6">
            <ContactSection />
          </div>
        )}
      </main>

      {/* Global Modals & Drawers */}
      <CartDrawer />
      <ProductDetailModal />
      <CheckoutModal />
      <OrderSuccessModal />
      <QuoteModal />
      <ToastContainer />

      {/* Industrial Footer */}
      <Footer />
    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <MainAppLayout />
    </AppProvider>
  );
}
