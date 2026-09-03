import React, { useState } from 'react';
import { useApp } from '../lib/store';
import { formatLempiras } from '../lib/pricingEngine';
import { 
  Building2, 
  Home, 
  Layers, 
  ShieldAlert, 
  Check, 
  ShoppingBag, 
  ArrowRight,
  HelpCircle
} from 'lucide-react';

type ProjectType = 'pergola' | 'techo' | 'deck' | 'cerca';

export const ProjectCalculator: React.FC = () => {
  const { products, addToCart, setIsCartOpen, showToast } = useApp();

  const [projectType, setProjectType] = useState<ProjectType>('pergola');
  const [lengthMeters, setLengthMeters] = useState<number>(4); // Largo en metros
  const [widthMeters, setWidthMeters] = useState<number>(3);  // Ancho en metros
  const [spacingCm, setSpacingCm] = useState<number>(50);     // Separación en cm

  // Calculate bill of materials based on project type
  const areaSqMeters = lengthMeters * widthMeters;

  // Estimation formulas
  const estimation = React.useMemo(() => {
    if (projectType === 'pergola') {
      // 4 to 6 Posts 4x4
      const postsCount = lengthMeters > 5 || widthMeters > 4 ? 6 : 4;
      // 2 main beams 2x6 along the length (converted to 12ft or 16ft)
      const mainBeamsCount = Math.ceil(lengthMeters / 3.66) * 2;
      // Cross rafters 2x4 spaced at spacingCm
      const raftersCount = Math.ceil((lengthMeters * 100) / spacingCm) + 1;
      const screwBoxes = Math.ceil(raftersCount * 4 / 250) || 1;

      return {
        description: `Pérgola exterior de ${lengthMeters}m × ${widthMeters}m (${areaSqMeters.toFixed(1)} m²)`,
        items: [
          {
            name: 'Postes Pino Tratado 4" x 4" x 10\'',
            qty: postsCount,
            unitPrice: 380,
            sku: 'MAD-PIN-4410',
            spec: 'Columnas estructurales ancladas'
          },
          {
            name: 'Vigas Maestras Pino Tratado CCA 2" x 6" x 12\'',
            qty: mainBeamsCount,
            unitPrice: 342,
            sku: 'MAD-PIN-2612',
            spec: 'Vigas longitudinales de soporte'
          },
          {
            name: 'Viguetas Pino Tratado 2" x 4" x 12\'',
            qty: raftersCount,
            unitPrice: 228,
            sku: 'MAD-PIN-2412',
            spec: `Separadas a ${spacingCm} cm para sombra uniforme`
          },
          {
            name: 'Tornillo para Madera Exterior C-3 2-1/2" (Caja 250 pcs)',
            qty: screwBoxes,
            unitPrice: 340,
            sku: 'FER-TOR-DECK',
            spec: 'Fijación anticorrosiva marina'
          }
        ]
      };
    } else if (projectType === 'techo') {
      // Rafters 2x4 or 2x6 every 60cm
      const rafters = Math.ceil((lengthMeters * 100) / 60) * 2;
      // Purlins / Clavadores 2x2 or 2x4 every 80cm
      const purlins = Math.ceil((widthMeters * 100) / 80) * 2;
      const nails = Math.ceil((rafters + purlins) * 6 / 150) || 2;

      return {
        description: `Estructura de techo a 2 aguas de ${lengthMeters}m × ${widthMeters}m (${areaSqMeters.toFixed(1)} m²)`,
        items: [
          {
            name: 'Vigas / Cabios Pino Tratado CCA 2" x 4" x 12\'',
            qty: rafters,
            unitPrice: 228,
            sku: 'MAD-PIN-2412',
            spec: 'Estructura principal de pendiente'
          },
          {
            name: 'Costaneras / Clavadores Pino 2" x 4" x 10\'',
            qty: purlins,
            unitPrice: 190,
            sku: 'MAD-PIN-2410',
            spec: 'Base para lámina de zinc o teja'
          },
          {
            name: 'Clavos con Cabeza para Madera 3" (Bolsa 5 lbs)',
            qty: nails,
            unitPrice: 125,
            sku: 'FER-CLA-3P',
            spec: 'Ensamble de armadura'
          }
        ]
      };
    } else if (projectType === 'deck') {
      // Floor boards 1x6 (14cm wide)
      const boardsCount = Math.ceil((widthMeters * 100) / 14);
      // Base joists 2x6 every 40cm
      const joistsCount = Math.ceil((lengthMeters * 100) / 40) + 1;
      const deckScrews = Math.ceil((boardsCount * joistsCount * 2) / 250) || 2;

      return {
        description: `Deck o Terraza de Madera de ${lengthMeters}m × ${widthMeters}m (${areaSqMeters.toFixed(1)} m²)`,
        items: [
          {
            name: 'Tablas de Piso Pino Tratado 1" x 6" x 12\'',
            qty: boardsCount,
            unitPrice: 175,
            sku: 'MAD-PIN-1612',
            spec: 'Superficie transitable cepillada'
          },
          {
            name: 'Durmientes de Base Pino Tratado CCA 2" x 6" x 12\'',
            qty: joistsCount,
            unitPrice: 342,
            sku: 'MAD-PIN-2612',
            spec: 'Bastidor de apoyo elevado del suelo'
          },
          {
            name: 'Tornillo para Madera Exterior C-3 2-1/2" (Caja 250 pcs)',
            qty: deckScrews,
            unitPrice: 340,
            sku: 'FER-TOR-DECK',
            spec: 'Tornillos de fijación oculta o vista'
          }
        ]
      };
    } else {
      // Cerca perimetral
      const posts = Math.ceil(lengthMeters / 2) + 1; // poste cada 2 metros
      const rails = Math.ceil(lengthMeters / 3.66) * 3; // 3 rieles horizontales
      const verticalPickets = Math.ceil((lengthMeters * 100) / 12); // tablas de 1x4 cada 12cm

      return {
        description: `Cerca perimetral de madera de ${lengthMeters} metros lineales`,
        items: [
          {
            name: 'Postes Pino Tratado CCA 4" x 4" x 8\'',
            qty: posts,
            unitPrice: 310,
            sku: 'MAD-PIN-448',
            spec: 'Postes enterrados con zapata de concreto'
          },
          {
            name: 'Rieles Horizontales Pino 2" x 4" x 12\'',
            qty: rails,
            unitPrice: 228,
            sku: 'MAD-PIN-2412',
            spec: 'Soporte transversal de la cerca'
          },
          {
            name: 'Tablas Verticales Pino 1" x 4" x 8\'',
            qty: verticalPickets,
            unitPrice: 85,
            sku: 'MAD-PIN-148',
            spec: 'Cerramiento visual de privacidad'
          }
        ]
      };
    }
  }, [projectType, lengthMeters, widthMeters, spacingCm, areaSqMeters]);

  const estimatedTotal = estimation.items.reduce((sum, it) => sum + it.qty * it.unitPrice, 0);

  const handleAddAllToCart = () => {
    estimation.items.forEach(it => {
      // Find or create synthetic product
      const existingProd = products.find(p => p.sku === it.sku) || products[0];
      addToCart(
        {
          ...existingProd,
          name: it.name,
          pricePerUnit: it.unitPrice
        },
        it.qty
      );
    });
    setIsCartOpen(true);
    showToast('¡Materiales del proyecto agregados al carrito!', 'success');
  };

  return (
    <section className="py-12 bg-slate-900 text-slate-100 border-y border-slate-800">
      <div className="max-w-7xl mx-auto px-4">
        {/* Title */}
        <div className="mb-8">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400 text-xs font-semibold uppercase tracking-wider mb-2">
            <Building2 className="w-3.5 h-3.5" />
            Cálculo Rápido por Obra
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
            ¿Qué estás construyendo?
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 max-w-2xl mt-1 leading-relaxed">
            Selecciona tu tipo de proyecto e introduce las dimensiones para obtener un despiece estimado de maderas y tornillería.
          </p>
        </div>

        {/* Project Type Selector Tabs */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-8">
          {[
            { id: 'pergola', name: 'Pérgola / Terraza', icon: '🏛️', sub: 'Estructura exterior y sombra' },
            { id: 'techo', name: 'Estructura de Techo', icon: '🏠', sub: 'Cabios, alfajías y clavadores' },
            { id: 'deck', name: 'Deck / Piso de Madera', icon: '🪵', sub: 'Pisos para piscina o jardín' },
            { id: 'cerca', name: 'Cerca Perimetral', icon: '🛡️', sub: 'Privacidad y delimitación' }
          ].map((tab) => {
            const isSelected = projectType === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setProjectType(tab.id as ProjectType)}
                className={`p-3.5 rounded-xl border text-left cursor-pointer transition-all active:scale-[0.98] ${
                  isSelected
                    ? 'border-amber-500 bg-amber-500/10 text-white shadow-xs'
                    : 'border-slate-800 bg-slate-950/60 text-slate-300 hover:border-slate-700'
                }`}
              >
                <div className="text-xl mb-1.5">{tab.icon}</div>
                <div className={`font-semibold text-xs sm:text-sm ${isSelected ? 'text-amber-400' : 'text-slate-100'}`}>
                  {tab.name}
                </div>
                <div className="text-[11px] text-slate-400 mt-0.5">{tab.sub}</div>
              </button>
            );
          })}
        </div>

        {/* Sliders & Dimensions Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Controls on Left (5 Cols) */}
          <div className="lg:col-span-5 bg-slate-950/60 border border-slate-800 rounded-xl p-5 space-y-5">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-amber-400 flex items-center gap-2">
              <span>Dimensiones del Área</span>
            </h3>

            {/* Length */}
            <div className="space-y-1.5">
              <div className="flex justify-between text-xs">
                <span className="text-slate-300 font-medium">Largo del proyecto:</span>
                <span className="font-mono font-bold text-amber-400 text-sm">{lengthMeters} metros</span>
              </div>
              <input
                type="range"
                min="2"
                max="12"
                step="0.5"
                value={lengthMeters}
                onChange={(e) => setLengthMeters(parseFloat(e.target.value))}
                className="w-full accent-amber-500 cursor-pointer h-1.5 bg-slate-800 rounded-lg"
              />
              <div className="flex justify-between text-[10px] text-slate-400">
                <span>2 metros (6.5 ft)</span>
                <span>12 metros (39.3 ft)</span>
              </div>
            </div>

            {/* Width (if not fence) */}
            {projectType !== 'cerca' && (
              <div className="space-y-1.5">
                <div className="flex justify-between text-xs">
                  <span className="text-slate-300 font-medium">Ancho del proyecto:</span>
                  <span className="font-mono font-bold text-amber-400 text-sm">{widthMeters} metros</span>
                </div>
                <input
                  type="range"
                  min="2"
                  max="8"
                  step="0.5"
                  value={widthMeters}
                  onChange={(e) => setWidthMeters(parseFloat(e.target.value))}
                  className="w-full accent-amber-500 cursor-pointer h-1.5 bg-slate-800 rounded-lg"
                />
                <div className="flex justify-between text-[10px] text-slate-400">
                  <span>2 metros</span>
                  <span>8 metros</span>
                </div>
              </div>
            )}

            {/* Spacing for pergola */}
            {projectType === 'pergola' && (
              <div className="space-y-1.5">
                <div className="flex justify-between text-xs">
                  <span className="text-slate-300 font-medium">Separación de viguetas:</span>
                  <span className="font-mono font-bold text-amber-400 text-sm">{spacingCm} cm</span>
                </div>
                <input
                  type="range"
                  min="30"
                  max="80"
                  step="5"
                  value={spacingCm}
                  onChange={(e) => setSpacingCm(parseInt(e.target.value))}
                  className="w-full accent-amber-500 cursor-pointer h-1.5 bg-slate-800 rounded-lg"
                />
                <div className="flex justify-between text-[10px] text-slate-400">
                  <span>30 cm (Más sombra)</span>
                  <span>80 cm (Más abierto)</span>
                </div>
              </div>
            )}

            {/* Disclaimer box */}
            <div className="p-3 bg-amber-500/10 border border-amber-500/20 rounded-lg flex items-start gap-2 text-xs text-amber-200">
              <ShieldAlert className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
              <p className="leading-relaxed text-[11px]">
                <strong>Nota técnica obligatoria:</strong> Estimación orientativa. Las cantidades y calibres finales deben ser verificados por un ingeniero civil, arquitecto o maestro de obra calificado según cargas locales.
              </p>
            </div>
          </div>

          {/* BOM Breakdown on Right (7 Cols) */}
          <div className="lg:col-span-7 bg-slate-950/60 border border-slate-800 rounded-xl p-5 space-y-5">
            <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-800 pb-3">
              <div>
                <span className="text-[11px] font-semibold text-amber-400 uppercase tracking-wider">
                  Despiece Estimado de Materiales
                </span>
                <h4 className="text-base font-semibold text-white mt-0.5">{estimation.description}</h4>
              </div>
              <span className="text-[11px] px-2 py-0.5 rounded bg-slate-900 text-slate-300 font-mono border border-slate-800">
                {estimation.items.length} partidas de obra
              </span>
            </div>

            {/* Items Table */}
            <div className="space-y-2.5">
              {estimation.items.map((item, idx) => (
                <div 
                  key={idx}
                  className="p-3 rounded-lg bg-slate-900/80 border border-slate-800/90 flex items-center justify-between gap-4"
                >
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="w-4 h-4 rounded-full bg-slate-800 text-amber-400 font-bold text-[10px] flex items-center justify-center">
                        {idx + 1}
                      </span>
                      <h5 className="text-xs sm:text-sm font-medium text-white truncate">{item.name}</h5>
                    </div>
                    <p className="text-[11px] text-slate-400 mt-0.5 pl-6">{item.spec}</p>
                  </div>

                  <div className="text-right shrink-0">
                    <div className="text-[11px] font-medium text-slate-300">
                      <span className="text-amber-400 font-bold text-xs">{item.qty}</span> pcs × {formatLempiras(item.unitPrice)}
                    </div>
                    <div className="text-xs font-mono font-bold text-white mt-0.5">
                      {formatLempiras(item.qty * item.unitPrice)}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Total Footer & Actions */}
            <div className="pt-4 border-t border-slate-800 flex flex-wrap items-center justify-between gap-4">
              <div>
                <span className="text-[10px] text-slate-400 uppercase tracking-wider block font-medium">
                  Subtotal Estimado de Materiales:
                </span>
                <span className="text-xl font-bold text-amber-400 font-mono tracking-tight">
                  {formatLempiras(estimatedTotal)}
                </span>
                <span className="text-[10px] text-slate-400 block">+ ISV 15% al procesar pedido</span>
              </div>

              <button
                type="button"
                onClick={handleAddAllToCart}
                className="px-5 py-2.5 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs uppercase tracking-tight flex items-center gap-2 shadow-xs cursor-pointer transition-all active:scale-[0.98]"
              >
                <ShoppingBag className="w-4 h-4" />
                Cargar Lista al Carrito
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
