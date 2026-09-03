import { Product, AdditionalService, DeliveryZone, BankAccount, BusinessConfig, Order, Quote } from '../types';

export const initialServices: AdditionalService[] = [
  {
    id: 'srv_corte',
    name: 'Corte a Medida con Sierra Radial',
    description: 'Cortes limpios y exactos según las dimensiones de tu plano.',
    price: 15,
    unit: 'por corte',
    active: true
  },
  {
    id: 'srv_cepillado',
    name: 'Cepillado 4 Caras (S4S)',
    description: 'Acabado liso, suave y libre de astillas listo para barniz o pintura.',
    price: 25,
    unit: 'por pieza',
    active: true
  },
  {
    id: 'srv_tratamiento',
    name: 'Tratamiento Protector Adicional',
    description: 'Sellador anti-comején y protector hidrófugo para intemperie en La Ceiba.',
    price: 45,
    unit: 'por pieza',
    active: true
  }
];

export const initialProducts: Product[] = [
  {
    id: 'prod_pino_2x4x12',
    sku: 'MAD-PIN-2412',
    name: 'Pino Tratado CCA 2" x 4" x 12\'',
    slug: 'pino-tratado-2x4x12',
    category: 'madera_dimensionada',
    species: 'pino_tratado',
    description: 'Madera de pino tratada bajo presión con sales CCA para máxima durabilidad en exteriores, techos, formaletas y estructuras expuestas a la humedad de la costa norte.',
    dimensions: { thicknessInches: 2, widthInches: 4, lengthFeet: 12, label: '2" x 4" x 12\'' },
    dimensionString: '2" x 4" x 12\'',
    unit: 'pieza',
    pricePerUnit: 228.00,
    pricePerBoardFoot: 28.50,
    cost: 160.00,
    stock: 240,
    minStock: 40,
    status: 'in_stock',
    imageUrl: 'https://images.unsplash.com/photo-1546484396-fb3fc6f95f98?auto=format&fit=crop&w=800&q=80',
    technicalSpecs: {
      humedad: '18% - 20% (Seco bajo techo)',
      tratamiento: 'CCA C-4 Presión al vacío',
      calidad: 'Grado Estructural Selecto #1',
      origen: 'Olancho / Siguatepeque, Honduras',
      pesoAprox: '8.5 kg / pieza'
    },
    featured: true
  },
  {
    id: 'prod_pino_2x6x12',
    sku: 'MAD-PIN-2612',
    name: 'Pino Tratado CCA 2" x 6" x 12\'',
    slug: 'pino-tratado-2x6x12',
    category: 'madera_dimensionada',
    species: 'pino_tratado',
    description: 'Viga de pino con tratamiento CCA de alta resistencia mecánica, ideal para cabios, vigas de techado y durmientes de pergolados.',
    dimensions: { thicknessInches: 2, widthInches: 6, lengthFeet: 12, label: '2" x 6" x 12\'' },
    dimensionString: '2" x 6" x 12\'',
    unit: 'pieza',
    pricePerUnit: 342.00,
    pricePerBoardFoot: 28.50,
    cost: 240.00,
    stock: 120,
    minStock: 25,
    status: 'in_stock',
    imageUrl: 'https://images.unsplash.com/photo-1589939705384-5185137a7f0f?auto=format&fit=crop&w=800&q=80',
    technicalSpecs: {
      humedad: '19%',
      tratamiento: 'CCA para retención marina 0.40 pcf',
      calidad: 'Estructural #1',
      origen: 'Honduras'
    },
    featured: true
  },
  {
    id: 'prod_pino_1x12x10',
    sku: 'MAD-TAB-11210',
    name: 'Tabla de Pino Nacional 1" x 12" x 10\'',
    slug: 'tabla-pino-1x12x10',
    category: 'madera_dimensionada',
    species: 'pino_nacional',
    description: 'Tabla ancha de pino de primera calidad, cepillada, perfecta para estanterías, muebles rústicos, revestimientos de pared y encofrados.',
    dimensions: { thicknessInches: 1, widthInches: 12, lengthFeet: 10, label: '1" x 12" x 10\'' },
    dimensionString: '1" x 12" x 10\'',
    unit: 'pieza',
    pricePerUnit: 250.00,
    pricePerBoardFoot: 25.00,
    cost: 175.00,
    stock: 85,
    minStock: 20,
    status: 'in_stock',
    imageUrl: 'https://images.unsplash.com/photo-1513836279014-a89f7a76ae86?auto=format&fit=crop&w=800&q=80',
    technicalSpecs: {
      humedad: '14% (Secado en horno)',
      tratamiento: 'Sin químico (Natural)',
      calidad: 'Grado Mueblería Libre de Nudos Sueltos',
      origen: 'Reserva Forestal Atlántida'
    },
    featured: true
  },
  {
    id: 'prod_cedro_2x4x10',
    sku: 'MAD-CED-2410',
    name: 'Cedro Real Dimensionado 2" x 4" x 10\'',
    slug: 'cedro-real-2x4x10',
    category: 'madera',
    species: 'cedro',
    description: 'Madera fina nativa hondureña con repelencia natural a la polilla y humedad. Acabado de lujo para puertas, marcos, vigas vistas y mobiliario náutico.',
    dimensions: { thicknessInches: 2, widthInches: 4, lengthFeet: 10, label: '2" x 4" x 10\'' },
    dimensionString: '2" x 4" x 10\'',
    unit: 'pieza',
    pricePerUnit: 480.00,
    pricePerBoardFoot: 72.00,
    cost: 330.00,
    stock: 35,
    minStock: 15,
    status: 'low_stock',
    imageUrl: 'https://images.unsplash.com/photo-1520697830682-bbb6e85e2b0b?auto=format&fit=crop&w=800&q=80',
    technicalSpecs: {
      humedad: '12% Secado al aire estabilizado',
      tratamiento: 'Resina natural antixilófagos',
      calidad: 'Madera Preciosa Certificada ICF',
      origen: 'Bosque de Manejo Sostenible Atlántida'
    },
    featured: true
  },
  {
    id: 'prod_plywood_34',
    sku: 'TAB-PLY-34',
    name: 'Plywood Pino Tratado 3/4" (4\' x 8\')',
    slug: 'plywood-pino-3-4',
    category: 'tableros',
    species: 'plywood',
    description: 'Lámina de contrachapado de 18 mm (3/4 pulgada) con adhesivo fenólico WBP resistente al agua. Uso en entrepisos, cubiertas y mobiliario.',
    dimensions: { thicknessInches: 0.75, widthInches: 48, lengthFeet: 8, label: '3/4" x 4\' x 8\'' },
    dimensionString: '3/4" x 4\' x 8\' (1.22m x 2.44m)',
    unit: 'hoja',
    pricePerUnit: 780.00,
    cost: 590.00,
    stock: 64,
    minStock: 15,
    status: 'in_stock',
    imageUrl: 'https://images.unsplash.com/photo-1588854337236-6889d631faa8?auto=format&fit=crop&w=800&q=80',
    technicalSpecs: {
      humedad: '10%',
      tratamiento: 'Cola fenólica grado marino exterior',
      calidad: 'Cara C+/C',
      origen: 'Importación Directa'
    },
    featured: true
  },
  {
    id: 'prod_viga_laurel_4x6x14',
    sku: 'MAD-LAU-4614',
    name: 'Viga de Laurel Macho 4" x 6" x 14\'',
    slug: 'viga-laurel-4x6x14',
    category: 'madera',
    species: 'laurel',
    description: 'Madera dura tropical para columnas y vigas de soporte pesadas en chalets, muelles y arquitectura de playa.',
    dimensions: { thicknessInches: 4, widthInches: 6, lengthFeet: 14, label: '4" x 6" x 14\'' },
    dimensionString: '4" x 6" x 14\'',
    unit: 'pieza',
    pricePerUnit: 1450.00,
    pricePerBoardFoot: 51.80,
    cost: 980.00,
    stock: 18,
    minStock: 8,
    status: 'low_stock',
    imageUrl: 'https://images.unsplash.com/photo-1541123437800-1bb1317badc2?auto=format&fit=crop&w=800&q=80',
    technicalSpecs: {
      humedad: '22% Estabilizada',
      tratamiento: 'Natural alta densidad',
      calidad: 'Extra Pesada Estructural',
      origen: 'Litoral Atlántico'
    }
  },
  {
    id: 'prod_tornillos_deck',
    sku: 'FER-TOR-DECK',
    name: 'Tornillo para Madera Exterior C-3 2-1/2" (Caja 250 pcs)',
    slug: 'tornillo-madera-exterior-2-1-2',
    category: 'fijaciones',
    description: 'Tornillos autorroscantes con recubrimiento cerámico anti-corrosión salina, punta torx T25 con broca incluida.',
    unit: 'unidad',
    pricePerUnit: 340.00,
    cost: 210.00,
    stock: 95,
    minStock: 20,
    status: 'in_stock',
    imageUrl: 'https://images.unsplash.com/photo-1586864387967-d02ef85d93e8?auto=format&fit=crop&w=800&q=80',
    featured: true
  },
  {
    id: 'prod_clavos_madera_3',
    sku: 'FER-CLA-3P',
    name: 'Clavos con Cabeza para Madera 3" (Bolsa 5 lbs)',
    slug: 'clavos-con-cabeza-3-pulgadas',
    category: 'fijaciones',
    description: 'Clavos de acero pulido para armar estructuras de pino, formaletas y techumbres.',
    unit: 'unidad',
    pricePerUnit: 125.00,
    cost: 80.00,
    stock: 140,
    minStock: 30,
    status: 'in_stock',
    imageUrl: 'https://images.unsplash.com/photo-1572981779307-38b8cabb2407?auto=format&fit=crop&w=800&q=80',
    featured: false
  },
  {
    id: 'prod_cemento_bijao',
    sku: 'FER-CEM-BIJ',
    name: 'Cemento Portland Gris Tipo 1 (Bolsa 42.5 Kg)',
    slug: 'cemento-portland-gris-42-5kg',
    category: 'ferreteria',
    description: 'Cemento hidráulico de alta resistencia temprana para cimentaciones de zapatas, postes de pérgola y muros de contención.',
    unit: 'unidad',
    pricePerUnit: 235.00,
    cost: 195.00,
    stock: 350,
    minStock: 50,
    status: 'in_stock',
    imageUrl: 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?auto=format&fit=crop&w=800&q=80',
    featured: true
  },
  {
    id: 'prod_preservante_wood',
    sku: 'FER-PRE-GAL',
    name: 'Preservante e Impregnante para Madera (Galón)',
    slug: 'preservante-impregnante-madera-galon',
    category: 'ferreteria',
    description: 'Formulación insecticida y fungicida base solvente penetrante para prolongar la vida útil de vigas y tablas en climas tropicales.',
    unit: 'unidad',
    pricePerUnit: 420.00,
    cost: 290.00,
    stock: 42,
    minStock: 10,
    status: 'in_stock',
    imageUrl: 'https://images.unsplash.com/photo-1563245372-f21724e3856d?auto=format&fit=crop&w=800&q=80',
    featured: false
  }
];

export const initialDeliveryZones: DeliveryZone[] = [
  {
    id: 'zone_casco_urbano',
    name: 'Zona 1 — Casco Urbano La Ceiba',
    description: 'Centro, El Sauce, La Julia, Barrio Alvarado, Potreritos, Mazapán, Suyapa y zonas céntricas.',
    rate: 150,
    freeShippingThreshold: 3500,
    estimatedDeliveryTime: 'Mismo día (2 a 4 hrs)',
    active: true
  },
  {
    id: 'zone_periferia',
    name: 'Zona 2 — Periferia y Salidas',
    description: 'Colonia Miramar, Satuyé, El Perú, Buenos Aires, Las Delicias, Danto y salida a Tela.',
    rate: 300,
    freeShippingThreshold: 6000,
    estimatedDeliveryTime: 'En 24 horas',
    active: true
  },
  {
    id: 'zone_este',
    name: 'Zona 3 — Corredor Este (Playas & Turismo)',
    description: 'Corozal, Sambo Creek, Piedra Pintada, Río María, Jutiapa y Nueva Armenia.',
    rate: 550,
    freeShippingThreshold: 9000,
    estimatedDeliveryTime: 'Programado en 24-48 hrs',
    active: true
  },
  {
    id: 'zone_oeste',
    name: 'Zona 4 — Corredor Oeste',
    description: 'El Porvenir, Aeropuerto Golosón, La Unión, La Masica y San Juan Pueblo.',
    rate: 750,
    freeShippingThreshold: 12000,
    estimatedDeliveryTime: 'Programado en 48 hrs',
    active: true
  }
];

export const initialBankAccounts: BankAccount[] = [
  {
    id: 'bank_atlantida',
    bankName: 'Banco Atlántida',
    accountType: 'Moneda Nacional (Lempiras)',
    accountNumber: '1100-2003-4921',
    beneficiary: 'Ferretería & Más S. de R.L.',
    rtn: '01019012345678',
    logo: '🏦'
  },
  {
    id: 'bank_bac',
    bankName: 'BAC Credomatic',
    accountType: 'Moneda Nacional (Lempiras)',
    accountNumber: '7412-8956-0012',
    beneficiary: 'Ferretería & Más S. de R.L.',
    rtn: '01019012345678',
    logo: '🦁'
  },
  {
    id: 'bank_ficohsa',
    bankName: 'Banco Ficohsa',
    accountType: 'Moneda Nacional (Lempiras)',
    accountNumber: '2000-1144-8899',
    beneficiary: 'Ferretería & Más S. de R.L.',
    rtn: '01019012345678',
    logo: '🏢'
  }
];

export const initialBusinessConfig: BusinessConfig = {
  companyName: 'Ferretería & Más',
  tagline: 'Maderas Finas y Materiales de Construcción',
  rtn: '01019012345678',
  phone: '+504 2442-8800',
  whatsapp: '+504 9988-7766',
  email: 'ventas@ferreteriaymas.hn',
  address: 'Carretera CA-13, Frente a Residencial El Sauce, 200m antes del Puente Danto',
  city: 'La Ceiba, Atlántida, Honduras',
  hours: 'Lunes a Viernes: 7:00 AM - 5:00 PM | Sábados: 7:00 AM - 1:00 PM',
  isvPercent: 15,
  woodReservationMinutes: 30
};

export const sampleOrders: Order[] = [
  {
    id: 'ORD-2026-00042',
    orderNumber: 'ORD-2026-00042',
    customer: {
      name: 'Ing. Carlos Mendoza (Constructora Ceibeña)',
      phone: '+504 9855-1122',
      whatsapp: '+504 9855-1122',
      email: 'cmendoza@constructora.hn',
      idNumber: '0101-1982-04512',
      companyName: 'Constructora Ceibeña S.A.',
      address: 'Proyecto Condominios El Toronjil, La Ceiba'
    },
    items: [
      {
        id: 'item_1',
        productId: 'prod_pino_2x4x12',
        product: initialProducts[0],
        quantity: 40,
        unitPrice: 228.00,
        subtotal: 9120.00,
        selectedServices: [
          { serviceId: 'srv_corte', serviceName: 'Corte a Medida', price: 15, quantity: 10 }
        ]
      }
    ],
    subtotal: 9270.00,
    servicesTotal: 150.00,
    tax: 1390.50,
    shippingFee: 0,
    discount: 0,
    total: 10660.50,
    deliveryMethod: 'pickup',
    pickupTimeSlot: 'Hoy entre 2:00 PM y 4:00 PM',
    pickupQrCode: 'RET-CEI-998242',
    paymentMethod: 'bank_transfer',
    paymentStatus: 'approved',
    fulfillmentStatus: 'ready_for_pickup',
    bankReference: 'BAC-TR-881923',
    createdAt: '2026-09-03T09:15:00Z',
    updatedAt: '2026-09-03T10:30:00Z'
  },
  {
    id: 'ORD-2026-00041',
    orderNumber: 'ORD-2026-00041',
    customer: {
      name: 'Lic. Martha Rosales',
      phone: '+504 9477-3311',
      whatsapp: '+504 9477-3311',
      email: 'marthar@gmail.com',
      address: 'Residencial Miramar, Calle 4, Casa #12'
    },
    items: [
      {
        id: 'item_2',
        productId: 'prod_pino_2x6x12',
        product: initialProducts[1],
        quantity: 12,
        unitPrice: 342.00,
        subtotal: 4104.00,
        selectedServices: [
          { serviceId: 'srv_cepillado', serviceName: 'Cepillado 4 Caras (S4S)', price: 25, quantity: 12 }
        ]
      },
      {
        id: 'item_3',
        productId: 'prod_tornillos_deck',
        product: initialProducts[6],
        quantity: 2,
        unitPrice: 340.00,
        subtotal: 680.00,
        selectedServices: []
      }
    ],
    subtotal: 5084.00,
    servicesTotal: 300.00,
    tax: 762.60,
    shippingFee: 300,
    discount: 0,
    total: 6146.60,
    deliveryMethod: 'delivery',
    deliveryZoneId: 'zone_periferia',
    deliveryZoneName: 'Zona 2 — Periferia y Salidas',
    pickupQrCode: 'DOM-CEI-441091',
    paymentMethod: 'card',
    paymentStatus: 'approved',
    fulfillmentStatus: 'in_transit',
    createdAt: '2026-09-02T14:20:00Z',
    updatedAt: '2026-09-03T08:00:00Z'
  }
];

export const sampleQuotes: Quote[] = [
  {
    id: 'COT-2026-00018',
    quoteNumber: 'COT-2026-00018',
    customer: {
      name: 'Arq. Roberto Figueroa',
      phone: '+504 9912-3456',
      whatsapp: '+504 9912-3456',
      email: 'rfigueroa@diseno.hn',
      companyName: 'Estudio Atlántida'
    },
    items: [
      {
        id: 'qitem_1',
        productId: 'prod_cedro_2x4x10',
        product: initialProducts[3],
        quantity: 16,
        unitPrice: 480.00,
        subtotal: 7680.00,
        selectedServices: [
          { serviceId: 'srv_cepillado', serviceName: 'Cepillado 4 Caras', price: 25, quantity: 16 }
        ]
      },
      {
        id: 'qitem_2',
        productId: 'prod_plywood_34',
        product: initialProducts[4],
        quantity: 8,
        unitPrice: 780.00,
        subtotal: 6240.00,
        selectedServices: []
      }
    ],
    subtotal: 14320.00,
    servicesTotal: 400.00,
    tax: 2148.00,
    shippingFee: 550.00,
    total: 17018.00,
    deliveryMethod: 'delivery',
    deliveryZoneName: 'Zona 3 — Corredor Este (Sambo Creek)',
    validUntil: '2026-09-18',
    status: 'active',
    createdAt: '2026-09-03T08:30:00Z'
  }
];
