import React from 'react';
import { useApp } from '../lib/store';
import { formatLempiras, calculateCartSummary, buildWhatsAppMessage } from '../lib/pricingEngine';
import { 
  X, 
  Trash2, 
  ShoppingBag, 
  ArrowRight, 
  Truck, 
  Warehouse, 
  FileText, 
  MessageCircle, 
  ShieldCheck,
  Plus,
  Minus
} from 'lucide-react';

export const CartDrawer: React.FC = () => {
  const { 
    cart, 
    isCartOpen, 
    setIsCartOpen, 
    updateCartItemQuantity, 
    removeFromCart, 
    clearCart,
    deliveryMethod,
    setDeliveryMethod,
    deliveryZones,
    selectedZone,
    setSelectedZone,
    setIsCheckoutOpen,
    businessConfig,
    createQuote,
    showToast
  } = useApp();

  if (!isCartOpen) return null;

  const summary = calculateCartSummary(
    cart,
    deliveryMethod === 'delivery' ? selectedZone : null,
    deliveryMethod === 'pickup',
    businessConfig.isvPercent
  );

  const handleCheckout = () => {
    if (cart.length === 0) return;
    setIsCartOpen(false);
    setIsCheckoutOpen(true);
  };

  const handleCreateQuote = () => {
    if (cart.length === 0) return;
    createQuote({
      name: 'Cliente Cotización',
      phone: businessConfig.phone,
      whatsapp: businessConfig.whatsapp,
      email: ''
    });
    setIsCartOpen(false);
  };

  const handleSendWhatsApp = () => {
    if (cart.length === 0) return;
    const msg = buildWhatsAppMessage(
      'COT-CART-' + Math.floor(1000 + Math.random() * 9000),
      'cotizacion',
      'Cliente Web',
      cart,
      summary.total,
      deliveryMethod,
      selectedZone?.name
    );
    window.open(`https://wa.me/${businessConfig.whatsapp.replace(/[^0-9]/g, '')}?text=${msg}`, '_blank');
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div 
        onClick={() => setIsCartOpen(false)}
        className="absolute inset-0 bg-slate-950/70 backdrop-blur-xs transition-opacity"
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-white border-l border-slate-200 shadow-2xl flex flex-col justify-between">
          {/* Header */}
          <div className="p-4 bg-slate-950 text-white flex items-center justify-between border-b border-slate-800">
            <div className="flex items-center gap-2.5">
              <ShoppingBag className="w-5 h-5 text-amber-400" />
              <div>
                <h3 className="text-sm font-bold text-white">Cotización & Carrito</h3>
                <span className="text-[11px] text-slate-400 font-normal">
                  {cart.length} {cart.length === 1 ? 'partida' : 'partidas'} agregadas
                </span>
              </div>
            </div>
            <button
              onClick={() => setIsCartOpen(false)}
              className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800/80 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Body: Items List */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3 divide-y divide-slate-100">
            {cart.length === 0 ? (
              <div className="py-16 text-center space-y-3">
                <ShoppingBag className="w-10 h-10 text-slate-300 mx-auto" />
                <h4 className="text-sm font-semibold text-slate-800">El carrito está vacío</h4>
                <p className="text-xs text-slate-500 max-w-xs mx-auto leading-relaxed">
                  Agrega madera con tus medidas desde el cotizador o selecciona productos del catálogo para comenzar.
                </p>
                <button
                  onClick={() => setIsCartOpen(false)}
                  className="mt-2 px-4 py-2 rounded-lg bg-slate-900 text-white text-xs font-semibold hover:bg-slate-800 transition-all cursor-pointer shadow-xs active:scale-[0.98]"
                >
                  Ir al Catálogo
                </button>
              </div>
            ) : (
              cart.map((item) => (
                <div key={item.id} className="pt-3 first:pt-0 flex gap-3 items-start">
                  <img
                    src={item.product.imageUrl}
                    alt={item.product.name}
                    className="w-16 h-16 rounded-lg object-cover border border-slate-200 shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-start gap-1">
                      <h4 className="text-xs font-semibold text-slate-900 truncate">{item.product.name}</h4>
                      <button
                        onClick={() => removeFromCart(item.id)}
                        className="text-slate-400 hover:text-rose-600 transition-colors cursor-pointer p-0.5"
                        title="Eliminar"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    <div className="text-[11px] text-slate-500 font-mono mt-0.5">
                      {item.customDimensions?.label || item.product.dimensionString || item.product.sku}
                    </div>

                    {item.selectedServices && item.selectedServices.length > 0 && (
                      <div className="mt-1 space-y-0.5">
                        {item.selectedServices.map((s, idx) => (
                          <span key={idx} className="block text-[10px] text-amber-700 font-medium">
                            + {s.serviceName} ({formatLempiras(s.price)})
                          </span>
                        ))}
                      </div>
                    )}

                    <div className="flex items-center justify-between mt-2 pt-1 border-t border-slate-100">
                      <div className="flex items-center border border-slate-200 rounded-md bg-slate-50">
                        <button
                          onClick={() => updateCartItemQuantity(item.id, item.quantity - 1)}
                          className="px-2 py-0.5 text-slate-700 hover:bg-slate-200 text-xs font-bold transition-colors cursor-pointer"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="px-2 text-xs font-bold text-slate-900">{item.quantity}</span>
                        <button
                          onClick={() => updateCartItemQuantity(item.id, item.quantity + 1)}
                          className="px-2 py-0.5 text-slate-700 hover:bg-slate-200 text-xs font-bold transition-colors cursor-pointer"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>

                      <span className="font-bold font-mono text-xs text-slate-950">
                        {formatLempiras(item.subtotal)}
                      </span>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Footer: Logistics Selector & Financial Total */}
          {cart.length > 0 && (
            <div className="p-4 bg-slate-50/80 border-t border-slate-200 space-y-3">
              {/* Delivery / Pickup Tabs */}
              <div className="p-1 bg-slate-200/70 rounded-xl grid grid-cols-2 gap-1 text-xs">
                <button
                  type="button"
                  onClick={() => setDeliveryMethod('pickup')}
                  className={`py-1.5 rounded-lg flex items-center justify-center gap-1.5 transition-all cursor-pointer font-medium active:scale-[0.98] ${
                    deliveryMethod === 'pickup'
                      ? 'bg-white text-slate-950 font-semibold shadow-xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  <Warehouse className="w-3.5 h-3.5 text-amber-500" />
                  Retiro Exprés (Gratis)
                </button>
                <button
                  type="button"
                  onClick={() => setDeliveryMethod('delivery')}
                  className={`py-1.5 rounded-lg flex items-center justify-center gap-1.5 transition-all cursor-pointer font-medium active:scale-[0.98] ${
                    deliveryMethod === 'delivery'
                      ? 'bg-white text-slate-950 font-semibold shadow-xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  <Truck className="w-3.5 h-3.5 text-amber-500" />
                  Envío a Domicilio
                </button>
              </div>

              {/* Delivery Zone Selector */}
              {deliveryMethod === 'delivery' && (
                <div className="bg-white p-2.5 rounded-lg border border-slate-200 space-y-1">
                  <label className="block text-[11px] font-semibold text-slate-700">Zona de Entrega La Ceiba:</label>
                  <select
                    value={selectedZone?.id || ''}
                    onChange={(e) => {
                      const zone = deliveryZones.find(z => z.id === e.target.value) || null;
                      setSelectedZone(zone);
                    }}
                    className="w-full bg-slate-50 border border-slate-200 rounded-md px-2 py-1.5 text-xs text-slate-800 font-medium focus:ring-1 focus:ring-slate-900 focus:outline-hidden"
                  >
                    {deliveryZones.map(z => (
                      <option key={z.id} value={z.id}>
                        {z.name} ({formatLempiras(z.rate)})
                      </option>
                    ))}
                  </select>
                  {selectedZone && (
                    <div className="text-[10px] text-slate-500 pt-0.5">
                      {summary.isFreeShipping ? (
                        <span className="text-emerald-700 font-semibold">¡Envío Gratis aplicado por compra mayor a {formatLempiras(selectedZone.freeShippingThreshold)}!</span>
                      ) : (
                        <span>Entrega: {selectedZone.estimatedDeliveryTime}</span>
                      )}
                    </div>
                  )}
                </div>
              )}

              {/* Breakdown */}
              <div className="space-y-1.5 text-xs pt-0.5">
                <div className="flex justify-between text-slate-600">
                  <span>Subtotal materiales:</span>
                  <span className="font-mono font-medium text-slate-900">{formatLempiras(summary.productsSubtotal)}</span>
                </div>
                {summary.servicesTotal > 0 && (
                  <div className="flex justify-between text-amber-700 font-medium">
                    <span>Servicios de taller:</span>
                    <span className="font-mono font-semibold">+{formatLempiras(summary.servicesTotal)}</span>
                  </div>
                )}
                <div className="flex justify-between text-slate-500">
                  <span>Impuesto Sobre Ventas (ISV 15%):</span>
                  <span className="font-mono">{formatLempiras(summary.tax)}</span>
                </div>
                <div className="flex justify-between text-slate-500">
                  <span>Flete / Envío:</span>
                  <span className="font-mono text-slate-900 font-medium">
                    {deliveryMethod === 'pickup' 
                      ? 'L. 0.00 (Bodega)' 
                      : (summary.shippingFee === 0 ? '¡GRATIS!' : formatLempiras(summary.shippingFee))}
                  </span>
                </div>
                <div className="pt-2 border-t border-slate-200 flex justify-between items-baseline font-bold">
                  <span className="text-xs uppercase tracking-wider text-slate-700">Total Definitivo (L.):</span>
                  <span className="text-xl text-slate-950 font-mono font-black tracking-tight">{formatLempiras(summary.total)}</span>
                </div>
              </div>

              {/* Conversion Buttons */}
              <div className="space-y-2 pt-1">
                <button
                  type="button"
                  onClick={handleCheckout}
                  className="w-full py-2.5 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs uppercase tracking-tight flex items-center justify-center gap-2 shadow-xs cursor-pointer active:scale-[0.98] transition-all"
                >
                  <span>Proceder a Finalizar Pedido</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>

                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={handleCreateQuote}
                    className="py-2 rounded-lg border border-slate-200 hover:bg-white text-slate-700 text-xs font-semibold flex items-center justify-center gap-1 cursor-pointer transition-all active:scale-[0.98]"
                  >
                    <FileText className="w-3.5 h-3.5 text-amber-600" />
                    Cotización Formal
                  </button>
                  <button
                    type="button"
                    onClick={handleSendWhatsApp}
                    className="py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold flex items-center justify-center gap-1 cursor-pointer transition-all active:scale-[0.98]"
                  >
                    <MessageCircle className="w-3.5 h-3.5" />
                    Vía WhatsApp
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
