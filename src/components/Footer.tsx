import React, { useState } from 'react';
import { useApp } from '../lib/store';
import { 
  Building2, 
  MapPin, 
  Phone, 
  Mail, 
  ShieldCheck, 
  CreditCard, 
  FileText, 
  X,
  MessageCircle,
  Truck
} from 'lucide-react';

export const Footer: React.FC = () => {
  const { businessConfig, currentView, setCurrentView, setActiveNavTab } = useApp();
  const [activePolicy, setActivePolicy] = useState<string | null>(null);

  return (
    <footer className="bg-slate-950 text-slate-400 text-xs border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 py-12 space-y-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
          {/* Col 1: Brand & Identity */}
          <div className="lg:col-span-2 space-y-3">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-amber-500 text-slate-950 font-black text-sm flex items-center justify-center shadow-xs">
                F&M
              </div>
              <span className="text-base font-bold text-white tracking-tight">
                FERRETERÍA <span className="text-amber-500">& MÁS</span>
              </span>
            </div>
            <p className="text-slate-400 text-xs leading-relaxed max-w-sm">
              Plataforma digital especializada en venta y dimensionado de maderas estructurales, pino tratado CCA y materiales de construcción para La Ceiba y el Litoral Atlántico de Honduras.
            </p>
            <div className="text-[11px] text-slate-400 space-y-1">
              <p>RTN Empresa: <strong className="text-slate-200 font-mono">{businessConfig.rtn}</strong></p>
              <p>Dirección: <span className="text-slate-300">{businessConfig.address}</span></p>
              <p>Ciudad: <span className="text-slate-300">La Ceiba, Atlántida, Honduras</span></p>
            </div>
          </div>

          {/* Col 2: Accesos Directos */}
          <div className="space-y-3">
            <h4 className="text-white font-semibold uppercase tracking-wider text-[11px]">
              Navegación Rápida
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <button
                  onClick={() => {
                    setCurrentView('store');
                    setActiveNavTab('cotizador');
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="hover:text-amber-400 transition-colors text-left cursor-pointer"
                >
                  🪵 Cotizador de Madera
                </button>
              </li>
              <li>
                <button
                  onClick={() => {
                    setCurrentView('store');
                    setActiveNavTab('madera');
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="hover:text-amber-400 transition-colors text-left cursor-pointer"
                >
                  📐 Madera Dimensionada
                </button>
              </li>
              <li>
                <button
                  onClick={() => {
                    setCurrentView('store');
                    setActiveNavTab('proyectos');
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="hover:text-amber-400 transition-colors text-left cursor-pointer"
                >
                  🏛️ Calculadora Pérgolas y Techos
                </button>
              </li>
              <li>
                <button
                  onClick={() => {
                    setCurrentView('store');
                    setActiveNavTab('ferreteria');
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="hover:text-amber-400 transition-colors text-left cursor-pointer"
                >
                  🔨 Ferretería & Tornillería
                </button>
              </li>
            </ul>
          </div>

          {/* Col 3: Pagos y Bancos */}
          <div className="space-y-3">
            <h4 className="text-white font-semibold uppercase tracking-wider text-[11px]">
              Bancos Autorizados
            </h4>
            <div className="space-y-1.5 text-[11px] text-slate-300">
              <div className="flex items-center gap-1.5">
                <span>🏦</span>
                <span>Banco Atlántida Honduras</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span>🦁</span>
                <span>BAC Credomatic</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span>🏢</span>
                <span>Banco Ficohsa</span>
              </div>
              <div className="flex items-center gap-1.5">
                <CreditCard className="w-3.5 h-3.5 text-amber-400" />
                <span>Tarjetas Visa & MasterCard</span>
              </div>
            </div>
            <div className="pt-2 text-[10px] text-slate-500">
              Facturación válida con CAI (SAR de Honduras)
            </div>
          </div>

          {/* Col 4: Políticas & Admin */}
          <div className="space-y-3">
            <h4 className="text-white font-semibold uppercase tracking-wider text-[11px]">
              Transparencia y Leyes
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <button
                  onClick={() => setActivePolicy('envios')}
                  className="hover:text-white transition-colors cursor-pointer text-left"
                >
                  Política de Fletes y Descarga
                </button>
              </li>
              <li>
                <button
                  onClick={() => setActivePolicy('garantia')}
                  className="hover:text-white transition-colors cursor-pointer text-left"
                >
                  Garantía de Madera Tratada
                </button>
              </li>
              <li>
                <button
                  onClick={() => setActivePolicy('cambios')}
                  className="hover:text-white transition-colors cursor-pointer text-left"
                >
                  Cambios y Devoluciones
                </button>
              </li>
              <li className="pt-2">
                <button
                  onClick={() => setCurrentView(currentView === 'admin' ? 'store' : 'admin')}
                  className="text-amber-400 hover:text-amber-300 font-semibold flex items-center gap-1.5 cursor-pointer transition-colors"
                >
                  <Building2 className="w-3.5 h-3.5" />
                  {currentView === 'admin' ? 'Volver a Tienda Pública' : 'Acceso CMS Administrativo'}
                </button>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-slate-900 flex flex-wrap items-center justify-between gap-4 text-[11px]">
          <p>
            © {new Date().getFullYear()} Ferretería & Más S. de R.L. Todos los derechos reservados. La Ceiba, Honduras. | By:{' '}
            <a 
              href="https://mora-grafics-studio.com/" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="text-amber-400 hover:text-amber-300 font-medium underline underline-offset-2 transition-colors"
            >
              Mora-Grafic's Studio
            </a>
          </p>
          <div className="flex items-center gap-4 text-slate-500">
            <span>ISV 15% Desglosado en todas las ventas</span>
            <span>·</span>
            <span>Moneda Oficial: Lempira (L.)</span>
          </div>
        </div>
      </div>

      {/* Modal for Policies */}
      {activePolicy && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-xl max-w-lg w-full p-6 text-white relative shadow-xl">
            <button
              onClick={() => setActivePolicy(null)}
              className="absolute top-4 right-4 text-slate-400 hover:text-white p-1 rounded-md hover:bg-slate-800 cursor-pointer transition-colors"
            >
              <X className="w-4 h-4" />
            </button>

            {activePolicy === 'envios' && (
              <div className="space-y-3">
                <h3 className="text-sm font-semibold text-amber-400">Política de Fletes y Descarga en Obra</h3>
                <p className="text-xs text-slate-300 leading-relaxed">
                  Las entregas con camión plataforma se realizan a pie de camión en la dirección especificada en La Ceiba. El cliente o constructor debe contar con personal en la obra para la descarga manual de piezas pesadas, o solicitar previamente servicio de cuadrilla con cargo adicional.
                </p>
                <p className="text-xs text-slate-300 leading-relaxed">
                  Zonas de difícil acceso o caminos sin balastrar pueden requerir transbordo coordinado.
                </p>
              </div>
            )}

            {activePolicy === 'garantia' && (
              <div className="space-y-3">
                <h3 className="text-sm font-semibold text-amber-400">Garantía de Madera Tratada CCA</h3>
                <p className="text-xs text-slate-300 leading-relaxed">
                  Nuestras maderas tratadas cuentan con certificación de retención química de 0.40 pcf según normas internacionales AWPA para contacto con suelo y humedad tropical. Cubre pudrición fúngica y ataque de comején por 15 años cuando no se realizan cortes longitudinales sin re-impregnación de sellador protector en los extremos.
                </p>
              </div>
            )}

            {activePolicy === 'cambios' && (
              <div className="space-y-3">
                <h3 className="text-sm font-semibold text-amber-400">Cambios y Devoluciones</h3>
                <p className="text-xs text-slate-300 leading-relaxed">
                  Se aceptan cambios de madera no cortada a medida dentro de los 7 días posteriores a la compra presentando la factura fiscal original y siempre que la madera no haya sido expuesta a la intemperie o alterada. Maderas con servicio de corte personalizado no son sujetas a devolución.
                </p>
              </div>
            )}

            <div className="pt-4 mt-4 border-t border-slate-800 text-right">
              <button
                onClick={() => setActivePolicy(null)}
                className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-lg text-xs font-semibold cursor-pointer active:scale-[0.98] transition-all"
              >
                Entendido
              </button>
            </div>
          </div>
        </div>
      )}
    </footer>
  );
};
