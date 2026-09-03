import React from 'react';
import { useApp } from '../lib/store';
import { formatLempiras, buildWhatsAppMessage } from '../lib/pricingEngine';
import { 
  X, 
  Printer, 
  MessageCircle, 
  ShoppingBag, 
  ShieldCheck, 
  Calendar, 
  Building2, 
  FileText 
} from 'lucide-react';

export const QuoteModal: React.FC = () => {
  const { viewingQuote, setViewingQuote, convertQuoteToOrder, businessConfig } = useApp();

  if (!viewingQuote) return null;

  const handlePrint = () => {
    window.print();
  };

  const handleWhatsApp = () => {
    const text = buildWhatsAppMessage(
      viewingQuote.quoteNumber,
      'cotizacion',
      viewingQuote.customer.name,
      viewingQuote.items,
      viewingQuote.total,
      viewingQuote.deliveryMethod,
      viewingQuote.deliveryZoneName
    );
    window.open(`https://wa.me/${businessConfig.whatsapp.replace(/[^0-9]/g, '')}?text=${text}`, '_blank');
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/75 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-xl max-w-2xl w-full border border-slate-200/90 shadow-2xl overflow-hidden my-8 relative text-slate-900 print:shadow-none print:border-none">
        {/* Header */}
        <div className="bg-slate-950 text-white p-6 relative border-b border-slate-800">
          <button
            onClick={() => setViewingQuote(null)}
            className="absolute top-4 right-4 p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800/80 transition-colors cursor-pointer print:hidden"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex items-start justify-between">
            <div>
              <span className="text-[11px] uppercase font-semibold tracking-wider text-amber-400 block">
                Cotización Formal de Materiales
              </span>
              <h3 className="text-2xl font-bold mt-0.5 font-mono tracking-tight text-white">{viewingQuote.quoteNumber}</h3>
              <p className="text-xs text-slate-400 mt-1">
                Emitida: {new Date(viewingQuote.createdAt).toLocaleDateString('es-HN')} · Vigente hasta: <strong className="text-slate-200">{viewingQuote.validUntil}</strong>
              </p>
            </div>
            <div className="text-right hidden sm:block">
              <span className="text-sm font-bold text-amber-400">FERRETERÍA & MÁS</span>
              <p className="text-[10px] text-slate-400">RTN: {businessConfig.rtn}</p>
              <p className="text-[10px] text-slate-400">La Ceiba, Atlántida</p>
            </div>
          </div>
        </div>

        {/* Client & Specs */}
        <div className="p-6 space-y-6">
          <div className="grid grid-cols-2 gap-4 text-xs bg-slate-50 p-4 rounded-xl border border-slate-200">
            <div>
              <span className="text-slate-500 font-semibold uppercase text-[10px] block">Cliente / Empresa:</span>
              <span className="font-semibold text-slate-900 text-sm block mt-0.5">{viewingQuote.customer.name}</span>
              <span className="text-slate-600 block">{viewingQuote.customer.phone}</span>
              {viewingQuote.customer.companyName && (
                <span className="text-slate-500 block">{viewingQuote.customer.companyName}</span>
              )}
            </div>
            <div>
              <span className="text-slate-500 font-semibold uppercase text-[10px] block">Condiciones de Entrega:</span>
              <span className="font-semibold text-slate-900 block mt-0.5">
                {viewingQuote.deliveryMethod === 'pickup' ? 'Retiro en Bodega La Ceiba' : `Flete a Domicilio (${viewingQuote.deliveryZoneName})`}
              </span>
              <span className="text-slate-600 block">Vigencia: 15 días calendario</span>
            </div>
          </div>

          {/* Table */}
          <div className="border border-slate-200 rounded-xl overflow-hidden text-xs">
            <table className="w-full text-left">
              <thead className="bg-slate-100 text-slate-700 font-semibold uppercase text-[10px] border-b border-slate-200">
                <tr>
                  <th className="p-3">Descripción de Material</th>
                  <th className="p-3 text-center">Cant.</th>
                  <th className="p-3 text-right">P. Unitario</th>
                  <th className="p-3 text-right">Subtotal</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {viewingQuote.items.map((item, idx) => (
                  <tr key={idx} className="hover:bg-slate-50/50">
                    <td className="p-3">
                      <div className="font-semibold text-slate-900">{item.product.name}</div>
                      <div className="text-[11px] text-slate-500 font-mono">
                        {item.customDimensions?.label || item.product.dimensionString}
                      </div>
                      {item.selectedServices && item.selectedServices.length > 0 && (
                        <div className="text-[10px] text-amber-700 mt-0.5">
                          Servicios: {item.selectedServices.map(s => s.serviceName).join(', ')}
                        </div>
                      )}
                    </td>
                    <td className="p-3 text-center font-semibold text-slate-800">
                      {item.quantity} {item.product.unit}(s)
                    </td>
                    <td className="p-3 text-right font-mono text-slate-700">
                      {formatLempiras(item.unitPrice)}
                    </td>
                    <td className="p-3 text-right font-mono font-semibold text-slate-900">
                      {formatLempiras(item.subtotal)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {/* Subtotals */}
            <div className="p-4 bg-slate-50 border-t border-slate-200 space-y-1 text-xs">
              <div className="flex justify-between text-slate-600">
                <span>Subtotal Materiales:</span>
                <span className="font-mono">{formatLempiras(viewingQuote.subtotal)}</span>
              </div>
              {viewingQuote.servicesTotal > 0 && (
                <div className="flex justify-between text-amber-700">
                  <span>Servicios de Taller:</span>
                  <span className="font-mono">+{formatLempiras(viewingQuote.servicesTotal)}</span>
                </div>
              )}
              <div className="flex justify-between text-slate-600">
                <span>Impuesto Sobre Ventas (ISV 15%):</span>
                <span className="font-mono">{formatLempiras(viewingQuote.tax)}</span>
              </div>
              <div className="flex justify-between text-slate-600">
                <span>Flete / Logística:</span>
                <span className="font-mono">{viewingQuote.shippingFee === 0 ? 'L. 0.00' : formatLempiras(viewingQuote.shippingFee)}</span>
              </div>
              <div className="pt-2 border-t border-slate-200 flex justify-between items-baseline font-bold text-sm text-slate-950">
                <span className="text-xs uppercase tracking-wider text-slate-700">TOTAL COTIZADO (L.):</span>
                <span className="text-xl font-black font-mono text-slate-950 tracking-tight">{formatLempiras(viewingQuote.total)}</span>
              </div>
            </div>
          </div>

          {/* Legal / Policy Note */}
          <div className="text-[11px] text-slate-500 space-y-1">
            <p>• Los precios están expresados en Lempiras hondureños (L.) e incluyen el 15% de ISV según ley.</p>
            <p>• Validez de 15 días a partir de la fecha de emisión. Madera reservada sujeta a confirmación de stock al emitir orden de compra.</p>
          </div>

          {/* Action Buttons */}
          <div className="space-y-2 pt-2 print:hidden">
            <button
              onClick={() => {
                convertQuoteToOrder(viewingQuote.id);
                setViewingQuote(null);
              }}
              className="w-full py-2.5 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs uppercase tracking-tight flex items-center justify-center gap-2 cursor-pointer shadow-xs active:scale-[0.98] transition-all"
            >
              <ShoppingBag className="w-4 h-4" />
              Convertir en Pedido de Compra
            </button>

            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={handleWhatsApp}
                className="py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold flex items-center justify-center gap-1.5 cursor-pointer shadow-xs active:scale-[0.98] transition-all"
              >
                <MessageCircle className="w-4 h-4" />
                Compartir por WhatsApp
              </button>

              <button
                onClick={handlePrint}
                className="py-2 rounded-lg border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-medium flex items-center justify-center gap-1.5 cursor-pointer active:scale-[0.98] transition-all"
              >
                <Printer className="w-4 h-4 text-slate-500" />
                Imprimir / PDF
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
