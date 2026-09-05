import React, { useState } from 'react';
import { useApp } from '../lib/store';
import { Product, Order, Quote, DeliveryZone, StockStatus, WoodSpecies } from '../types';
import { formatLempiras } from '../lib/pricingEngine';
import { 
  Building2, 
  LayoutDashboard, 
  Package, 
  Boxes, 
  ShoppingCart, 
  FileText, 
  Truck, 
  Settings, 
  Plus, 
  Edit, 
  Trash2, 
  Search, 
  ArrowLeft, 
  CheckCircle2, 
  Clock, 
  QrCode, 
  AlertTriangle, 
  Save, 
  Eye, 
  TrendingUp,
  DollarSign,
  Send,
  MessageCircle,
  Warehouse,
  Image as ImageIcon,
  Upload,
  Loader2,
  Check
} from 'lucide-react';
import { compressImageFile, sanitizeImagePath } from '../lib/storageHelper';

export const AdminCMS: React.FC = () => {
  const { 
    adminTab, 
    setAdminTab, 
    setCurrentView, 
    products, 
    saveProduct, 
    deleteProduct, 
    updateProductStock, 
    orders, 
    updateOrderStatus, 
    quotes, 
    deliveryZones, 
    setDeliveryZones, 
    businessConfig, 
    setBusinessConfig,
    setViewingQuote,
    showToast
  } = useApp();

  // Search & Filter state inside CMS
  const [productSearch, setProductSearch] = useState('');
  const [orderFilter, setOrderFilter] = useState<string>('all');
  const [qrInputVerify, setQrInputVerify] = useState('');
  const [qrVerifyResult, setQrVerifyResult] = useState<Order | null>(null);

  // Edit / Add product modal
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [isCreatingNew, setIsCreatingNew] = useState(false);
  const [isCompressingImage, setIsCompressingImage] = useState(false);
  const [imageUploadNotice, setImageUploadNotice] = useState<string | null>(null);

  // Financial KPI calculations
  const totalSalesRevenue = orders
    .filter(o => o.paymentStatus === 'approved')
    .reduce((sum, o) => sum + o.total, 0);

  const pendingVerificationCount = orders.filter(o => o.fulfillmentStatus === 'verifying_payment').length;
  const readyForPickupCount = orders.filter(o => o.fulfillmentStatus === 'ready_for_pickup').length;
  const lowStockCount = products.filter(p => p.status === 'low_stock' || p.stock <= p.minStock).length;

  const handleVerifyQr = (e: React.FormEvent) => {
    e.preventDefault();
    const found = orders.find(o => o.pickupQrCode.toLowerCase() === qrInputVerify.trim().toLowerCase());
    if (found) {
      setQrVerifyResult(found);
      showToast(`Pedido encontrado: ${found.orderNumber}`, 'success');
    } else {
      setQrVerifyResult(null);
      showToast('Código de retiro no encontrado en el sistema', 'error');
    }
  };

  const handleSaveProductForm = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingProduct) return;
    const sanitized: Product = {
      ...editingProduct,
      imageUrl: sanitizeImagePath(editingProduct.imageUrl)
    };
    saveProduct(sanitized);
    setEditingProduct(null);
    setIsCreatingNew(false);
    setImageUploadNotice(null);
  };

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 flex flex-col md:flex-row">
      {/* CMS Left Navigation Sidebar */}
      <aside className="w-full md:w-64 bg-slate-950 border-r border-slate-800 p-4 shrink-0 flex flex-col justify-between">
        <div className="space-y-6">
          {/* Header & Back to Store */}
          <div>
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-mono font-semibold text-amber-500 uppercase tracking-wider">
                CMS · Admin v2.4
              </span>
              <button
                onClick={() => setCurrentView('store')}
                className="text-xs font-medium text-slate-400 hover:text-white flex items-center gap-1 cursor-pointer transition-colors"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                Tienda
              </button>
            </div>
            <h2 className="text-base font-bold text-white mt-1 tracking-tight">Ferretería & Más</h2>
            <p className="text-[11px] text-slate-400">Sucursal CA-13, La Ceiba</p>
          </div>

          {/* Navigation Links */}
          <nav className="space-y-1 text-xs font-medium">
            <button
              onClick={() => setAdminTab('dashboard')}
              className={`w-full flex items-center justify-between p-2.5 rounded-lg transition-all cursor-pointer ${
                adminTab === 'dashboard' ? 'bg-amber-500 text-slate-950 font-bold shadow-xs' : 'text-slate-300 hover:bg-slate-900'
              }`}
            >
              <span className="flex items-center gap-2">
                <LayoutDashboard className="w-4 h-4" />
                Dashboard General
              </span>
            </button>

            <button
              onClick={() => setAdminTab('orders')}
              className={`w-full flex items-center justify-between p-2.5 rounded-lg transition-all cursor-pointer ${
                adminTab === 'orders' ? 'bg-amber-500 text-slate-950 font-bold shadow-xs' : 'text-slate-300 hover:bg-slate-900'
              }`}
            >
              <span className="flex items-center gap-2">
                <ShoppingCart className="w-4 h-4" />
                Gestor de Pedidos
              </span>
              {pendingVerificationCount > 0 && (
                <span className="w-5 h-5 rounded-full bg-amber-600 text-white text-[10px] flex items-center justify-center font-mono font-bold">
                  {pendingVerificationCount}
                </span>
              )}
            </button>

            <button
              onClick={() => setAdminTab('products')}
              className={`w-full flex items-center justify-between p-2.5 rounded-lg transition-all cursor-pointer ${
                adminTab === 'products' ? 'bg-amber-500 text-slate-950 font-bold shadow-xs' : 'text-slate-300 hover:bg-slate-900'
              }`}
            >
              <span className="flex items-center gap-2">
                <Package className="w-4 h-4" />
                Catálogo & Precios
              </span>
              <span className="text-[11px] font-mono opacity-80">{products.length}</span>
            </button>

            <button
              onClick={() => setAdminTab('inventory')}
              className={`w-full flex items-center justify-between p-2.5 rounded-lg transition-all cursor-pointer ${
                adminTab === 'inventory' ? 'bg-amber-500 text-slate-950 font-bold shadow-xs' : 'text-slate-300 hover:bg-slate-900'
              }`}
            >
              <span className="flex items-center gap-2">
                <Boxes className="w-4 h-4" />
                Control de Inventario
              </span>
              {lowStockCount > 0 && (
                <span className="w-5 h-5 rounded-full bg-rose-500 text-white text-[10px] flex items-center justify-center font-mono font-bold">
                  {lowStockCount}
                </span>
              )}
            </button>

            <button
              onClick={() => setAdminTab('quotes')}
              className={`w-full flex items-center justify-between p-2.5 rounded-lg transition-all cursor-pointer ${
                adminTab === 'quotes' ? 'bg-amber-500 text-slate-950 font-bold shadow-xs' : 'text-slate-300 hover:bg-slate-900'
              }`}
            >
              <span className="flex items-center gap-2">
                <FileText className="w-4 h-4" />
                Cotizaciones Activas
              </span>
              <span className="text-[11px] font-mono opacity-80">{quotes.length}</span>
            </button>

            <button
              onClick={() => setAdminTab('zones')}
              className={`w-full flex items-center justify-between p-2.5 rounded-lg transition-all cursor-pointer ${
                adminTab === 'zones' ? 'bg-amber-500 text-slate-950 font-bold shadow-xs' : 'text-slate-300 hover:bg-slate-900'
              }`}
            >
              <span className="flex items-center gap-2">
                <Truck className="w-4 h-4" />
                Zonas & Fletes
              </span>
            </button>

            <button
              onClick={() => setAdminTab('settings')}
              className={`w-full flex items-center justify-between p-2.5 rounded-lg transition-all cursor-pointer ${
                adminTab === 'settings' ? 'bg-amber-500 text-slate-950 font-bold shadow-xs' : 'text-slate-300 hover:bg-slate-900'
              }`}
            >
              <span className="flex items-center gap-2">
                <Settings className="w-4 h-4" />
                Configuración & Cuentas
              </span>
            </button>
          </nav>
        </div>

        {/* User Footer info */}
        <div className="pt-4 border-t border-slate-800 text-[11px] text-slate-400">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-amber-500/20 text-amber-400 font-bold flex items-center justify-center text-xs">
              SA
            </div>
            <div>
              <span className="font-semibold text-white block">Super Administrador</span>
              <span className="text-[10px]">La Ceiba - Acceso Total</span>
            </div>
          </div>
        </div>
      </aside>

      {/* Main CMS Work Area */}
      <main className="flex-1 p-6 overflow-y-auto max-w-7xl">
        {/* TAB 1: DASHBOARD GENERAL */}
        {adminTab === 'dashboard' && (
          <div className="space-y-6">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div>
                <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight">Dashboard Operativo</h2>
                <p className="text-xs text-slate-400">Resumen en vivo de ventas, inventario y retiros en bodega.</p>
              </div>
              <button
                onClick={() => {
                  setEditingProduct({
                    id: `prod_${Date.now()}`,
                    sku: `MAD-${Math.floor(100 + Math.random() * 900)}`,
                    name: '',
                    slug: '',
                    category: 'madera_dimensionada',
                    species: 'pino_tratado',
                    description: '',
                    unit: 'pieza',
                    pricePerUnit: 180,
                    cost: 110,
                    stock: 50,
                    minStock: 10,
                    status: 'in_stock',
                    imageUrl: 'https://images.unsplash.com/photo-1546484396-fb3fc6f95f98?auto=format&fit=crop&w=800&q=80'
                  });
                  setIsCreatingNew(true);
                  setAdminTab('products');
                }}
                className="px-3.5 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 rounded-lg text-xs font-bold flex items-center gap-1.5 cursor-pointer shadow-xs active:scale-[0.98] transition-all"
              >
                <Plus className="w-4 h-4" />
                Nuevo Producto / Madera
              </button>
            </div>

            {/* KPI Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-slate-950/60 border border-slate-800 rounded-xl p-4 shadow-xs">
                <div className="flex items-center justify-between text-xs text-slate-400">
                  <span>Ventas Facturadas</span>
                  <DollarSign className="w-4 h-4 text-emerald-400" />
                </div>
                <div className="text-xl sm:text-2xl font-bold font-mono text-white mt-2 tracking-tight">
                  {formatLempiras(totalSalesRevenue)}
                </div>
                <span className="text-[10px] text-emerald-400 font-medium mt-1 block">
                  ↑ Transacciones procesadas
                </span>
              </div>

              <div className="bg-slate-950/60 border border-slate-800 rounded-xl p-4 shadow-xs">
                <div className="flex items-center justify-between text-xs text-slate-400">
                  <span>Pagos en Verificación</span>
                  <Clock className="w-4 h-4 text-amber-400" />
                </div>
                <div className="text-xl sm:text-2xl font-bold font-mono text-amber-400 mt-2 tracking-tight">
                  {pendingVerificationCount} pedidos
                </div>
                <span className="text-[10px] text-slate-400 mt-1 block">
                  Transferencias bancarias pendientes
                </span>
              </div>

              <div className="bg-slate-950/60 border border-slate-800 rounded-xl p-4 shadow-xs">
                <div className="flex items-center justify-between text-xs text-slate-400">
                  <span>Retiros Listos en Bodega</span>
                  <Warehouse className="w-4 h-4 text-sky-400" />
                </div>
                <div className="text-xl sm:text-2xl font-bold font-mono text-sky-400 mt-2 tracking-tight">
                  {readyForPickupCount} pedidos
                </div>
                <span className="text-[10px] text-slate-400 mt-1 block">
                  Listos para entrega exprés con QR
                </span>
              </div>

              <div className="bg-slate-950/60 border border-slate-800 rounded-xl p-4 shadow-xs">
                <div className="flex items-center justify-between text-xs text-slate-400">
                  <span>Alertas de Stock Bajo</span>
                  <AlertTriangle className="w-4 h-4 text-rose-400" />
                </div>
                <div className="text-xl sm:text-2xl font-bold font-mono text-rose-400 mt-2 tracking-tight">
                  {lowStockCount} ítems
                </div>
                <span className="text-[10px] text-rose-400 mt-1 block">
                  Requiere compra a aserradero
                </span>
              </div>
            </div>

            {/* Quick QR Scanner & Verifier for Warehouse Attendant */}
            <div className="bg-slate-950/60 border border-slate-800 rounded-xl p-5 space-y-4 shadow-xs">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-semibold text-white flex items-center gap-2">
                    <QrCode className="w-4 h-4 text-amber-400" />
                    Escáner / Verificador de Retiro en Bodega
                  </h3>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Introduce o escanea el token del cliente (ej. RET-CEI-998242) para validar y entregar materiales.
                  </p>
                </div>
              </div>

              <form onSubmit={handleVerifyQr} className="flex gap-2 max-w-md">
                <input
                  type="text"
                  placeholder="Ingresar token: RET-CEI-XXXXXX"
                  value={qrInputVerify}
                  onChange={(e) => setQrInputVerify(e.target.value)}
                  className="flex-1 bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-xs font-mono text-white focus:outline-none focus:ring-1 focus:ring-amber-500 uppercase"
                />
                <button
                  type="submit"
                  className="px-4 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs uppercase tracking-tight rounded-lg cursor-pointer active:scale-[0.98] transition-all"
                >
                  Validar
                </button>
              </form>

              {/* Verification Result */}
              {qrVerifyResult && (
                <div className="p-4 bg-slate-900 rounded-xl border border-emerald-500/40 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-emerald-400 font-semibold text-xs flex items-center gap-1.5">
                      <CheckCircle2 className="w-4 h-4" />
                      Token Validado: {qrVerifyResult.orderNumber}
                    </span>
                    <span className="text-xs bg-slate-800 px-2 py-0.5 rounded font-medium text-white font-mono">
                      {qrVerifyResult.pickupQrCode}
                    </span>
                  </div>

                  <div className="text-xs space-y-1 text-slate-300">
                    <div><strong>Cliente:</strong> {qrVerifyResult.customer.name} ({qrVerifyResult.customer.phone})</div>
                    <div><strong>Estado actual:</strong> <span className="capitalize">{qrVerifyResult.fulfillmentStatus}</span></div>
                    <div><strong>Partidas a despachar:</strong></div>
                    <ul className="pl-4 list-disc space-y-0.5">
                      {qrVerifyResult.items.map((it, idx) => (
                        <li key={idx}>
                          {it.quantity}x {it.product.name} ({it.customDimensions?.label || it.product.dimensionString})
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="flex items-center gap-2 pt-2">
                    <button
                      onClick={() => {
                        updateOrderStatus(qrVerifyResult.id, 'delivered');
                        setQrVerifyResult({ ...qrVerifyResult, fulfillmentStatus: 'delivered' });
                      }}
                      className="px-3.5 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs cursor-pointer active:scale-[0.98] transition-all"
                    >
                      ✓ Marcar como Entregado en Bodega
                    </button>
                    <button
                      onClick={() => setQrVerifyResult(null)}
                      className="px-3 py-1.5 rounded-lg border border-slate-800 text-slate-400 hover:text-white text-xs cursor-pointer transition-colors"
                    >
                      Cerrar
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Recent Orders Overview */}
            <div className="bg-slate-950/60 border border-slate-800 rounded-xl p-5 space-y-4 shadow-xs">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-semibold text-white">Últimos Pedidos Registrados</h3>
                <button
                  onClick={() => setAdminTab('orders')}
                  className="text-xs text-amber-400 hover:underline font-medium cursor-pointer"
                >
                  Ver todos los pedidos →
                </button>
              </div>

              <div className="divide-y divide-slate-800 text-xs">
                {orders.slice(0, 5).map((o) => (
                  <div key={o.id} className="py-3 flex items-center justify-between gap-4">
                    <div>
                      <span className="font-semibold font-mono text-white">{o.orderNumber}</span>
                      <span className="text-slate-400 block">{o.customer.name}</span>
                    </div>
                    <div className="text-right">
                      <span className="font-semibold font-mono text-amber-400">{formatLempiras(o.total)}</span>
                      <span className="text-[10px] text-slate-400 block capitalize">
                        {o.deliveryMethod === 'pickup' ? 'Retiro' : 'Flete'} · {o.paymentStatus}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: GESTOR DE PRODUCTOS & MADERAS */}
        {adminTab === 'products' && (
          <div className="space-y-6">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div>
                <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight">Catálogo de Maderas y Productos</h2>
                <p className="text-xs text-slate-400">Edita precios, pies tablares, costos y fichas técnicas.</p>
              </div>

              <button
                onClick={() => {
                  setEditingProduct({
                    id: `prod_${Date.now()}`,
                    sku: `MAD-${Math.floor(100 + Math.random() * 900)}`,
                    name: '',
                    slug: '',
                    category: 'madera_dimensionada',
                    species: 'pino_tratado',
                    description: '',
                    unit: 'pieza',
                    pricePerUnit: 220,
                    cost: 150,
                    stock: 50,
                    minStock: 10,
                    status: 'in_stock',
                    imageUrl: 'https://images.unsplash.com/photo-1546484396-fb3fc6f95f98?auto=format&fit=crop&w=800&q=80'
                  });
                  setIsCreatingNew(true);
                }}
                className="px-3.5 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 rounded-lg text-xs font-bold flex items-center gap-1.5 cursor-pointer shadow-xs active:scale-[0.98] transition-all"
              >
                <Plus className="w-4 h-4" />
                Agregar Producto
              </button>
            </div>

            {/* Search */}
            <div className="relative max-w-md">
              <input
                type="text"
                placeholder="Buscar por SKU, nombre, especie..."
                value={productSearch}
                onChange={(e) => setProductSearch(e.target.value)}
                className="w-full bg-slate-900 border border-slate-800 rounded-lg pl-9 pr-3 py-2 text-xs text-white focus:outline-none focus:ring-1 focus:ring-amber-500"
              />
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            </div>

            {/* Products Table */}
            <div className="bg-slate-950/60 border border-slate-800 rounded-xl overflow-hidden shadow-xs">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-950 text-slate-400 uppercase font-mono text-[10px] border-b border-slate-800">
                    <tr>
                      <th className="p-3.5">SKU / Producto</th>
                      <th className="p-3.5">Especie / Medida</th>
                      <th className="p-3.5 text-right">Precio Venta (L.)</th>
                      <th className="p-3.5 text-right">Costo (L.)</th>
                      <th className="p-3.5 text-center">Stock</th>
                      <th className="p-3.5 text-center">Estado</th>
                      <th className="p-3.5 text-right">Acciones</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800">
                    {products
                      .filter(p => p.name.toLowerCase().includes(productSearch.toLowerCase()) || p.sku.toLowerCase().includes(productSearch.toLowerCase()))
                      .map((p) => (
                        <tr key={p.id} className="hover:bg-slate-800/40 transition-colors">
                          <td className="p-3.5">
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 rounded-lg bg-slate-900 border border-slate-800 overflow-hidden shrink-0 flex items-center justify-center">
                                {p.imageUrl ? (
                                  <img 
                                    src={p.imageUrl} 
                                    alt={p.name} 
                                    className="w-full h-full object-cover"
                                    onError={(e) => {
                                      (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1546484396-fb3fc6f95f98?auto=format&fit=crop&w=800&q=80';
                                    }}
                                  />
                                ) : (
                                  <ImageIcon className="w-4 h-4 text-slate-600" />
                                )}
                              </div>
                              <div>
                                <div className="font-semibold text-white">{p.name}</div>
                                <span className="font-mono text-[11px] text-amber-400 font-medium">{p.sku}</span>
                              </div>
                            </div>
                          </td>
                          <td className="p-3.5">
                            <span className="capitalize text-slate-300">{p.species || p.category}</span>
                            <span className="block font-mono text-slate-400 text-[11px]">{p.dimensionString || '-'}</span>
                          </td>
                          <td className="p-3.5 text-right font-mono font-semibold text-white">
                            {formatLempiras(p.pricePerUnit)}
                          </td>
                          <td className="p-3.5 text-right font-mono text-slate-400">
                            {formatLempiras(p.cost)}
                          </td>
                          <td className="p-3.5 text-center font-semibold font-mono">
                            {p.stock}
                          </td>
                          <td className="p-3.5 text-center">
                            <span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold ${
                              p.status === 'in_stock' ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30' : 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                            }`}>
                              {p.status}
                            </span>
                          </td>
                          <td className="p-3.5 text-right">
                            <div className="flex items-center justify-end gap-1.5">
                              <button
                                onClick={() => {
                                  setEditingProduct({ ...p });
                                  setIsCreatingNew(false);
                                }}
                                className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 cursor-pointer transition-colors"
                                title="Editar"
                              >
                                <Edit className="w-3.5 h-3.5" />
                              </button>
                              <button
                                onClick={() => {
                                  if (confirm(`¿Eliminar ${p.name}?`)) deleteProduct(p.id);
                                }}
                                className="p-1.5 rounded-lg bg-slate-800 hover:bg-rose-950/60 text-rose-300 cursor-pointer transition-colors"
                                title="Eliminar"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: CONTROL DE INVENTARIO */}
        {adminTab === 'inventory' && (
          <div className="space-y-6">
            <div>
              <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight">Control de Existencias en Bodega</h2>
              <p className="text-xs text-slate-400">Ajusta existencias de madera y materiales en tiempo real.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {products.map((p) => (
                <div key={p.id} className="bg-slate-950/60 border border-slate-800 rounded-xl p-4 space-y-3 shadow-xs">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <span className="text-[10px] font-mono text-amber-400 font-medium">{p.sku}</span>
                      <h4 className="text-sm font-semibold text-white line-clamp-1">{p.name}</h4>
                      <span className="text-xs text-slate-400">{p.dimensionString || p.unit}</span>
                    </div>
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold shrink-0 ${
                      p.stock > p.minStock ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30' : 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                    }`}>
                      {p.stock > p.minStock ? '🟢 Normal' : '🔴 Bajo'}
                    </span>
                  </div>

                  <div className="flex items-center justify-between p-3 bg-slate-900 rounded-lg text-xs border border-slate-800/80">
                    <div>
                      <span className="text-slate-500 text-[10px] block">Stock Mínimo:</span>
                      <span className="font-semibold text-slate-300">{p.minStock} pcs</span>
                    </div>
                    <div className="text-right">
                      <span className="text-slate-500 text-[10px] block">Existencia Actual:</span>
                      <span className="text-xl font-bold font-mono text-white tracking-tight">{p.stock}</span>
                    </div>
                  </div>

                  {/* Fast Stock Adjuster */}
                  <div className="flex items-center gap-1.5 pt-1">
                    <button
                      onClick={() => updateProductStock(p.id, Math.max(0, p.stock - 10))}
                      className="flex-1 py-1.5 bg-slate-800 hover:bg-slate-700 rounded-lg text-xs font-semibold text-slate-200 cursor-pointer active:scale-95 transition-all"
                    >
                      -10
                    </button>
                    <button
                      onClick={() => updateProductStock(p.id, Math.max(0, p.stock - 1))}
                      className="flex-1 py-1.5 bg-slate-800 hover:bg-slate-700 rounded-lg text-xs font-semibold text-slate-200 cursor-pointer active:scale-95 transition-all"
                    >
                      -1
                    </button>
                    <button
                      onClick={() => updateProductStock(p.id, p.stock + 1)}
                      className="flex-1 py-1.5 bg-slate-800 hover:bg-slate-700 rounded-lg text-xs font-semibold text-slate-200 cursor-pointer active:scale-95 transition-all"
                    >
                      +1
                    </button>
                    <button
                      onClick={() => updateProductStock(p.id, p.stock + 10)}
                      className="flex-1 py-1.5 bg-amber-500 hover:bg-amber-400 rounded-lg text-xs font-bold text-slate-950 cursor-pointer active:scale-95 transition-all shadow-xs"
                    >
                      +10
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 4: GESTOR DE PEDIDOS */}
        {adminTab === 'orders' && (
          <div className="space-y-6">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div>
                <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight">Gestor de Pedidos de Clientes</h2>
                <p className="text-xs text-slate-400">Actualiza estados de pago y preparación para entrega o retiro.</p>
              </div>

              {/* Filter by status */}
              <div className="flex flex-wrap gap-1.5 text-xs">
                {['all', 'verifying_payment', 'ready_for_pickup', 'in_transit', 'delivered'].map((st) => (
                  <button
                    key={st}
                    onClick={() => setOrderFilter(st)}
                    className={`px-3 py-1.5 rounded-lg capitalize font-semibold cursor-pointer transition-all ${
                      orderFilter === st ? 'bg-amber-500 text-slate-950 shadow-xs font-bold' : 'bg-slate-950/60 border border-slate-800 text-slate-300 hover:bg-slate-800'
                    }`}
                  >
                    {st.replace('_', ' ')}
                  </button>
                ))}
              </div>
            </div>

            {/* Orders list */}
            <div className="space-y-4">
              {orders
                .filter(o => orderFilter === 'all' || o.fulfillmentStatus === orderFilter)
                .map((order) => (
                  <div key={order.id} className="bg-slate-950/60 border border-slate-800 rounded-xl p-5 space-y-4 shadow-xs">
                    <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-800 pb-3">
                      <div>
                        <span className="font-mono font-bold text-base text-white">{order.orderNumber}</span>
                        <span className="text-xs text-slate-400 ml-3">
                          {new Date(order.createdAt).toLocaleString('es-HN')}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="font-mono font-bold text-amber-400 text-sm">
                          {formatLempiras(order.total)}
                        </span>
                        <span className="px-2.5 py-0.5 rounded-full text-[10px] font-semibold uppercase bg-slate-900 border border-slate-800 text-slate-300">
                          {order.deliveryMethod === 'pickup' ? 'Retiro en Bodega' : 'Flete Domicilio'}
                        </span>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
                      <div>
                        <span className="text-slate-400 block font-medium">Cliente:</span>
                        <span className="font-semibold text-white">{order.customer.name}</span>
                        <span className="text-slate-400 block">{order.customer.phone}</span>
                        {order.customer.address && (
                          <span className="text-slate-400 block truncate">{order.customer.address}</span>
                        )}
                      </div>

                      <div>
                        <span className="text-slate-400 block font-medium">Método de Pago:</span>
                        <span className="font-semibold text-white uppercase">{order.paymentMethod}</span>
                        {order.bankReference && (
                          <span className="font-mono text-amber-400 block">Ref: {order.bankReference}</span>
                        )}
                        <span className="text-slate-400 block">Estado: {order.paymentStatus}</span>
                      </div>

                      <div>
                        <span className="text-slate-400 block font-medium">Token de Retiro / Entrega:</span>
                        <span className="font-mono font-bold text-emerald-400 text-sm block">
                          {order.pickupQrCode}
                        </span>
                        {order.pickupTimeSlot && (
                          <span className="text-slate-300 block">{order.pickupTimeSlot}</span>
                        )}
                      </div>
                    </div>

                    {/* Change Status Controls */}
                    <div className="pt-3 border-t border-slate-800 flex flex-wrap items-center justify-between gap-3">
                      <div className="flex items-center gap-2 text-xs">
                        <span className="text-slate-400 font-medium">Cambiar Estado:</span>
                        <select
                          value={order.fulfillmentStatus}
                          onChange={(e) => updateOrderStatus(order.id, e.target.value as any)}
                          className="bg-slate-900 border border-slate-800 rounded-lg px-2.5 py-1 text-xs text-white font-medium focus:outline-none focus:ring-1 focus:ring-amber-500"
                        >
                          <option value="verifying_payment">En Verificación de Pago</option>
                          <option value="in_preparation">En Preparación (Corte / Carga)</option>
                          <option value="ready_for_pickup">Listo para Retiro en Bodega</option>
                          <option value="in_transit">En Camino (Camión Plataforma)</option>
                          <option value="delivered">Entregado / Completado</option>
                          <option value="cancelled">Cancelado</option>
                        </select>
                      </div>

                      <div className="flex items-center gap-2">
                        {order.paymentStatus === 'verifying' && (
                          <button
                            onClick={() => updateOrderStatus(order.id, 'in_preparation', 'approved')}
                            className="px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-xs font-semibold cursor-pointer active:scale-[0.98] transition-all shadow-xs"
                          >
                            ✓ Aprobar Pago Bancario
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
            </div>
          </div>
        )}

        {/* TAB 5: GESTOR DE COTIZACIONES */}
        {adminTab === 'quotes' && (
          <div className="space-y-6">
            <div>
              <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight">Cotizaciones Emitidas</h2>
              <p className="text-xs text-slate-400">Folios de cotización generados para clientes y constructores.</p>
            </div>

            <div className="space-y-3">
              {quotes.map((q) => (
                <div key={q.id} className="bg-slate-950/60 border border-slate-800 rounded-xl p-4 flex flex-wrap items-center justify-between gap-4 shadow-xs">
                  <div>
                    <span className="font-mono font-bold text-white text-base">{q.quoteNumber}</span>
                    <span className="text-xs text-slate-400 ml-2 font-medium">{q.customer.name} ({q.customer.phone})</span>
                    <div className="text-xs text-slate-400 mt-1">
                      Validez: {q.validUntil} · {q.items.length} partidas de material
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <span className="font-mono font-bold text-amber-400 text-base">
                      {formatLempiras(q.total)}
                    </span>
                    <button
                      onClick={() => setViewingQuote(q)}
                      className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg text-xs font-semibold flex items-center gap-1 cursor-pointer transition-colors"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      Ver Detalle
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 6: GESTOR DE ZONAS Y FLETES */}
        {adminTab === 'zones' && (
          <div className="space-y-6">
            <div>
              <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight">Tarifas de Logística y Fletes en La Ceiba</h2>
              <p className="text-xs text-slate-400">Configura precios de flete por zona geográfica y umbrales de envío gratis.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {deliveryZones.map((z, idx) => (
                <div key={z.id} className="bg-slate-950/60 border border-slate-800 rounded-xl p-4 space-y-3 shadow-xs">
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="font-semibold text-white text-sm">{z.name}</h4>
                      <p className="text-xs text-slate-400 mt-0.5">{z.description}</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3 text-xs pt-2 border-t border-slate-800">
                    <div>
                      <label className="text-slate-400 block text-[10px] uppercase font-bold tracking-wider">Tarifa Base (L.):</label>
                      <input
                        type="number"
                        value={z.rate}
                        onChange={(e) => {
                          const updated = [...deliveryZones];
                          updated[idx].rate = parseFloat(e.target.value) || 0;
                          setDeliveryZones(updated);
                        }}
                        className="w-full bg-slate-900 border border-slate-800 rounded-lg px-2.5 py-1.5 text-white font-mono font-bold mt-1 focus:outline-none focus:ring-1 focus:ring-amber-500"
                      />
                    </div>
                    <div>
                      <label className="text-slate-400 block text-[10px] uppercase font-bold tracking-wider">Envío Gratis Desde (L.):</label>
                      <input
                        type="number"
                        value={z.freeShippingThreshold}
                        onChange={(e) => {
                          const updated = [...deliveryZones];
                          updated[idx].freeShippingThreshold = parseFloat(e.target.value) || 0;
                          setDeliveryZones(updated);
                        }}
                        className="w-full bg-slate-900 border border-slate-800 rounded-lg px-2.5 py-1.5 text-white font-mono font-bold mt-1 focus:outline-none focus:ring-1 focus:ring-amber-500"
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 7: CONFIGURACIÓN GENERAL */}
        {adminTab === 'settings' && (
          <div className="space-y-6 max-w-2xl">
            <div>
              <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight">Configuración del Negocio</h2>
              <p className="text-xs text-slate-400">Datos fiscales, horarios de atención y números de WhatsApp de La Ceiba.</p>
            </div>

            <div className="bg-slate-950/60 border border-slate-800 rounded-xl p-6 space-y-4 text-xs shadow-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Nombre Comercial</label>
                  <input
                    type="text"
                    value={businessConfig.companyName}
                    onChange={(e) => setBusinessConfig({ ...businessConfig, companyName: e.target.value })}
                    className="w-full bg-slate-900 border border-slate-800 rounded-lg p-2.5 text-white focus:outline-none focus:ring-1 focus:ring-amber-500"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">RTN de la Empresa</label>
                  <input
                    type="text"
                    value={businessConfig.rtn}
                    onChange={(e) => setBusinessConfig({ ...businessConfig, rtn: e.target.value })}
                    className="w-full bg-slate-900 border border-slate-800 rounded-lg p-2.5 text-white font-mono focus:outline-none focus:ring-1 focus:ring-amber-500"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Teléfono PBX La Ceiba</label>
                  <input
                    type="text"
                    value={businessConfig.phone}
                    onChange={(e) => setBusinessConfig({ ...businessConfig, phone: e.target.value })}
                    className="w-full bg-slate-900 border border-slate-800 rounded-lg p-2.5 text-white font-mono focus:outline-none focus:ring-1 focus:ring-amber-500"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">WhatsApp de Ventas</label>
                  <input
                    type="text"
                    value={businessConfig.whatsapp}
                    onChange={(e) => setBusinessConfig({ ...businessConfig, whatsapp: e.target.value })}
                    className="w-full bg-slate-900 border border-slate-800 rounded-lg p-2.5 text-white font-mono focus:outline-none focus:ring-1 focus:ring-amber-500"
                  />
                </div>
                <div className="sm:col-span-2">
                  <label className="block text-slate-300 font-semibold mb-1">Dirección de Bodega</label>
                  <input
                    type="text"
                    value={businessConfig.address}
                    onChange={(e) => setBusinessConfig({ ...businessConfig, address: e.target.value })}
                    className="w-full bg-slate-900 border border-slate-800 rounded-lg p-2.5 text-white focus:outline-none focus:ring-1 focus:ring-amber-500"
                  />
                </div>
                <div className="sm:col-span-2">
                  <label className="block text-slate-300 font-semibold mb-1">Horarios de Atención</label>
                  <input
                    type="text"
                    value={businessConfig.hours}
                    onChange={(e) => setBusinessConfig({ ...businessConfig, hours: e.target.value })}
                    className="w-full bg-slate-900 border border-slate-800 rounded-lg p-2.5 text-white focus:outline-none focus:ring-1 focus:ring-amber-500"
                  />
                </div>
              </div>

              <div className="pt-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => showToast('Configuración guardada exitosamente', 'success')}
                  className="px-6 py-2.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs uppercase tracking-wider rounded-lg cursor-pointer active:scale-[0.98] transition-all shadow-xs"
                >
                  Guardar Cambios
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Modal for Editing / Adding Products */}
        {editingProduct && (
          <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
            <div className="bg-slate-900 border border-slate-800 rounded-xl max-w-xl w-full p-6 text-white my-8 shadow-xl">
              <h3 className="text-lg font-bold mb-4 tracking-tight">
                {isCreatingNew ? 'Nuevo Producto / Especie' : `Editar: ${editingProduct.name}`}
              </h3>

              <form onSubmit={handleSaveProductForm} className="space-y-4 text-xs">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-slate-400 font-semibold mb-1">Nombre Comercial *</label>
                    <input
                      type="text"
                      required
                      value={editingProduct.name}
                      onChange={(e) => setEditingProduct({ ...editingProduct, name: e.target.value })}
                      className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-white focus:outline-none focus:ring-1 focus:ring-amber-500"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-400 font-semibold mb-1">SKU / Código *</label>
                    <input
                      type="text"
                      required
                      value={editingProduct.sku}
                      onChange={(e) => setEditingProduct({ ...editingProduct, sku: e.target.value })}
                      className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-white font-mono focus:outline-none focus:ring-1 focus:ring-amber-500"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-400 font-semibold mb-1">Precio Venta (L.) *</label>
                    <input
                      type="number"
                      required
                      step="0.01"
                      value={editingProduct.pricePerUnit}
                      onChange={(e) => setEditingProduct({ ...editingProduct, pricePerUnit: parseFloat(e.target.value) || 0 })}
                      className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-white font-mono focus:outline-none focus:ring-1 focus:ring-amber-500"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-400 font-semibold mb-1">Costo de Compra (L.)</label>
                    <input
                      type="number"
                      step="0.01"
                      value={editingProduct.cost}
                      onChange={(e) => setEditingProduct({ ...editingProduct, cost: parseFloat(e.target.value) || 0 })}
                      className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-white font-mono focus:outline-none focus:ring-1 focus:ring-amber-500"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-400 font-semibold mb-1">Existencia en Bodega</label>
                    <input
                      type="number"
                      value={editingProduct.stock}
                      onChange={(e) => setEditingProduct({ ...editingProduct, stock: parseInt(e.target.value) || 0 })}
                      className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-white font-mono focus:outline-none focus:ring-1 focus:ring-amber-500"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-400 font-semibold mb-1">Medida Visible (ej. 2" x 4" x 12')</label>
                    <input
                      type="text"
                      value={editingProduct.dimensionString || ''}
                      onChange={(e) => setEditingProduct({ ...editingProduct, dimensionString: e.target.value })}
                      className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-white font-mono focus:outline-none focus:ring-1 focus:ring-amber-500"
                    />
                  </div>
                </div>

                {/* Product Image Section */}
                <div className="p-3 bg-slate-950 border border-amber-500/40 rounded-lg space-y-2.5 shadow-sm">
                  <div className="flex items-center justify-between">
                    <label className="text-amber-300 font-semibold flex items-center gap-1.5">
                      <ImageIcon className="w-4 h-4 text-amber-400" />
                      Fotografía del Producto / Material
                    </label>
                    <span className="text-[10px] text-amber-400/80 font-mono">JPG, PNG, WebP o Ruta</span>
                  </div>

                  <div className="flex items-center gap-3">
                    {/* Thumbnail preview */}
                    <div className="w-16 h-16 rounded-lg bg-slate-900 border border-slate-700 overflow-hidden shrink-0 flex items-center justify-center relative shadow-inner">
                      {editingProduct.imageUrl ? (
                        <img 
                          src={editingProduct.imageUrl} 
                          alt="Vista previa" 
                          className="w-full h-full object-cover" 
                          onError={(e) => {
                            (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1546484396-fb3fc6f95f98?auto=format&fit=crop&w=800&q=80';
                          }}
                        />
                      ) : (
                        <ImageIcon className="w-6 h-6 text-slate-600" />
                      )}
                    </div>

                    <div className="flex-1 space-y-1.5">
                      <input
                        type="text"
                        placeholder="/images/gallery/mi-foto.jpg o https://..."
                        value={editingProduct.imageUrl || ''}
                        onChange={(e) => {
                          const sanitized = sanitizeImagePath(e.target.value);
                          setEditingProduct({ ...editingProduct, imageUrl: sanitized });
                        }}
                        className="w-full bg-slate-900 border border-slate-800 rounded-lg p-2 text-white font-mono text-[11px] focus:outline-none focus:ring-1 focus:ring-amber-500"
                      />
                      
                      <div className="flex flex-wrap items-center gap-2">
                        <label className={`px-2.5 py-1 rounded text-[11px] font-semibold flex items-center gap-1 cursor-pointer transition-colors ${
                          isCompressingImage 
                            ? 'bg-amber-600 text-white cursor-wait' 
                            : 'bg-slate-800 hover:bg-slate-700 text-slate-200'
                        }`}>
                          {isCompressingImage ? (
                            <>
                              <Loader2 className="w-3 h-3 animate-spin text-amber-300" />
                              Optimizando foto...
                            </>
                          ) : (
                            <>
                              <Upload className="w-3 h-3 text-amber-400" />
                              Subir desde mi computadora o teléfono
                            </>
                          )}
                          <input
                            type="file"
                            accept="image/*"
                            disabled={isCompressingImage}
                            className="hidden"
                            onChange={async (e) => {
                              const file = e.target.files?.[0];
                              if (file) {
                                setIsCompressingImage(true);
                                setImageUploadNotice('Optimizando imagen para carga ultrarrápida...');
                                try {
                                  const compressedDataUrl = await compressImageFile(file);
                                  setEditingProduct({ ...editingProduct, imageUrl: compressedDataUrl });
                                  setImageUploadNotice('✓ Imagen optimizada con éxito para almacenamiento seguro');
                                } catch (err: any) {
                                  console.error('Error optimizando imagen:', err);
                                  setImageUploadNotice(null);
                                } finally {
                                  setIsCompressingImage(false);
                                }
                              }
                            }}
                          />
                        </label>

                        {imageUploadNotice && (
                          <span className="text-[10px] text-emerald-400 flex items-center gap-1">
                            <Check className="w-3 h-3 text-emerald-400" />
                            {imageUploadNotice}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Clarification guide about public/ vs web URL */}
                  <div className="p-2 bg-slate-900/90 rounded border border-slate-800 text-[10px] text-slate-400 space-y-1">
                    <p>
                      <strong className="text-amber-400 font-medium">¿Tienes fotos en tu computadora dentro del proyecto?</strong>
                    </p>
                    <p className="leading-relaxed">
                      Si guardas archivos en <code className="text-slate-300 bg-slate-950 px-1 py-0.5 rounded font-mono">public/images/gallery/mi-foto.jpg</code>, en la casilla de arriba escribe únicamente <code className="text-amber-300 bg-slate-950 px-1 py-0.5 rounded font-mono font-bold">/images/gallery/mi-foto.jpg</code>.
                    </p>
                    <p className="text-slate-500 text-[9px]">
                      (Las páginas web no deben incluir la palabra "public" ni diagonales invertidas \)
                    </p>
                  </div>

                  {/* Quick Preset Images */}
                  <div className="pt-2 border-t border-slate-800/80">
                    <span className="text-[10px] text-slate-400 block mb-1">Galería Rápida de Maderas y Materiales:</span>
                    <div className="flex flex-wrap gap-1.5">
                      {[
                        { label: 'Pino Tratado', url: 'https://images.unsplash.com/photo-1546484396-fb3fc6f95f98?auto=format&fit=crop&w=800&q=80' },
                        { label: 'Vigas / Cuartones', url: 'https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=800&q=80' },
                        { label: 'Caoba / Duras', url: 'https://images.unsplash.com/photo-1589939705384-5185137a7f0f?auto=format&fit=crop&w=800&q=80' },
                        { label: 'Plywood / Tableros', url: 'https://images.unsplash.com/photo-1534349762230-e0cadf78f5da?auto=format&fit=crop&w=800&q=80' },
                        { label: 'Tornillería / Fijación', url: 'https://images.unsplash.com/photo-1581783342308-f792dbdd27c5?auto=format&fit=crop&w=800&q=80' },
                        { label: 'Herramientas', url: 'https://images.unsplash.com/photo-1504148455328-c376907d081c?auto=format&fit=crop&w=800&q=80' },
                      ].map((preset) => (
                        <button
                          key={preset.label}
                          type="button"
                          onClick={() => {
                            setEditingProduct({ ...editingProduct, imageUrl: preset.url });
                            setImageUploadNotice(null);
                          }}
                          className="px-2 py-0.5 rounded bg-slate-900 hover:bg-slate-800 text-[10px] text-slate-300 hover:text-amber-400 border border-slate-800 transition-colors cursor-pointer"
                        >
                          {preset.label}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-slate-400 font-semibold mb-1">Descripción</label>
                  <textarea
                    rows={2}
                    value={editingProduct.description}
                    onChange={(e) => setEditingProduct({ ...editingProduct, description: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-white focus:outline-none focus:ring-1 focus:ring-amber-500"
                  />
                </div>

                <div className="flex justify-end gap-2 pt-3 border-t border-slate-800">
                  <button
                    type="button"
                    onClick={() => setEditingProduct(null)}
                    className="px-4 py-2 rounded-lg border border-slate-800 text-slate-400 hover:text-white cursor-pointer transition-colors"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold rounded-lg cursor-pointer active:scale-[0.98] transition-all shadow-xs"
                  >
                    Guardar Producto
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};
