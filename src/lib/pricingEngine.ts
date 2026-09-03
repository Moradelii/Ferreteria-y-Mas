import { WoodDimension, AdditionalService, SelectedServiceItem, CartItem, Product, DeliveryZone } from '../types';

/**
 * Calculates board feet (Pies Tablares) from dimensions in inches and feet
 * Formula: (Grosor" x Ancho" x Largo') / 12
 */
export function calculateBoardFeet(thicknessInches: number, widthInches: number, lengthFeet: number): number {
  if (thicknessInches <= 0 || widthInches <= 0 || lengthFeet <= 0) return 0;
  const bf = (thicknessInches * widthInches * lengthFeet) / 12;
  return Math.round(bf * 100) / 100;
}

/**
 * Calculates item subtotal based on unit or board feet plus additional services
 */
export function calculateItemTotal(
  product: Product,
  quantity: number,
  customDim?: WoodDimension,
  selectedServices: SelectedServiceItem[] = []
): { unitPrice: number; subtotal: number; boardFeet: number; servicesCost: number } {
  let boardFeet = 0;
  let unitPrice = product.pricePerUnit;

  if (customDim) {
    boardFeet = calculateBoardFeet(customDim.thicknessInches, customDim.widthInches, customDim.lengthFeet);
    if (product.pricePerBoardFoot && product.pricePerBoardFoot > 0) {
      unitPrice = Math.round(boardFeet * product.pricePerBoardFoot * 100) / 100;
    }
  } else if (product.dimensions) {
    boardFeet = calculateBoardFeet(
      product.dimensions.thicknessInches,
      product.dimensions.widthInches,
      product.dimensions.lengthFeet
    );
  }

  const productsCost = unitPrice * quantity;
  const servicesCost = selectedServices.reduce((sum, s) => sum + s.price * s.quantity, 0);
  const subtotal = Math.round((productsCost + servicesCost) * 100) / 100;

  return {
    unitPrice,
    subtotal,
    boardFeet,
    servicesCost
  };
}

/**
 * Formats amount into Honduran Lempiras (L.)
 */
export function formatLempiras(amount: number): string {
  return `L. ${amount.toLocaleString('es-HN', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  })}`;
}

/**
 * Calculates cart summary including taxes (ISV 15%) and shipping
 */
export function calculateCartSummary(
  items: CartItem[],
  zone?: DeliveryZone | null,
  isPickup: boolean = false,
  isvPercent: number = 15
) {
  const productsSubtotal = items.reduce((sum, item) => sum + (item.unitPrice * item.quantity), 0);
  const servicesTotal = items.reduce((sum, item) => {
    return sum + (item.selectedServices?.reduce((sSum, s) => sSum + s.price * s.quantity, 0) || 0);
  }, 0);

  const subtotal = productsSubtotal + servicesTotal;
  const tax = Math.round((subtotal * (isvPercent / 100)) * 100) / 100;

  let shippingFee = 0;
  if (!isPickup && zone) {
    if (subtotal >= zone.freeShippingThreshold && zone.freeShippingThreshold > 0) {
      shippingFee = 0;
    } else {
      shippingFee = zone.rate;
    }
  }

  const total = Math.round((subtotal + tax + shippingFee) * 100) / 100;

  return {
    productsSubtotal,
    servicesTotal,
    subtotal,
    tax,
    shippingFee,
    total,
    isFreeShipping: !isPickup && zone && subtotal >= zone.freeShippingThreshold
  };
}

/**
 * Builds professional WhatsApp message for orders and quotes
 */
export function buildWhatsAppMessage(
  code: string,
  type: 'cotizacion' | 'pedido',
  customerName: string,
  items: CartItem[],
  total: number,
  deliveryMethod: string,
  zoneName?: string
): string {
  const emojiType = type === 'pedido' ? '📦 NUEVO PEDIDO' : '🪵 COTIZACIÓN DE MADERA';
  let message = `${emojiType} - FERRETERÍA & MÁS\n`;
  message += `━━━━━━━━━━━━━━━━━━━━━\n`;
  message += `Folio: *${code}*\n`;
  message += `Cliente: *${customerName || 'Cliente'}*\n`;
  message += `Modalidad: *${deliveryMethod === 'pickup' ? 'Retiro Exprés en Bodega' : `Entrega a Domicilio (${zoneName || 'La Ceiba'})`}*\n\n`;
  message += `*DETALLE DE MATERIALES:*\n`;

  items.forEach((item, index) => {
    const dim = item.customDimensions?.label || item.product.dimensionString || '';
    message += `${index + 1}. *${item.product.name}* ${dim ? `(${dim})` : ''}\n`;
    message += `   • Cantidad: ${item.quantity} ${item.product.unit}(s)\n`;
    message += `   • P. Unit: ${formatLempiras(item.unitPrice)}\n`;
    if (item.selectedServices && item.selectedServices.length > 0) {
      message += `   • Servicios: ${item.selectedServices.map(s => s.serviceName).join(', ')}\n`;
    }
    message += `   • Subtotal: ${formatLempiras(item.subtotal)}\n\n`;
  });

  message += `━━━━━━━━━━━━━━━━━━━━━\n`;
  message += `*TOTAL ESTIMADO:* *${formatLempiras(total)}*\n\n`;
  message += `📍 *Ubicación de entrega / retiro:* La Ceiba, Atlántida\n`;
  message += `Favor confirmar disponibilidad de stock y fecha de entrega. ¡Muchas gracias!`;

  return encodeURIComponent(message);
}
