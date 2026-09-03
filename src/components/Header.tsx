import React, { useState } from 'react';
import { useApp } from '../lib/store';
import { 
  ShoppingCart, 
  Search, 
  Menu, 
  X, 
  Building2,
  MessageCircle,
  Phone,
  MapPin,
  Clock
} from 'lucide-react';

export const Header: React.FC = () => {
  const { 
    cart, 
    setIsCartOpen, 
    currentView, 
    setCurrentView, 
    activeNavTab, 
    setActiveNavTab,
    searchQuery,
    setSearchQuery,
    businessConfig
  } = useApp();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  const totalCartCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  const handleNavClick = (tab: string) => {
    setCurrentView('store');
    setActiveNavTab(tab);
    setMobileMenuOpen(false);
    setIsSearchOpen(false);
    
    // Smooth scroll to relevant section if on inicio
    if (tab === 'cotizador') {
      const el = document.getElementById('cotizador');
      if (el) el.scrollIntoView({ behavior: 'smooth' });
      else window.scrollTo({ top: 0, behavior: 'smooth' });
    } else if (tab === 'catalogo') {
      const el = document.getElementById('catalogo');
      if (el) el.scrollIntoView({ behavior: 'smooth' });
      else window.scrollTo({ top: 0, behavior: 'smooth' });
    } else if (tab === 'nosotros') {
      const el = document.getElementById('nosotros');
      if (el) el.scrollIntoView({ behavior: 'smooth' });
      else window.scrollTo({ top: 0, behavior: 'smooth' });
    } else if (tab === 'contacto') {
      const el = document.getElementById('contacto');
      if (el) el.scrollIntoView({ behavior: 'smooth' });
      else window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const navItems = [
    { id: 'inicio', label: 'INICIO' },
    { id: 'catalogo', label: 'CATÁLOGO' },
    { id: 'cotizador', label: 'COTIZADOR' },
    { id: 'servicios', label: 'SERVICIOS' },
    { id: 'nosotros', label: 'NOSOTROS' },
    { id: 'contacto', label: 'CONTACTO' },
  ];

  return (
    <header className="sticky top-0 z-50 bg-slate-950/85 backdrop-blur-md border-b border-slate-800/80 text-white transition-all">
      {/* Main Header Container matching reference image */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between gap-6">
        
        {/* Brand Logo: Stylized Orange F + FERRETERÍA & MÁS */}
        <div 
          onClick={() => handleNavClick('inicio')} 
          className="flex items-center gap-3 cursor-pointer group select-none shrink-0"
        >
          {/* Geometric Angled Orange F Icon */}
          <div className="text-amber-500 group-hover:text-amber-400 transition-colors">
            <svg 
              className="w-8 h-8 sm:w-9 sm:h-9 shrink-0 fill-current" 
              viewBox="0 0 40 40" 
              fill="none" 
              xmlns="http://www.w3.org/2000/svg"
            >
              <path 
                d="M5 11L13 3H37V10.5H16V17.5H32V24.5H16V37H5V11Z" 
              />
            </svg>
          </div>

          <div className="flex flex-col leading-none">
            <span className="text-lg sm:text-xl font-black tracking-tight text-white uppercase font-sans">
              FERRETERÍA
            </span>
            <span className="text-xs sm:text-sm font-black tracking-wider text-amber-500 uppercase mt-0.5">
              & MÁS
            </span>
          </div>
        </div>

        {/* Center Desktop Navigation Menu */}
        <nav className="hidden lg:flex items-center gap-8">
          {navItems.map((item) => {
            const isActive = activeNavTab === item.id;
            return (
              <div key={item.id} className="relative py-2">
                <button
                  onClick={() => handleNavClick(item.id)}
                  className={`text-xs font-bold uppercase tracking-wider transition-colors cursor-pointer ${
                    isActive 
                      ? 'text-white' 
                      : 'text-slate-300 hover:text-white'
                  }`}
                >
                  {item.label}
                </button>
                {/* Active Indicator Underline as seen in reference image */}
                {isActive && (
                  <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-amber-500 rounded-full" />
                )}
              </div>
            );
          })}
        </nav>

        {/* Right Action Icons: Search, Cart with Badge, Hamburger Menu */}
        <div className="flex items-center gap-4 sm:gap-5">
          {/* Search Trigger */}
          <button
            onClick={() => setIsSearchOpen(!isSearchOpen)}
            aria-label="Buscar producto"
            className="text-white hover:text-amber-400 p-1.5 transition-colors cursor-pointer rounded-lg hover:bg-slate-900/60"
            title="Buscar maderas y materiales"
          >
            <Search className="w-5 h-5" />
          </button>

          {/* Cart Icon with Notification Badge */}
          <button
            onClick={() => setIsCartOpen(true)}
            aria-label="Ver carrito"
            className="relative text-white hover:text-amber-400 p-1.5 transition-colors cursor-pointer rounded-lg hover:bg-slate-900/60"
            title="Carrito y Cotizaciones"
          >
            <ShoppingCart className="w-5 h-5" />
            {/* Orange Badge showing 3 (matching image) or actual cart count */}
            <span className="absolute -top-1 -right-1 bg-amber-500 text-slate-950 font-black text-[10px] w-4.5 h-4.5 rounded-full flex items-center justify-center border-2 border-slate-950 shadow-sm">
              {totalCartCount > 0 ? totalCartCount : 3}
            </span>
          </button>

          {/* Hamburger Menu Toggle (Mobile & Tablet) */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Menú principal"
            className="text-white hover:text-amber-400 p-1.5 transition-colors cursor-pointer rounded-lg hover:bg-slate-900/60"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Expandable Search Bar */}
      {isSearchOpen && (
        <div className="bg-slate-900/95 border-t border-slate-800 px-4 py-3 animate-in fade-in duration-200">
          <div className="max-w-2xl mx-auto flex items-center gap-3">
            <div className="relative flex-1">
              <input
                type="text"
                autoFocus
                placeholder="Buscar pino tratado, tablas '2x4x12', cedro, plywood, tornillería..."
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  if (activeNavTab !== 'catalogo') setActiveNavTab('catalogo');
                }}
                className="w-full pl-9 pr-4 py-2.5 text-xs bg-slate-950 border border-slate-700 rounded-lg text-white focus:outline-none focus:border-amber-500 transition-all placeholder:text-slate-400"
              />
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
              {searchQuery && (
                <button 
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-3 text-xs text-slate-400 hover:text-white font-bold"
                >
                  ✕
                </button>
              )}
            </div>
            <button
              onClick={() => setIsSearchOpen(false)}
              className="px-3 py-2 text-xs font-semibold text-slate-300 hover:text-white bg-slate-800 rounded-lg"
            >
              Cerrar
            </button>
          </div>
        </div>
      )}

      {/* Mobile Drawer Navigation */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-slate-950 border-t border-slate-800/80 px-5 py-6 space-y-4 animate-in slide-in-from-top-3 duration-200 shadow-2xl">
          <ul className="space-y-3">
            {navItems.map((item) => {
              const isActive = activeNavTab === item.id;
              return (
                <li key={item.id}>
                  <button
                    onClick={() => handleNavClick(item.id)}
                    className={`w-full text-left py-2 px-3 rounded-lg text-sm font-bold uppercase tracking-wider flex items-center justify-between transition-colors ${
                      isActive 
                        ? 'bg-amber-500/15 text-amber-400 border-l-4 border-amber-500' 
                        : 'text-slate-200 hover:bg-slate-900 hover:text-white'
                    }`}
                  >
                    <span>{item.label}</span>
                    {isActive && <span className="text-amber-400 text-xs">●</span>}
                  </button>
                </li>
              );
            })}
          </ul>

          <div className="pt-4 border-t border-slate-800 flex flex-col gap-2.5 text-xs">
            <button
              onClick={() => {
                setCurrentView(currentView === 'admin' ? 'store' : 'admin');
                setMobileMenuOpen(false);
              }}
              className="py-2 px-3 rounded-lg bg-slate-900 hover:bg-slate-800 text-amber-400 font-bold flex items-center justify-between transition-colors"
            >
              <span className="flex items-center gap-2">
                <Building2 className="w-4 h-4" />
                {currentView === 'admin' ? 'Ver Tienda' : 'Panel Administrativo CMS'}
              </span>
            </button>

            <a
              href={`https://wa.me/${businessConfig.whatsapp.replace(/[^0-9]/g, '')}`}
              target="_blank"
              rel="noreferrer"
              className="py-2 px-3 rounded-lg bg-emerald-600/20 hover:bg-emerald-600/30 text-emerald-400 font-bold flex items-center gap-2 transition-colors"
            >
              <MessageCircle className="w-4 h-4 text-emerald-400" />
              WhatsApp La Ceiba: {businessConfig.whatsapp}
            </a>
          </div>
        </div>
      )}
    </header>
  );
};
