import React from 'react';
import { useApp } from '../lib/store';
import { 
  MapPin, 
  Phone, 
  Clock, 
  Mail, 
  MessageCircle, 
  Truck, 
  Warehouse, 
  HelpCircle, 
  ShieldCheck, 
  Building2 
} from 'lucide-react';

export const ContactSection: React.FC = () => {
  const { businessConfig, deliveryZones } = useApp();

  return (
    <section id="contacto" className="py-16 bg-slate-50/50 text-slate-900 border-t border-slate-200">
      <div className="max-w-7xl mx-auto px-4 space-y-12">
        {/* Title */}
        <div className="max-w-2xl">
          <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-amber-800 bg-amber-50 border border-amber-200/70 px-2.5 py-0.5 rounded-full uppercase tracking-wider mb-2">
            <Warehouse className="w-3.5 h-3.5 text-amber-600" />
            Bodega Central & Logística
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
            Ubicación, Horarios y Cobertura de Fletes
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 mt-1 leading-relaxed">
            Atención presencial para constructores, carpinteros y particulares sobre la Carretera CA-13, La Ceiba, Atlántida.
          </p>
        </div>

        {/* 3 Contact Columns */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Card 1: Dirección y Bodega */}
          <div className="bg-white border border-slate-200/90 rounded-xl p-6 space-y-4 shadow-xs">
            <div className="w-10 h-10 rounded-lg bg-slate-900 text-amber-400 flex items-center justify-center shadow-xs">
              <MapPin className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-semibold text-slate-900 text-base">Bodega y Patios de Madera</h3>
              <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                {businessConfig.address}
              </p>
              <span className="inline-block mt-2 font-mono text-[11px] font-medium text-slate-700 bg-slate-50 px-2 py-0.5 rounded border border-slate-200">
                GPS: 15.7725° N, 86.7915° W
              </span>
            </div>
            <div className="pt-3 border-t border-slate-100 text-xs text-slate-600 space-y-1">
              <p>• Andenes de carga rápida para pick-ups y camiones.</p>
              <p>• Servicio de montacargas para paquetes de madera.</p>
            </div>
          </div>

          {/* Card 2: Horarios de Despacho */}
          <div className="bg-white border border-slate-200/90 rounded-xl p-6 space-y-4 shadow-xs">
            <div className="w-10 h-10 rounded-lg bg-slate-900 text-amber-400 flex items-center justify-center shadow-xs">
              <Clock className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-semibold text-slate-900 text-base">Horarios de Carga y Ventas</h3>
              <div className="text-xs text-slate-700 mt-2 space-y-1.5 font-medium">
                <div className="flex justify-between">
                  <span>Lunes a Viernes:</span>
                  <span className="font-semibold text-slate-900">7:00 AM - 5:00 PM</span>
                </div>
                <div className="flex justify-between">
                  <span>Sábados:</span>
                  <span className="font-semibold text-slate-900">7:00 AM - 1:00 PM</span>
                </div>
                <div className="flex justify-between text-slate-400">
                  <span>Domingos:</span>
                  <span>Cerrado por mantenimiento</span>
                </div>
              </div>
            </div>
            <div className="pt-3 border-t border-slate-100 text-xs text-emerald-700 font-semibold">
              ⚡ Retiro Exprés en Bodega disponible en 30 minutos tras confirmar tu pedido en línea.
            </div>
          </div>

          {/* Card 3: Teléfonos & WhatsApp */}
          <div className="bg-white border border-slate-200/90 rounded-xl p-6 space-y-4 shadow-xs">
            <div className="w-10 h-10 rounded-lg bg-slate-900 text-amber-400 flex items-center justify-center shadow-xs">
              <Phone className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-semibold text-slate-900 text-base">Líneas de Atención Inmediata</h3>
              <div className="text-xs text-slate-700 mt-2 space-y-2">
                <div>
                  <span className="text-slate-400 block text-[10px] uppercase font-semibold">PBX La Ceiba:</span>
                  <span className="font-mono font-semibold text-slate-900 text-sm">{businessConfig.phone}</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px] uppercase font-semibold">Mesa de Cotizaciones WhatsApp:</span>
                  <a
                    href={`https://wa.me/${businessConfig.whatsapp.replace(/[^0-9]/g, '')}`}
                    target="_blank"
                    rel="noreferrer"
                    className="font-mono font-semibold text-emerald-700 hover:text-emerald-800 text-sm flex items-center gap-1 transition-colors"
                  >
                    <MessageCircle className="w-4 h-4" />
                    {businessConfig.whatsapp}
                  </a>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px] uppercase font-semibold">Correo de Facturación:</span>
                  <span className="font-mono text-slate-600">{businessConfig.email}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Coverage zones table */}
        <div className="bg-slate-950 text-white rounded-xl p-6 lg:p-8 space-y-6 border border-slate-800 shadow-md">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <span className="text-[11px] font-mono font-semibold text-amber-400 uppercase tracking-wider">
                Logística de Distribución
              </span>
              <h3 className="text-xl font-bold mt-1 text-white tracking-tight">Zonas de Cobertura con Camión Plataforma</h3>
            </div>
            <span className="text-xs text-slate-400">
              Despachos diarios coordinados desde La Ceiba
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {deliveryZones.map((z) => (
              <div key={z.id} className="bg-slate-900 border border-slate-800 p-4 rounded-lg space-y-2">
                <div className="font-semibold text-sm text-amber-400">{z.name}</div>
                <p className="text-xs text-slate-300 leading-relaxed">{z.description}</p>
                <div className="pt-2 border-t border-slate-800 text-xs flex justify-between items-baseline">
                  <span className="text-slate-400">Tarifa Flete:</span>
                  <span className="font-mono font-bold text-white">L. {z.rate.toFixed(2)}</span>
                </div>
                <div className="text-[10px] text-emerald-400 font-medium">
                  Gratis en compras &gt; L. {z.freeShippingThreshold.toLocaleString()}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* FAQ Section */}
        <div className="space-y-6 max-w-4xl mx-auto">
          <div className="text-center space-y-1">
            <h3 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">Preguntas Frecuentes de Clientes y Contratistas</h3>
            <p className="text-xs text-slate-500">Respuestas técnicas sobre cubicación, preservación y logística en La Ceiba.</p>
          </div>

          <div className="divide-y divide-slate-200 border border-slate-200 rounded-xl overflow-hidden bg-white shadow-xs">
            <div className="p-5 space-y-1.5">
              <h4 className="text-sm font-semibold text-slate-900 flex items-center gap-2">
                <HelpCircle className="w-4 h-4 text-amber-600 shrink-0" />
                ¿Qué diferencia hay entre el Pino Tratado CCA y el Pino Nacional sin tratar?
              </h4>
              <p className="text-xs text-slate-600 leading-relaxed pl-6">
                El pino tratado CCA ha sido sometido a un autoclave de presión con preservantes de Cobre, Cromo y Arsénico, haciéndolo inmune a las termitas (comején), hongos y la humedad salina de la costa de La Ceiba. El pino nacional natural es recomendado principalmente para encofrados temporales, cielos falsos o muebles interiores secos.
              </p>
            </div>

            <div className="p-5 space-y-1.5">
              <h4 className="text-sm font-semibold text-slate-900 flex items-center gap-2">
                <HelpCircle className="w-4 h-4 text-amber-600 shrink-0" />
                ¿Cómo se calcula el Pie Tablar (Board Foot) en Honduras?
              </h4>
              <p className="text-xs text-slate-600 leading-relaxed pl-6">
                La fórmula estandarizada por el Instituto de Conservación Forestal (ICF) y aserraderos es: <strong className="font-mono">(Grosor en pulgadas × Ancho en pulgadas × Largo en pies) ÷ 12</strong>. Nuestro cotizador web realiza este cálculo de forma instantánea al elegir cualquier medida.
              </p>
            </div>

            <div className="p-5 space-y-1.5">
              <h4 className="text-sm font-semibold text-slate-900 flex items-center gap-2">
                <HelpCircle className="w-4 h-4 text-amber-600 shrink-0" />
                ¿Cómo funciona el Retiro Exprés en Bodega con Código QR?
              </h4>
              <p className="text-xs text-slate-600 leading-relaxed pl-6">
                Al comprar o reservar en línea, recibes un número de pedido y un Código QR digital. Cuando llegas a nuestra bodega sobre la CA-13, el despachador escanea tu código en su tablet y tu madera ya está cortada y agrupada en el andén de carga, evitando filas y esperas de más de 1 hora.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
