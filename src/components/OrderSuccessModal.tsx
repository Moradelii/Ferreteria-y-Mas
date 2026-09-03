import React from 'react';
import { useApp } from '../lib/store';
import { formatLempiras, buildWhatsAppMessage } from '../lib/pricingEngine';
import { 
  CheckCircle2, 
  QrCode, 
  Warehouse, 
  Truck, 
  Printer, 
  MessageCircle, 
  X, 
  Calendar, 
  FileText 
} from 'lucide-react';

export const OrderSuccessModal: React.FC = () => {
  const { completedOrder, setCompletedOrder, businessConfig } = useApp();

  if (!completedOrder) return null;

  const handlePrint = () => {
    window.print();
  };

  const handleWhatsApp = () => {
    const text = buildWhatsAppMessage(
      completedOrder.orderNumber,
      'pedido',
      completedOrder.customer.name,
      completedOrder.items,
      completedOrder.total,
      completedOrder.deliveryMethod,
      completedOrder.deliveryZoneName
    );
    window.open(`https://wa.me/${businessConfig.whatsapp.replace(/[^0-9]/g, '')}?text=${text}`, '_blank');
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/75 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-xl max-w-xl w-full border border-slate-200/90 shadow-2xl overflow-hidden my-8 relative text-slate-900 print:shadow-none print:border-none">
        {/* Header */}
        <div className="bg-emerald-800 text-white p-6 text-center relative">
          <button
            onClick={() => setCompletedOrder(null)}
            className="absolute top-4 right-4 p-1 rounded-lg text-emerald-200 hover:text-white hover:bg-emerald-700/60 transition-colors cursor-pointer print:hidden"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="w-12 h-12 rounded-full bg-white text-emerald-800 flex items-center justify-center mx-auto mb-3 shadow-xs">
            <CheckCircle2 className="w-7 h-7" />
          </div>

          <span className="text-[11px] uppercase font-semibold tracking-wider text-emerald-200 block">
            ¡Pedido Registrado con Éxito!
          </span>
          <h3 className="text-2xl font-bold mt-0.5 font-mono tracking-tight">{completedOrder.orderNumber}</h3>
          <p className="text-xs text-emerald-100/90 mt-1 max-w-md mx-auto leading-relaxed">
            Hemos recibido tu orden y nuestro equipo de bodega en La Ceiba está preparando tus materiales.
          </p>
        </div>

        {/* QR Code / Reception Box */}
        <div className="p-6 space-y-6">
          <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="space-y-1 text-center sm:text-left">
              <span className="text-[10px] font-semibold uppercase tracking-wider text-slate-500 block">
                {completedOrder.deliveryMethod === 'pickup' ? 'Código de Retiro Exprés en Bodega' : 'Código de Guía de Entrega'}
              </span>
              <span className="text-lg font-black text-slate-900 font-mono tracking-tight">
                {completedOrder.pickupQrCode}
              </span>
              <div className="text-xs text-slate-600 flex items-center gap-1 justify-center sm:justify-start">
                <Warehouse className="w-3.5 h-3.5 text-amber-600" />
                <span>Bodega Central La Ceiba: CA-13 frente a El Sauce</span>
              </div>
              {completedOrder.pickupTimeSlot && (
                <div className="text-xs font-semibold text-emerald-700 flex items-center gap-1 justify-center sm:justify-start">
                  <Calendar className="w-3.5 h-3.5" />
                  <span>Horario asignado: {completedOrder.pickupTimeSlot}</span>
                </div>
              )}
            </div>

            {/* Simulated QR Code Graphic */}
            <div className="p-2.5 bg-white border border-slate-300 rounded-xl shadow-xs shrink-0 text-center">
              <QrCode className="w-18 h-18 text-slate-900 mx-auto" />
              <span className="text-[9px] font-mono font-semibold text-slate-700 block mt-0.5 tracking-tight">
                ESCANEABLE EN BODEGA
              </span>
            </div>
          </div>

          {/* Customer & Delivery Specs */}
          <div className="grid grid-cols-2 gap-3 text-xs bg-slate-50 border border-slate-200 p-3.5 rounded-xl">
            <div>
              <span className="text-slate-500 font-medium block text-[11px]">Cliente:</span>
              <span className="font-semibold text-slate-900">{completedOrder.customer.name}</span>
              <span className="text-slate-600 block">{completedOrder.customer.phone}</span>
            </div>
            <div>
              <span className="text-slate-500 font-medium block text-[11px]">Modalidad & Pago:</span>
              <span className="font-semibold text-slate-900 capitalize">
                {completedOrder.deliveryMethod === 'pickup' ? 'Retiro en Bodega' : 'Envío a Domicilio'}
              </span>
              <span className="text-slate-600 block capitalize text-[11px]">
                {completedOrder.paymentMethod === 'card' ? 'Tarjeta (Aprobado)' : completedOrder.paymentMethod === 'bank_transfer' ? 'Transferencia (Verificación)' : 'Efectivo'}
              </span>
            </div>
          </div>

          {/* Itemized Receipt Table */}
          <div className="space-y-2">
            <span className="text-xs font-semibold text-slate-700 uppercase tracking-wider block">
              Detalle de Materiales Facturados:
            </span>
            <div className="divide-y divide-slate-100 text-xs border border-slate-200 rounded-xl overflow-hidden">
              {completedOrder.items.map((item, idx) => (
                <div key={idx} className="p-3 flex items-center justify-between bg-white">
                  <div>
                    <span className="font-semibold text-slate-900">{item.product.name}</span>
                    <div className="text-[11px] text-slate-500 font-mono">
                      {item.customDimensions?.label || item.product.dimensionString} · {item.quantity} {item.product.unit}(s)
                    </div>
                  </div>
                  <span className="font-mono font-semibold text-slate-900">
                    {formatLempiras(item.subtotal)}
                  </span>
                </div>
              ))}
              <div className="p-3 bg-slate-50 space-y-1">
                <div className="flex justify-between text-slate-600">
                  <span>Subtotal:</span>
                  <span className="font-mono">{formatLempiras(completedOrder.subtotal)}</span>
                </div>
                <div className="flex justify-between text-slate-600">
                  <span>ISV 15%:</span>
                  <span className="font-mono">{formatLempiras(completedOrder.tax)}</span>
                </div>
                <div className="flex justify-between text-slate-600">
                  <span>Flete:</span>
                  <span className="font-mono">{completedOrder.shippingFee === 0 ? 'L. 0.00' : formatLempiras(completedOrder.shippingFee)}</span>
                </div>
                <div className="flex justify-between font-bold text-sm text-slate-950 pt-1 border-t border-slate-200">
                  <span>Total Pagado / Acordado:</span>
                  <span className="font-mono font-black">{formatLempiras(completedOrder.total)}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="space-y-2 pt-2 print:hidden">
            <button
              onClick={handleWhatsApp}
              className="w-full py-2.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs uppercase tracking-tight flex items-center justify-center gap-2 cursor-pointer shadow-xs active:scale-[0.98] transition-all"
            >
              <MessageCircle className="w-4 h-4" />
              Enviar Copia de Orden a WhatsApp de Bodega
            </button>

            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={handlePrint}
                className="py-2 rounded-lg border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-medium flex items-center justify-center gap-1.5 cursor-pointer transition-all active:scale-[0.98]"
              >
                <Printer className="w-4 h-4 text-slate-500" />
                Imprimir Comprobante
              </button>

              <button
                onClick={() => setCompletedOrder(null)}
                className="py-2 rounded-lg bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold cursor-pointer transition-all active:scale-[0.98] shadow-xs"
              >
                Cerrar & Seguir Comprando
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
