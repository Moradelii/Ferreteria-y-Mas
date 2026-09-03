export type WoodSpecies = 'pino_nacional' | 'pino_tratado' | 'cedro' | 'laurel' | 'plywood' | 'caoba';

export type ProductUnit = 'pieza' | 'pie_tablar' | 'vara' | 'metro' | 'metro_lineal' | 'unidad' | 'hoja';

export type StockStatus = 'in_stock' | 'low_stock' | 'out_of_stock' | 'on_order';

export interface WoodDimension {
  thicknessInches: number; // e.g. 1, 2, 3, 4, 0.75
  widthInches: number;     // e.g. 2, 4, 6, 8, 10, 12
  lengthFeet: number;      // e.g. 8, 10, 12, 14, 16, 20
  label: string;           // e.g. '2" x 4" x 12\''
}

export interface AdditionalService {
  id: string;
  name: string;
  description: string;
  price: number; // in Lempiras (L.)
  unit: string;  // 'por corte', 'por pieza', 'por pie'
  active: boolean;
}

export interface Product {
  id: string;
  sku: string;
  name: string;
  slug: string;
  category: 'madera' | 'madera_dimensionada' | 'tableros' | 'ferreteria' | 'herramientas' | 'fijaciones';
  species?: WoodSpecies;
  description: string;
  dimensions?: WoodDimension;
  dimensionString?: string; // e.g. "2\" x 4\" x 12'"
  unit: ProductUnit;
  pricePerUnit: number; // in Lempiras (L.)
  pricePerBoardFoot?: number; // Precio por pie tablar si aplica
  cost: number;
  stock: number;
  minStock: number;
  status: StockStatus;
  imageUrl: string;
  technicalSpecs?: {
    humedad?: string;
    tratamiento?: string;
    calidad?: string;
    origen?: string;
    pesoAprox?: string;
  };
  featured?: boolean;
}

export interface SelectedServiceItem {
  serviceId: string;
  serviceName: string;
  price: number;
  quantity: number;
}

export interface CartItem {
  id: string; // unique item instance id
  productId: string;
  product: Product;
  quantity: number;
  customDimensions?: WoodDimension;
  calculatedBoardFeet?: number;
  selectedServices: SelectedServiceItem[];
  unitPrice: number;
  subtotal: number;
}

export type DeliveryMethod = 'pickup' | 'delivery';

export interface DeliveryZone {
  id: string;
  name: string;
  description: string;
  rate: number; // Lempiras
  freeShippingThreshold: number; // e.g. L. 4,500
  estimatedDeliveryTime: string; // e.g. "Mismo día o 24 hrs"
  active: boolean;
}

export type PaymentMethod = 'card' | 'bank_transfer' | 'cash';

export type PaymentStatus = 'pending' | 'verifying' | 'approved' | 'rejected';

export type FulfillmentStatus = 
  | 'pending'
  | 'verifying_payment'
  | 'in_preparation'
  | 'ready_for_pickup'
  | 'in_transit'
  | 'delivered'
  | 'cancelled';

export interface CustomerInfo {
  name: string;
  phone: string;
  whatsapp: string;
  email: string;
  idNumber?: string; // RTN or DNI
  companyName?: string;
  address?: string;
  notes?: string;
}

export interface Order {
  id: string; // e.g. "ORD-2026-00042"
  orderNumber: string;
  customer: CustomerInfo;
  items: CartItem[];
  subtotal: number;
  servicesTotal: number;
  tax: number; // ISV 15%
  shippingFee: number;
  discount: number;
  total: number;
  deliveryMethod: DeliveryMethod;
  deliveryZoneId?: string;
  deliveryZoneName?: string;
  pickupTimeSlot?: string;
  pickupQrCode: string; // unique validation token
  paymentMethod: PaymentMethod;
  paymentStatus: PaymentStatus;
  fulfillmentStatus: FulfillmentStatus;
  bankReference?: string;
  bankReceiptUrl?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Quote {
  id: string; // e.g. "COT-2026-00018"
  quoteNumber: string;
  customer: CustomerInfo;
  items: CartItem[];
  subtotal: number;
  servicesTotal: number;
  tax: number;
  shippingFee: number;
  total: number;
  deliveryMethod: DeliveryMethod;
  deliveryZoneName?: string;
  validUntil: string;
  status: 'active' | 'converted' | 'expired';
  createdAt: string;
}

export interface BankAccount {
  id: string;
  bankName: string;
  accountType: 'Moneda Nacional (Lempiras)' | 'Dólares (USD)';
  accountNumber: string;
  beneficiary: string;
  rtn: string;
  logo: string;
}

export interface BusinessConfig {
  companyName: string;
  tagline: string;
  rtn: string;
  phone: string;
  whatsapp: string;
  email: string;
  address: string;
  city: string;
  hours: string;
  isvPercent: number; // 15% Honduras
  woodReservationMinutes: number;
}
