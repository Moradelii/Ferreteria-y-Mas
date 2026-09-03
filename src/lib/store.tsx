import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  Product, 
  CartItem, 
  Order, 
  Quote, 
  DeliveryZone, 
  BankAccount, 
  BusinessConfig, 
  AdditionalService,
  CustomerInfo,
  WoodDimension,
  SelectedServiceItem,
  DeliveryMethod,
  PaymentMethod
} from '../types';
import { 
  initialProducts, 
  initialDeliveryZones, 
  initialBankAccounts, 
  initialBusinessConfig, 
  initialServices,
  sampleOrders,
  sampleQuotes 
} from '../data/initialData';
import { calculateCartSummary, calculateItemTotal } from './pricingEngine';

interface AppContextType {
  // Navigation & View
  currentView: 'store' | 'admin';
  setCurrentView: (view: 'store' | 'admin') => void;
  activeNavTab: string;
  setActiveNavTab: (tab: string) => void;
  adminTab: 'dashboard' | 'products' | 'inventory' | 'orders' | 'quotes' | 'zones' | 'settings';
  setAdminTab: (tab: 'dashboard' | 'products' | 'inventory' | 'orders' | 'quotes' | 'zones' | 'settings') => void;

  // Products
  products: Product[];
  setProducts: React.Dispatch<React.SetStateAction<Product[]>>;
  updateProductStock: (productId: string, newStock: number, actionNote?: string) => void;
  saveProduct: (product: Product) => void;
  deleteProduct: (productId: string) => void;

  // Services & Config
  services: AdditionalService[];
  deliveryZones: DeliveryZone[];
  setDeliveryZones: React.Dispatch<React.SetStateAction<DeliveryZone[]>>;
  bankAccounts: BankAccount[];
  businessConfig: BusinessConfig;
  setBusinessConfig: React.Dispatch<React.SetStateAction<BusinessConfig>>;

  // Cart
  cart: CartItem[];
  addToCart: (
    product: Product, 
    quantity: number, 
    customDim?: WoodDimension, 
    services?: SelectedServiceItem[]
  ) => void;
  updateCartItemQuantity: (itemId: string, quantity: number) => void;
  removeFromCart: (itemId: string) => void;
  clearCart: () => void;
  isCartOpen: boolean;
  setIsCartOpen: (open: boolean) => void;

  // Selected Delivery
  deliveryMethod: DeliveryMethod;
  setDeliveryMethod: (method: DeliveryMethod) => void;
  selectedZone: DeliveryZone | null;
  setSelectedZone: (zone: DeliveryZone | null) => void;
  pickupTimeSlot: string;
  setPickupTimeSlot: (slot: string) => void;

  // Orders & Quotes
  orders: Order[];
  quotes: Quote[];
  createOrder: (
    customer: CustomerInfo, 
    paymentMethod: PaymentMethod,
    bankRef?: string
  ) => Order;
  createQuote: (customer: CustomerInfo) => Quote;
  updateOrderStatus: (orderId: string, status: Order['fulfillmentStatus'], paymentStatus?: Order['paymentStatus']) => void;
  convertQuoteToOrder: (quoteId: string) => Order | null;

  // Modals & Active Inspecting
  inspectProduct: Product | null;
  setInspectProduct: (prod: Product | null) => void;
  isCheckoutOpen: boolean;
  setIsCheckoutOpen: (open: boolean) => void;
  completedOrder: Order | null;
  setCompletedOrder: (order: Order | null) => void;
  viewingQuote: Quote | null;
  setViewingQuote: (quote: Quote | null) => void;

  // Search & Filters
  searchQuery: string;
  setSearchQuery: (q: string) => void;
  selectedCategoryFilter: string;
  setSelectedCategoryFilter: (cat: string) => void;

  // Toast
  toast: { message: string; type: 'success' | 'info' | 'warning' | 'error' } | null;
  showToast: (message: string, type?: 'success' | 'info' | 'warning' | 'error') => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Navigation
  const [currentView, setCurrentView] = useState<'store' | 'admin'>('store');
  const [activeNavTab, setActiveNavTab] = useState<string>('inicio');
  const [adminTab, setAdminTab] = useState<'dashboard' | 'products' | 'inventory' | 'orders' | 'quotes' | 'zones' | 'settings'>('dashboard');

  // Products
  const [products, setProducts] = useState<Product[]>(() => {
    const saved = localStorage.getItem('fym_products');
    return saved ? JSON.parse(saved) : initialProducts;
  });

  // Services & Config
  const [services] = useState<AdditionalService[]>(initialServices);
  const [deliveryZones, setDeliveryZones] = useState<DeliveryZone[]>(() => {
    const saved = localStorage.getItem('fym_zones');
    return saved ? JSON.parse(saved) : initialDeliveryZones;
  });
  const [bankAccounts] = useState<BankAccount[]>(initialBankAccounts);
  const [businessConfig, setBusinessConfig] = useState<BusinessConfig>(() => {
    const saved = localStorage.getItem('fym_config');
    return saved ? JSON.parse(saved) : initialBusinessConfig;
  });

  // Cart
  const [cart, setCart] = useState<CartItem[]>(() => {
    const saved = localStorage.getItem('fym_cart');
    return saved ? JSON.parse(saved) : [];
  });
  const [isCartOpen, setIsCartOpen] = useState(false);

  // Delivery & Pickup State
  const [deliveryMethod, setDeliveryMethod] = useState<DeliveryMethod>('pickup');
  const [selectedZone, setSelectedZone] = useState<DeliveryZone | null>(deliveryZones[0] || null);
  const [pickupTimeSlot, setPickupTimeSlot] = useState<string>('Hoy entre 2:00 PM y 4:00 PM');

  // Orders & Quotes
  const [orders, setOrders] = useState<Order[]>(() => {
    const saved = localStorage.getItem('fym_orders');
    return saved ? JSON.parse(saved) : sampleOrders;
  });
  const [quotes, setQuotes] = useState<Quote[]>(() => {
    const saved = localStorage.getItem('fym_quotes');
    return saved ? JSON.parse(saved) : sampleQuotes;
  });

  // Modals
  const [inspectProduct, setInspectProduct] = useState<Product | null>(null);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState<boolean>(false);
  const [completedOrder, setCompletedOrder] = useState<Order | null>(null);
  const [viewingQuote, setViewingQuote] = useState<Quote | null>(null);

  // Filters & Search
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategoryFilter, setSelectedCategoryFilter] = useState('all');

  // Toast
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'info' | 'warning' | 'error' } | null>(null);

  const showToast = (message: string, type: 'success' | 'info' | 'warning' | 'error' = 'success') => {
    setToast({ message, type });
    setTimeout(() => {
      setToast(null);
    }, 4000);
  };

  // Sync to localStorage
  useEffect(() => {
    localStorage.setItem('fym_products', JSON.stringify(products));
  }, [products]);

  useEffect(() => {
    localStorage.setItem('fym_cart', JSON.stringify(cart));
  }, [cart]);

  useEffect(() => {
    localStorage.setItem('fym_orders', JSON.stringify(orders));
  }, [orders]);

  useEffect(() => {
    localStorage.setItem('fym_quotes', JSON.stringify(quotes));
  }, [quotes]);

  useEffect(() => {
    localStorage.setItem('fym_zones', JSON.stringify(deliveryZones));
  }, [deliveryZones]);

  useEffect(() => {
    localStorage.setItem('fym_config', JSON.stringify(businessConfig));
  }, [businessConfig]);

  // Cart operations
  const addToCart = (
    product: Product, 
    quantity: number, 
    customDim?: WoodDimension, 
    itemServices: SelectedServiceItem[] = []
  ) => {
    const { unitPrice, subtotal, boardFeet } = calculateItemTotal(product, quantity, customDim, itemServices);
    
    // Create new cart item
    const newItem: CartItem = {
      id: `cart_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
      productId: product.id,
      product,
      quantity,
      customDimensions: customDim,
      calculatedBoardFeet: boardFeet,
      selectedServices: itemServices,
      unitPrice,
      subtotal
    };

    setCart(prev => [...prev, newItem]);
    showToast(`Agregado: ${quantity}x ${product.name}`, 'success');
  };

  const updateCartItemQuantity = (itemId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(itemId);
      return;
    }
    setCart(prev => prev.map(item => {
      if (item.id === itemId) {
        const { subtotal } = calculateItemTotal(
          item.product, 
          quantity, 
          item.customDimensions, 
          item.selectedServices
        );
        return {
          ...item,
          quantity,
          subtotal
        };
      }
      return item;
    }));
  };

  const removeFromCart = (itemId: string) => {
    setCart(prev => prev.filter(i => i.id !== itemId));
    showToast('Producto removido del carrito', 'info');
  };

  const clearCart = () => {
    setCart([]);
  };

  // Stock management
  const updateProductStock = (productId: string, newStock: number) => {
    setProducts(prev => prev.map(p => {
      if (p.id === productId) {
        const status = newStock <= 0 ? 'out_of_stock' : newStock <= p.minStock ? 'low_stock' : 'in_stock';
        return { ...p, stock: newStock, status };
      }
      return p;
    }));
    showToast('Inventario actualizado con éxito', 'success');
  };

  const saveProduct = (product: Product) => {
    setProducts(prev => {
      const exists = prev.some(p => p.id === product.id);
      if (exists) {
        return prev.map(p => p.id === product.id ? product : p);
      }
      return [product, ...prev];
    });
    showToast(`Producto ${product.name} guardado correctamente`, 'success');
  };

  const deleteProduct = (productId: string) => {
    setProducts(prev => prev.filter(p => p.id !== productId));
    showToast('Producto eliminado del catálogo', 'info');
  };

  // Create Order
  const createOrder = (
    customer: CustomerInfo, 
    paymentMethod: PaymentMethod,
    bankRef?: string
  ): Order => {
    const summary = calculateCartSummary(
      cart, 
      deliveryMethod === 'delivery' ? selectedZone : null, 
      deliveryMethod === 'pickup',
      businessConfig.isvPercent
    );

    const orderSeq = (orders.length + 43).toString().padStart(5, '0');
    const orderNumber = `ORD-2026-${orderSeq}`;
    const qrToken = `RET-CEI-${Math.floor(100000 + Math.random() * 900000)}`;

    const newOrder: Order = {
      id: orderNumber,
      orderNumber,
      customer,
      items: [...cart],
      subtotal: summary.subtotal,
      servicesTotal: summary.servicesTotal,
      tax: summary.tax,
      shippingFee: summary.shippingFee,
      discount: 0,
      total: summary.total,
      deliveryMethod,
      deliveryZoneId: selectedZone?.id,
      deliveryZoneName: selectedZone?.name,
      pickupTimeSlot: deliveryMethod === 'pickup' ? pickupTimeSlot : undefined,
      pickupQrCode: qrToken,
      paymentMethod,
      paymentStatus: paymentMethod === 'card' ? 'approved' : 'pending',
      fulfillmentStatus: paymentMethod === 'card' ? 'in_preparation' : 'verifying_payment',
      bankReference: bankRef,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    // Deduct stock for items
    cart.forEach(item => {
      updateProductStock(item.productId, Math.max(0, item.product.stock - item.quantity));
    });

    setOrders(prev => [newOrder, ...prev]);
    clearCart();
    setCompletedOrder(newOrder);
    setIsCheckoutOpen(false);
    showToast(`¡Pedido ${orderNumber} registrado exitosamente!`, 'success');

    return newOrder;
  };

  // Create Quotation
  const createQuote = (customer: CustomerInfo): Quote => {
    const summary = calculateCartSummary(
      cart, 
      deliveryMethod === 'delivery' ? selectedZone : null, 
      deliveryMethod === 'pickup',
      businessConfig.isvPercent
    );

    const quoteSeq = (quotes.length + 19).toString().padStart(5, '0');
    const quoteNumber = `COT-2026-${quoteSeq}`;

    // Valid for 15 days
    const validDate = new Date();
    validDate.setDate(validDate.getDate() + 15);

    const newQuote: Quote = {
      id: quoteNumber,
      quoteNumber,
      customer,
      items: [...cart],
      subtotal: summary.subtotal,
      servicesTotal: summary.servicesTotal,
      tax: summary.tax,
      shippingFee: summary.shippingFee,
      total: summary.total,
      deliveryMethod,
      deliveryZoneName: deliveryMethod === 'delivery' ? selectedZone?.name : 'Retiro en Bodega',
      validUntil: validDate.toISOString().split('T')[0],
      status: 'active',
      createdAt: new Date().toISOString()
    };

    setQuotes(prev => [newQuote, ...prev]);
    setViewingQuote(newQuote);
    showToast(`Cotización ${quoteNumber} generada y lista para compartir`, 'success');

    return newQuote;
  };

  const updateOrderStatus = (orderId: string, status: Order['fulfillmentStatus'], paymentStatus?: Order['paymentStatus']) => {
    setOrders(prev => prev.map(o => {
      if (o.id === orderId) {
        return {
          ...o,
          fulfillmentStatus: status,
          paymentStatus: paymentStatus || o.paymentStatus,
          updatedAt: new Date().toISOString()
        };
      }
      return o;
    }));
    showToast(`Pedido ${orderId} actualizado a estado: ${status}`, 'info');
  };

  const convertQuoteToOrder = (quoteId: string): Order | null => {
    const quote = quotes.find(q => q.id === quoteId);
    if (!quote) return null;

    setCart(quote.items);
    setQuotes(prev => prev.map(q => q.id === quoteId ? { ...q, status: 'converted' } : q));
    setIsCheckoutOpen(true);
    showToast(`Cotización ${quoteId} cargada al carrito para finalizar compra`, 'info');
    return null;
  };

  return (
    <AppContext.Provider
      value={{
        currentView,
        setCurrentView,
        activeNavTab,
        setActiveNavTab,
        adminTab,
        setAdminTab,
        products,
        setProducts,
        updateProductStock,
        saveProduct,
        deleteProduct,
        services,
        deliveryZones,
        setDeliveryZones,
        bankAccounts,
        businessConfig,
        setBusinessConfig,
        cart,
        addToCart,
        updateCartItemQuantity,
        removeFromCart,
        clearCart,
        isCartOpen,
        setIsCartOpen,
        deliveryMethod,
        setDeliveryMethod,
        selectedZone,
        setSelectedZone,
        pickupTimeSlot,
        setPickupTimeSlot,
        orders,
        quotes,
        createOrder,
        createQuote,
        updateOrderStatus,
        convertQuoteToOrder,
        inspectProduct,
        setInspectProduct,
        isCheckoutOpen,
        setIsCheckoutOpen,
        completedOrder,
        setCompletedOrder,
        viewingQuote,
        setViewingQuote,
        searchQuery,
        setSearchQuery,
        selectedCategoryFilter,
        setSelectedCategoryFilter,
        toast,
        showToast
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
