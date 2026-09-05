# 📖 Guía de Modificaciones — Ferretería & Más (La Ceiba, Atlántida)

Esta guía detalla **paso a paso, sección por sección y página por página** cómo realizar cambios en la aplicación web, tanto de forma visual (sin programar, a través del **Panel de Administración CMS integrado**) como técnica (editando el **código fuente** en React, TypeScript y Tailwind CSS).

---

## 📑 Tabla de Contenidos
1. [Estructura del Proyecto y Archivos Clave](#1-estructura-del-proyecto-y-archivos-clave)
2. [Método 1: Cambios sin Código (Panel de Administración CMS)](#2-método-1-cambios-sin-código-panel-de-administración-cms)
3. [Método 2: Cambios en el Código Sección por Sección (Página de Inicio)](#3-método-2-cambios-en-el-código-sección-por-sección-página-de-inicio)
   - [A. Encabezado / Header](#a-encabezado--header-srccomponentsheadertsx)
   - [B. Sección Principal / Hero](#b-sección-principal--hero-srccomponentsherotsx)
   - [C. Banner de Promociones](#c-banner-de-promociones-srcapptsx---offersbanner)
   - [D. Cotizador de Madera y Pies Tablares](#d-cotizador-de-madera-y-pies-tablares-srccomponentswoodestimatortsx)
   - [E. Calculador de Proyectos](#e-calculador-de-proyectos-srccomponentsprojectcalculatortsx)
   - [F. Catálogo de Productos](#f-catálogo-de-productos-srccomponentscatalogtsx)
   - [G. Sección Nosotros y Trayectoria](#g-sección-nosotros-y-trayectoria-srcapptsx---aboutsection)
   - [H. Sección de Contacto y Ubicación](#h-sección-de-contacto-y-ubicación-srccomponentscontactsectiontsx)
   - [I. Pie de Página / Footer](#i-pie-de-página--footer-srccomponentsfootertsx)
4. [Páginas y Pestañas de Navegación](#4-páginas-y-pestañas-de-navegación)
5. [Modales y Procesos de Compra](#5-modales-y-procesos-de-compra)
   - [Carrito de Compras (Drawer)](#carrito-de-compras-srccomponentscartdrawertsx)
   - [Checkout y Datos de Facturación SAR](#checkout-y-facturación-srccomponentscheckoutmodaltsx)
   - [Comprobante de Pedido con Código QR](#comprobante-de-pedido-srccomponentsordersuccessmodaltsx)
   - [Generador de Cotización](#generador-de-cotización-srccomponentsquotemodaltsx)
6. [Datos Iniciales, Precios y Cuentas Bancarias](#6-datos-iniciales-precios-y-cuentas-bancarias)
7. [Guías Prácticas Frecuentes (Ejemplos Rápidos)](#7-guías-prácticas-frecuentes-ejemplos-rápidos)
   - [¿Cómo cambiar el número de WhatsApp y teléfono?](#caso-1-cambiar-número-de-whatsapp-y-teléfono)
   - [¿Cómo cambiar o subir un nuevo video/foto al Hero?](#caso-2-cambiar-el-video-o-foto-del-hero)
   - [¿Cómo agregar un nuevo producto de madera o ferretería?](#caso-3-agregar-un-nuevo-producto-al-catálogo)
   - [¿Cómo actualizar los números de cuenta bancaria (BAC, Ficohsa, Atlántida)?](#caso-4-actualizar-cuentas-bancarias-para-transferencias)
   - [¿Cómo modificar las tarifas de flete y zonas de entrega?](#caso-5-modificar-tarifas-de-flete-en-la-ceiba)
   - [¿Cómo cambiar las imágenes de los productos en el Catálogo?](#caso-6-cambiar-imágenes-en-el-catálogo-de-maderas-y-materiales)

---

## 1. Estructura del Proyecto y Archivos Clave

El proyecto está construido con **React 18**, **TypeScript**, **Vite** y **Tailwind CSS**. No requiere bases de datos externas obligatorias para su funcionamiento inmediato, ya que utiliza un almacén de estado reactivo sincronizado con `localStorage`.

```text
/
├── public/                     # Archivos estáticos públicos
│   ├── hero-lumber.jpg         # Fotografía principal de madera apilada
│   └── videos/                 # Videos en alta definición
│       ├── hero-sawmill-hd.mp4 # Video del aserrío en el Hero
│       └── timber-sawmill.mp4  # Video secundario
│
├── src/
│   ├── components/             # Componentes modulares de la interfaz
│   │   ├── AdminCMS.tsx        # Panel de administración completo
│   │   ├── CartDrawer.tsx      # Carrito lateral deslizable
│   │   ├── Catalog.tsx         # Cuadrícula y filtros de productos
│   │   ├── CheckoutModal.tsx   # Pasarela de pago y facturación SAR
│   │   ├── ContactSection.tsx  # Sección de contacto, mapa y horarios
│   │   ├── Footer.tsx          # Pie de página industrial
│   │   ├── Header.tsx          # Barra superior y menú móvil
│   │   ├── Hero.tsx            # Portada de impacto con video
│   │   ├── OrderSuccessModal.tsx # Pantalla de confirmación con QR
│   │   ├── ProductDetailModal.tsx# Ficha técnica ampliada del producto
│   │   ├── ProjectCalculator.tsx # Estimador por tipo de obra (Pérgolas, Decks, Techos)
│   │   ├── QuoteModal.tsx      # Modal de cotización formal
│   │   └── WoodEstimator.tsx   # Calculador por pieza y pie tablar
│   │
│   ├── data/
│   │   └── initialData.ts      # Datos precargados: productos, cuentas de banco, configuración
│   │
│   ├── lib/
│   │   ├── pricingEngine.ts    # Motor matemático de cálculo de pies tablares e ISV
│   │   └── store.tsx           # Estado global (Context API) y persistencia
│   │
│   ├── types.ts                # Definiciones de TypeScript (Product, Order, etc.)
│   ├── App.tsx                 # Enrutador principal y diseño general
│   └── index.css               # Estilos globales y directivas Tailwind
```

---

## 2. Método 1: Cambios sin Código (Panel de Administración CMS)

La aplicación incluye un **Panel Administrativo (CMS)** que permite cambiar la información sin necesidad de abrir archivos de código.

### ¿Cómo ingresar al Panel de Administración?
1. Desplázate hasta el **Footer** (pie de página) y haz clic en el enlace con icono de candado que dice:  
   `⚙️ Panel Admin / CMS`.
2. Alternativamente, en el estado global puedes activar la vista `currentView = 'admin'`.
3. Para regresar a la tienda pública, pulsa el botón **"← Volver a la Tienda"** en la esquina superior izquierda del panel.

### Módulos del panel lateral (con sus nombres exactos):
- **📊 Dashboard General**: Vista general de ingresos del mes, número de pedidos activos, cotizaciones pendientes y productos con existencia baja.
- **🛒 Gestor de Pedidos**: 
  - Ver pedidos entrantes con desglose de ítems, totales e ISV.
  - Cambiar estado: *Pendiente → Verificando Pago → Listo para Retiro → En Tránsito → Entregado*.
  - Inspeccionar el comprobante de depósito bancario subido por el cliente.
- **📦 Catálogo & Precios**: 
  - Crear nuevos productos o materiales con botón "+ Agregar Producto".
  - Ver miniaturas de fotos, SKU, precios, existencias y estados.
  - Editar precios, medidas y **fotografías** (subir foto local, pegar URL o galería rápida).
  - Eliminar productos obsoletos.
- **⚙️ Control de Inventario**: Ajuste directo de existencias en tiempo real y configuración de alerta de stock mínimo.
- **📄 Cotizaciones Activas**: Historial de cotizaciones generadas por clientes con opción de convertirlas a pedido formal.
- **🚚 Zonas & Fletes**: Configurar el costo de envío (flete en Lempiras) para cada sector (Ej. Centro, El Sauce, Corozal, Sambo Creek, Jutiapa) y el monto de compra mínima para flete gratis.
- **⚙️ Configuración & Cuentas**: Modificar nombre de la empresa, RTN, Teléfono, WhatsApp, Correo, Dirección física, Horario de atención y % de ISV (15%).

---

## 3. Método 2: Cambios en el Código Sección por Sección (Página de Inicio)

Si deseas modificar textos fijos, colores, componentes o la estructura visual, aquí tienes la ruta exacta de cada sección:

---

### A. Encabezado / Header (`src/components/Header.tsx`)

#### 1. Cambiar el Logo / Nombre de Marca
- **Archivo**: `src/components/Header.tsx` (Líneas ~85-115)
- **Código actual**:
  ```tsx
  <div className="w-9 h-9 rounded-lg bg-amber-500 flex items-center justify-center font-black text-slate-950 text-xl font-mono shadow-md">
    F
  </div>
  <div className="flex flex-col text-left">
    <span className="text-white font-black text-base sm:text-lg tracking-wider uppercase leading-none">
      FERRETERÍA
    </span>
    <span className="text-amber-400 font-bold text-[11px] sm:text-xs tracking-[0.25em] uppercase leading-tight">
      & MÁS
    </span>
  </div>
  ```
- **Cómo cambiarlo**:
  - Para cambiar el texto comercial, edita los strings `"FERRETERÍA"` y `"& MÁS"`.
  - Para colocar un logotipo en imagen: reemplaza el `<div>F</div>` por `<img src="/tu-logo.png" alt="Logo" className="h-9 w-auto" />`.

#### 2. Modificar Enlaces de Navegación
- **Archivo**: `src/components/Header.tsx` (Líneas ~20-30)
- **Array `NAV_ITEMS`**:
  ```tsx
  const NAV_ITEMS = [
    { id: 'inicio', label: 'INICIO' },
    { id: 'catalogo', label: 'CATÁLOGO' },
    { id: 'cotizador', label: 'COTIZADOR' },
    { id: 'servicios', label: 'SERVICIOS' },
    { id: 'nosotros', label: 'NOSOTROS' },
    { id: 'contacto', label: 'CONTACTO' },
  ];
  ```
  Puedes agregar, eliminar o renombrar cualquier pestaña de navegación aquí.

---

### B. Sección Principal / Hero (`src/components/Hero.tsx`)

Esta sección cuenta con video cinematográfico, fotografía de alta definición, textos principales, botones CTA y el contenedor de 4 pilares.

#### 1. Cambiar los Textos del Hero
- **Archivo**: `src/components/Hero.tsx` (Líneas ~180-215)
- **Ceja superior**:
  ```tsx
  <span className="text-amber-400 font-bold text-[11px] sm:text-xs uppercase tracking-[0.2em] block mb-2">
    MADERA DE ALTA CALIDAD
  </span>
  ```
- **Titular Principal**:
  ```tsx
  <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black text-white tracking-tight leading-[1.04] mb-3 sm:mb-4">
    Lista para <br />
    tu obra.
  </h1>
  ```
  *Para cambiar el título, edita el contenido dentro de la etiqueta `<h1>`.*
- **Párrafo descriptivo**:
  ```tsx
  <p className="text-slate-100 text-xs sm:text-sm md:text-base font-normal leading-relaxed max-w-lg mb-6">
    Madera curada, tratada y cortada a la medida. <br className="hidden sm:inline" />
    Despacho rápido en La Ceiba y zonas aledañas.
  </p>
  ```

#### 2. Cambiar o Aclarar el Video de Fondo
- **Archivo**: `src/components/Hero.tsx` (Líneas ~105-135)
- El video apunta a `/videos/hero-sawmill-hd.mp4`.
- Si deseas cambiar el archivo de video:
  1. Coloca tu archivo `.mp4` dentro de la carpeta `/public/videos/mi-video.mp4`.
  2. En `Hero.tsx`, cambia la línea:
     ```tsx
     <source src="/videos/mi-video.mp4" type="video/mp4" />
     ```
- Para ajustar la **claridad y brillo del video**:
  Modifica las clases en la etiqueta `<video>`:
  - `brightness-[0.95]`: Aumenta a `brightness-[1.0]` si deseas aún más luz.
  - `opacity-90`: Puedes cambiarlo a `opacity-100` para verlo al 100% de fuerza.
  - El degradado protector lateral se encuentra en:
    ```tsx
    <div className="absolute inset-0 bg-gradient-to-r from-slate-950/85 via-slate-950/40 to-transparent sm:w-2/3 pointer-events-none" />
    ```

#### 3. Los 4 Pilares de Garantía (Escritorio vs Smartphone)
- En `Hero.tsx`, la función `renderPillars()` contiene los 4 pilares:
  1. `MADERA CURADA Y TRATADA` (Garantía contra curvaturas y termitas)
  2. `DESPACHO RÁPIDO EN LA CEIBA` (Recibe tu pedido sin filas ni esperas)
  3. `CORTE A LA MEDIDA` (Servicio de corte y cepillado según tu proyecto)
  4. `PAGO SEGURO EN LÍNEA` (Múltiples opciones de pago digital)
- **Comportamiento Responsivo**:
  - En **pantallas grandes / computadoras**: Se dibuja dentro del Hero en la base (`hidden md:block`).
  - En **smartphones / móviles**: Se dibuja afuera del Hero, inmediatamente debajo del mismo en `<section id="hero-pillars-mobile" className="md:hidden bg-slate-950 ...">`.

---

### C. Banner de Promociones (`src/App.tsx -> OffersBanner`)

- **Archivo**: `src/App.tsx` (Líneas ~110-135)
- **Texto actual**:  
  *"Descuento del 10% en pedidos de más de 300 pies tablares de Pino Tratado para pérgolas y decks."*
- **Cómo cambiar la oferta**:
  Edita el texto dentro del componente `OffersBanner` o ajusta el botón de enlace para redirigir a `cotizador` o `catalogo`.

---

### D. Cotizador de Madera y Pies Tablares (`src/components/WoodEstimator.tsx`)

Permite al cliente calcular el costo exacto de piezas de madera ingresando Grosor, Ancho, Largo y Cantidad.

#### 1. Fórmula de Pies Tablares
- **Archivo**: `src/lib/pricingEngine.ts` (Línea ~10)
- **Fórmula**:  
  $$\text{Pies Tablares} = \frac{\text{Grosor (pulgadas)} \times \text{Ancho (pulgadas)} \times \text{Largo (pies)}}{12} \times \text{Cantidad}$$
- Para ajustar el factor de cálculo o precio base por pie tablar, edita la función `calculateBoardFeet` en `pricingEngine.ts`.

#### 2. Modificar Medidas Estándar Rápidas
- En `WoodEstimator.tsx`, busca `COMMON_DIMENSIONS`:
  ```tsx
  const COMMON_DIMENSIONS = [
    { label: '2" x 4" x 12\'', thickness: 2, width: 4, length: 12 },
    { label: '2" x 6" x 12\'', thickness: 2, width: 6, length: 12 },
    { label: '1" x 4" x 10\'', thickness: 1, width: 4, length: 10 },
    ...
  ];
  ```
  Puedes agregar o cambiar las medidas de acceso rápido que aparecen en los botones.

#### 3. Servicios Adicionales (Corte, Cepillado, Tratamiento)
- Los servicios están definidos en `src/data/initialData.ts` (`initialServices`).
- Para cambiar precios de corte (L. 15), cepillado (L. 25) o tratamiento (L. 45), puedes hacerlo directamente en `initialData.ts` o administrarlos desde el CMS.

---

### E. Calculador de Proyectos (`src/components/ProjectCalculator.tsx`)

Ayuda a contratistas y propietarios a presupuestar materiales para:
1. **Pérgolas Exteriores** (Postes, vigas maestras, viguetas superiores).
2. **Decks / Terrazas de Madera** (Estructura de soporte, tablas de piso, tornillos inoxidables).
3. **Estructuras de Techo** (Vigas principales, clavadores, fijaciones).
4. **Cercos Perimetrales** (Postes, travesaños, tablas verticales).

#### ¿Cómo modificar los factores de desperdicio o rendimiento?
- En `ProjectCalculator.tsx`, localiza la función `calculateProjectRequirements()`.
- Por defecto se aplica un **10% de desperdicio técnico** (`wasteFactor = 1.10`). Si deseas aumentar al 15%, cambia el valor a `1.15`.

---

### F. Catálogo de Productos (`src/components/Catalog.tsx`)

Muestra la lista de productos con filtros por categoría, buscador por nombre/código y tarjetas con precio y botón de agregar al carrito.

- **Categorías soportadas**:
  - `todas`: Ver todo el inventario.
  - `madera_dimensionada`: Pino tratado, vigas, tablas, cuartones.
  - `tableros`: Plywood marino, MDF, OSB.
  - `ferreteria`: Herrajes, ángulos de sujeción para pérgolas.
  - `herramientas`: Sierras, niveles, metros, cepillos.
  - `fijaciones`: Tornillería para madera, clavos galvanizados.
- Para cambiar los textos o agregar nuevas categorías, edita el array `CATEGORIES` en `src/components/Catalog.tsx`.

#### ¿De dónde salen las imágenes de los productos?
Cada producto tiene la propiedad `imageUrl`. El catálogo renderiza estas imágenes con la etiqueta:
```tsx
<img 
  src={product.imageUrl} 
  alt={product.name}
  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
  onError={(e) => {
    (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1546484396-fb3fc6f95f98?auto=format&fit=crop&w=800&q=80';
  }}
/>
```
Si la imagen falla o el enlace se rompe, el sistema activa automáticamente una imagen de respaldo de madera tratada para que el catálogo nunca se vea roto o con huecos vacíos.

Las imágenes se pueden cambiar de 3 formas:
1. **Desde el Panel Admin / CMS**: Pestaña *Productos* → Botón *Editar (icono lápiz)* → Subir foto o pegar enlace.
2. **Desde el código `src/data/initialData.ts`**: Cambiando la propiedad `imageUrl` de cada ítem.
3. **Guardando fotos en la carpeta `/public/`**: Colocando el archivo (ej. `/public/productos/pino-2x4.jpg`) y usando `imageUrl: '/productos/pino-2x4.jpg'`.

---

### G. Sección Nosotros y Trayectoria (`src/App.tsx -> AboutSection`)

- **Archivo**: `src/App.tsx` (Líneas ~57-108)
- Contiene los 3 pilares de confianza local:
  1. **Preservación CCA Garantizada**: Cumplimiento de estándares AWPA.
  2. **Taller de Dimensionado Propio**: Sierras radiales, cepillado S4S.
  3. **Legalidad y Facturación SAR**: Guías forestales del ICF y CAI vigente.
- Para cambiar la historia de la empresa o la ubicación, edita los párrafos de texto dentro de `AboutSection`.

---

### H. Sección de Contacto y Ubicación (`src/components/ContactSection.tsx`)

Contiene:
- Dirección exacta: *Carretera CA-13, Frente a Residencial El Sauce, 200m antes del Puente Danto, La Ceiba*.
- Horarios de atención comercial.
- Enlace directo con mensaje preconfigurado a WhatsApp.
- Formulario de contacto directo con botón de envío.

---

### I. Pie de Página / Footer (`src/components/Footer.tsx`)

- **Archivo**: `src/components/Footer.tsx`
- Contiene los enlaces rápidos de navegación, teléfonos, enlaces de redes sociales, el aviso de facturación fiscal SAR y el botón de acceso al **Panel Admin / CMS**.
- Para cambiar derechos de autor o el año (2026), edita el texto al final del archivo.

---

## 4. Páginas y Pestañas de Navegación

En `src/App.tsx` (Líneas ~150-275), el componente `MainAppLayout` decide qué pantalla mostrar según la variable `activeNavTab`:

| Pestaña | ID de Navegación | Componentes que Renderiza |
| :--- | :--- | :--- |
| **Inicio** | `'inicio'` | Hero + OffersBanner + Cotizador + Proyectos + Catálogo + Nosotros + Contacto |
| **Catálogo** | `'catalogo'` | Filtros completos y cuadrícula de productos (`<Catalog />`) |
| **Servicios** | `'servicios'` | Banner de taller industrial + Calculador de Proyectos + Cotizador |
| **Madera** | `'madera'` | Catálogo filtrado en *madera dimensionada* + Estimador de pies tablares |
| **Ferretería** | `'ferreteria'` | Catálogo filtrado en *fijaciones y tornillería* |
| **Cotizador** | `'cotizador'` | Pantalla dedicada al estimador de madera |
| **Proyectos** | `'proyectos'` | Pantalla dedicada al calculador de pérgolas/decks |
| **Nosotros** | `'nosotros'` | Información institucional, garantías y certificaciones |
| **Contacto** | `'contacto'` | Canales de atención, mapa y formulario |

*Si deseas agregar una nueva pestaña:*  
1. Agrega el ID y título en `Header.tsx` dentro de `NAV_ITEMS`.  
2. Agrega la condición `{activeNavTab === 'tu_pestaña' && (...) }` dentro del `<main>` en `src/App.tsx`.

---

## 5. Modales y Procesos de Compra

### Carrito de Compras (`src/components/CartDrawer.tsx`)
- Se abre al pulsar el icono del carrito en el Header o al añadir un producto.
- Permite modificar cantidades, ver el desglose de servicios agregados (ej. cortes) y proceder al Checkout o solicitar Cotización formal.

### Checkout y Facturación (`src/components/CheckoutModal.tsx`)
- **Paso 1: Tipo de Entrega**:
  - *Retiro en Aserrío / Tienda (Gratis)*: El cliente elige fecha y rango horario.
  - *Envío a Domicilio en La Ceiba*: El cliente selecciona su zona (Centro, Sauce, Satélite, Corozal, Sambo Creek, etc.) y se suma automáticamente el flete correspondiente.
- **Paso 2: Datos del Cliente y Facturación**:
  - Nombre, Teléfono, WhatsApp, Correo, Dirección de entrega.
  - Opción de solicitar **Factura con CAI (SAR)** con RTN y Razón Social de la empresa.
- **Paso 3: Método de Pago**:
  - *Transferencia Bancaria (BAC Credomatic, Ficohsa, Banco Atlántida)*: Muestra números de cuenta e instrucciones para subir el número de referencia o foto del comprobante.
  - *Pago con Tarjeta de Débito/Crédito*.
  - *Pago contra entrega en efectivo*.

### Comprobante de Pedido (`src/components/OrderSuccessModal.tsx`)
- Muestra el número de orden (ej. `ORD-2026-00042`).
- Genera un **Código QR único** para retiro rápido en bodega sin hacer filas.
- Botón para descargar el comprobante o enviar el resumen por WhatsApp al equipo de despacho.

### Generador de Cotización (`src/components/QuoteModal.tsx`)
- Genera un documento con validez de 15 días calendario, ideal para contratistas que deben presentar presupuestos a sus clientes antes de comprar.

---

## 6. Datos Iniciales, Precios y Cuentas Bancarias

El archivo principal donde residen los datos de fábrica es:  
📂 `src/data/initialData.ts`

En este archivo puedes configurar:
1. **`initialProducts`**: Lista con precios en Lempiras (L.), SKU, descripciones y especificaciones técnicas.
2. **`initialDeliveryZones`**: Zonas de reparto en el área de La Ceiba y sus tarifas de flete.
3. **`initialBankAccounts`**: Cuentas bancarias de BAC, Ficohsa y Atlántida con sus números de cuenta y beneficiario.
4. **`initialBusinessConfig`**: RTN, teléfono, WhatsApp, dirección física, porcentaje de ISV (15%).

> 💡 **Nota Importante**: Si has realizado cambios en el navegador mediante el CMS, estos se guardan en el `localStorage` de tu navegador. Para restablecer todo a los valores de fábrica de `initialData.ts`, puedes borrar el almacenamiento local del navegador o usar el botón de reinicio en el CMS.

---

## 7. Guías Prácticas Frecuentes (Ejemplos Rápidos)

### Caso 1: Cambiar número de WhatsApp y teléfono
1. Abre `src/data/initialData.ts`.
2. Busca `initialBusinessConfig`:
   ```ts
   export const initialBusinessConfig: BusinessConfig = {
     companyName: 'Ferretería & Más',
     phone: '+504 2442-8800',       // <--- Cambia el teléfono fijo
     whatsapp: '+504 9988-7766',    // <--- Cambia el número de WhatsApp
     ...
   };
   ```
3. O hazlo sin tocar código desde el **Panel Admin / CMS → Pestaña Configuración**.

---

### Caso 2: Cambiar el video o foto del Hero
1. Coloca tu nuevo video en `/public/videos/nuevo-video.mp4` y tu foto en `/public/nueva-foto.jpg`.
2. Abre `src/components/Hero.tsx`.
3. Busca la etiqueta `<img src="/hero-lumber.jpg" ...>` y cámbiala por `/nueva-foto.jpg`.
4. Busca `<source src="/videos/hero-sawmill-hd.mp4" ...>` y cámbiala por `/videos/nuevo-video.mp4`.
5. Guarda el archivo y listo.

---

### Caso 3: Agregar un nuevo producto al catálogo
1. Abre `src/data/initialData.ts`.
2. Dentro del arreglo `initialProducts`, añade tu objeto:
   ```ts
   {
     id: 'prod_viga_caoba_4x8x16',
     sku: 'MAD-CAO-4816',
     name: 'Viga de Caoba Seleccionada 4" x 8" x 16\'',
     slug: 'viga-caoba-4x8x16',
     category: 'madera_dimensionada',
     species: 'caoba',
     description: 'Madera fina de caoba aserrada para dinteles, pérgolas rústicas de lujo y columnas.',
     dimensions: { thicknessInches: 4, widthInches: 8, lengthFeet: 16, label: '4" x 8" x 16\'' },
     dimensionString: '4" x 8" x 16\'',
     unit: 'pieza',
     pricePerUnit: 1450.00,
     pricePerBoardFoot: 34.00,
     cost: 950.00,
     stock: 35,
     minStock: 10,
     status: 'in_stock',
     imageUrl: 'https://images.unsplash.com/photo-1546484396-fb3fc6f95f98?auto=format&fit=crop&w=800&q=80',
     technicalSpecs: {
       humedad: '14% Estufada',
       calidad: 'FAS Primera',
       origen: 'Honduras'
     },
     featured: true
   }
   ```
3. Alternativamente, puedes pulsar el botón **"+ Nuevo Producto"** directamente en la pestaña **Productos** del CMS sin editar código.

---

### Caso 4: Actualizar cuentas bancarias para transferencias
1. Abre `src/data/initialData.ts`.
2. Busca el arreglo `initialBankAccounts` y actualiza los números de cuenta:
   ```ts
   {
     id: 'bank_bac',
     bankName: 'BAC Credomatic',
     accountType: 'Moneda Nacional (Lempiras)',
     accountNumber: 'TU-NUEVO-NUMERO-AQUI',
     beneficiary: 'Ferretería & Más S. de R.L.',
     rtn: '01019012345678',
     logo: '🦁'
   }
   ```

---

### Caso 5: Modificar tarifas de flete en La Ceiba
1. Abre `src/data/initialData.ts`.
2. Busca `initialDeliveryZones`:
   ```ts
   {
     id: 'zone_ceiba_centro',
     name: 'Zona 1 — Casco Urbano La Ceiba',
     description: 'Barrio El Centro, La Isla, Potreritos, Mazapán, Miramar',
     rate: 180, // <-- Precio del flete en Lempiras
     freeShippingThreshold: 3500, // <-- Flete gratis a partir de este monto
     estimatedDeliveryTime: 'Mismo día (2 a 4 horas)',
     active: true
   }
   ```
3. O modifícalo en el **Panel Admin / CMS → Pestaña Zonas de Entrega**.

---

### Caso 6: Cambiar imágenes en el Catálogo de Maderas y Materiales

Tienes **tres formas fáciles** de cambiar o actualizar las fotografías de los productos:

#### Método 1: Desde el Panel de Administración CMS (Visual e Instantáneo, Sin Código)
1. Ve al final de la página (Footer) y haz clic en **"⚙️ Panel Admin / CMS"**.
2. En el panel lateral izquierdo, haz clic en la pestaña **"Catálogo & Precios"** (la pestaña con icono de caja naranja que muestra el contador de productos).
3. En la tabla de productos verás ahora la miniatura de cada material junto a su nombre y código SKU. Busca el producto que deseas actualizar (ej. *Pino Tratado CCA 2" x 4" x 12'*) y pulsa el botón **Editar** (icono de lápiz en la columna Acciones).
4. En la ventana emergente verás la sección destacada **"Fotografía del Producto / Material"** (con borde ámbar e icono de imagen):
   *(Nota: Si tenías la página abierta previamente, pulsa `F5` o `Ctrl + Shift + R` en tu navegador para asegurarte de que cargue la versión actualizada).*
   - **Opción A (Subir foto propia)**: Pulsa el botón **"Subir desde mi computadora o teléfono"**. Selecciona la foto tomada en tu bodega o aserrío. El sistema la procesará y mostrará una vista previa al instante.
   - **Opción B (Pegar enlace URL)**: Puedes pegar cualquier dirección web de imagen en el campo de texto (por ejemplo de Unsplash, tu Google Drive público, o Cloudinary).
   - **Opción C (Galería Rápida)**: El CMS incluye botones con fotos de alta calidad preseleccionadas para *Pino Tratado*, *Vigas*, *Caoba*, *Plywood*, *Tornillería* y *Herramientas*. Solo pulsa el botón correspondiente para asignarla.
5. Haz clic en **"Guardar Producto"**. ¡La imagen se actualizará de inmediato en el catálogo general, en la vista rápida y en el carrito!

---

#### Método 2: En el Código Fuente (`src/data/initialData.ts`)
Si deseas que la imagen quede guardada de forma fija como valor predeterminado de fábrica en el código:
1. Abre el archivo `src/data/initialData.ts`.
2. Localiza el arreglo `initialProducts`.
3. Busca el producto por su nombre o SKU (ej. `prod_pino_2x4x12`).
4. Modifica el campo `imageUrl`:
   ```ts
   {
     id: 'prod_pino_2x4x12',
     sku: 'MAD-PIN-2412',
     name: 'Pino Tratado CCA 2" x 4" x 12\'',
     // ...
     imageUrl: 'https://images.unsplash.com/photo-1546484396-fb3fc6f95f98?auto=format&fit=crop&w=800&q=80',
     // ...
   }
   ```
5. Guarda el archivo.

---

#### Método 3: Usando tus Propias Fotos Locales en la Carpeta `/public/images/gallery/`
Si tienes fotografías reales de tus paquetes de madera tomadas con tu celular o cámara en La Ceiba:
1. Guarda la imagen en la carpeta `/public/images/gallery/` del proyecto.  
   Por ejemplo: `/public/images/gallery/pino-2x4x12.jpg`
2. **Regla de oro de rutas web**:
   - En aplicaciones web (Vite/React), los archivos dentro de la carpeta `public/` se sirven desde la raíz `/`.
   - Por tanto, **NO** debes escribir la palabra `public`, ni barras invertidas `\` de Windows.
   - La ruta correcta que debes ingresar es:
     ```text
     /images/gallery/pino-2x4x12.jpg
     ```
   *(Nota: El sistema ahora cuenta con un formateador inteligente: si por error pegas `public\images\gallery\foto.jpg`, automáticamente lo transformará a `/images/gallery/foto.jpg` sin que tengas que corregirlo manualmente).*
3. La aplicación la servirá directamente a máxima velocidad sin depender de servidores externos.

#### 🛡️ Protección contra Pantalla en Blanco (LocalStorage Quota):
- **¿Por qué ocurría la pantalla en blanco?** Al subir una foto en alta resolución desde el celular o computadora, el navegador generaba una cadena Base64 cruda de varios megabytes. Al intentar guardarla en el almacenamiento local del navegador (`localStorage`), se superaba el límite estricto de 5MB por dominio (`QuotaExceededError`), provocando que React se detuviera.
- **Solución implementada:**
  1. **Compresión automática al vuelo:** El botón *"Subir desde mi computadora o teléfono"* ahora procesa la foto en un lienzo (Canvas) inteligente, reduciéndola a un tamaño optimizado de 900px y calidad JPEG 82% (~40 KB a 70 KB). Es 100 veces más ligera, se visualiza con máxima nitidez y jamás satura la memoria.
  2. **Escudo de Almacenamiento Seguro (`storageHelper.ts`):** Todas las lecturas y escrituras cuentan con bloques `try/catch` y protección de cuota. Si la memoria está llena, no se bloquea ni se congela.
  3. **Muro de Recuperación (`ErrorBoundary`):** Si ocurriera cualquier anomalía en el navegador del cliente, se muestra una ventana de recuperación con el botón *"Restaurar Datos de Fábrica y Recargar"* en vez de una pantalla en blanco.

#### 💡 Recomendaciones de Formato y Tamaño:
- **Relación de aspecto ideal**: Cuadrada (`1:1`) o ligeramente horizontal (`4:3`).
- **Resolución sugerida**: Entre `600 × 600 px` y `1200 × 1200 px`.
- **Formatos compatibles**: `.jpg`, `.jpeg`, `.png` y `.webp`.
- **Peso del archivo**: Menor a `500 KB` para carga rápida incluso en redes móviles 3G/4G en la zona de Atlántida.

---

## 8. Verificación de Compilación y Calidad

Para verificar que tus cambios no contengan errores de sintaxis o TypeScript:
- **Prueba de Tipos**: `npm run lint` o `tsc --noEmit`
- **Compilación de Producción**: `npm run build`

¡Con esta estructura podrás gestionar, actualizar y escalar la aplicación con total independencia y seguridad!
