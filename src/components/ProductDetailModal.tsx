import React, { useState } from 'react';
import { useApp } from '../lib/store';
import { formatLempiras, calculateBoardFeet } from '../lib/pricingEngine';
import { 
  X, 
  ShoppingBag, 
  Check, 
  ShieldCheck, 
  Truck, 
  Warehouse, 
  MessageCircle, 
  Tag, 
  FileCheck 
} from 'lucide-react';
import { SelectedServiceItem } from '../types';

export const ProductDetailModal: React.FC = () => {
  const { 
    inspectProduct, 
    setInspectProduct, 
    addToCart, 
    setIsCartOpen, 
    services, 
    businessConfig 
  } = useApp();

  const [qty, setQty] = useState(1);
  const [selectedServicesMap, setSelectedServicesMap] = useState<Record<string, boolean>>({});

  if (!inspectProduct) return null;

  const bf = inspectProduct.dimensions 
    ? calculateBoardFeet(
        inspectProduct.dimensions.thicknessInches, 
        inspectProduct.dimensions.widthInches, 
        inspectProduct.dimensions.lengthFeet
      ) 
    : 0;

  const selectedServicesList: SelectedServiceItem[] = services
    .filter(s => selectedServicesMap[s.id])
    .map(s => ({
      serviceId: s.id,
      serviceName: s.name,
      price: s.price,
      quantity: qty
    }));

  const servicesCost = selectedServicesList.reduce((sum, s) => sum + s.price * s.quantity, 0);
  const totalItemSubtotal = (inspectProduct.pricePerUnit * qty) + servicesCost;

  const handleAdd = () => {
    addToCart(inspectProduct, qty, inspectProduct.dimensions, selectedServicesList);
    setInspectProduct(null);
    setIsCartOpen(true);
  };

  const handleWhatsApp = () => {
    const text = `Hola Ferretería & Más! Deseo consultar sobre el producto: *${inspectProduct.name}* (SKU: ${inspectProduct.sku}) por una cantidad de ${qty} ${inspectProduct.unit}(s). ¿Tienen entrega para La Ceiba?`;
    window.open(`https://wa.me/${businessConfig.whatsapp.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(text)}`, '_blank');
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-xl max-w-2xl w-full border border-slate-200 shadow-2xl overflow-hidden my-8 relative">
        {/* Close Button */}
        <button
          onClick={() => setInspectProduct(null)}
          className="absolute top-4 right-4 z-10 w-8 h-8 rounded-full bg-slate-950/70 hover:bg-slate-950 text-white backdrop-blur-xs flex items-center justify-center transition-all cursor-pointer shadow-xs"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="grid grid-cols-1 md:grid-cols-2">
          {/* Image Side */}
          <div className="bg-slate-100 relative aspect-square md:aspect-auto">
            <img
              src={inspectProduct.imageUrl}
              alt={inspectProduct.name}
              className="w-full h-full object-cover"
            />
            <div className="absolute bottom-3 left-3 bg-slate-950/75 backdrop-blur-xs text-white px-2.5 py-1 rounded-md text-xs font-mono font-medium shadow-xs">
              SKU: {inspectProduct.sku}
            </div>
          </div>

          {/* Details Side */}
          <div className="p-6 flex flex-col justify-between space-y-4">
            <div>
              <div className="flex items-center gap-2 text-xs font-semibold text-amber-700 uppercase tracking-wider mb-1">
                <span>{inspectProduct.species?.replace('_', ' ') || inspectProduct.category}</span>
                {bf > 0 && <span>· {bf} PT</span>}
              </div>

              <h3 className="text-xl font-bold text-slate-900 leading-tight">
                {inspectProduct.name}
              </h3>

              <div className="mt-2 flex items-baseline gap-2">
                <span className="text-2xl font-black text-slate-950 font-mono tracking-tight">
                  {formatLempiras(inspectProduct.pricePerUnit)}
                </span>
                <span className="text-xs text-slate-500 font-medium">
                  por {inspectProduct.unit} (ISV inc.)
                </span>
              </div>

              <p className="text-xs text-slate-600 mt-2 leading-relaxed">
                {inspectProduct.description}
              </p>

              {/* Technical Specifications */}
              {inspectProduct.technicalSpecs && (
                <div className="mt-4 p-3 bg-slate-50 rounded-lg border border-slate-200 text-xs space-y-1.5">
                  <span className="font-semibold text-slate-800 block text-[11px] uppercase tracking-wider flex items-center gap-1">
                    <FileCheck className="w-3.5 h-3.5 text-amber-600" />
                    Ficha Técnica de Material
                  </span>
                  {inspectProduct.technicalSpecs.tratamiento && (
                    <div className="flex justify-between text-slate-600">
                      <span>Tratamiento:</span>
                      <span className="font-medium text-slate-900">{inspectProduct.technicalSpecs.tratamiento}</span>
                    </div>
                  )}
                  {inspectProduct.technicalSpecs.humedad && (
                    <div className="flex justify-between text-slate-600">
                      <span>Humedad:</span>
                      <span className="font-medium text-slate-900">{inspectProduct.technicalSpecs.humedad}</span>
                    </div>
                  )}
                  {inspectProduct.technicalSpecs.calidad && (
                    <div className="flex justify-between text-slate-600">
                      <span>Grado de calidad:</span>
                      <span className="font-medium text-slate-900">{inspectProduct.technicalSpecs.calidad}</span>
                    </div>
                  )}
                  {inspectProduct.technicalSpecs.origen && (
                    <div className="flex justify-between text-slate-600">
                      <span>Procedencia:</span>
                      <span className="font-medium text-slate-900">{inspectProduct.technicalSpecs.origen}</span>
                    </div>
                  )}
                </div>
              )}

              {/* Optional Services */}
              {['madera', 'madera_dimensionada'].includes(inspectProduct.category) && (
                <div className="mt-4 space-y-2">
                  <span className="text-xs font-semibold text-slate-800 block">Servicios de Taller:</span>
                  <div className="space-y-1.5 text-xs">
                    {services.map(s => (
                      <label 
                        key={s.id} 
                        className="flex items-center justify-between p-2 rounded-lg bg-slate-50 border border-slate-200 cursor-pointer hover:bg-slate-100 transition-colors"
                      >
                        <div className="flex items-center gap-2">
                          <input
                            type="checkbox"
                            checked={!!selectedServicesMap[s.id]}
                            onChange={(e) => setSelectedServicesMap(prev => ({ ...prev, [s.id]: e.target.checked }))}
                            className="rounded text-amber-600"
                          />
                          <span className="text-slate-800 font-medium">{s.name}</span>
                        </div>
                        <span className="font-semibold text-amber-700">+{formatLempiras(s.price)}</span>
                      </label>
                    ))}
                  </div>
                </div>
              )}

              {/* Quantity Selector */}
              <div className="mt-4 flex items-center justify-between">
                <span className="text-xs font-medium text-slate-700">Cantidad:</span>
                <div className="flex items-center border border-slate-200 rounded-lg overflow-hidden bg-slate-50">
                  <button
                    onClick={() => setQty(Math.max(1, qty - 1))}
                    className="px-3 py-1 text-slate-700 font-bold hover:bg-slate-200 transition-colors cursor-pointer"
                  >
                    -
                  </button>
                  <span className="px-4 py-1 text-xs font-bold text-slate-900">{qty}</span>
                  <button
                    onClick={() => setQty(qty + 1)}
                    className="px-3 py-1 text-slate-700 font-bold hover:bg-slate-200 transition-colors cursor-pointer"
                  >
                    +
                  </button>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="pt-3 border-t border-slate-200 space-y-2">
              <div className="flex justify-between items-baseline mb-2">
                <span className="text-xs text-slate-500 font-medium">Subtotal:</span>
                <span className="text-lg font-black font-mono text-slate-950">
                  {formatLempiras(totalItemSubtotal)}
                </span>
              </div>

              <button
                type="button"
                onClick={handleAdd}
                className="w-full py-2.5 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs uppercase tracking-tight flex items-center justify-center gap-2 cursor-pointer shadow-xs active:scale-[0.98] transition-all"
              >
                <ShoppingBag className="w-4 h-4" />
                Agregar al Carrito
              </button>

              <button
                type="button"
                onClick={handleWhatsApp}
                className="w-full py-2 rounded-lg border border-emerald-600/30 text-emerald-700 hover:bg-emerald-50 font-medium text-xs flex items-center justify-center gap-1.5 cursor-pointer active:scale-[0.98] transition-all"
              >
                <MessageCircle className="w-4 h-4" />
                Consultar por WhatsApp
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
