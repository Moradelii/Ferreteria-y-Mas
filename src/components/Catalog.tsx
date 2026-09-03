import React, { useState, useMemo } from 'react';
import { useApp } from '../lib/store';
import { Product, StockStatus } from '../types';
import { formatLempiras, calculateBoardFeet } from '../lib/pricingEngine';
import { 
  Search, 
  Filter, 
  ShoppingBag, 
  Eye, 
  Layers, 
  CheckCircle2, 
  AlertTriangle, 
  XCircle, 
  Clock, 
  Tag, 
  ArrowUpDown 
} from 'lucide-react';

export const Catalog: React.FC = () => {
  const { 
    products, 
    searchQuery, 
    setSearchQuery, 
    selectedCategoryFilter, 
    setSelectedCategoryFilter,
    addToCart,
    setInspectProduct,
    setIsCartOpen
  } = useApp();

  const [sortBy, setSortBy] = useState<'featured' | 'price_asc' | 'price_desc' | 'name'>('featured');
  const [speciesFilter, setSpeciesFilter] = useState<string>('all');

  // Filtered & Sorted Products
  const filteredProducts = useMemo(() => {
    return products.filter(product => {
      // Search term
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesName = product.name.toLowerCase().includes(q);
        const matchesSku = product.sku.toLowerCase().includes(q);
        const matchesSpecies = product.species?.toLowerCase().includes(q);
        const matchesDim = product.dimensionString?.toLowerCase().includes(q) || 
          product.dimensions?.label.toLowerCase().includes(q);
        const matchesDesc = product.description.toLowerCase().includes(q);

        if (!matchesName && !matchesSku && !matchesSpecies && !matchesDim && !matchesDesc) {
          return false;
        }
      }

      // Category
      if (selectedCategoryFilter !== 'all') {
        if (selectedCategoryFilter === 'madera_all') {
          if (!['madera', 'madera_dimensionada'].includes(product.category)) return false;
        } else if (product.category !== selectedCategoryFilter) {
          return false;
        }
      }

      // Species
      if (speciesFilter !== 'all' && product.species !== speciesFilter) {
        return false;
      }

      return true;
    }).sort((a, b) => {
      if (sortBy === 'price_asc') return a.pricePerUnit - b.pricePerUnit;
      if (sortBy === 'price_desc') return b.pricePerUnit - a.pricePerUnit;
      if (sortBy === 'name') return a.name.localeCompare(b.name);
      return (b.featured ? 1 : 0) - (a.featured ? 1 : 0);
    });
  }, [products, searchQuery, selectedCategoryFilter, speciesFilter, sortBy]);

  const renderStockBadge = (status: StockStatus, stock: number) => {
    switch (status) {
      case 'in_stock':
        return (
          <span className="inline-flex items-center gap-1.5 text-[11px] font-medium px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200/80 shadow-2xs">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
            En Stock ({stock})
          </span>
        );
      case 'low_stock':
        return (
          <span className="inline-flex items-center gap-1.5 text-[11px] font-medium px-2 py-0.5 rounded-full bg-amber-50 text-amber-700 border border-amber-200/80 shadow-2xs">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-500"></span>
            Stock Limitado ({stock})
          </span>
        );
      case 'out_of_stock':
        return (
          <span className="inline-flex items-center gap-1.5 text-[11px] font-medium px-2 py-0.5 rounded-full bg-rose-50 text-rose-700 border border-rose-200/80 shadow-2xs">
            <span className="w-1.5 h-1.5 rounded-full bg-rose-500"></span>
            Agotado
          </span>
        );
      case 'on_order':
        return (
          <span className="inline-flex items-center gap-1.5 text-[11px] font-medium px-2 py-0.5 rounded-full bg-sky-50 text-sky-700 border border-sky-200/80 shadow-2xs">
            <span className="w-1.5 h-1.5 rounded-full bg-sky-500"></span>
            Bajo Pedido
          </span>
        );
    }
  };

  return (
    <section id="catalogo" className="py-12 bg-slate-50 text-slate-900 min-h-screen">
      <div className="max-w-7xl mx-auto px-4">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
          <div>
            <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-700 bg-white border border-slate-200 px-3 py-1 rounded-full uppercase tracking-wider mb-2 shadow-xs">
              <Tag className="w-3.5 h-3.5 text-amber-600" />
              Inventario Activo en Bodega La Ceiba
            </div>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black text-slate-900 tracking-tight">
              Catálogo de Maderas y Materiales
            </h2>
            <p className="text-sm text-slate-600 mt-1">
              Consulta precios con ISV, especificaciones técnicas y disponibilidad inmediata para retiro o flete.
            </p>
          </div>

          {/* Quick Stats */}
          <div className="flex items-center gap-3 text-xs font-medium text-slate-600">
            <span className="bg-white px-3 py-1.5 rounded-lg border border-slate-200 shadow-2xs">
              <strong className="text-slate-900">{filteredProducts.length}</strong> productos disponibles
            </span>
          </div>
        </div>

        {/* Filter Controls Bar */}
        <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-xs mb-8 space-y-3">
          <div className="flex flex-wrap items-center justify-between gap-4">
            {/* Category Buttons */}
            <div className="flex flex-wrap items-center gap-1.5 text-xs">
              {[
                { id: 'all', label: 'Todos los Productos' },
                { id: 'madera_all', label: '🪵 Todas las Maderas' },
                { id: 'madera_dimensionada', label: '📐 Madera Dimensionada' },
                { id: 'tableros', label: '🪚 Tableros & Plywood' },
                { id: 'fijaciones', label: '🔩 Tornillos & Clavos' },
                { id: 'ferreteria', label: '🔨 Ferretería General' }
              ].map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategoryFilter(cat.id)}
                  className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer font-medium active:scale-[0.98] ${
                    selectedCategoryFilter === cat.id
                      ? 'bg-slate-900 text-white shadow-xs font-semibold'
                      : 'bg-slate-100/80 text-slate-600 hover:bg-slate-200/80 hover:text-slate-900'
                  }`}
                >
                  {cat.label}
                </button>
              ))}
            </div>

            {/* Sort Dropdown */}
            <div className="flex items-center gap-2 text-xs">
              <span className="text-slate-500 font-medium flex items-center gap-1">
                <ArrowUpDown className="w-3.5 h-3.5" />
                Ordenar por:
              </span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 text-slate-800 font-medium focus:ring-1 focus:ring-slate-900 focus:outline-hidden"
              >
                <option value="featured">Destacados primero</option>
                <option value="price_asc">Precio: Menor a Mayor</option>
                <option value="price_desc">Precio: Mayor a Menor</option>
                <option value="name">Nombre (A-Z)</option>
              </select>
            </div>
          </div>

          {/* Subfilter by Species if viewing wood */}
          {['all', 'madera_all', 'madera_dimensionada'].includes(selectedCategoryFilter) && (
            <div className="pt-3 border-t border-slate-100 flex flex-wrap items-center gap-1.5 text-xs">
              <span className="text-slate-400 font-semibold uppercase text-[10px] tracking-wider pr-1">
                Especie:
              </span>
              {[
                { id: 'all', label: 'Todas' },
                { id: 'pino_tratado', label: 'Pino Tratado CCA' },
                { id: 'pino_nacional', label: 'Pino Nacional' },
                { id: 'cedro', label: 'Cedro Real' },
                { id: 'laurel', label: 'Laurel' }
              ].map((sp) => (
                <button
                  key={sp.id}
                  onClick={() => setSpeciesFilter(sp.id)}
                  className={`px-2.5 py-1 rounded-md transition-all cursor-pointer text-xs ${
                    speciesFilter === sp.id
                      ? 'bg-amber-500 text-slate-950 font-semibold shadow-2xs'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200/80 font-medium'
                  }`}
                >
                  {sp.label}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Product Cards Grid */}
        {filteredProducts.length === 0 ? (
          <div className="bg-white rounded-xl p-12 text-center border border-slate-200 shadow-xs max-w-lg mx-auto">
            <Layers className="w-12 h-12 text-slate-400 mx-auto mb-3" />
            <h3 className="text-base font-bold text-slate-800">No encontramos productos con esos criterios</h3>
            <p className="text-xs text-slate-500 mt-1 mb-4">
              Prueba cambiando el término de búsqueda o seleccionando otra categoría.
            </p>
            <button
              onClick={() => {
                setSearchQuery('');
                setSelectedCategoryFilter('all');
                setSpeciesFilter('all');
              }}
              className="px-4 py-2 bg-slate-900 text-white rounded-lg text-xs font-semibold hover:bg-slate-800 transition-all cursor-pointer shadow-xs active:scale-[0.98]"
            >
              Restablecer Filtros
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {filteredProducts.map((product) => {
              const bf = product.dimensions 
                ? calculateBoardFeet(product.dimensions.thicknessInches, product.dimensions.widthInches, product.dimensions.lengthFeet)
                : 0;

              return (
                <div
                  key={product.id}
                  className="bg-white rounded-xl border border-slate-200/90 shadow-xs hover:shadow-md hover:border-slate-300 transition-all flex flex-col justify-between overflow-hidden group"
                >
                  <div>
                    {/* Image Box */}
                    <div className="relative aspect-4/3 overflow-hidden bg-slate-100 border-b border-slate-100">
                      <img
                        src={product.imageUrl}
                        alt={product.name}
                        className="w-full h-full object-cover group-hover:scale-103 transition-transform duration-300"
                        loading="lazy"
                      />
                      <div className="absolute top-2.5 left-2.5 flex flex-col gap-1">
                        {renderStockBadge(product.status, product.stock)}
                      </div>
                      <div className="absolute top-2.5 right-2.5">
                        <span className="text-[10px] font-mono font-medium bg-slate-950/75 backdrop-blur-xs text-white px-2 py-0.5 rounded shadow-xs">
                          {product.sku}
                        </span>
                      </div>
                    </div>

                    {/* Content Details */}
                    <div className="p-4 space-y-2">
                      <div className="flex items-center justify-between text-xs text-slate-500">
                        <span className="uppercase font-semibold tracking-wider text-[10px] text-amber-700">
                          {product.species?.replace('_', ' ') || product.category.replace('_', ' ')}
                        </span>
                        {bf > 0 && (
                          <span className="font-mono font-medium bg-slate-100 text-slate-700 px-1.5 py-0.5 rounded text-[11px]">
                            {bf} PT
                          </span>
                        )}
                      </div>

                      <h3 
                        onClick={() => setInspectProduct(product)}
                        className="font-bold text-slate-900 text-sm leading-snug cursor-pointer hover:text-amber-600 transition-colors line-clamp-2"
                      >
                        {product.name}
                      </h3>

                      <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed">
                        {product.description}
                      </p>

                      {product.dimensions && (
                        <div className="inline-block bg-slate-100 border border-slate-200 rounded-md px-2 py-0.5 text-xs font-mono font-medium text-slate-700">
                          📏 {product.dimensionString || product.dimensions.label}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Price & Action Footer */}
                  <div className="p-4 pt-3 border-t border-slate-100 bg-slate-50/60">
                    <div className="flex items-baseline justify-between mb-3">
                      <div>
                        <span className="text-[10px] text-slate-400 block uppercase font-medium">Precio:</span>
                        <span className="text-lg font-black text-slate-950 font-mono tracking-tight">
                          {formatLempiras(product.pricePerUnit)}
                        </span>
                        <span className="text-[10px] text-slate-500 block">
                          por {product.unit} · ISV inc.
                        </span>
                      </div>
                      {product.pricePerBoardFoot && (
                        <div className="text-right text-xs text-slate-500">
                          <span className="font-mono font-medium">{formatLempiras(product.pricePerBoardFoot)}</span>
                          <span className="block text-[10px] text-slate-400">/ PT</span>
                        </div>
                      )}
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                      <button
                        type="button"
                        onClick={() => setInspectProduct(product)}
                        className="py-2 px-2.5 rounded-lg border border-slate-200 hover:bg-slate-100 text-slate-700 text-xs font-medium flex items-center justify-center gap-1 cursor-pointer transition-all active:scale-[0.98]"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        Ficha
                      </button>

                      <button
                        type="button"
                        disabled={product.status === 'out_of_stock'}
                        onClick={() => {
                          addToCart(product, 1);
                          setIsCartOpen(true);
                        }}
                        className={`py-2 px-2.5 rounded-lg text-xs font-semibold flex items-center justify-center gap-1 transition-all ${
                          product.status === 'out_of_stock'
                            ? 'bg-slate-100 text-slate-400 cursor-not-allowed border border-slate-200'
                            : 'bg-amber-500 hover:bg-amber-400 text-slate-950 cursor-pointer shadow-xs active:scale-[0.98]'
                        }`}
                      >
                        <ShoppingBag className="w-3.5 h-3.5" />
                        Comprar
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
};
