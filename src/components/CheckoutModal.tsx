import React, { useState } from 'react';
import { useApp } from '../lib/store';
import { formatLempiras, calculateCartSummary } from '../lib/pricingEngine';
import { CustomerInfo, PaymentMethod, DeliveryMethod } from '../types';
import { 
  X, 
  Check, 
  CreditCard, 
  Building2, 
  Banknote, 
  Truck, 
  Warehouse, 
  ShieldCheck, 
  Lock, 
  Upload, 
  Clock, 
  AlertCircle 
} from 'lucide-react';

export const CheckoutModal: React.FC = () => {
  const { 
    isCheckoutOpen, 
    setIsCheckoutOpen, 
    cart, 
    deliveryMethod, 
    setDeliveryMethod, 
    selectedZone, 
    setSelectedZone,
    deliveryZones,
    pickupTimeSlot,
    setPickupTimeSlot,
    bankAccounts,
    businessConfig,
    createOrder,
    showToast
  } = useApp();

  const [step, setStep] = useState<1 | 2 | 3>(1);

  // Form states
  const [customer, setCustomer] = useState<CustomerInfo>({
    name: '',
    phone: '',
    whatsapp: '',
    email: '',
    idNumber: '',
    companyName: '',
    address: '',
    notes: ''
  });

  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('card');
  const [bankRef, setBankRef] = useState('');
  const [selectedBankId, setSelectedBankId] = useState(bankAccounts[0]?.id || '');
  const [isUploadingProof, setIsUploadingProof] = useState(false);
  const [cardData, setCardData] = useState({
    number: '',
    holder: '',
    expiry: '',
    cvv: ''
  });

  if (!isCheckoutOpen || cart.length === 0) return null;

  const summary = calculateCartSummary(
    cart,
    deliveryMethod === 'delivery' ? selectedZone : null,
    deliveryMethod === 'pickup',
    businessConfig.isvPercent
  );

  const handleNextStep = (e: React.FormEvent) => {
    e.preventDefault();
    if (step === 1) {
      if (!customer.name || !customer.phone) {
        showToast('Por favor completa tu nombre y teléfono para la orden', 'warning');
        return;
      }
      setStep(2);
    } else if (step === 2) {
      if (deliveryMethod === 'delivery' && !customer.address) {
        showToast('Por favor ingresa la dirección de entrega en La Ceiba', 'warning');
        return;
      }
      setStep(3);
    }
  };

  const handleFinalizeOrder = (e: React.FormEvent) => {
    e.preventDefault();

    if (paymentMethod === 'bank_transfer' && !bankRef) {
      showToast('Por favor ingresa la referencia o número de comprobante bancario', 'warning');
      return;
    }

    createOrder(customer, paymentMethod, bankRef);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-xl max-w-3xl w-full border border-slate-200/90 shadow-2xl overflow-hidden my-8 relative text-slate-900">
        {/* Header */}
        <div className="bg-slate-950 text-white p-5 flex items-center justify-between border-b border-slate-800">
          <div>
            <div className="flex items-center gap-1.5 text-xs font-semibold text-amber-400 uppercase tracking-wider">
              <ShieldCheck className="w-4 h-4 text-amber-400" />
              Checkout Seguro · Ferretería & Más
            </div>
            <h3 className="text-lg font-bold mt-0.5 text-white">Finalizar Compra / Retiro de Materiales</h3>
          </div>
          <button
            onClick={() => setIsCheckoutOpen(false)}
            className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800/80 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Step Indicator */}
        <div className="bg-slate-50 px-6 py-3 border-b border-slate-200">
          <div className="flex items-center justify-between max-w-md mx-auto text-xs font-medium">
            <div className={`flex items-center gap-2 ${step >= 1 ? 'text-slate-900 font-semibold' : 'text-slate-400'}`}>
              <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[11px] font-bold ${
                step >= 1 ? 'bg-slate-900 text-white shadow-2xs' : 'bg-slate-200 text-slate-500'
              }`}>
                1
              </span>
              <span>Datos Cliente</span>
            </div>
            <div className="w-8 h-px bg-slate-200" />
            <div className={`flex items-center gap-2 ${step >= 2 ? 'text-slate-900 font-semibold' : 'text-slate-400'}`}>
              <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[11px] font-bold ${
                step >= 2 ? 'bg-slate-900 text-white shadow-2xs' : 'bg-slate-200 text-slate-500'
              }`}>
                2
              </span>
              <span>Entrega / Retiro</span>
            </div>
            <div className="w-8 h-px bg-slate-200" />
            <div className={`flex items-center gap-2 ${step === 3 ? 'text-slate-900 font-semibold' : 'text-slate-400'}`}>
              <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[11px] font-bold ${
                step === 3 ? 'bg-slate-900 text-white shadow-2xs' : 'bg-slate-200 text-slate-500'
              }`}>
                3
              </span>
              <span>Pago & Orden</span>
            </div>
          </div>
        </div>

        {/* Content Body */}
        <div className="p-6">
          {/* STEP 1: CUSTOMER DATA */}
          {step === 1 && (
            <form onSubmit={handleNextStep} className="space-y-4">
              <h4 className="text-xs font-semibold text-slate-700 uppercase tracking-wider">
                1. Información de Contacto y Facturación
              </h4>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">Nombre Completo *</label>
                  <input
                    type="text"
                    required
                    placeholder="Ej. Carlos Mendoza"
                    value={customer.name}
                    onChange={(e) => setCustomer({ ...customer, name: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-sm text-slate-900 focus:ring-1 focus:ring-slate-900 focus:outline-hidden"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">Teléfono Móvil *</label>
                  <input
                    type="tel"
                    required
                    placeholder="Ej. +504 9855-1122"
                    value={customer.phone}
                    onChange={(e) => setCustomer({ ...customer, phone: e.target.value, whatsapp: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-sm text-slate-900 focus:ring-1 focus:ring-slate-900 focus:outline-hidden"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">Correo Electrónico</label>
                  <input
                    type="email"
                    placeholder="cliente@ejemplo.com"
                    value={customer.email}
                    onChange={(e) => setCustomer({ ...customer, email: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-sm text-slate-900 focus:ring-1 focus:ring-slate-900 focus:outline-hidden"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">RTN o DNI (Factura SAR)</label>
                  <input
                    type="text"
                    placeholder="0101-1985-01234"
                    value={customer.idNumber}
                    onChange={(e) => setCustomer({ ...customer, idNumber: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-sm text-slate-900 focus:ring-1 focus:ring-slate-900 focus:outline-hidden"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-xs font-medium text-slate-700 mb-1">Empresa / Proyecto (Opcional)</label>
                  <input
                    type="text"
                    placeholder="Ej. Constructora del Atlántico / Proyecto Casa Playa"
                    value={customer.companyName}
                    onChange={(e) => setCustomer({ ...customer, companyName: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-sm text-slate-900 focus:ring-1 focus:ring-slate-900 focus:outline-hidden"
                  />
                </div>
              </div>

              <div className="flex justify-end pt-4 border-t border-slate-200">
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-white font-semibold text-xs uppercase tracking-tight cursor-pointer shadow-xs active:scale-[0.98] transition-all"
                >
                  Continuar a Entrega →
                </button>
              </div>
            </form>
          )}

          {/* STEP 2: DELIVERY OR PICKUP */}
          {step === 2 && (
            <form onSubmit={handleNextStep} className="space-y-5">
              <h4 className="text-xs font-semibold text-slate-700 uppercase tracking-wider">
                2. Método de Recepción de Materiales
              </h4>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Option: Pickup */}
                <div
                  onClick={() => setDeliveryMethod('pickup')}
                  className={`p-4 rounded-xl border cursor-pointer transition-all ${
                    deliveryMethod === 'pickup'
                      ? 'border-amber-500 bg-amber-50/40 shadow-xs'
                      : 'border-slate-200 hover:border-slate-300 bg-white'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-bold text-slate-900 flex items-center gap-1.5 text-sm">
                      <Warehouse className="w-4 h-4 text-amber-600" />
                      Retiro Exprés en Bodega
                    </span>
                    <span className="text-xs font-bold text-emerald-600 uppercase">¡GRATIS!</span>
                  </div>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    Preparamos tus maderas en bodega (Carretera CA-13 frente a El Sauce). Recibirás un Código QR para cargar rápido tu pickup o camión.
                  </p>
                </div>

                {/* Option: Delivery */}
                <div
                  onClick={() => setDeliveryMethod('delivery')}
                  className={`p-4 rounded-xl border cursor-pointer transition-all ${
                    deliveryMethod === 'delivery'
                      ? 'border-amber-500 bg-amber-50/40 shadow-xs'
                      : 'border-slate-200 hover:border-slate-300 bg-white'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-bold text-slate-900 flex items-center gap-1.5 text-sm">
                      <Truck className="w-4 h-4 text-amber-600" />
                      Entrega en Obra o Domicilio
                    </span>
                    <span className="text-xs font-mono font-medium text-slate-700">
                      Desde L. 150
                    </span>
                  </div>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    Llevamos tus materiales en nuestros camiones de plataforma hasta tu construcción en La Ceiba y municipios vecinos.
                  </p>
                </div>
              </div>

              {/* Pickup Time Selector */}
              {deliveryMethod === 'pickup' && (
                <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-3">
                  <label className="block text-xs font-semibold text-slate-700 flex items-center gap-1.5">
                    <Clock className="w-4 h-4 text-amber-600" />
                    Selecciona horario estimado de retiro en bodega:
                  </label>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs">
                    {[
                      'Hoy entre 11:00 AM y 1:00 PM',
                      'Hoy entre 2:00 PM y 4:30 PM',
                      'Mañana a primera hora (7:30 AM)'
                    ].map((slot) => (
                      <button
                        key={slot}
                        type="button"
                        onClick={() => setPickupTimeSlot(slot)}
                        className={`p-2.5 rounded-lg border text-center transition-all cursor-pointer font-medium active:scale-[0.98] ${
                          pickupTimeSlot === slot
                            ? 'bg-slate-900 text-white border-slate-900 shadow-xs'
                            : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-100'
                        }`}
                      >
                        {slot}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Delivery Zone & Address */}
              {deliveryMethod === 'delivery' && (
                <div className="space-y-4 p-4 bg-slate-50 rounded-xl border border-slate-200">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Zona Logística de La Ceiba:
                    </label>
                    <select
                      value={selectedZone?.id || ''}
                      onChange={(e) => {
                        const z = deliveryZones.find(x => x.id === e.target.value) || null;
                        setSelectedZone(z);
                      }}
                      className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-sm text-slate-900 font-medium focus:ring-1 focus:ring-slate-900 focus:outline-hidden"
                    >
                      {deliveryZones.map(z => (
                        <option key={z.id} value={z.id}>
                          {z.name} ({formatLempiras(z.rate)})
                        </option>
                      ))}
                    </select>
                    <p className="text-[11px] text-slate-500 mt-1">{selectedZone?.description}</p>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Dirección Exacta de Entrega / Referencia en La Ceiba *
                    </label>
                    <textarea
                      required
                      rows={2}
                      placeholder="Ej. Colonia El Toronjil, 2 cuadras arriba del parque infantil, portón negro con rótulo de obra."
                      value={customer.address}
                      onChange={(e) => setCustomer({ ...customer, address: e.target.value })}
                      className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-sm text-slate-900 focus:ring-1 focus:ring-slate-900 focus:outline-hidden"
                    />
                  </div>
                </div>
              )}

              <div className="flex justify-between pt-4 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="px-4 py-2 rounded-lg border border-slate-200 text-slate-700 hover:bg-slate-50 font-medium text-xs cursor-pointer transition-all active:scale-[0.98]"
                >
                  ← Volver
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-white font-semibold text-xs uppercase tracking-tight cursor-pointer shadow-xs active:scale-[0.98] transition-all"
                >
                  Continuar a Método de Pago →
                </button>
              </div>
            </form>
          )}

          {/* STEP 3: PAYMENT METHOD */}
          {step === 3 && (
            <form onSubmit={handleFinalizeOrder} className="space-y-5">
              <h4 className="text-xs font-semibold text-slate-700 uppercase tracking-wider">
                3. Selección de Método de Pago Seguro
              </h4>

              {/* Payment Tabs */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {[
                  { id: 'card', name: 'Tarjeta Débito / Crédito', icon: CreditCard, sub: 'Visa, Mastercard, BAC' },
                  { id: 'bank_transfer', name: 'Transferencia Bancaria', icon: Building2, sub: 'Atlántida, BAC, Ficohsa' },
                  { id: 'cash', name: 'Efectivo en Entrega', icon: Banknote, sub: 'O al retirar en bodega' }
                ].map((m) => {
                  const Icon = m.icon;
                  const isSelected = paymentMethod === m.id;
                  return (
                    <button
                      key={m.id}
                      type="button"
                      onClick={() => setPaymentMethod(m.id as PaymentMethod)}
                      className={`p-3.5 rounded-xl border text-left cursor-pointer transition-all active:scale-[0.98] ${
                        isSelected
                          ? 'border-slate-900 bg-slate-900 text-white shadow-xs'
                          : 'border-slate-200 bg-white text-slate-700 hover:border-slate-300'
                      }`}
                    >
                      <Icon className={`w-5 h-5 mb-1.5 ${isSelected ? 'text-amber-400' : 'text-slate-600'}`} />
                      <div className="font-semibold text-xs">{m.name}</div>
                      <div className={`text-[10px] mt-0.5 ${isSelected ? 'text-slate-300' : 'text-slate-500'}`}>
                        {m.sub}
                      </div>
                    </button>
                  );
                })}
              </div>

              {/* Card Form */}
              {paymentMethod === 'card' && (
                <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-3">
                  <div className="flex items-center gap-2 text-xs font-semibold text-slate-700">
                    <Lock className="w-3.5 h-3.5 text-emerald-600" />
                    Pasarela Bancaria Segura (Encriptación SSL 256-bit)
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-slate-700 mb-1">Número de Tarjeta</label>
                    <input
                      type="text"
                      required
                      maxLength={19}
                      placeholder="4000 1234 5678 9010"
                      value={cardData.number}
                      onChange={(e) => setCardData({ ...cardData, number: e.target.value })}
                      className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-sm font-mono text-slate-900 focus:ring-1 focus:ring-slate-900 focus:outline-hidden"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[11px] font-semibold text-slate-700 mb-1">Vencimiento (MM/AA)</label>
                      <input
                        type="text"
                        required
                        maxLength={5}
                        placeholder="12/28"
                        value={cardData.expiry}
                        onChange={(e) => setCardData({ ...cardData, expiry: e.target.value })}
                        className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-sm font-mono text-slate-900 focus:ring-1 focus:ring-slate-900 focus:outline-hidden"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-semibold text-slate-700 mb-1">Código CVV</label>
                      <input
                        type="password"
                        required
                        maxLength={4}
                        placeholder="123"
                        value={cardData.cvv}
                        onChange={(e) => setCardData({ ...cardData, cvv: e.target.value })}
                        className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-sm font-mono text-slate-900 focus:ring-1 focus:ring-slate-900 focus:outline-hidden"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Bank Transfer Details */}
              {paymentMethod === 'bank_transfer' && (
                <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-4">
                  <div className="text-xs font-semibold text-slate-800">
                    Cuentas Bancarias Oficiales de Ferretería & Más:
                  </div>

                  <div className="space-y-2">
                    {bankAccounts.map((b) => (
                      <div
                        key={b.id}
                        onClick={() => setSelectedBankId(b.id)}
                        className={`p-3 rounded-lg border cursor-pointer flex items-center justify-between transition-colors ${
                          selectedBankId === b.id
                            ? 'bg-white border-amber-600 shadow-xs'
                            : 'bg-white/60 border-slate-200 hover:bg-white'
                        }`}
                      >
                        <div>
                          <span className="font-bold text-slate-900 text-xs flex items-center gap-1.5">
                            <span>{b.logo}</span>
                            {b.bankName}
                          </span>
                          <span className="text-[11px] font-mono text-slate-600 block mt-0.5">
                            Cuenta: <strong>{b.accountNumber}</strong> ({b.accountType})
                          </span>
                          <span className="text-[10px] text-slate-500 block">
                            Titular: {b.beneficiary} | RTN: {b.rtn}
                          </span>
                        </div>
                        {selectedBankId === b.id && <Check className="w-4 h-4 text-amber-600" />}
                      </div>
                    ))}
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Número de Referencia Bancaria o Transacción *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="Ej. ATL-1092834 o BAC-88219"
                      value={bankRef}
                      onChange={(e) => setBankRef(e.target.value)}
                      className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-sm font-mono text-slate-900 focus:ring-1 focus:ring-slate-900 focus:outline-hidden"
                    />
                    <p className="text-[11px] text-slate-500 mt-1">
                      También puedes enviar la foto de tu comprobante a nuestro WhatsApp después de confirmar.
                    </p>
                  </div>
                </div>
              )}

              {/* Cash details */}
              {paymentMethod === 'cash' && (
                <div className="p-4 bg-amber-50/60 rounded-xl border border-amber-200/80 text-xs text-amber-900 space-y-1">
                  <div className="font-semibold flex items-center gap-1">
                    <AlertCircle className="w-4 h-4 text-amber-600" />
                    Pago en Efectivo o Cheque de Caja:
                  </div>
                  <p className="text-amber-800 leading-relaxed">
                    {deliveryMethod === 'pickup'
                      ? 'Pagas directamente en caja de bodega en La Ceiba al momento de retirar tus materiales.'
                      : 'Pagas al motorista contra entrega en tu obra. Favor tener el monto exacto en Lempiras.'}
                  </p>
                </div>
              )}

              {/* Order Final Summary */}
              <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 text-xs space-y-1.5">
                <div className="flex justify-between text-slate-600">
                  <span>Partidas de Material:</span>
                  <span className="font-semibold text-slate-800">{cart.length} productos</span>
                </div>
                <div className="flex justify-between text-slate-600">
                  <span>Modalidad:</span>
                  <span className="font-semibold text-slate-800">
                    {deliveryMethod === 'pickup' ? `Retiro en Bodega (${pickupTimeSlot})` : `Flete a Domicilio (${selectedZone?.name})`}
                  </span>
                </div>
                <div className="flex justify-between text-slate-500">
                  <span>ISV 15%:</span>
                  <span className="font-mono">{formatLempiras(summary.tax)}</span>
                </div>
                <div className="flex justify-between text-slate-500">
                  <span>Flete:</span>
                  <span className="font-mono">{summary.shippingFee === 0 ? 'L. 0.00' : formatLempiras(summary.shippingFee)}</span>
                </div>
                <div className="pt-2 border-t border-slate-200 flex justify-between items-baseline">
                  <span className="text-xs uppercase tracking-wider font-bold text-slate-700">Total a Pagar (L.):</span>
                  <span className="text-xl font-black font-mono text-slate-950 tracking-tight">
                    {formatLempiras(summary.total)}
                  </span>
                </div>
              </div>

              {/* Final Buttons */}
              <div className="flex justify-between pt-4 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => setStep(2)}
                  className="px-4 py-2 rounded-lg border border-slate-200 text-slate-700 hover:bg-slate-50 font-medium text-xs cursor-pointer transition-all active:scale-[0.98]"
                >
                  ← Volver
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs uppercase tracking-tight cursor-pointer shadow-xs active:scale-[0.98] transition-all"
                >
                  Confirmar y Generar Orden
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
