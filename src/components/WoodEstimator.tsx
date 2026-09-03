import React, { useState, useMemo } from 'react';
import { useApp } from '../lib/store';
import { WoodSpecies, WoodDimension, SelectedServiceItem, Product } from '../types';
import { calculateBoardFeet, formatLempiras, buildWhatsAppMessage } from '../lib/pricingEngine';
import { 
  Calculator, 
  Check, 
  Layers, 
  Scissors, 
  ShieldCheck, 
  ShoppingBag, 
  FileText, 
  MessageCircle, 
  Sparkles, 
  Info,
  Clock,
  Warehouse
} from 'lucide-react';

interface PresetDimension {
  thickness: number;
  width: number;
  length: number;
  label: string;
  category: string;
}

const COMMON_PRESETS: PresetDimension[] = [
  { thickness: 2, width: 4, length: 10, label: '2" x 4" x 10\'', category: 'Regla / Clavador' },
  { thickness: 2, width: 4, length: 12, label: '2" x 4" x 12\'', category: 'Estructural estándar' },
  { thickness: 2, width: 4, length: 16, label: '2" x 4" x 16\'', category: 'Largo especial' },
  { thickness: 2, width: 6, length: 12, label: '2" x 6" x 12\'', category: 'Viga de techo' },
  { thickness: 2, width: 8, length: 14, label: '2" x 8" x 14\'', category: 'Viga maestra' },
  { thickness: 1, width: 12, length: 10, label: '1" x 12" x 10\'', category: 'Tabla ancha' },
  { thickness: 4, width: 4, length: 10, label: '4" x 4" x 10\'', category: 'Columna / Poste' },
  { thickness: 1, width: 4, length: 10, label: '1" x 4" x 10\'', category: 'Listón / Fachada' }
];

export const WoodEstimator: React.FC = () => {
  const { 
    products, 
    services, 
    addToCart, 
    setIsCartOpen, 
    businessConfig, 
    selectedZone,
    deliveryMethod,
    createQuote,
    showToast
  } = useApp();

  // Step 1: Species
  const [selectedSpecies, setSelectedSpecies] = useState<WoodSpecies>('pino_tratado');

  // Step 2: Dimension mode & values
  const [useCustomDim, setUseCustomDim] = useState(false);
  const [selectedPresetIndex, setSelectedPresetIndex] = useState(1); // default 2" x 4" x 12'
  const [customThickness, setCustomThickness] = useState<number>(2);
  const [customWidth, setCustomWidth] = useState<number>(4);
  const [customLength, setCustomLength] = useState<number>(12);

  // Step 3: Quantity
  const [quantity, setQuantity] = useState<number>(20);

  // Step 4: Services
  const [selectedServicesMap, setSelectedServicesMap] = useState<Record<string, boolean>>({
    srv_corte: false,
    srv_cepillado: false,
    srv_tratamiento: false
  });

  // Client quick info for instant quote
  const [showQuoteQuickModal, setShowQuoteQuickModal] = useState(false);
  const [quoteClientName, setQuoteClientName] = useState('');
  const [quoteClientPhone, setQuoteClientPhone] = useState('');

  // Active Dimensions
  const activeDimension: WoodDimension = useMemo(() => {
    if (!useCustomDim) {
      const p = COMMON_PRESETS[selectedPresetIndex];
      return {
        thicknessInches: p.thickness,
        widthInches: p.width,
        lengthFeet: p.length,
        label: p.label
      };
    }
    return {
      thicknessInches: customThickness,
      widthInches: customWidth,
      lengthFeet: customLength,
      label: `${customThickness}" x ${customWidth}" x ${customLength}'`
    };
  }, [useCustomDim, selectedPresetIndex, customThickness, customWidth, customLength]);

  // Find matching or closest product in inventory for pricing & stock
  const matchingProduct: Product = useMemo(() => {
    const bySpecies = products.filter(p => p.species === selectedSpecies);
    const exact = bySpecies.find(p => 
      p.dimensions?.thicknessInches === activeDimension.thicknessInches &&
      p.dimensions?.widthInches === activeDimension.widthInches &&
      p.dimensions?.lengthFeet === activeDimension.lengthFeet
    );

    if (exact) return exact;

    // Fallback: use first species product and rate by board feet
    const fallback = bySpecies[0] || products[0];
    return fallback;
  }, [products, selectedSpecies, activeDimension]);

  // Board feet calculation
  const singlePieceBoardFeet = useMemo(() => {
    return calculateBoardFeet(
      activeDimension.thicknessInches,
      activeDimension.widthInches,
      activeDimension.lengthFeet
    );
  }, [activeDimension]);

  const totalBoardFeet = useMemo(() => {
    return Math.round(singlePieceBoardFeet * quantity * 100) / 100;
  }, [singlePieceBoardFeet, quantity]);

  // Base price per piece
  const unitPrice = useMemo(() => {
    if (matchingProduct.dimensions?.label === activeDimension.label) {
      return matchingProduct.pricePerUnit;
    }
    // Calculate via board foot rate
    const bfRate = matchingProduct.pricePerBoardFoot || 28.50;
    return Math.round(singlePieceBoardFeet * bfRate * 100) / 100;
  }, [matchingProduct, activeDimension, singlePieceBoardFeet]);

  // Additional services cost
  const selectedServicesList: SelectedServiceItem[] = useMemo(() => {
    return services
      .filter(s => selectedServicesMap[s.id])
      .map(s => ({
        serviceId: s.id,
        serviceName: s.name,
        price: s.price,
        quantity: quantity // applied per piece
      }));
  }, [services, selectedServicesMap, quantity]);

  const servicesTotalCost = useMemo(() => {
    return selectedServicesList.reduce((sum, s) => sum + s.price * s.quantity, 0);
  }, [selectedServicesList]);

  // Financial totals
  const subtotalProducts = unitPrice * quantity;
  const subtotalBeforeTax = subtotalProducts + servicesTotalCost;
  const tax = Math.round((subtotalBeforeTax * (businessConfig.isvPercent / 100)) * 100) / 100;
  const estimatedShipping = deliveryMethod === 'pickup' 
    ? 0 
    : (selectedZone && subtotalBeforeTax >= selectedZone.freeShippingThreshold ? 0 : (selectedZone?.rate || 150));
  const grandTotal = subtotalBeforeTax + tax + estimatedShipping;

  const handleAddToCart = () => {
    addToCart(matchingProduct, quantity, activeDimension, selectedServicesList);
    setIsCartOpen(true);
  };

  const handleCreateDirectQuote = (e: React.FormEvent) => {
    e.preventDefault();
    if (!quoteClientName || !quoteClientPhone) {
      showToast('Ingresa tu nombre y teléfono para la cotización', 'warning');
      return;
    }

    addToCart(matchingProduct, quantity, activeDimension, selectedServicesList);
    createQuote({
      name: quoteClientName,
      phone: quoteClientPhone,
      whatsapp: quoteClientPhone,
      email: ''
    });

    setShowQuoteQuickModal(false);
  };

  const handleSendWhatsAppConsultation = () => {
    const rawMsg = buildWhatsAppMessage(
      'COT-TEMP-' + Math.floor(1000 + Math.random() * 9000),
      'cotizacion',
      'Cliente Web',
      [
        {
          id: 'temp',
          productId: matchingProduct.id,
          product: matchingProduct,
          quantity,
          customDimensions: activeDimension,
          selectedServices: selectedServicesList,
          unitPrice,
          subtotal: subtotalBeforeTax
        }
      ],
      grandTotal,
      deliveryMethod,
      selectedZone?.name
    );

    const waUrl = `https://wa.me/${businessConfig.whatsapp.replace(/[^0-9]/g, '')}?text=${rawMsg}`;
    window.open(waUrl, '_blank');
  };

  return (
    <section id="cotizador" className="py-12 bg-slate-900 text-slate-100 relative border-y border-slate-800/80">
      <div className="max-w-7xl mx-auto px-4">
        {/* Header Title */}
        <div className="mb-8">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-800/90 border border-slate-700/80 text-amber-400 text-xs font-semibold uppercase tracking-wider mb-2 shadow-xs">
            <Calculator className="w-3.5 h-3.5" />
            Módulo Técnico de Cotización
          </div>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black text-white tracking-tight">
            Cotizador Profesional de Madera
          </h2>
          <p className="text-sm sm:text-base text-slate-400 max-w-3xl mt-1">
            Calcula pies tablares, precios unitarios, servicios de corte/cepillado e impuestos en tiempo real para proyectos en La Ceiba y Atlántida.
          </p>
        </div>

        {/* Two-Column Grid: Configurator on Left, Live Financial Spec on Right */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Left Column: 4 Steps Configurator (8 Cols) */}
          <div className="lg:col-span-7 xl:col-span-8 space-y-5">
            {/* PASO 1: ESPECIE DE MADERA */}
            <div className="bg-slate-950/80 border border-slate-800/90 rounded-xl p-5 shadow-xs backdrop-blur-xs">
              <div className="flex items-center justify-between mb-4">
                <span className="text-xs font-bold text-amber-400 uppercase tracking-wider flex items-center gap-2">
                  <span className="w-5 h-5 rounded-full bg-amber-500 text-slate-950 flex items-center justify-center font-bold text-[11px]">1</span>
                  Seleccionar Especie de Madera
                </span>
                <span className="text-xs text-slate-400 font-medium">Tratamiento & Usos</span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {[
                  {
                    id: 'pino_tratado',
                    name: 'Pino Tratado CCA',
                    tag: 'Exteriores / Techos',
                    desc: 'Resistente a termitas y salitre'
                  },
                  {
                    id: 'pino_nacional',
                    name: 'Pino Nacional',
                    tag: 'Económico / Estructura',
                    desc: 'Seco al horno de primera'
                  },
                  {
                    id: 'cedro',
                    name: 'Cedro Real',
                    tag: 'Ebanistería de Lujo',
                    desc: 'Repelente natural nativo'
                  },
                  {
                    id: 'laurel',
                    name: 'Laurel Macho',
                    tag: 'Viga Pesada',
                    desc: 'Alta resistencia mecánica'
                  }
                ].map((wood) => {
                  const isSelected = selectedSpecies === wood.id;
                  return (
                    <button
                      key={wood.id}
                      type="button"
                      onClick={() => setSelectedSpecies(wood.id as WoodSpecies)}
                      className={`relative text-left p-3.5 rounded-xl border transition-all cursor-pointer overflow-hidden group ${
                        isSelected 
                          ? 'border-amber-500 bg-amber-500/10 ring-1 ring-amber-500/50 text-white' 
                          : 'border-slate-800 bg-slate-900/60 hover:border-slate-700 hover:bg-slate-900/90'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-1">
                        <span className={`text-xs font-semibold ${isSelected ? 'text-amber-400' : 'text-slate-200'}`}>
                          {wood.name}
                        </span>
                        {isSelected && <Check className="w-3.5 h-3.5 text-amber-400" />}
                      </div>
                      <span className="block text-[10px] font-semibold text-amber-500/90">{wood.tag}</span>
                      <p className="text-[11px] text-slate-400 mt-1 leading-tight">{wood.desc}</p>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* PASO 2: DIMENSIONES */}
            <div className="bg-slate-950/80 border border-slate-800/90 rounded-xl p-5 shadow-xs backdrop-blur-xs">
              <div className="flex flex-wrap items-center justify-between gap-2 mb-4">
                <span className="text-xs font-bold text-amber-400 uppercase tracking-wider flex items-center gap-2">
                  <span className="w-5 h-5 rounded-full bg-amber-500 text-slate-950 flex items-center justify-center font-bold text-[11px]">2</span>
                  Dimensiones de la Pieza (Grosor × Ancho × Largo)
                </span>
                <div className="flex items-center gap-1 bg-slate-900 p-0.5 rounded-lg border border-slate-800 text-xs">
                  <button
                    type="button"
                    onClick={() => setUseCustomDim(false)}
                    className={`px-2.5 py-1 rounded-md font-medium cursor-pointer transition-all ${
                      !useCustomDim ? 'bg-amber-500 text-slate-950 font-semibold shadow-xs' : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    Medidas Comerciales
                  </button>
                  <button
                    type="button"
                    onClick={() => setUseCustomDim(true)}
                    className={`px-2.5 py-1 rounded-md font-medium cursor-pointer transition-all ${
                      useCustomDim ? 'bg-amber-500 text-slate-950 font-semibold shadow-xs' : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    Medida Exacta
                  </button>
                </div>
              </div>

              {!useCustomDim ? (
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                  {COMMON_PRESETS.map((preset, idx) => {
                    const isSelected = selectedPresetIndex === idx;
                    const bf = calculateBoardFeet(preset.thickness, preset.width, preset.length);
                    return (
                      <button
                        key={preset.label}
                        type="button"
                        onClick={() => setSelectedPresetIndex(idx)}
                        className={`p-3 rounded-lg border text-left cursor-pointer transition-all ${
                          isSelected 
                            ? 'bg-amber-500/10 border-amber-500 text-white ring-1 ring-amber-500/50' 
                            : 'bg-slate-900/60 border-slate-800 text-slate-300 hover:border-slate-700 hover:bg-slate-900/90'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-bold tracking-tight">{preset.label}</span>
                          {isSelected && <Check className="w-3.5 h-3.5 text-amber-400" />}
                        </div>
                        <div className="flex items-center justify-between text-[10px] text-slate-400 mt-1">
                          <span>{preset.category}</span>
                          <span className="font-mono text-amber-400 font-semibold">{bf} PT</span>
                        </div>
                      </button>
                    );
                  })}
                </div>
              ) : (
                <div className="p-4 bg-slate-900/70 rounded-xl border border-slate-800 space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                        Grosor (Pulgadas)
                      </label>
                      <select
                        value={customThickness}
                        onChange={(e) => setCustomThickness(parseFloat(e.target.value))}
                        className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white text-xs font-medium focus:ring-2 focus:ring-amber-500"
                      >
                        <option value={0.75}>3/4" (0.75 pulgada)</option>
                        <option value={1}>1" pulgada</option>
                        <option value={1.5}>1-1/2" (1.5 pulgadas)</option>
                        <option value={2}>2" pulgadas</option>
                        <option value={3}>3" pulgadas</option>
                        <option value={4}>4" pulgadas</option>
                        <option value={6}>6" pulgadas</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                        Ancho (Pulgadas)
                      </label>
                      <select
                        value={customWidth}
                        onChange={(e) => setCustomWidth(parseFloat(e.target.value))}
                        className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white text-xs font-medium focus:ring-2 focus:ring-amber-500"
                      >
                        <option value={2}>2" pulgadas</option>
                        <option value={3}>3" pulgadas</option>
                        <option value={4}>4" pulgadas</option>
                        <option value={6}>6" pulgadas</option>
                        <option value={8}>8" pulgadas</option>
                        <option value={10}>10" pulgadas</option>
                        <option value={12}>12" pulgadas</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                        Largo (Pies)
                      </label>
                      <select
                        value={customLength}
                        onChange={(e) => setCustomLength(parseFloat(e.target.value))}
                        className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white text-xs font-medium focus:ring-2 focus:ring-amber-500"
                      >
                        <option value={8}>8 pies (2.44 m)</option>
                        <option value={10}>10 pies (3.05 m)</option>
                        <option value={12}>12 pies (3.66 m)</option>
                        <option value={14}>14 pies (4.27 m)</option>
                        <option value={16}>16 pies (4.88 m)</option>
                        <option value={20}>20 pies (6.10 m)</option>
                      </select>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 text-xs text-amber-400 font-medium">
                    <Info className="w-4 h-4 text-amber-400 shrink-0" />
                    <span>
                      Medida seleccionada: <strong>{activeDimension.label}</strong> = <strong>{singlePieceBoardFeet} pies tablares</strong> por pieza.
                    </span>
                  </div>
                </div>
              )}
            </div>

            {/* PASO 3: CANTIDAD */}
            <div className="bg-slate-950/80 border border-slate-800/90 rounded-xl p-5 shadow-xs backdrop-blur-xs">
              <div className="flex items-center justify-between mb-4">
                <span className="text-xs font-bold text-amber-400 uppercase tracking-wider flex items-center gap-2">
                  <span className="w-5 h-5 rounded-full bg-amber-500 text-slate-950 flex items-center justify-center font-bold text-[11px]">3</span>
                  Cantidad de Piezas
                </span>
                <span className="text-xs text-slate-400">Total: <strong className="text-white">{totalBoardFeet}</strong> Pies Tablares</span>
              </div>

              <div className="flex flex-wrap items-center gap-4">
                <div className="flex items-center border border-slate-800 rounded-lg bg-slate-900 overflow-hidden shadow-xs">
                  <button
                    type="button"
                    onClick={() => setQuantity(Math.max(1, quantity - 5))}
                    className="px-4 py-2 text-slate-300 hover:text-white hover:bg-slate-800 font-black text-base transition-colors cursor-pointer"
                  >
                    -
                  </button>
                  <input
                    type="number"
                    min="1"
                    max="1000"
                    value={quantity}
                    onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                    className="w-16 text-center bg-transparent text-white font-bold text-sm focus:outline-hidden"
                  />
                  <button
                    type="button"
                    onClick={() => setQuantity(quantity + 5)}
                    className="px-4 py-2 text-slate-300 hover:text-white hover:bg-slate-800 font-black text-base transition-colors cursor-pointer"
                  >
                    +
                  </button>
                </div>

                {/* Quick Presets for Contractors */}
                <div className="flex items-center gap-1.5 flex-wrap">
                  {[10, 25, 50, 100, 200].map((presetQty) => (
                    <button
                      key={presetQty}
                      type="button"
                      onClick={() => setQuantity(presetQty)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-semibold cursor-pointer transition-all active:scale-[0.98] ${
                        quantity === presetQty 
                          ? 'bg-amber-500 text-slate-950 shadow-xs' 
                          : 'bg-slate-900 border border-slate-800 text-slate-300 hover:bg-slate-800'
                      }`}
                    >
                      {presetQty} pcs
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* PASO 4: SERVICIOS ADICIONALES */}
            <div className="bg-slate-950/80 border border-slate-800/90 rounded-xl p-5 shadow-xs backdrop-blur-xs">
              <div className="flex items-center justify-between mb-4">
                <span className="text-xs font-bold text-amber-400 uppercase tracking-wider flex items-center gap-2">
                  <span className="w-5 h-5 rounded-full bg-amber-500 text-slate-950 flex items-center justify-center font-bold text-[11px]">4</span>
                  Servicios de Taller & Procesamiento (Opcional)
                </span>
                <span className="text-xs text-slate-400">Preparación en bodega</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {services.map((srv) => {
                  const isChecked = !!selectedServicesMap[srv.id];
                  return (
                    <div
                      key={srv.id}
                      onClick={() => setSelectedServicesMap(prev => ({ ...prev, [srv.id]: !prev[srv.id] }))}
                      className={`p-3.5 rounded-xl border cursor-pointer transition-all ${
                        isChecked 
                          ? 'border-amber-500 bg-amber-500/10 text-white' 
                          : 'border-slate-800 bg-slate-900/60 text-slate-300 hover:border-slate-700'
                      }`}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex items-center gap-2">
                          <input
                            type="checkbox"
                            checked={isChecked}
                            onChange={() => {}} // handled by parent div
                            className="w-4 h-4 rounded text-amber-500 bg-slate-800 border-slate-700 focus:ring-amber-500"
                          />
                          <span className="text-xs font-semibold text-white">{srv.name}</span>
                        </div>
                      </div>
                      <p className="text-[11px] text-slate-400 mt-1 pl-6 leading-tight">{srv.description}</p>
                      <div className="mt-2 pl-6 text-xs font-bold text-amber-400">
                        +{formatLempiras(srv.price)} <span className="text-[10px] text-slate-400 font-normal">/{srv.unit}</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Right Column: Dynamic Price Sheet & Action Dock (4 Cols) */}
          <div className="lg:col-span-5 xl:col-span-4 sticky top-24 space-y-4">
            <div className="bg-slate-950 border border-slate-800 rounded-xl p-5 shadow-sm space-y-5">
              {/* Header Badge */}
              <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                <div>
                  <span className="text-xs font-bold uppercase tracking-wider text-amber-400 flex items-center gap-1">
                    <Sparkles className="w-3.5 h-3.5" />
                    Desglose Técnico
                  </span>
                  <h3 className="text-base font-bold text-white mt-0.5">{activeDimension.label}</h3>
                </div>
                <div className="text-right">
                  <span className="text-[10px] font-mono text-slate-400 block uppercase">Stock</span>
                  <span className={`inline-flex items-center gap-1 text-[11px] font-bold px-2 py-0.5 rounded-md ${
                    matchingProduct.stock > matchingProduct.minStock 
                      ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30' 
                      : 'bg-amber-500/15 text-amber-400 border border-amber-500/30'
                  }`}>
                    <Warehouse className="w-3 h-3" />
                    {matchingProduct.stock} disp.
                  </span>
                </div>
              </div>

              {/* Technical Specifications Specs Summary */}
              <div className="bg-slate-900/80 rounded-lg p-3 border border-slate-800 text-xs space-y-2">
                <div className="flex justify-between text-slate-300">
                  <span className="text-slate-400">Especie:</span>
                  <span className="font-semibold text-amber-400 uppercase">{selectedSpecies.replace('_', ' ')}</span>
                </div>
                <div className="flex justify-between text-slate-300">
                  <span className="text-slate-400">Medida:</span>
                  <span className="font-mono font-medium text-white">{activeDimension.label}</span>
                </div>
                <div className="flex justify-between text-slate-300">
                  <span className="text-slate-400">Pie Tablar por pieza:</span>
                  <span className="font-mono text-slate-200">{singlePieceBoardFeet} PT</span>
                </div>
                <div className="flex justify-between text-slate-300">
                  <span className="text-slate-400">Volumen total ({quantity} pcs):</span>
                  <span className="font-mono font-bold text-amber-400">{totalBoardFeet} PT</span>
                </div>
              </div>

              {/* Itemized Financial Calculation */}
              <div className="space-y-2 text-xs pt-1">
                <div className="flex justify-between text-slate-300">
                  <span>Precio unitario pieza:</span>
                  <span className="font-mono font-medium text-white">{formatLempiras(unitPrice)}</span>
                </div>
                <div className="flex justify-between text-slate-300">
                  <span>Subtotal madera ({quantity} pcs):</span>
                  <span className="font-mono font-medium text-white">{formatLempiras(subtotalProducts)}</span>
                </div>

                {servicesTotalCost > 0 && (
                  <div className="flex justify-between text-amber-400 font-medium">
                    <span>Servicios de taller ({selectedServicesList.length}):</span>
                    <span className="font-mono font-bold">+{formatLempiras(servicesTotalCost)}</span>
                  </div>
                )}

                <div className="flex justify-between text-slate-400">
                  <span>Impuesto Sobre Ventas (ISV 15%):</span>
                  <span className="font-mono">{formatLempiras(tax)}</span>
                </div>

                <div className="flex justify-between text-slate-400">
                  <span>Flete ({deliveryMethod === 'pickup' ? 'Retiro en Bodega' : selectedZone?.name || 'La Ceiba'}):</span>
                  <span className="font-mono text-emerald-400">
                    {estimatedShipping === 0 ? '¡GRATIS!' : formatLempiras(estimatedShipping)}
                  </span>
                </div>

                <div className="pt-3 border-t border-slate-800 flex justify-between items-baseline">
                  <div>
                    <span className="text-xs font-bold uppercase tracking-wider text-slate-400 block">
                      Total Estimado (L.):
                    </span>
                    <span className="text-[10px] text-amber-400 font-normal">Incluye ISV 15% y flete</span>
                  </div>
                  <span className="text-2xl font-black text-amber-400 font-mono tracking-tight">
                    {formatLempiras(grandTotal)}
                  </span>
                </div>
              </div>

              {/* Conversion Buttons */}
              <div className="space-y-2 pt-2">
                <button
                  type="button"
                  onClick={handleAddToCart}
                  className="w-full py-2.5 px-4 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs uppercase tracking-tight flex items-center justify-center gap-2 shadow-xs cursor-pointer transition-all active:scale-[0.98]"
                >
                  <ShoppingBag className="w-4 h-4" />
                  Agregar al Carrito de Compra
                </button>

                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setShowQuoteQuickModal(true)}
                    className="py-2 px-3 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-200 text-xs font-semibold flex items-center justify-center gap-1.5 cursor-pointer transition-all active:scale-[0.98]"
                  >
                    <FileText className="w-3.5 h-3.5 text-amber-400" />
                    Cotización Formal
                  </button>

                  <button
                    type="button"
                    onClick={handleSendWhatsAppConsultation}
                    className="py-2 px-3 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold flex items-center justify-center gap-1.5 cursor-pointer transition-all active:scale-[0.98]"
                  >
                    <MessageCircle className="w-3.5 h-3.5" />
                    Vía WhatsApp
                  </button>
                </div>
              </div>

              {/* Trust Badge */}
              <div className="pt-2 text-center">
                <span className="text-[10px] text-slate-400 flex items-center justify-center gap-1">
                  <ShieldCheck className="w-3 h-3 text-amber-400" />
                  Precios sujetos a confirmación física de inventario
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Quote Generation Dialog */}
      {showQuoteQuickModal && (
        <div className="fixed inset-0 z-50 bg-black/70 flex items-center justify-center p-4 backdrop-blur-xs">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl max-w-md w-full p-6 text-slate-100 shadow-2xl relative">
            <h3 className="text-xl font-bold text-white mb-1 flex items-center gap-2">
              <FileText className="w-5 h-5 text-amber-400" />
              Generar Folio de Cotización Oficial
            </h3>
            <p className="text-xs text-slate-400 mb-4">
              Te generaremos un folio único (ej. COT-2026-XXXX) con validez de 15 días, imprimible y compartible.
            </p>

            <form onSubmit={handleCreateDirectQuote} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">Nombre o Empresa *</label>
                <input
                  type="text"
                  required
                  placeholder="Ej. Ing. Mario Paz / Constructora"
                  value={quoteClientName}
                  onChange={(e) => setQuoteClientName(e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white focus:ring-2 focus:ring-amber-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">Teléfono o WhatsApp *</label>
                <input
                  type="tel"
                  required
                  placeholder="Ej. +504 9855-1122"
                  value={quoteClientPhone}
                  onChange={(e) => setQuoteClientPhone(e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white focus:ring-2 focus:ring-amber-500"
                />
              </div>

              <div className="p-3 bg-slate-800/80 rounded-lg text-xs space-y-1 text-slate-300 border border-slate-700">
                <div className="flex justify-between">
                  <span>Material:</span>
                  <span className="font-bold text-white">{quantity}x {activeDimension.label} ({selectedSpecies})</span>
                </div>
                <div className="flex justify-between">
                  <span>Total con ISV 15%:</span>
                  <span className="font-mono font-bold text-amber-400">{formatLempiras(grandTotal)}</span>
                </div>
              </div>

              <div className="flex items-center gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowQuoteQuickModal(false)}
                  className="flex-1 py-2.5 rounded-lg border border-slate-700 hover:bg-slate-800 text-slate-300 text-xs font-bold cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-black uppercase tracking-wider cursor-pointer"
                >
                  Generar Folio
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </section>
  );
};
