/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from "react";
import { 
  Leaf, 
  Search, 
  ShoppingBag, 
  ChevronRight, 
  ArrowRight, 
  Plus, 
  Star, 
  Check, 
  Smartphone, 
  MapPin, 
  User, 
  X,
  Play,
  Bell,
  MessageCircle,
  Package,
  TrendingUp,
  Award,
  BookOpen,
  Globe,
  Map as MapIcon,
  ShieldCheck,
  Camera,
  Trash2
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

// --- Types ---
type ModalType = 'ingia' | 'jiunge' | 'checkout' | 'chat' | 'payment_status';
type RoleType = 'mkulima' | 'mnunuzi';
type ViewType = 'landing' | 'marketplace' | 'dashboard' | 'profile' | 'payment';

interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  image: string;
  emoji: string;
  farmer: string;
}

interface ChatThread {
  farmerName: string;
  farmerImage: string;
  farmerEmoji: string;
  messages: Message[];
  lastMessage: string;
  lastTime: string;
}

interface Message {
  id: string;
  sender: string;
  text: string;
  time: string;
  isMe: boolean;
}

interface Product {
  id: string;
  emoji: string;
  name: string;
  farmer: string;
  location: string;
  price: string;
  unit: string;
  image: string;
  isVerified?: boolean;
}

interface OrderRecord {
  id: string; 
  date: string; 
  items: string[]; 
  status: 'delivered' | 'pending' | 'cancelled'; 
  total: string;
  paymentMethod?: string;
}

interface UserProfileData {
  name: string;
  phone: string;
  location: string;
  role: RoleType;
  joinedAt: string;
  isVerified?: boolean;
  orders: OrderRecord[];
  preferences: { notifications: boolean; language: 'sw' | 'en' };
}

// --- Shared Components ---
const Button = ({ 
  children, 
  variant = 'primary', 
  className = '', 
  ...props 
}: React.ButtonHTMLAttributes<HTMLButtonElement> & { variant?: 'primary' | 'ghost' | 'outline' | 'white' }) => {
  const base = "px-6 py-2.5 rounded-lg font-semibold transition-all duration-200 active:scale-95 flex items-center justify-center gap-2 text-sm";
  const variants = {
    primary: "bg-primary text-white hover:bg-primary-dark shadow-sm hover:shadow-md",
    ghost: "bg-transparent text-text-muted border border-border-subtle hover:bg-white hover:border-primary hover:text-primary",
    outline: "bg-transparent text-text-main border border-border-subtle hover:border-primary hover:text-primary",
    white: "bg-white text-primary hover:shadow-lg"
  };

  return (
    <button className={`${base} ${variants[variant]} ${className}`} {...props}>
      {children}
    </button>
  );
};

// --- Sections ---

const Navbar = ({ onOpenModal, cartItems, cartCount, user, onNavigate, activeView, onToggleChat }: { onOpenModal: (type: ModalType) => void, cartItems: CartItem[], cartCount: number, user: UserProfileData | null, onNavigate: (view: ViewType) => void, activeView: ViewType, onToggleChat: () => void }) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showCart, setShowCart] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 10);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const notifications = [
    { id: 1, text: "🍎 Bei ya Nyanya Arusha imepungua kwa 15%!", time: "Dakika 5 zilizopita" },
    { id: 2, text: "📦 Order yako #9021 iko njiani.", time: "Dakika 45 zilizopita" },
    { id: 3, text: "💬 Ujumbe mpya kutoka kwa Mkulima Juma.", time: "Dakika 2 zilizopita" },
  ];

  const totalCartValue = cartItems.reduce((acc, item) => acc + (item.price * item.quantity), 0);

  return (
    <nav className={`sticky top-0 z-50 h-20 px-6 md:px-12 flex items-center justify-between transition-all duration-300 ${isScrolled ? 'bg-surface/90 backdrop-blur-xl border-b border-border-subtle shadow-sm' : 'bg-surface border-b border-border-subtle'}`}>
      <div className="flex items-center gap-2 cursor-pointer" onClick={() => onNavigate('landing')}>
        <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center shadow-lg shadow-primary/20">
          <Leaf className="w-4 h-4 text-white" />
        </div>
        <span className="font-display font-extrabold text-xl tracking-tight text-text-main uppercase">
          Shamba<span className="text-primary italic">Direct</span>
        </span>
      </div>

      <div className="hidden xl:flex items-center gap-8">
        {user ? (
          <>
            {[
              { id: 'marketplace', label: 'Soko la Mazao' },
              { id: 'dashboard', label: 'Dashboard Yangu' },
              { id: 'profile', label: 'Akaunti' },
            ].map((link) => (
              <button 
                key={link.id} 
                onClick={() => onNavigate(link.id as ViewType)} 
                className={`text-[11px] font-black uppercase tracking-widest transition-all px-2 py-1 rounded-md ${activeView === link.id ? 'text-primary bg-primary/5' : 'text-text-muted hover:text-primary'}`}
              >
                {link.label}
              </button>
            ))}
          </>
        ) : (
          ['Soko', 'Bei za Mikoani', 'Elimu', 'Impact'].map((link) => (
            <a key={link} href={`#${link.toLowerCase().replace(/ /g, '-')}`} className="text-[11px] font-black uppercase tracking-widest text-text-muted hover:text-primary transition-colors">
              {link}
            </a>
          ))
        )}
      </div>

      <div className="flex items-center gap-4">
        {user && (
          <div className="flex items-center gap-2">
            {/* Notification Bell */}
            <div className="relative">
              <button 
                onClick={() => setShowNotifications(!showNotifications)}
                className={`p-2.5 bg-surface border border-border-subtle rounded-xl hover:border-primary transition-colors relative ${showNotifications ? 'border-primary' : ''}`}
              >
                <Bell className="w-5 h-5 text-text-main" />
                <span className="absolute top-2.5 right-2.5 w-2 h-2 bg-red-500 rounded-full border-2 border-surface animate-pulse" />
              </button>
              <AnimatePresence>
                {showNotifications && (
                  <motion.div 
                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 10, scale: 0.95 }}
                    className="absolute right-0 mt-4 w-80 bg-surface border border-border-subtle rounded-2xl shadow-2xl p-4 space-y-3 z-[100]"
                  >
                    <div className="flex justify-between items-center px-1">
                      <span className="text-[10px] font-black uppercase tracking-widest text-text-main">Notifications</span>
                      <button className="text-[10px] text-primary font-bold uppercase hover:underline border-none bg-transparent cursor-pointer">Mark all read</button>
                    </div>
                    <div className="space-y-2 max-h-[300px] overflow-y-auto pr-1 custom-scrollbar">
                      {notifications.map(n => (
                        <div key={n.id} className="p-3 bg-app-bg rounded-xl border border-border-subtle hover:border-primary/30 transition-all cursor-pointer">
                          <p className="text-xs font-semibold text-text-main leading-snug">{n.text}</p>
                          <p className="text-[9px] text-text-muted mt-1 font-bold italic">{n.time}</p>
                        </div>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Chat Button */}
            <button 
              onClick={onToggleChat}
              className="p-2.5 bg-surface border border-border-subtle rounded-xl hover:border-primary transition-colors relative"
            >
              <MessageCircle className="w-5 h-5 text-text-main" />
            </button>
          </div>
        )}

        {/* Cart Button with Dropdown logic */}
        <div className="relative">
          <button 
            onClick={() => setShowCart(!showCart)}
            className={`p-2.5 bg-surface border border-border-subtle rounded-lg hover:border-primary transition-colors shadow-sm relative ${showCart ? 'border-primary bg-app-bg' : ''}`}
          >
            <ShoppingBag className="w-5 h-5 text-text-main" />
            {cartCount > 0 && (
              <motion.span 
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-primary text-white text-[10px] font-bold rounded-full flex items-center justify-center border-2 border-surface"
              >
                {cartCount}
              </motion.span>
            )}
          </button>
          <AnimatePresence>
            {showCart && (
              <motion.div 
                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 10, scale: 0.95 }}
                className="absolute right-0 mt-4 w-72 bg-surface border border-border-subtle rounded-2xl shadow-2xl p-5 space-y-4 z-[100]"
              >
                <div className="text-[10px] font-black uppercase tracking-widest text-text-muted">Kitoroli Chako</div>
                {cartItems.length === 0 ? (
                  <p className="text-xs text-text-muted font-medium py-4 text-center italic">Hakuna bidhaa...</p>
                ) : (
                  <>
                    <div className="space-y-3 max-h-[250px] overflow-y-auto pr-1 custom-scrollbar">
                      {cartItems.map(item => (
                        <div key={item.id} className="flex gap-3 items-center">
                          <img src={item.image} className="w-10 h-10 rounded-lg object-cover border border-border-subtle shadow-sm bg-app-bg" alt={item.name} referrerPolicy="no-referrer" />
                          <div className="flex-1">
                            <div className="text-xs font-bold text-text-main">{item.name}</div>
                            <div className="text-[9px] text-text-muted uppercase tracking-widest">{item.quantity} x TZS {item.price.toLocaleString()}</div>
                          </div>
                        </div>
                      ))}
                    </div>
                    <div className="pt-4 border-t border-border-subtle flex justify-between items-center">
                      <span className="text-[10px] font-black uppercase tracking-widest text-text-muted">Jumla:</span>
                      <span className="text-sm font-black text-primary uppercase">TZS {totalCartValue.toLocaleString()}</span>
                    </div>
                    <Button className="w-full py-3 text-xs" onClick={() => { setShowCart(false); onOpenModal('checkout'); }}>Lipia Sasa</Button>
                  </>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {user ? (
          <button 
            onClick={() => onNavigate('profile')}
            className="flex items-center gap-3 pl-2 pr-4 py-1.5 bg-app-bg border border-border-subtle rounded-xl hover:border-primary transition-all group"
          >
            <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-colors">
              <User className="w-4 h-4" />
            </div>
            <div className="text-left hidden sm:block">
              <div className="text-[10px] font-bold text-text-muted uppercase tracking-wider leading-none mb-1">Mkaazi</div>
              <div className="text-xs font-extrabold text-text-main leading-none">{user.name.split(' ')[0]}</div>
            </div>
          </button>
        ) : (
          <>
            <Button variant="outline" className="hidden sm:flex" onClick={() => onOpenModal('ingia')}>Ingia</Button>
            <Button onClick={() => onOpenModal('jiunge')}>Anza Bure</Button>
          </>
        )}
      </div>
    </nav>
  );
};

const AnnouncementBar = () => (
  <div className="bg-text-main text-white py-2 px-6 text-center text-[11px] font-bold uppercase tracking-[0.1em]">
    🌱 Wakulima wapya: Miezi 3 ya bure! Tumia code <span className="text-primary italic">SHAMBA2025</span> &mdash; 
    <a href="#join" className="underline ml-2 text-primary hover:text-white transition-colors">Jisajili Leo →</a>
  </div>
);

const Hero = () => {
  return (
    <section className="max-w-7xl mx-auto px-6 md:px-12 py-16 md:py-24 grid lg:grid-cols-2 gap-16 items-center">
      <motion.div 
        initial={{ opacity: 0, x: -30 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.8 }}
        className="space-y-10"
      >
        <div className="inline-flex items-center gap-2 px-3 py-1 bg-primary/5 border border-primary/20 rounded-md text-primary text-[10px] font-extrabold uppercase tracking-widest">
          <span className="w-1.5 h-1.5 bg-primary rounded-full animate-pulse" />
          Inatumika Tanzania Nzima
        </div>
        <h1 className="font-display text-6xl md:text-7xl font-extrabold leading-[0.95] tracking-tighter text-text-main">
          Boresha <br/>
          <span className="text-primary">Biashara</span> Yako
        </h1>
        <p className="text-text-muted text-lg font-medium leading-relaxed max-w-lg">
          Shamba Direct inatumia teknolojia ya kisasa kuunganisha wakulima na wanunuzi Tanzania. Rahisisha utendaji wako na ongeza tija leo.
        </p>
        <div className="flex flex-wrap gap-4">
          <Button className="px-10 py-4 text-base rounded-xl shadow-xl shadow-primary/30">
            Anza Bure Leo <ArrowRight className="w-5 h-5" />
          </Button>
          <Button variant="ghost" className="px-10 py-4 text-base rounded-xl bg-white">
            <Play className="w-4 h-4 fill-current text-primary" /> Tazama Video
          </Button>
        </div>
        <div className="pt-10 border-t border-border-subtle flex gap-12">
          {[
            { label: 'Ukweli wa Bei', value: '100%' },
            { label: 'Ukuaji wa Soko', value: '45%' },
            { label: 'Kurahisisha', value: '99.9%' },
          ].map((stat) => (
            <div key={stat.label}>
              <div className="font-display text-3xl font-extrabold text-text-main tracking-tight">{stat.value}</div>
              <div className="text-[10px] text-text-muted uppercase tracking-[0.2em] mt-1 font-bold">{stat.label}</div>
            </div>
          ))}
        </div>
      </motion.div>

      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1, delay: 0.2 }}
        className="relative bg-white rounded-[32px] p-1 border border-border-subtle shadow-2xl overflow-hidden group"
      >
        <div className="bg-app-bg rounded-[30px] p-8 flex flex-col justify-between min-h-[500px] border border-border-subtle shadow-inner">
          <div className="flex justify-between items-start">
            <span className="bg-surface border border-border-subtle px-4 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-wider text-primary shadow-sm">Dashboard / Soko</span>
            <div className="flex items-center gap-2 text-[10px] font-extrabold text-text-muted">
              <div className="flex gap-1.5">
                <div className="w-2.5 h-2.5 rounded-full bg-red-400" />
                <div className="w-2.5 h-2.5 rounded-full bg-yellow-400" />
                <div className="w-2.5 h-2.5 rounded-full bg-green-400" />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 mt-8">
            {[
              { icon: <TrendingUp className="w-4 h-4" />, name: 'Mapato Ya Leo', value: 'TZS 450k', color: 'primary' },
              { icon: <Package className="w-4 h-4" />, name: 'Maagizo Mapya', value: '12', color: 'text-main' },
              { image: 'https://images.unsplash.com/photo-1551754655-cd27e38d2076?q=80&w=100', name: 'Mahindi Safi', value: '800kg', color: 'text-main' },
              { image: 'https://images.unsplash.com/photo-1518977676601-b53f02bad673?q=80&w=100', name: 'Nyanya Bora', value: '250kg', color: 'text-main' },
            ].map((m, idx) => (
              <motion.div 
                key={m.name} 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 + (idx * 0.1) }}
                className="bg-surface p-5 rounded-2xl border border-border-subtle shadow-sm hover:border-primary/30 transition-all cursor-default"
              >
                <div className="mb-3">
                  {m.image ? (
                    <img src={m.image} className="w-8 h-8 rounded-lg object-cover border border-border-subtle shadow-inner" alt={m.name} referrerPolicy="no-referrer" />
                  ) : (
                    <div className="w-8 h-8 rounded-lg bg-primary/10 text-primary flex items-center justify-center">
                      {m.icon}
                    </div>
                  )}
                </div>
                <div className="text-[10px] font-bold text-text-muted uppercase tracking-widest mb-1">{m.name}</div>
                <div className={`font-display text-xl font-extrabold text-${m.color}`}>{m.value}</div>
              </motion.div>
            ))}
          </div>

          <div className="mt-8 pt-8 border-t border-border-subtle">
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs font-bold text-text-main">Mwenendo wa Bei</span>
              <span className="text-[10px] text-primary font-bold">Live updates</span>
            </div>
            <div className="h-24 flex items-end gap-1.5">
              {[40, 65, 45, 80, 55, 90, 75, 85, 95].map((h, i) => (
                <motion.div 
                  key={i}
                  initial={{ height: 0 }}
                  animate={{ height: `${h}%` }}
                  transition={{ delay: 1 + (i * 0.05), duration: 0.5 }}
                  className="flex-1 bg-primary/20 rounded-t-md hover:bg-primary transition-colors relative group/bar"
                >
                  <div className="absolute -top-6 left-1/2 -translate-x-1/2 bg-text-main text-white text-[8px] px-1.5 py-0.5 rounded opacity-0 group-hover/bar:opacity-100 transition-opacity whitespace-nowrap">
                    TZS {h * 10}
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </motion.div>
    </section>
  );
};

const TrustedBy = () => (
  <div className="py-10 border-y border-border-subtle bg-surface overflow-hidden whitespace-nowrap">
    <div className="max-w-7xl mx-auto flex items-center gap-12 px-10">
      <span className="text-[10px] font-bold text-text-muted/60 uppercase tracking-[0.3em] shrink-0">Biashara zilizounganishwa:</span>
      <div className="flex gap-20 items-center opacity-30 hover:opacity-100 transition-opacity grayscale hover:grayscale-0">
        {['Sleek Solutions', 'Blue Horizon', 'Global Market', 'Tech Hub TZ', 'Prime Logistics'].map((l) => (
          <span key={l} className="font-display font-black text-xl tracking-tighter text-text-main">{l}</span>
        ))}
      </div>
    </div>
  </div>
);

const HowItWorks = () => (
  <section id="jinsi-inavyofanya-kazi" className="py-24 bg-app-bg px-6">
    <div className="max-w-7xl mx-auto">
      <div className="text-center space-y-4 mb-20">
        <span className="text-xs font-bold text-primary uppercase tracking-[0.3em]">Mchakato wa Sleek</span>
        <h2 className="font-display text-5xl font-extrabold text-text-main tracking-tight">Rahisi kwa Kila Hatua</h2>
        <p className="text-text-muted max-w-lg mx-auto leading-relaxed font-medium">Boresha utendaji wako na mfumo wetu wa kisasa ulioundwa kurahisisha kazi zako za kila siku.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
        {[
          { step: '01', icon: <User className="w-5 h-5" />, title: 'Tengeneza Profaili', desc: 'Jisajili haraka na utengeneze utambulisho wako wa kidijitali.' },
          { step: '02', icon: <Search className="w-5 h-5" />, title: 'Tafuta/Weka Bidhaa', desc: 'Tumia search yenye akili au weka bidhaa zako kwa urahisi.' },
          { step: '03', icon: <Plus className="w-5 h-5" />, title: 'Simamia Miamala', desc: 'Fanya maamuzi sahihi kupitia dashboard yenye data za wakati halisi.' },
          { step: '04', icon: <Check className="w-5 h-5" />, title: 'Kua Zaidi', desc: 'Ongeza faida na ufikie wanunuzi wengi zaidi nchini kote.' },
        ].map((item, idx) => (
          <div key={item.step} className="bg-surface p-8 rounded-2xl border border-border-subtle hover:border-primary/40 shadow-sm transition-all group">
            <div className="w-12 h-12 bg-app-bg text-primary border border-border-subtle rounded-xl flex items-center justify-center mb-6 group-hover:bg-primary group-hover:text-white transition-colors duration-300">
              {item.icon}
            </div>
            <div className="font-display text-4xl font-extrabold text-border-subtle mb-4 group-hover:text-primary/10 transition-colors uppercase italic">{item.step}</div>
            <h3 className="font-bold text-lg mb-3 text-text-main tracking-tight">{item.title}</h3>
            <p className="text-sm text-text-muted leading-relaxed font-medium">{item.desc}</p>
          </div>
        ))}
      </div>
    </div>
  </section>
);

interface ProductItemProps {
  key?: string | number;
  emoji: string;
  name: string;
  farmer: string;
  location: string;
  price: string;
  unit: string;
  image: string;
  onAdd: (name: string) => void;
  onChat: () => void;
  onDelete?: () => void;
  isVerified?: boolean;
  rating?: number;
}

const ProductItem = ({ 
  emoji, 
  name, 
  farmer, 
  location, 
  price, 
  unit, 
  image, 
  onAdd, 
  onChat, 
  onDelete,
  isVerified = false, 
  rating = 4.5 
}: ProductItemProps) => {
  const [imgError, setImgError] = useState(false);
  const [showConfirmDelete, setShowConfirmDelete] = useState(false);

  return (
    <motion.div 
      whileHover={{ y: -8 }}
      className="bg-surface border border-border-subtle rounded-2xl overflow-hidden group hover:border-primary shadow-sm hover:shadow-[0_20px_50px_rgba(37,99,235,0.1)] transition-all duration-300 relative"
    >
      <div className="h-48 relative bg-app-bg flex items-center justify-center overflow-hidden">
        {!imgError ? (
          <img 
            src={image} 
            referrerPolicy="no-referrer" 
            alt={name} 
            onError={() => setImgError(true)}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
          />
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center bg-primary/5 text-primary/20 space-y-2">
            <span className="text-6xl">{emoji}</span>
            <span className="text-[10px] font-black uppercase tracking-widest text-primary/40">Picha Inapakia...</span>
          </div>
        )}
        <div className="absolute top-4 right-4 flex flex-col gap-2 items-end">
        {onDelete ? (
          <div className="relative">
            {!showConfirmDelete ? (
              <button 
                onClick={(e) => { e.stopPropagation(); setShowConfirmDelete(true); }}
                className="bg-red-500 text-white p-2 rounded-xl shadow-lg border-none cursor-pointer transform hover:scale-110 transition-all"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            ) : (
              <div className="bg-white rounded-xl shadow-2xl p-2 flex gap-1 border border-red-500 animate-in fade-in zoom-in duration-200">
                <button 
                  onClick={(e) => { e.stopPropagation(); onDelete(); }}
                  className="bg-red-500 text-white px-3 py-1.5 rounded-lg text-[8px] font-black uppercase tracking-widest border-none cursor-pointer hover:bg-red-600 transition-colors"
                >
                  Futa
                </button>
                <button 
                  onClick={(e) => { e.stopPropagation(); setShowConfirmDelete(false); }}
                  className="bg-app-bg text-text-muted px-3 py-1.5 rounded-lg text-[8px] font-black uppercase tracking-widest border-none cursor-pointer hover:bg-border-subtle transition-colors"
                >
                  X
                </button>
              </div>
            )}
          </div>
        ) : (
          <div className="bg-white/90 backdrop-blur px-2.5 py-1 rounded-md text-[9px] font-black uppercase tracking-widest text-primary shadow-sm border border-border-subtle">
            {location}
          </div>
        )}
        {isVerified && (
          <div className="bg-green-500 text-white px-2 py-1 rounded-md flex items-center gap-1 shadow-lg">
            <ShieldCheck className="w-3 h-3" />
            <span className="text-[7px] font-black uppercase tracking-wider">Verified Mkulima</span>
          </div>
        )}
      </div>
      <div className="absolute bottom-4 left-4 flex gap-0.5 bg-surface/80 backdrop-blur px-2 py-1 rounded-full border border-border-subtle shadow-sm">
        {[...Array(5)].map((_, i) => (
          <Star key={i} className={`w-2.5 h-2.5 ${i < Math.floor(rating) ? 'fill-primary text-primary' : 'text-text-muted/30'}`} />
        ))}
      </div>
      <div className="absolute inset-0 bg-primary/0 group-hover:bg-primary/5 transition-colors pointer-events-none" />
    </div>
    <div className="p-6">
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="font-bold text-lg text-text-main tracking-tight mb-0.5">{name}</h3>
          <p className="text-[10px] font-bold text-text-muted uppercase tracking-widest">{farmer}</p>
        </div>
      </div>
      <div className="flex items-center justify-between mt-6">
        <div>
          <div className="text-[10px] font-extrabold text-text-muted uppercase tracking-widest mb-1">Presha ya Soko</div>
          <div className="font-display text-xl font-black text-primary">TZS {price}</div>
        </div>
        <div className="flex gap-2">
          <button 
            onClick={() => onAdd(name)}
            className="flex-1 bg-primary text-white text-[10px] font-black uppercase tracking-widest rounded-xl hover:bg-primary-dark transition-all py-3 shadow-lg shadow-primary/20 flex items-center justify-center gap-2"
          >
            <Smartphone className="w-3 h-3" /> Nunua Sasa
          </button>
          <button 
            onClick={onChat}
            className="w-12 h-12 bg-app-bg text-text-muted rounded-xl flex items-center justify-center hover:bg-primary hover:text-white transition-all active:scale-95 border border-border-subtle hover:border-primary"
          >
            <MessageCircle className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
    </motion.div>
  );
};

const MarketDashboard = () => (
  <section id="bei-za-mikoani" className="py-24 px-6 bg-surface">
    <div className="max-w-7xl mx-auto">
      <div className="grid lg:grid-cols-[1fr_350px] gap-12 bg-app-bg border border-border-subtle p-8 md:p-12 rounded-[48px] shadow-sm">
        <div className="space-y-10">
          <div className="inline-flex items-center gap-3 bg-white px-4 py-2 rounded-xl border border-border-subtle">
            <TrendingUp className="w-5 h-5 text-primary" />
            <span className="text-xs font-black uppercase tracking-[0.2em] text-text-main">Market Intel / Real-Time Data</span>
          </div>
          <h2 className="font-display text-4xl md:text-5xl font-extrabold text-text-main leading-tight tracking-tighter">
            Angalia <span className="text-primary italic">Mwenendo wa Bei</span> Leo Nchi Nzima.
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-6">
            {[
              { region: 'Dar es Salaam', price: '1,200', trend: 'up' },
              { region: 'Arusha', price: '950', trend: 'down' },
              { region: 'Dodoma', price: '1,100', trend: 'up' },
              { region: 'Mbeya', price: '800', trend: 'stable' },
              { region: 'Mwanza', price: '1,050', trend: 'up' },
              { region: 'Morogoro', price: '900', trend: 'down' },
            ].map(r => (
              <div key={r.region} className="bg-white p-6 rounded-2xl border border-border-subtle hover:border-primary/20 transition-all shadow-sm group">
                <div className="text-[10px] font-black text-text-muted uppercase tracking-widest mb-1">{r.region}</div>
                <div className="font-display text-xl font-black text-text-main">TZS {r.price}</div>
                <div className={`text-[9px] font-black mt-2 uppercase tracking-widest ${r.trend === 'up' ? 'text-red-500' : r.trend === 'down' ? 'text-green-500' : 'text-blue-500'}`}>
                  {r.trend === 'up' ? '▲ Kupanda' : r.trend === 'down' ? '▼ Kushuka' : '● Imara'}
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="bg-white rounded-3xl p-8 border border-border-subtle shadow-inner space-y-8">
          <div className="text-xs font-black uppercase tracking-[0.3em] text-primary">Top Gainers</div>
          <div className="space-y-6">
            {[
              { item: 'Vitunguu', increase: '+15%', icon: '🧅' },
              { item: 'Mahindi', increase: '+8%', icon: '🌽' },
              { item: 'Nyanya', increase: '-12%', icon: '🍅' },
            ].map(i => (
              <div key={i.item} className="flex items-center justify-between pb-4 border-b border-border-subtle last:border-0">
                <div className="flex items-center gap-3">
                  <span className="text-xl">{i.icon}</span>
                  <span className="text-sm font-extrabold text-text-main">{i.item}</span>
                </div>
                <span className={`text-xs font-black ${i.increase.startsWith('+') ? 'text-red-500' : 'text-green-500'}`}>{i.increase}</span>
              </div>
            ))}
          </div>
          <Button variant="outline" className="w-full mt-4 text-[10px] uppercase font-black tracking-widest">Download Full Report</Button>
        </div>
      </div>
    </div>
  </section>
);

const LearningSection = () => (
  <section id="elimu" className="py-24 px-6 bg-app-bg">
    <div className="max-w-7xl mx-auto">
      <div className="flex flex-col md:flex-row justify-between items-end gap-8 mb-20">
        <div className="space-y-4">
          <span className="text-xs font-bold text-primary uppercase tracking-[0.3em]">Knowledge Hub</span>
          <h2 className="font-display text-5xl font-extrabold text-text-main tracking-tight uppercase tracking-tight italic">Elimu kwa <span className="text-primary">Wakulima</span></h2>
          <p className="text-text-muted max-w-md leading-relaxed font-medium">Boresha uzalishaji wako kwa mbinu za kisasa na ushauri wa wataalam wetu.</p>
        </div>
        <Button variant="outline" className="rounded-full px-8 py-4">Tazama Maktaba Yote <BookOpen className="w-4 h-4 ml-2" /></Button>
      </div>

      <div className="grid md:grid-cols-3 gap-8">
        {[
          { icon: <TrendingUp className="w-6 h-6" />, title: 'Masoko ya Nje', desc: 'Jinsi ya kusafirisha mazao yako nchi za nje na kupata faida maradufu.' },
          { icon: <Award className="w-6 h-6" />, title: 'Uzalishaji Bora', desc: 'Tumia mbegu sahihi na mbolea kidijitali ili kupata mavuno mengi zaidi.' },
          { icon: <ShieldCheck className="w-6 h-6" />, title: 'Uhakika wa Mikopo', desc: 'Pata mikopo midogo ya mbegu na pembejeo kupitia history ya mauzo yako.' },
        ].map((item, idx) => (
          <div key={idx} className="bg-surface p-10 rounded-[32px] border border-border-subtle hover:border-primary transition-all group shadow-sm">
            <div className="w-14 h-14 bg-app-bg text-primary rounded-2xl flex items-center justify-center mb-8 group-hover:bg-primary group-hover:text-white transition-colors duration-500">
              {item.icon}
            </div>
            <h3 className="font-display text-2xl font-extrabold text-text-main mb-4 tracking-tight uppercase tracking-tight">{item.title}</h3>
            <p className="text-text-muted text-sm leading-relaxed font-medium">{item.desc}</p>
            <button className="mt-8 flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] text-primary hover:gap-4 transition-all">Soma Zaidi <ArrowRight className="w-4 h-4" /></button>
          </div>
        ))}
      </div>
    </div>
  </section>
);

const ImpactSection = () => (
  <section id="impact" className="py-32 px-6 bg-text-main overflow-hidden relative">
    <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-primary/10 rounded-full blur-[150px] -mr-40 -mt-20 pointer-events-none" />
    <div className="max-w-7xl mx-auto relative z-10 text-center space-y-20">
      <div className="space-y-6">
        <span className="text-xs font-black text-primary uppercase tracking-[0.5em]">Tanzania Social Impact</span>
        <h2 className="font-display text-5xl md:text-7xl font-extrabold text-white max-w-4xl mx-auto leading-[0.9] tracking-tighter italic">Zaidi ya Soko, <br/> Tunajenga <span className="text-primary italic">Mustakabali.</span></h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
        {[
          { label: 'Kipato Kimeongezeka', value: '+35%', sub: 'Kwa wastani wa mkulima mmoja' },
          { label: 'Tani Zilizookolewa', value: '450k', sub: 'Punguza upotevu wa mazao' },
          { label: 'Wakulima Waliothibitishwa', value: '12k', sub: 'Wanaotumia Verified Badge' },
          { label: 'Mikoa Inayofikiwa', value: '26', sub: 'Tanzania Bara na Visiwani' },
        ].map(stat => (
          <div key={stat.label} className="space-y-2">
            <div className="font-display text-6xl font-black text-white tracking-tighter">{stat.value}</div>
            <div className="text-[11px] font-black text-primary uppercase tracking-widest">{stat.label}</div>
            <div className="text-[10px] text-white/40 font-medium">{stat.sub}</div>
          </div>
        ))}
      </div>

      <div className="pt-10">
        <Button variant="white" className="rounded-full px-12 py-5 font-black uppercase tracking-widest text-xs">Soma Impact Report 2025</Button>
      </div>
    </div>
  </section>
);

const Products = ({ products, onAdd, onChat }: { products: Product[], onAdd: (name: string) => void, onChat: () => void }) => (
  <section id="mazao" className="py-24 px-6 md:px-12 bg-surface overflow-hidden">
    <div className="max-w-7xl mx-auto space-y-16">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="space-y-4">
          <span className="text-xs font-bold text-primary uppercase tracking-[0.3em]">Hali ya Soko</span>
          <h2 className="font-display text-5xl font-extrabold text-text-main tracking-tight">Mazao <span className="text-primary italic">Yaliyothibitishwa</span></h2>
          <p className="text-text-muted max-w-md leading-relaxed font-medium">Bofya bidhaa ili kuona maelezo ya kina ya mkulima na eneo la uzalishaji.</p>
        </div>
        <Button variant="outline">Angalia Soko Zima <ArrowRight className="w-4 h-4" /></Button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
        {products.map((p) => (
          <ProductItem 
            key={p.id}
            emoji={p.emoji}
            name={p.name}
            farmer={p.farmer}
            location={p.location}
            price={p.price}
            unit={p.unit}
            image={p.image}
            isVerified={p.isVerified}
            onAdd={onAdd}
            onChat={onChat}
          />
        ))}
      </div>
    </div>
  </section>
);

const RoleCard = ({ type, title, desc, features, onAction }: { type: RoleType, title: string, desc: string, features: string[], onAction: () => void }) => {
  const isFarmer = type === 'mkulima';
  return (
    <div className="flex flex-col bg-surface border border-border-subtle rounded-3xl overflow-hidden group shadow-sm hover:shadow-2xl transition-all duration-500">
      <div className="p-10 flex-1">
        <span className={`inline-block text-[10px] font-bold uppercase tracking-[0.2em] px-4 py-1.5 rounded-lg mb-8 ${isFarmer ? 'bg-primary text-white' : 'bg-text-main text-white'}`}>
          {isFarmer ? 'Moduli ya Mkulima' : 'Moduli ya Mnunuzi'}
        </span>
        <h3 className="font-display text-4xl font-extrabold mb-5 leading-tight text-text-main tracking-tighter">{title}</h3>
        <p className="text-text-muted mb-10 leading-relaxed font-medium">{desc}</p>
        <ul className="space-y-5">
          {features.map((f) => (
            <li key={f} className="flex items-start gap-4 text-sm font-semibold text-text-main/80">
              <div className={`w-6 h-6 rounded-lg flex items-center justify-center shrink-0 mt-0.5 ${isFarmer ? 'bg-primary/10 text-primary' : 'bg-text-main/10 text-text-main'}`}>
                <Check className="w-3.5 h-3.5" />
              </div>
              {f}
            </li>
          ))}
        </ul>
      </div>
      <div className="px-10 py-10 bg-app-bg border-t border-border-subtle">
        <Button 
          variant={isFarmer ? 'primary' : 'outline'} 
          className="w-full py-5 text-base rounded-xl"
          onClick={onAction}
        >
          {isFarmer ? 'Anza Kuuza' : 'Anza Kununua'} <ArrowRight className="w-5 h-5 ml-1" />
        </Button>
      </div>
    </div>
  );
};

const Roles = ({ onOpenModal }: { onOpenModal: (type: ModalType) => void }) => (
  <section id="kwa-wakulima" className="py-24 px-6 md:px-12 bg-app-bg">
    <div className="max-w-7xl mx-auto space-y-16">
      <div className="text-center space-y-4 mb-20">
        <span className="text-xs font-bold text-primary uppercase tracking-[0.3em]">Mifumo Maalumu</span>
        <h2 className="font-display text-5xl font-extrabold text-text-main tracking-tight">Imeundwa kwa Ajili Yako</h2>
        <p className="text-text-muted max-w-lg mx-auto leading-relaxed font-medium">Boresha utendaji wako kwa kutumia zana zilizobuniwa kwa mahitaji yako mahususi.</p>
      </div>

      <div className="grid lg:grid-cols-2 gap-10">
        <RoleCard 
          type="mkulima"
          title="Udhibiti Kamili wa Mazao Yako"
          desc="Weka bei yako, fuatilia maagizo, na pata malipo papo hapo kupitia mfumo wetu salama wa malipo."
          features={[
            "Dashboard ya mauzo na takwimu",
            "Mifumo ya malipo ya kidijitali (M-Pesa)",
            "Mikopo ya Pembejeo (Micro-loans)",
            "Usaidizi wa kiufundi 24/7",
            "Zana za kupunguza upotevu wa mazao"
          ]}
          onAction={() => onOpenModal('jiunge')}
        />
        <RoleCard 
          type="mnunuzi"
          title="Uhakika wa Ubora na Usambazaji"
          desc="Pata bidhaa safi moja kwa moja kutoka shambani kwa bei ya soko bila kupitia madalali wasio na lazima."
          features={[
            "Ufuatiliaji wa bidhaa (Traceability)",
            "Chaguo za delivery za haraka",
            "Miamala salama na iliyothibitishwa",
            "Viwango vya juu vya usafi (Quality Control)",
            "Ufikiaji wa bidhaa msimu mzima"
          ]}
          onAction={() => onOpenModal('jiunge')}
        />
      </div>
    </div>
  </section>
);

const TestimonialCard = ({ quote, author, role, initials }: { quote: string, author: string, role: string, initials: string }) => (
  <div className="bg-surface p-10 rounded-3xl border border-border-subtle shadow-lg group hover:border-primary transition-all">
    <div className="flex gap-1 mb-8">
      {[1, 2, 3, 4, 5].map((i) => <Star key={i} className="w-4 h-4 fill-primary text-primary" />)}
    </div>
    <p className="font-medium text-lg text-text-main leading-relaxed mb-10 italic">"{quote}"</p>
    <div className="flex items-center gap-4">
      <div className="w-12 h-12 bg-app-bg rounded-xl flex items-center justify-center font-black text-sm text-primary border border-border-subtle tracking-tighter">
        {initials}
      </div>
      <div>
        <div className="text-text-main font-bold text-base">{author}</div>
        <div className="text-text-muted text-[10px] font-extrabold uppercase tracking-widest mt-1">{role}</div>
      </div>
    </div>
  </div>
);

const Testimonials = () => (
  <section className="py-32 px-6 md:px-12 bg-white overflow-hidden relative">
    <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-primary/5 rounded-full blur-[120px] -mr-40 -mt-20 pointer-events-none" />
    <div className="max-w-7xl mx-auto space-y-20 relative z-10">
      <div className="text-center space-y-4">
        <span className="text-xs font-bold text-primary uppercase tracking-[0.3em]">Sauti za Mafanikio</span>
        <h2 className="font-display text-5xl font-extrabold text-text-main tracking-tight italic">Imethibitishwa na <span className="text-primary italic">Soko</span></h2>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        <TestimonialCard 
          quote="Teknolojia hii imeturahisishia kupata bei bora ya mahindi yetu Morogoro bila kupitia madalali."
          author="Juma Mwalimu"
          role="Mkulima, Morogoro"
          initials="JM"
        />
        <TestimonialCard 
          quote="Usimamizi wa ugavi umekuwa rahisi mno tangu tulipoanza kutumia platform hii kwa restaurant yetu."
          author="Amina Abdallah"
          role="Mmiliki Restaurant, DSM"
          initials="AA"
        />
        <TestimonialCard 
          quote="Uhakika wa bidhaa safi kila asubuhi umetuletea faida kubwa zaidi katika duka letu la jumla."
          author="David Kimaro"
          role="Mkuu wa Kaya, DSM"
          initials="DK"
        />
      </div>
    </div>
  </section>
);

const PricingCard = ({ title, price, desc, features, featured = false, onAction }: { title: string, price: string, desc: string, features: string[], featured?: boolean, onAction: () => void }) => (
  <div className={`relative p-10 rounded-3xl border flex flex-col transition-all duration-300 ${featured ? 'bg-surface border-primary shadow-2xl ring-4 ring-primary/5 -translate-y-4' : 'bg-surface border-border-subtle shadow-sm'}`}>
    {featured && (
      <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-primary text-white text-[9px] font-black uppercase tracking-[0.3em] px-6 py-2 rounded-lg shadow-xl shadow-primary/20">
        Ufanisi wa Juu
      </div>
    )}
    <div className="mb-10">
      <span className="text-[10px] font-extrabold text-text-muted uppercase tracking-[0.3em] mb-4 block">{title}</span>
      <div className="font-display text-5xl font-black mb-4 text-text-main tracking-tighter">
        {price}<span className="text-sm font-bold text-text-muted"> / mwezi</span>
      </div>
      <p className="text-sm text-text-muted leading-relaxed font-semibold">{desc}</p>
    </div>
    
    <div className="h-px bg-border-subtle mb-10" />
    
    <ul className="space-y-5 mb-10 flex-1">
      {features.map((f) => (
        <li key={f} className="flex items-center gap-4 text-sm font-semibold text-text-main/90">
          <div className="w-5 h-5 bg-primary/10 text-primary rounded-md flex items-center justify-center shrink-0">
            <Check className="w-3.5 h-3.5" />
          </div>
          {f}
        </li>
      ))}
    </ul>

    <Button 
      variant={featured ? 'primary' : 'outline'} 
      className="w-full py-5 text-sm rounded-xl font-extrabold"
      onClick={onAction}
    >
      Anza {price === 'Bure' ? 'Bure' : 'Sasa'}
    </Button>
  </div>
);

const Pricing = ({ onOpenModal }: { onOpenModal: (type: ModalType) => void }) => (
  <section id="bei" className="py-32 px-6 md:px-12 bg-app-bg">
    <div className="max-w-7xl mx-auto space-y-16">
      <div className="text-center space-y-4 mb-20">
        <span className="text-xs font-bold text-primary uppercase tracking-[0.3em]">Mfumo wa Ada</span>
        <h2 className="font-display text-5xl font-extrabold text-text-main tracking-tight uppercase tracking-tight">Gharama <span className="text-primary italic">Zisizoficha</span></h2>
        <p className="text-text-muted max-w-lg mx-auto leading-relaxed font-medium">Lipa tu pale unapotumia huduma zetu. Tunataka biashara yako ikue bila vikwazo vya kifedha.</p>
      </div>

      <div className="grid md:grid-cols-3 gap-8">
        <PricingCard 
          title="Basic"
          price="Bure"
          desc="Kwa wakulima binafsi na biashara ndogo zinazoanza mtandaoni."
          features={["Bidhaa 5 kwa mwezi", "Ufikiaji wa soko la kanda", "Takwimu za msingi", "Support ya SMS", "Malipo ya M-Pesa"]}
          onAction={() => onOpenModal('jiunge')}
        />
        <PricingCard 
          title="Premium"
          price="TZS 25k"
          desc="Ufumbuzi kamili kwa wakulima na wanunuzi wanaotaka kutanua biashara zao."
          features={["Bidhaa zisizo na ukomo", "Ufikiaji wa soko la nchi nzima", "Analytics & Takwimu za Juu", "Vipaumbele kwenye Search", "Support ya Simu 24/7"]}
          featured={true}
          onAction={() => onOpenModal('jiunge')}
        />
        <PricingCard 
          title="Enterprise"
          price="Maalum"
          desc="Zana maalum kwa ajili ya ushirika wa wakulima (Co-ops) na wasambazaji wakubwa."
          features={["Multi-user Dashboard", "Usimamizi wa Warehouse", "Export API Integration", "Account Manager Maalum", "Training kwa Timu"]}
          onAction={() => onOpenModal('jiunge')}
        />
      </div>
    </div>
  </section>
);

const CTA = ({ onOpenModal }: { onOpenModal: (type: ModalType) => void }) => (
  <section className="pb-32 px-6 md:px-12 bg-app-bg">
    <div className="max-w-7xl mx-auto">
      <div className="bg-text-main rounded-[48px] p-16 md:p-24 text-center relative overflow-hidden shadow-2xl">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-transparent" />
        <div className="relative z-10 space-y-10">
          <span className="text-xs font-extrabold text-primary uppercase tracking-[0.4em]">Sleek Connectivity</span>
          <h2 className="font-display text-5xl md:text-6xl font-extrabold text-white max-w-2xl mx-auto leading-[0.9] tracking-tighter italic">Unganisha Shamba Lako na <br/> <span className="text-primary">Dunia Leo</span></h2>
          <p className="text-white/60 max-w-lg mx-auto text-lg leading-relaxed font-medium">Jiunge na maelfu ya wakulima wa Tanzania waliopiga hatua kwa kutumia teknolojia ya Shamba Direct.</p>
          <div className="flex flex-wrap justify-center gap-6 pt-6">
            <Button className="px-12 py-5 text-lg rounded-2xl bg-primary hover:bg-primary-dark shadow-2xl shadow-primary/40 border-none" onClick={() => onOpenModal('jiunge')}>Jiunge Bure Sasa</Button>
            <Button variant="ghost" className="px-12 py-5 text-lg rounded-2xl border-white/10 text-white hover:bg-white/5 hover:border-white/30" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>Tafuta Mazao</Button>
          </div>
        </div>
      </div>
    </div>
  </section>
);

const FarmerDashboard = ({ user, products, onAddProduct, onDeleteProduct }: { user: UserProfileData, products: Product[], onAddProduct: (p: Omit<Product, 'id'>) => void, onDeleteProduct: (id: string) => void }) => {
  const [isAddingProduct, setIsAddingProduct] = useState(false);
  const [newProduct, setNewProduct] = useState({
    name: '',
    price: '',
    unit: 'kilo',
    location: user.location,
    image: null as File | null,
    imagePreview: null as string | null
  });

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setNewProduct(prev => ({ 
        ...prev, 
        image: file, 
        imagePreview: URL.createObjectURL(file) 
      }));
    }
  };

  const handlePostProduct = () => {
    if (!newProduct.name || !newProduct.price) return;
    
    onAddProduct({
      name: newProduct.name,
      price: newProduct.price,
      unit: newProduct.unit,
      location: newProduct.location,
      emoji: '🍃', // Default icon for new user products
      farmer: user.name,
      image: newProduct.imagePreview || `https://picsum.photos/seed/${newProduct.name.toLowerCase().replace(/ /g, '-')}/400/300`,
      isVerified: user.isVerified
    });

    setIsAddingProduct(false);
    setNewProduct({ name: '', price: '', unit: 'kilo', location: user.location, image: null, imagePreview: null });
  };

  const userProducts = products.filter(p => p.farmer === user.name);

  return (
    <div className="max-w-7xl mx-auto px-6 md:px-12 py-16 space-y-12">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
        <div>
          <span className="text-[10px] font-black text-primary uppercase tracking-[0.3em] mb-2 block">Farmer Intel</span>
          <h1 className="text-4xl md:text-5xl font-black text-text-main uppercase tracking-tighter italic">Karibu Shambani, <br/> <span className="text-primary italic">{user.name.split(' ')[0]}</span></h1>
        </div>
        <div className="flex gap-4">
          <Button variant="outline" className="rounded-xl px-8" onClick={() => setIsAddingProduct(false)}>Dashboard</Button>
          {!isAddingProduct && (
            <Button className="rounded-xl px-8 shadow-xl shadow-primary/20" onClick={() => setIsAddingProduct(true)}>Weka Bidhaa Mpya</Button>
          )}
        </div>
      </div>

      <AnimatePresence mode="wait">
        {isAddingProduct ? (
          <motion.div 
            key="add-product-form"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="bg-surface border border-border-subtle rounded-[40px] p-10 shadow-sm space-y-10"
          >
            <div className="flex flex-col md:flex-row gap-12">
              <div className="flex-1 space-y-8">
                <div>
                  <h2 className="text-2xl font-black text-text-main uppercase tracking-tighter italic mb-2">Sajili Bidhaa Mpya</h2>
                  <p className="text-sm text-text-muted font-medium">Maelezo haya yataonekana kwenye soko kwa wanunuzi wote.</p>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-text-muted pl-2">Jina la Bidhaa</label>
                    <input 
                      type="text" 
                      placeholder="Mf. Nyanya za Arusha" 
                      value={newProduct.name}
                      onChange={(e) => setNewProduct({...newProduct, name: e.target.value})}
                      className="w-full bg-app-bg border border-border-subtle rounded-2xl px-6 py-4 text-sm font-semibold outline-none focus:border-primary transition-all"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-text-muted pl-2">Mahali (Location)</label>
                    <input 
                      type="text" 
                      placeholder="Mf. Iringa" 
                      value={newProduct.location}
                      onChange={(e) => setNewProduct({...newProduct, location: e.target.value})}
                      className="w-full bg-app-bg border border-border-subtle rounded-2xl px-6 py-4 text-sm font-semibold outline-none focus:border-primary transition-all"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-text-muted pl-2">Bei (TZS)</label>
                    <input 
                      type="number" 
                      placeholder="1200" 
                      value={newProduct.price}
                      onChange={(e) => setNewProduct({...newProduct, price: e.target.value})}
                      className="w-full bg-app-bg border border-border-subtle rounded-2xl px-6 py-4 text-sm font-semibold outline-none focus:border-primary transition-all"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-text-muted pl-2">Kipimo (Unit)</label>
                    <select 
                      value={newProduct.unit}
                      onChange={(e) => setNewProduct({...newProduct, unit: e.target.value})}
                      className="w-full bg-app-bg border border-border-subtle rounded-2xl px-6 py-4 text-sm font-semibold outline-none focus:border-primary transition-all appearance-none"
                    >
                      <option value="kilo">Kilo</option>
                      <option value="bunda">Bunda</option>
                      <option value="gundi">Gundi</option>
                      <option value="gunia">Gunia</option>
                    </select>
                  </div>
                </div>

                <div className="flex gap-4 pt-4">
                  <Button className="px-10 py-4 shadow-xl shadow-primary/20" onClick={handlePostProduct}>Tangaza Bidhaa Sasa</Button>
                  <Button variant="outline" className="px-10 py-4" onClick={() => setIsAddingProduct(false)}>Ghairi</Button>
                </div>
              </div>

              <div className="w-full md:w-[350px] space-y-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-text-muted pl-2">Picha ya Zao</label>
                  <label className="block w-full h-80 bg-app-bg border-2 border-dashed border-border-subtle rounded-[32px] overflow-hidden cursor-pointer hover:border-primary transition-all relative group">
                    <input type="file" className="hidden" accept="image/*" onChange={handleImageChange} />
                    {newProduct.imagePreview ? (
                      <img src={newProduct.imagePreview} className="w-full h-full object-cover" alt="Preview" />
                    ) : (
                      <div className="absolute inset-0 flex flex-col items-center justify-center space-y-4 text-text-muted group-hover:text-primary">
                        <Camera className="w-12 h-12" />
                        <span className="text-[10px] font-bold uppercase tracking-widest">Gusa ku-upload picha</span>
                      </div>
                    )}
                  </label>
                </div>
                <div className="p-6 bg-primary/5 border border-primary/10 rounded-2xl">
                  <p className="text-[10px] leading-relaxed text-text-muted font-medium">
                    <span className="text-primary font-black uppercase">Kidokezo:</span> Hakikisha picha ni ya wazi na inaonyesha ubora wa zao lako ili kuvutia wanunuzi haraka.
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        ) : (
          <motion.div 
            key="dashboard-stats"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="space-y-12"
          >
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              {[
                { icon: <ShoppingBag className="w-5 h-5" />, label: 'Mauzo Mwezi Huu', value: 'TZS 1.2M', trend: '▲ 12%' },
                { icon: <TrendingUp className="w-5 h-5" />, label: 'Bei ya Wastani', value: 'TZS 1,200', trend: '▼ 3%' },
                { icon: <MapPin className="w-5 h-5" />, label: 'Active Listings', value: '14 Mazao', trend: '● Stable' },
                { icon: <User className="w-5 h-5" />, label: 'Wateja Wapya', value: '45+', trend: '▲ 20%' },
              ].map((stat, i) => (
                <div key={i} className="bg-surface p-8 rounded-[32px] border border-border-subtle shadow-sm hover:border-primary/20 transition-all group">
                  <div className="w-10 h-10 bg-app-bg text-primary rounded-xl flex items-center justify-center mb-6 group-hover:bg-primary group-hover:text-white transition-colors">
                    {stat.icon}
                  </div>
                  <p className="text-[10px] font-black text-text-muted uppercase tracking-widest mb-1">{stat.label}</p>
                  <h4 className="font-display text-2xl font-black text-text-main">{stat.value}</h4>
                  <span className={`text-[9px] font-black mt-2 uppercase tracking-widest ${stat.trend.startsWith('▲') ? 'text-green-500' : stat.trend.startsWith('▼') ? 'text-red-500' : 'text-primary'}`}>
                    {stat.trend}
                  </span>
                </div>
              ))}
            </div>

            <div className="grid lg:grid-cols-[1fr_400px] gap-8">
              <div className="bg-surface border border-border-subtle rounded-[40px] p-10 shadow-sm space-y-8">
                <div className="flex justify-between items-center">
                  <h3 className="text-xl font-black text-text-main uppercase tracking-tighter">Mazao Yako ({userProducts.length})</h3>
                  <button className="text-[10px] font-black text-primary uppercase tracking-widest hover:underline bg-transparent border-none cursor-pointer">Simamia yote</button>
                </div>
                
                {userProducts.length > 0 ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    {userProducts.map(p => (
                      <ProductItem 
                        key={p.id}
                        emoji={p.emoji}
                        name={p.name}
                        farmer={p.farmer}
                        location={p.location}
                        price={p.price}
                        unit={p.unit}
                        image={p.image}
                        isVerified={p.isVerified}
                        onAdd={() => {}} 
                        onChat={() => {}}
                        onDelete={() => onDeleteProduct(p.id)}
                      />
                    ))}
                  </div>
                ) : (
                  <div className="py-20 text-center space-y-4">
                    <div className="w-16 h-16 bg-app-bg rounded-full flex items-center justify-center mx-auto text-text-muted/30">
                      <ShoppingBag className="w-8 h-8" />
                    </div>
                    <p className="text-sm font-medium text-text-muted uppercase tracking-widest">Hujajaweka bidhaa yoyote bado</p>
                  </div>
                )}
              </div>

              <div className="bg-text-main rounded-[40px] p-10 text-white space-y-8 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-primary/20 blur-[60px] rounded-full" />
                <div className="relative z-10 space-y-6">
                  <span className="text-[10px] font-black text-primary uppercase tracking-[0.4em]">Sleek Finance</span>
                  <h3 className="text-3xl font-black tracking-tighter italic">Pata Mkopo wa <br/> <span className="text-primary italic">Halaka Papo Hapo.</span></h3>
                  <p className="text-white/50 text-xs font-medium leading-loose">Wakulima walio na history ya mauzo zaidi ya miezi 3 wanaweza kupata pembejeo za hadi TZS 500,000.</p>
                  <div className="pt-4">
                    <Button variant="white" className="w-full py-4 text-[10px] font-black uppercase tracking-widest">Apply Sasa</Button>
                  </div>
                </div>
                <div className="pt-10 border-t border-white/10 space-y-4">
                  <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-widest text-white/40">
                    <span>Next Payout</span>
                    <span>Alhamisi, 24 April</span>
                  </div>
                  <div className="text-2xl font-black tracking-tighter text-primary">TZS 150,450</div>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

const PaymentPage = ({ items, total, onConfirm, onCancel, status, selectedProvider }: { items: CartItem[], total: number, onConfirm: (method: string) => void, onCancel: () => void, status: 'idle' | 'processing' | 'success' | 'failed', selectedProvider: string | null }) => {
  return (
    <div className="max-w-4xl mx-auto px-6 py-16 space-y-12">
      <div className="text-center space-y-4">
        <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 rounded-full border border-primary/20">
          <Smartphone className="w-4 h-4 text-primary" />
          <span className="text-[10px] font-black uppercase tracking-widest text-primary">Secure Digital Payment</span>
        </div>
        <h1 className="text-4xl md:text-5xl font-black text-text-main uppercase tracking-tighter italic">Kamilisha <span className="text-primary italic">Malipo Yako.</span></h1>
        <p className="text-text-muted font-medium">Chagua njia ya malipo ya simu ili tukubarishie mzigo wako.</p>
      </div>

      <div className="grid md:grid-cols-[1fr_350px] gap-8">
        <div className="space-y-6">
          <div className="bg-surface border border-border-subtle rounded-[32px] p-8 shadow-sm">
            <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-text-muted mb-8">Chagua Mtandao</h3>
            <div className="grid grid-cols-2 gap-4">
              {[
                { id: 'mpesa', name: 'M-Pesa', logo: 'Vodacom', color: 'bg-red-500' },
                { id: 'tigopesa', name: 'Tigo Pesa', logo: 'Tigo', color: 'bg-blue-600' },
                { id: 'airtel', name: 'Airtel Money', logo: 'Airtel', color: 'bg-red-600' },
                { id: 'halopesa', name: 'Halopesa', logo: 'Halotel', color: 'bg-orange-500' },
              ].map(method => (
                <button 
                  key={method.id}
                  disabled={status === 'processing' || status === 'success'}
                  onClick={() => onConfirm(method.name)}
                  className="p-6 bg-app-bg border border-border-subtle rounded-3xl hover:border-primary hover:bg-white transition-all text-center space-y-3 group disabled:opacity-50"
                >
                  <div className={`w-12 h-12 ${method.color} rounded-2xl mx-auto flex items-center justify-center text-white font-black text-xs shadow-lg shadow-black/5`}>
                    {method.name.charAt(0)}
                  </div>
                  <div>
                    <div className="text-sm font-black text-text-main group-hover:text-primary uppercase tracking-tighter">{method.name}</div>
                    <div className="text-[8px] font-bold text-text-muted uppercase tracking-[0.2em]">{method.logo}</div>
                  </div>
                </button>
              ))}
            </div>
          </div>

          <div className="bg-text-main rounded-3xl p-8 text-white space-y-6 relative overflow-hidden">
             <div className="absolute -top-10 -right-10 w-40 h-40 bg-primary/20 blur-[80px] rounded-full" />
             <div className="flex items-center gap-3 relative z-10">
                <ShieldCheck className="w-5 h-5 text-primary" />
                <span className="text-[10px] font-black uppercase tracking-widest text-primary/80">End-to-End Encryption Enabled</span>
             </div>
             <p className="text-xs font-medium text-white/60 leading-relaxed relative z-10">
               Malipo yote yanachakatwa kupitia mfumo wetu uliosanifiwa kwa viwango vya kimataifa vya usalama. PIN yako ni siri yako.
             </p>
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-surface border border-border-subtle rounded-[32px] p-8 shadow-sm space-y-6">
            <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-text-muted">Muhtasari wa Order</h3>
            <div className="space-y-4">
              {items.map(item => (
                <div key={item.id} className="flex justify-between items-center text-sm font-bold text-text-main">
                  <span>{item.name} <span className="text-text-muted/50 font-medium">x{item.quantity}</span></span>
                  <span>TZS {(item.price * item.quantity).toLocaleString()}</span>
                </div>
              ))}
            </div>
            <div className="pt-6 border-t border-border-subtle space-y-2">
              <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-widest text-text-muted">
                <span>Shipping</span>
                <span className="text-green-500">Bure</span>
              </div>
              <div className="flex justify-between items-center bg-app-bg p-4 rounded-xl">
                 <span className="text-[10px] font-black uppercase tracking-widest text-text-main">Jumla ya Malipo</span>
                 <span className="text-xl font-black text-primary">TZS {total.toLocaleString()}</span>
              </div>
            </div>
          </div>
          
          <Button variant="outline" className="w-full py-4 text-xs font-black uppercase tracking-widest" onClick={onCancel} disabled={status === 'processing'}>
            Ghairi Malipo
          </Button>
        </div>
      </div>
    </div>
  );
};

const WhatsAppChat = ({ threads, activeThread, onSelect, onSend, onClose }: { threads: ChatThread[], activeThread: number, onSelect: (i: number) => void, onSend: (text: string) => void, onClose: () => void }) => {
  const [inputMsg, setInputMsg] = useState('');
  const chat = threads[activeThread];

  return (
    <div className="fixed bottom-0 right-0 md:bottom-8 md:right-8 z-[200] w-full md:w-[420px] h-[600px] bg-white md:rounded-[40px] shadow-[0_40px_120px_rgba(15,23,42,0.3)] border border-border-subtle overflow-hidden flex flex-col scale-100 origin-bottom-right">
      {/* Header */}
      <div className="bg-text-main px-6 py-5 flex items-center justify-between text-white border-b border-white/5">
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 bg-primary/20 rounded-full flex items-center justify-center text-2xl">
            {chat.farmerEmoji}
          </div>
          <div>
            <div className="text-sm font-black uppercase tracking-tighter italic">{chat.farmerName}</div>
            <div className="text-[10px] font-bold text-primary/80 uppercase tracking-widest flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 bg-primary rounded-full animate-pulse" /> Yuko Online
            </div>
          </div>
        </div>
        <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-full transition-colors border-none bg-transparent">
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto bg-[#efeae2] p-6 space-y-4 custom-scrollbar pattern-dots">
        <div className="flex justify-center mb-6">
          <span className="bg-white/80 text-[10px] font-black uppercase tracking-widest px-4 py-1.5 rounded-full text-text-muted shadow-sm">Leo</span>
        </div>
        
        {chat.messages.map((m, idx) => (
          <motion.div 
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            key={idx} 
            className={`flex ${m.isMe ? 'justify-end' : 'justify-start'}`}
          >
            <div className={`relative max-w-[85%] px-4 py-3 rounded-2xl text-xs font-semibold shadow-sm ${m.isMe ? 'bg-primary text-white rounded-tr-none' : 'bg-white text-text-main rounded-tl-none border border-border-subtle'}`}>
              <p className="leading-relaxed">{m.text}</p>
              <div className={`text-[9px] mt-1 text-right italic ${m.isMe ? 'text-white/60' : 'text-text-muted/60'}`}>
                {m.time} {m.isMe && '· ✓✓'}
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Input */}
      <div className="p-5 bg-white border-t border-border-subtle flex items-center gap-3">
        <button className="p-2 text-text-muted hover:text-primary transition-colors bg-transparent border-none">
          <Plus className="w-5 h-5" />
        </button>
        <div className="flex-1 relative">
           <input 
            type="text" 
            placeholder="Andika ujumbe hapa..." 
            value={inputMsg}
            onChange={(e) => setInputMsg(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && (onSend(inputMsg), setInputMsg(''))}
            className="w-full bg-app-bg border border-border-subtle rounded-2xl px-5 py-3 text-xs font-semibold outline-none focus:border-primary transition-all pr-12" 
          />
          <button className="absolute right-3 top-1/2 -translate-y-1/2 p-1.5 text-primary hover:scale-110 transition-all bg-transparent border-none">
            <Smartphone className="w-4 h-4" />
          </button>
        </div>
        <button 
          onClick={() => { onSend(inputMsg); setInputMsg(''); }}
          className="w-12 h-12 bg-primary text-white rounded-full flex items-center justify-center shadow-lg shadow-primary/20 hover:scale-105 active:scale-95 transition-all text-white border-none cursor-pointer"
        >
          <ArrowRight className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
};

const Footer = () => (
  <footer className="bg-surface pt-24 pb-12 px-6 md:px-12 border-t border-border-subtle">
    <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-20 pb-20 border-b border-border-subtle">
      <div className="col-span-1 md:col-span-1.5 space-y-8">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
            <Leaf className="w-4 h-4 text-white" />
          </div>
          <span className="font-display font-black text-xl text-text-main tracking-tighter uppercase">Shamba<span className="text-primary">Direct</span></span>
        </div>
        <p className="text-text-muted text-sm leading-relaxed max-w-xs font-medium">
          Tunatekeleza mapinduzi ya kidijitali katika sekta ya kilimo Tanzania kwa kuleta ufanisi na uwazi katika mnyororo wa thamani.
        </p>
        <div className="flex items-center gap-4 p-4 bg-app-bg border border-border-subtle rounded-xl w-fit shadow-inner">
          <Smartphone className="w-4 h-4 text-primary" />
          <span className="text-[10px] font-black text-text-main tracking-widest uppercase">Digital Payment Verified</span>
        </div>
      </div>

      {[
        { title: 'Platform', links: ['Dashboard', 'Mazao', 'Wakulima', 'Wanunuzi', 'Soko'] },
        { title: 'Kampuni', links: ['Kuhusu', 'Blog', 'Kazi', 'Mafanikio', 'Wasiliana'] },
        { title: 'Sheria', links: ['Masharti', 'Privacy', 'Cookies', 'Usalama', 'Leseni'] },
      ].map((col) => (
        <div key={col.title}>
          <h4 className="text-[10px] font-black text-text-main uppercase tracking-[0.25em] mb-8">{col.title}</h4>
          <ul className="space-y-4">
            {col.links.map((link) => (
              <li key={link}>
                <a href="#" className="text-sm font-semibold text-text-muted hover:text-primary transition-colors">{link}</a>
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
    <div className="max-w-7xl mx-auto pt-12 flex flex-col md:flex-row justify-between items-center gap-8">
      <p className="text-text-muted/50 text-[11px] font-bold uppercase tracking-wider">© 2025 Shamba Direct. Sleek Interface Enabled.</p>
      <div className="flex gap-10">
        {['Twitter', 'Instagram', 'LinkedIn'].map((s) => (
          <a key={s} href="#" className="text-[10px] font-black text-text-muted/40 hover:text-primary transition-colors uppercase tracking-[0.2em]">{s}</a>
        ))}
      </div>
    </div>
  </footer>
);

// --- Modals ---

const Modal = ({ 
  isOpen, 
  onClose, 
  title, 
  subTitle, 
  children 
}: { 
  isOpen: boolean, 
  onClose: () => void, 
  title: string, 
  subTitle: string, 
  children: React.ReactNode 
}) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-[100] bg-text-main/40 backdrop-blur-md"
          />
          <motion.div 
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-[101] w-full max-w-[480px] px-4"
          >
            <div className="bg-surface rounded-3xl p-12 relative shadow-[0_32px_128px_rgba(15,23,42,0.25)] overflow-hidden border border-border-subtle">
              <button 
                onClick={onClose}
                className="absolute top-8 right-8 p-2 bg-app-bg rounded-lg hover:bg-border-subtle transition-colors group cursor-pointer border-none"
              >
                <X className="w-5 h-5 text-text-muted group-hover:text-text-main" />
              </button>
              
              <div className="mb-12 text-center">
                <h2 className="font-display text-4xl font-extrabold mb-3 tracking-tighter text-text-main uppercase">{title}</h2>
                <p className="text-text-muted text-sm font-semibold">{subTitle}</p>
              </div>

              {children}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

const UserProfile = ({ user, onUpdate, onLogout }: { user: UserProfileData, onUpdate: (data: Partial<UserProfileData>) => void, onLogout: () => void }) => {
  const [activeSubTab, setActiveSubTab] = useState<'details' | 'orders' | 'settings'>('details');

  return (
    <div className="max-w-7xl mx-auto px-6 md:px-12 py-16">
      <div className="grid lg:grid-cols-[300px_1fr] gap-12">
        {/* Sidebar */}
        <div className="space-y-8">
          <div className="bg-surface border border-border-subtle rounded-3xl p-8 space-y-6 shadow-sm">
            <div className="flex flex-col items-center text-center space-y-4">
              <div className="w-24 h-24 bg-primary text-white rounded-[32px] flex items-center justify-center text-3xl font-black shadow-xl shadow-primary/20 relative">
                {user.name.charAt(0)}
                {user.isVerified && (
                  <div className="absolute -bottom-1 -right-1 bg-green-500 text-white p-1.5 rounded-full border-4 border-surface shadow-lg">
                    <ShieldCheck className="w-4 h-4" />
                  </div>
                )}
              </div>
              <div>
                <div className="flex items-center justify-center gap-2">
                  <h3 className="text-xl font-extrabold text-text-main uppercase tracking-tighter">{user.name}</h3>
                  {user.isVerified && (
                    <ShieldCheck className="w-5 h-5 text-green-500" />
                  )}
                </div>
                <p className="text-[10px] font-bold text-text-muted uppercase tracking-widest mt-1">{user.role} · {user.location}</p>
              </div>
            </div>
            
            <div className="h-px bg-border-subtle" />
            
            <nav className="space-y-2">
              {[
                { id: 'details', label: 'Maelezo ya Akaunti', icon: <User className="w-4 h-4" /> },
                { id: 'orders', label: 'Historia ya Maagizo', icon: <ShoppingBag className="w-4 h-4" /> },
                { id: 'settings', label: 'Mapendeleo & Usalama', icon: <Smartphone className="w-4 h-4" /> },
              ].map((item) => (
                <button 
                  key={item.id}
                  onClick={() => setActiveSubTab(item.id as any)}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold transition-all border-none cursor-pointer ${activeSubTab === item.id ? 'bg-primary text-white shadow-lg shadow-primary/20' : 'text-text-muted hover:bg-app-bg hover:text-text-main'}`}
                >
                  {item.icon}
                  {item.label}
                </button>
              ))}
            </nav>

            <div className="h-px bg-border-subtle" />

            <button 
              onClick={onLogout}
              className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold text-red-500 hover:bg-red-50 transition-all border-none cursor-pointer"
            >
              <X className="w-4 h-4" />
              Toka kwenye Mfumo
            </button>
          </div>
        </div>

        {/* Content Area */}
        <div className="bg-surface border border-border-subtle rounded-3xl p-10 shadow-sm min-h-[600px]">
          <AnimatePresence mode="wait">
            {activeSubTab === 'details' && (
              <motion.div 
                key="details"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="space-y-10"
              >
                <div>
                  <h2 className="text-2xl font-extrabold text-text-main tracking-tighter uppercase mb-2">Maelezo ya Akaunti</h2>
                  <p className="text-sm text-text-muted font-medium">Boresha utambulisho wako kwa wanunuzi na wakulima wengine.</p>
                </div>

                <div className="grid md:grid-cols-2 gap-8">
                  <div className="space-y-2">
                    <label className="text-[10px] font-extrabold text-text-main uppercase tracking-[0.25em] pl-1">Jina Kamili</label>
                    <input 
                      type="text" 
                      value={user.name} 
                      onChange={(e) => onUpdate({ name: e.target.value })}
                      className="w-full bg-app-bg border border-border-subtle rounded-xl px-6 py-4 text-sm font-semibold outline-none focus:border-primary transition-all shadow-inner" 
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-extrabold text-text-main uppercase tracking-[0.25em] pl-1">Nambari ya Simu</label>
                    <input 
                      type="tel" 
                      value={user.phone} 
                      onChange={(e) => onUpdate({ phone: e.target.value })}
                      className="w-full bg-app-bg border border-border-subtle rounded-xl px-6 py-4 text-sm font-semibold outline-none focus:border-primary transition-all shadow-inner" 
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-extrabold text-text-main uppercase tracking-[0.25em] pl-1">Eneo (Mkoa)</label>
                    <select 
                      value={user.location} 
                      onChange={(e) => onUpdate({ location: e.target.value })}
                      className="w-full bg-app-bg border border-border-subtle rounded-xl px-6 py-4 text-sm font-semibold outline-none focus:border-primary appearance-none shadow-inner"
                    >
                      {['Dar es Salaam', 'Arusha', 'Mwanza', 'Morogoro', 'Dodoma', 'Mbeya', 'Tanga', 'Kilimanjaro'].map(m => (
                        <option key={m} value={m}>{m}</option>
                      ))}
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-extrabold text-text-main uppercase tracking-[0.25em] pl-1">Role ya Mfumo</label>
                    <div className="px-6 py-4 bg-app-bg border border-border-subtle rounded-xl text-sm font-bold text-text-muted">
                      {user.role === 'mkulima' ? 'Mkulima Aliyethibitishwa' : 'Mnunuzi Maalum'}
                    </div>
                  </div>
                </div>

                <div className="pt-6 border-t border-border-subtle">
                  <Button className="px-10 py-4">Hifadhi Mabadiliko</Button>
                </div>
              </motion.div>
            )}

            {activeSubTab === 'orders' && (
              <motion.div 
                key="orders"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="space-y-10"
              >
                <div>
                  <h2 className="text-2xl font-extrabold text-text-main tracking-tighter uppercase mb-2">Historia ya Maagizo</h2>
                  <p className="text-sm text-text-muted font-medium">Fuatilia miamala yako yote na hali ya usafirishaji.</p>
                </div>

                <div className="space-y-8">
                  {user.orders.map((order) => (
                    <div key={order.id} className="bg-app-bg border border-border-subtle rounded-3xl p-8 space-y-6 hover:border-primary/30 transition-all">
                      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                        <div className="space-y-1">
                          <div className="flex items-center gap-3">
                            <span className="text-[10px] font-black text-primary uppercase tracking-[0.2em]">Agizo #{order.id}</span>
                            <span className={`px-2 py-0.5 rounded text-[8px] font-black uppercase tracking-widest ${order.status === 'delivered' ? 'bg-green-100 text-green-600' : 'bg-yellow-100 text-yellow-600'}`}>
                              {order.status}
                            </span>
                          </div>
                          <div className="text-sm font-extrabold text-text-main">{order.items.join(', ')}</div>
                          <div className="text-[10px] font-bold text-text-muted uppercase tracking-widest">{order.date}</div>
                        </div>
                        <div className="text-right">
                          <div className="text-xl font-black text-text-main tracking-tighter uppercase">{order.total}</div>
                         <Button variant="outline" className="mt-2 text-[9px] min-w-[120px]">Tazama Risiti</Button>
                        </div>
                      </div>
                      
                      {order.status === 'pending' && (
                        <div className="pt-6 border-t border-border-subtle space-y-4">
                          <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-widest text-text-muted">
                            <span>Delivery Status: Njiani</span>
                            <span className="text-primary italic">Inafika baada ya dakika 45 (Kariakoo)</span>
                          </div>
                          <div className="h-2 bg-white rounded-full overflow-hidden border border-border-subtle">
                            <motion.div 
                              initial={{ width: 0 }}
                              animate={{ width: '65%' }}
                              className="h-full bg-primary"
                            />
                          </div>
                          <div className="flex justify-between text-[8px] font-bold text-text-muted/60 uppercase tracking-tighter italic">
                            <span>Imechuliwa Shambani</span>
                            <span className="text-primary">Kariakoo Transit</span>
                            <span>Mlangoni Kwako</span>
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </motion.div>
            )}

            {activeSubTab === 'settings' && (
              <motion.div 
                key="settings"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="space-y-10"
              >
                <div>
                  <h2 className="text-2xl font-extrabold text-text-main tracking-tighter uppercase mb-2">Mapendeleo</h2>
                  <p className="text-sm text-text-muted font-medium">Binafsisha mfumo wako kwa ufanisi zaidi.</p>
                </div>

                <div className="space-y-8">
                  <div className="flex items-center justify-between p-6 bg-app-bg border border-border-subtle rounded-2xl shadow-inner">
                    <div className="space-y-1">
                      <div className="text-sm font-bold text-text-main">Taarifa za SMS</div>
                      <div className="text-xs text-text-muted">Pata ujumbe bidhaa mpya inapowekwa sokoni.</div>
                    </div>
                    <button 
                      onClick={() => onUpdate({ preferences: { ...user.preferences, notifications: !user.preferences.notifications } })}
                      className={`w-12 h-6 rounded-full transition-all relative ${user.preferences.notifications ? 'bg-primary' : 'bg-border-subtle'}`}
                    >
                      <motion.div 
                        initial={false}
                        animate={{ x: user.preferences.notifications ? 24 : 0 }}
                        className="absolute top-1 left-1 w-4 h-4 bg-white rounded-full shadow-sm" 
                      />
                    </button>
                  </div>

                  <div className="flex items-center justify-between p-6 bg-app-bg border border-border-subtle rounded-2xl shadow-inner">
                    <div className="space-y-1">
                      <div className="text-sm font-bold text-text-main">Lugha ya Mfumo</div>
                      <div className="text-xs text-text-muted">Chagua lugha inayokufaa zaidi.</div>
                    </div>
                    <select 
                      value={user.preferences.language}
                      onChange={(e) => onUpdate({ preferences: { ...user.preferences, language: e.target.value as any } })}
                      className="bg-surface border border-border-subtle rounded-lg px-4 py-2 text-[10px] font-black uppercase tracking-widest outline-none shadow-sm"
                    >
                      <option value="sw">Kiswahili</option>
                      <option value="en">English</option>
                    </select>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};

export default function App() {
  const [products, setProducts] = useState<Product[]>([
    { id: '1', emoji: '🌽', name: 'Mahindi', farmer: 'Juma Salim', location: 'Morogoro', price: '1,200', unit: 'kilo', image: 'https://images.unsplash.com/photo-1551754655-cd27e38d2076?q=80&w=600', isVerified: true },
    { id: '2', emoji: '🍅', name: 'Nyanya', farmer: 'Fatuma Ali', location: 'Arusha', price: '2,500', unit: 'kilo', image: 'https://images.unsplash.com/photo-1518977676601-b53f02bad673?q=80&w=600', isVerified: true },
    { id: '3', emoji: '🧅', name: 'Vitunguu', farmer: 'Kikundi cha Hewa', location: 'Dodoma', price: '1,800', unit: 'kilo', image: 'https://images.unsplash.com/photo-1580149022654-308539bb49f5?q=80&w=600', isVerified: false },
    { id: '4', emoji: '🥬', name: 'Mchicha', farmer: 'Amina Fanuel', location: 'Kilimanjaro', price: '800', unit: 'bunda', image: 'https://images.unsplash.com/photo-1524179524541-591963dec68b?q=80&w=600', isVerified: true },
    { id: '5', emoji: '🥕', name: 'Karoti', farmer: 'John Ngowi', location: 'Iringa', price: '1,500', unit: 'kilo', image: 'https://images.unsplash.com/photo-1590868309235-ea34bed7bd7f?q=80&w=600' },
    { id: '6', emoji: '🫘', name: 'Maharagwe', farmer: 'Coop ya Mbeya', location: 'Mbeya', price: '3,200', unit: 'kilo', image: 'https://images.unsplash.com/photo-1551462147-37885acc3c41?q=80&w=600' },
    { id: '7', emoji: '🌶️', name: 'Pilipili Hoho', farmer: 'Sara J.', location: 'Tanga', price: '4,000', unit: 'kilo', image: 'https://images.unsplash.com/photo-1563203400-0967347902bb?q=80&w=600' },
    { id: '8', emoji: '🍌', name: 'Ndizi', farmer: 'Benedict M.', location: 'Kagera', price: '2,000', unit: 'gundi', image: 'https://images.unsplash.com/photo-1571771894821-ad99621139c6?q=80&w=600' },
  ]);
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [toast, setToast] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalType, setModalType] = useState<ModalType>('jiunge');
  const [activeTab, setActiveTab] = useState<RoleType>('mkulima');
  const [view, setView] = useState<ViewType>('landing');
  const [user, setUser] = useState<UserProfileData | null>(null);

  const [formName, setFormName] = useState('');
  const [formPhone, setFormPhone] = useState('');
  const [formLocation, setFormLocation] = useState('');

  // Chat Simulated State
  const [chatThreads, setChatThreads] = useState<ChatThread[]>([
    {
      farmerName: 'Juma Salim',
      farmerEmoji: '🌽',
      lastMessage: 'Ndiyo, zimebaki kilo 50 tu.',
      lastTime: '10:05 AM',
      messages: [
        { id: '1', sender: 'Mkulima Juma', text: 'Habari, nyanya zipo bado?', time: '10:00 AM', isMe: false },
        { id: '2', sender: 'Me', text: 'Ndiyo, zimebaki kilo 50 tu.', time: '10:05 AM', isMe: true },
      ]
    },
    {
      farmerName: 'Fatuma Ali',
      farmerEmoji: '🍅',
      lastMessage: 'Karibu tena shambani.',
      lastTime: 'Machi 12',
      messages: [
        { id: '1', sender: 'Fatuma', text: 'Mzigo wako umeshafika, umeridhika?', time: '12:00 PM', isMe: false },
      ]
    }
  ]);
  const [activeChatThread, setActiveChatThread] = useState(0);
  const [isChatOpen, setIsChatOpen] = useState(false);

  const [isProcessingPayment, setIsProcessingPayment] = useState(false);
  const [paymentStatus, setPaymentStatus] = useState<'idle' | 'processing' | 'success' | 'failed'>('idle');
  const [selectedMobileProvider, setSelectedMobileProvider] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3000);
  };

  const handleAddToCart = (name: string, price: string, emoji: string, image: string, farmer: string) => {
    const numericPrice = parseInt(price.replace(/,/g, ''));
    setCartItems(prev => {
      const existing = prev.find(i => i.name === name);
      if (existing) {
        return prev.map(i => i.name === name ? { ...i, quantity: i.quantity + 1 } : i);
      }
      return [{ id: Date.now().toString(), name, price: numericPrice, quantity: 1, emoji, image, farmer }, ...prev];
    });
    
    // Trigger Checkout Flow
    setTimeout(() => {
      setView('payment');
    }, 100);
  };

  const handleOrder = (paymentMethod: string) => {
    if (!user) return;
    
    setSelectedMobileProvider(paymentMethod);
    setPaymentStatus('processing');
    setModalType('payment_status');
    setIsModalOpen(true);

    // Simulate USSD Push / API Call
    setTimeout(() => {
      const totalValue = cartItems.reduce((acc, item) => acc + (item.price * item.quantity), 0);
      const newOrder: OrderRecord = {
        id: Math.floor(1000 + Math.random() * 9000).toString(),
        date: new Date().toLocaleDateString('sw-TZ'),
        items: cartItems.map(i => `${i.name} (x${i.quantity})`),
        status: 'pending',
        total: `TZS ${totalValue.toLocaleString()}`,
        paymentMethod
      };
      
      setUser(prev => prev ? { ...prev, orders: [newOrder, ...prev.orders] } : null);
      setCartItems([]);
      setPaymentStatus('success');
      
      showToast(`🎉 Malipo ya ${paymentMethod} yamepokelewa!`);
    }, 4000);
  };

  const handleOpenModal = (type: ModalType) => {
    setModalType(type);
    setIsModalOpen(true);
  };

  const handleSendMessage = (text: string) => {
    if (!text.trim()) return;
    const msg: Message = {
      id: Date.now().toString(),
      sender: 'Me',
      text: text,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      isMe: true
    };
    
    const updatedThreads = [...chatThreads];
    updatedThreads[activeChatThread].messages.push(msg);
    updatedThreads[activeChatThread].lastMessage = text;
    updatedThreads[activeChatThread].lastTime = msg.time;
    setChatThreads(updatedThreads);
    
    // Auto-reply simulation
    setTimeout(() => {
      const reply: Message = {
        id: (Date.now() + 1).toString(),
        sender: updatedThreads[activeChatThread].farmerName,
        text: 'Nimepokea ujumbe wako. Nitalifanyia kazi hivi punde.',
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        isMe: false
      };
      const newThreads = [...updatedThreads];
      newThreads[activeChatThread].messages.push(reply);
      setChatThreads(newThreads);
    }, 2000);
  };

  const handleAuthAction = () => {
    if (modalType === 'jiunge') {
      const newUser: UserProfileData = {
        name: formName || 'Mteja Sleek',
        phone: formPhone || '0700 000 000',
        location: formLocation || 'Dar es Salaam',
        role: activeTab,
        joinedAt: new Date().toLocaleDateString('sw-TZ'),
        isVerified: activeTab === 'mkulima' ? false : false, // Default to unverified
        orders: [
          { id: '9021', date: '05 Map 2025', items: ['Nyanya kutoka Arusha'], status: 'delivered', total: 'TZS 45,000' },
        ],
        preferences: { notifications: true, language: 'sw' }
      };
      setUser(newUser);
      showToast('🎉 Karibu, unaweza sasa kuona Dashboard yako!');
      setView('dashboard');
    } else {
      // Mock login
      setUser({
        name: 'Amina Hassan',
        phone: '0712 345 678',
        location: 'Dar es Salaam',
        role: 'mkulima',
        joinedAt: '01/01/2025',
        isVerified: true,
        orders: [],
        preferences: { notifications: true, language: 'sw' }
      });
      showToast('Karibu tena!');
      setView('dashboard');
    }
    setIsModalOpen(false);
  };

  return (
    <div className="min-h-screen selection:bg-primary/20 selection:text-primary bg-app-bg">
      <AnnouncementBar />
      <Navbar 
        onOpenModal={handleOpenModal} 
        cartItems={cartItems} 
        cartCount={cartItems.reduce((acc, i) => acc + i.quantity, 0)} 
        user={user} 
        onNavigate={setView} 
        activeView={view}
        onToggleChat={() => setIsChatOpen(!isChatOpen)}
      />
      
      <main>
        <AnimatePresence mode="wait">
          {view === 'landing' && (
            <motion.div key="landing" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <Hero />
              <TrustedBy />
              <HowItWorks />
              <Products 
                products={products}
                onChat={() => setIsChatOpen(true)}
                onAdd={(name) => {
                  const p = products.find(prod => prod.name === name) || products[0];
                  handleAddToCart(name, p.price, p.emoji, p.image, p.farmer);
                }} 
              />
              <MarketDashboard />
              <Roles onOpenModal={handleOpenModal} />
              <LearningSection />
              <Testimonials />
              <Pricing onOpenModal={handleOpenModal} />
              <ImpactSection />
              <CTA onOpenModal={handleOpenModal} />
            </motion.div>
          )}

          {view === 'marketplace' && user && (
            <motion.div key="marketplace" initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }} className="py-12">
               <div className="max-w-7xl mx-auto px-6 md:px-12 space-y-12">
                <div className="flex justify-between items-end">
                  <h2 className="text-4xl font-black text-text-main uppercase tracking-tighter italic">Soko la <span className="text-primary italic">Leo</span></h2>
                  <div className="flex gap-4">
                    <Button variant="outline" className="rounded-xl"><MapIcon className="w-4 h-4 mr-2" /> Kalibu Nami</Button>
                    <div className="flex items-center gap-3 bg-white border border-border-subtle px-4 py-2 rounded-xl focus-within:border-primary">
                      <Search className="w-4 h-4 text-text-muted" />
                      <input type="text" placeholder="Tafuta bidhaa..." className="bg-transparent text-xs font-semibold outline-none" />
                    </div>
                  </div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                  {products.map(p => (
                    <ProductItem 
                      key={p.id}
                      emoji={p.emoji}
                      name={p.name}
                      farmer={p.farmer}
                      location={p.location}
                      price={p.price}
                      unit={p.unit}
                      image={p.image}
                      isVerified={p.isVerified}
                      onChat={() => setIsChatOpen(true)}
                      onAdd={(n) => handleAddToCart(n, p.price, p.emoji, p.image, p.farmer)}
                    />
                  ))}
                </div>
               </div>
            </motion.div>
          )}

          {view === 'dashboard' && user && (
            <motion.div key="dashboard" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="py-6">
              {user.role === 'mkulima' ? (
                <FarmerDashboard 
                  user={user} 
                  products={products}
                  onAddProduct={(newProd) => {
                    const id = Date.now().toString();
                    setProducts(prev => [{ id, ...newProd }, ...prev]);
                    showToast(`✅ Bidhaa ${newProd.name} imewekwa sokoni!`);
                  }}
                  onDeleteProduct={(id) => {
                    setProducts(prev => prev.filter(p => p.id !== id));
                    showToast('🗑️ Bidhaa imeondolewa sokoni.');
                  }}
                />
              ) : (
                <div className="max-w-7xl mx-auto px-6 md:px-12 py-16 text-center space-y-8">
                   <h1 className="text-4xl font-black text-text-main uppercase tracking-tighter">Buyer Dashboard coming soon!</h1>
                   <Button onClick={() => setView('marketplace')}>Endelea Kununua</Button>
                </div>
              )}
            </motion.div>
          )}

          {view === 'payment' && user && (
            <motion.div key="payment" initial={{ opacity: 0, x: 100 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -100 }}>
               <PaymentPage 
                items={cartItems} 
                total={cartItems.reduce((acc, i) => acc + (i.price * i.quantity), 0)} 
                status={paymentStatus}
                selectedProvider={selectedMobileProvider}
                onConfirm={handleOrder}
                onCancel={() => setView('marketplace')}
               />
            </motion.div>
          )}

          {view === 'profile' && user && (
            <motion.div key="profile" initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }}>
              <UserProfile user={user} onUpdate={(d) => setUser({ ...user, ...d })} onLogout={() => { setUser(null); setView('landing'); }} />
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      <Footer />

      {/* Checkout Modal */}
      <Modal isOpen={isModalOpen && modalType === 'checkout'} onClose={() => setIsModalOpen(false)} title="Lipa Shamba Direct" subTitle="Chagua njia ya malipo ya kidijitali iliyo salama.">
        <div className="space-y-8">
          <div className="p-4 bg-app-bg border border-border-subtle rounded-2xl flex justify-between items-center">
            <span className="text-[10px] font-black uppercase tracking-widest text-text-muted">Total Order Amount</span>
            <span className="text-xl font-black text-primary">TZS {cartItems.reduce((acc, i) => acc + (i.price * i.quantity), 0).toLocaleString()}</span>
          </div>
          <div className="grid grid-cols-2 gap-4">
            {[
              { id: 'mpesa', name: 'M-Pesa', logo: 'Vodacom' },
              { id: 'tigopesa', name: 'Tigo Pesa', logo: 'Tigo' },
              { id: 'airtel', name: 'Airtel Money', logo: 'Airtel' },
              { id: 'bank', name: 'Bank Transfer', logo: 'CRDB / NMB' },
            ].map(method => (
              <button 
                key={method.id}
                onClick={() => handleOrder(method.name)}
                className="p-6 bg-app-bg border border-border-subtle rounded-2xl hover:border-primary hover:bg-white transition-all text-center space-y-2 group"
              >
                <div className="text-sm font-black text-text-main group-hover:text-primary uppercase tracking-tighter">{method.name}</div>
                <div className="text-[8px] font-bold text-text-muted uppercase tracking-[0.2em]">{method.logo}</div>
              </button>
            ))}
          </div>
          <div className="space-y-4">
             <div className="space-y-2 text-left">
                <label className="text-[10px] font-extrabold text-text-main uppercase tracking-[0.25em] pl-1">Phone Number for Payment</label>
                <input type="tel" placeholder="0xxx xxx xxx" className="w-full bg-app-bg border border-border-subtle rounded-xl px-6 py-4 text-sm font-semibold outline-none focus:border-primary transition-all" />
              </div>
          </div>
        </div>
      </Modal>

      {/* Footer */}
      <Footer />
      <Modal 
        isOpen={isModalOpen && modalType === 'payment_status'} 
        onClose={() => paymentStatus !== 'processing' && setIsModalOpen(false)} 
        title={paymentStatus === 'processing' ? "Kushughulikia Malipo" : "Kikamilifu"}
        subTitle={paymentStatus === 'processing' ? `Tafadhali kamilisha malipo kwenye simu yako ya ${selectedMobileProvider}` : "Order yako imepokelewa na inashughulikiwa."}
      >
        <div className="flex flex-col items-center justify-center py-12 space-y-8 text-center">
          {paymentStatus === 'processing' ? (
            <>
              <div className="relative w-24 h-24">
                <motion.div 
                  className="absolute inset-0 border-4 border-primary/20 rounded-full"
                />
                <motion.div 
                  className="absolute inset-0 border-4 border-t-primary rounded-full"
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                />
                <div className="absolute inset-0 flex items-center justify-center">
                  <Smartphone className="w-8 h-8 text-primary animate-bounce" />
                </div>
              </div>
              <div className="space-y-4">
                <div className="p-4 bg-app-bg border border-border-subtle rounded-2xl">
                  <p className="text-xs font-bold text-text-main leading-relaxed">
                    Tumeuma ombi la malipo (USSD Push) kwenye simu yako.<br/>
                    <span className="text-primary">Weka PIN yako kukamilisha TZS {cartItems.reduce((acc, i) => acc + (i.price * i.quantity), 0).toLocaleString()}</span>
                  </p>
                </div>
                <p className="text-[10px] font-black uppercase tracking-widest text-text-muted animate-pulse italic">
                  Inasubiri uthibitisho kutoka kwa {selectedMobileProvider}...
                </p>
              </div>
            </>
          ) : (
            <>
              <motion.div 
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="w-24 h-24 bg-green-500 rounded-full flex items-center justify-center shadow-2xl shadow-green-500/40"
              >
                <Check className="w-12 h-12 text-white" />
              </motion.div>
              <div className="space-y-2">
                <h3 className="text-2xl font-black text-text-main uppercase tracking-tighter italic">Malipo Yamefanikiwa!</h3>
                <p className="text-sm text-text-muted font-medium">Namba ya Muamala: <span className="font-bold text-text-main tracking-widest">SDK-{Math.random().toString(36).substring(7).toUpperCase()}</span></p>
              </div>
              <div className="pt-4 w-full">
                <Button className="w-full py-4" onClick={() => { setIsModalOpen(false); setView('profile'); }}>Fuatilia Mzigo Wako</Button>
              </div>
            </>
          )}
        </div>
      </Modal>

      {/* Floating Elements */}
      <motion.button 
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        className="fixed bottom-8 left-8 z-[150] w-14 h-14 bg-primary text-white rounded-2xl flex items-center justify-center shadow-2xl shadow-primary/40 border-none cursor-pointer"
        onClick={() => setIsChatOpen(!isChatOpen)}
      >
        <MessageCircle className="w-6 h-6" />
      </motion.button>

      <AnimatePresence>
        {isChatOpen && (
          <WhatsAppChat 
            threads={chatThreads}
            activeThread={activeChatThread}
            onSelect={setActiveChatThread}
            onSend={handleSendMessage}
            onClose={() => setIsChatOpen(false)}
          />
        )}
      </AnimatePresence>

      {/* Persistence / UI Overlays */}
      <AnimatePresence>
        {toast && (
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="fixed bottom-12 right-12 z-[200] flex items-center gap-4 bg-text-main text-white px-8 py-5 rounded-2xl shadow-2xl border border-white/10"
          >
            <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center shrink-0 shadow-lg shadow-primary/40">
              <Check className="w-5 h-5" />
            </div>
            <span className="text-sm font-extrabold uppercase tracking-widest">{toast}</span>
            <div className="absolute top-0 right-0 h-full w-1.5 bg-primary rounded-r-2xl" />
          </motion.div>
        )}
      </AnimatePresence>

      <Modal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)}
        title={modalType === 'jiunge' ? 'Anza Bure Sasa' : 'Karibu Tena'}
        subTitle={modalType === 'jiunge' ? 'Jisajili kwa dakika chache na uanze kufanyia kazi biashara yako.' : 'Ingia kwenye mfumo wa Shamba Direct.'}
      >
        <div className="space-y-8">
          {modalType === 'jiunge' && (
            <div className="flex p-1 bg-app-bg border border-border-subtle rounded-2xl">
              <button 
                onClick={() => setActiveTab('mkulima')}
                className={`flex-1 py-3.5 text-[10px] font-black uppercase tracking-[0.2em] rounded-xl transition-all border-none cursor-pointer ${activeTab === 'mkulima' ? 'bg-primary text-white shadow-xl shadow-primary/20' : 'text-text-muted hover:text-text-main'}`}
              >
                Mkulima
              </button>
              <button 
                onClick={() => setActiveTab('mnunuzi')}
                className={`flex-1 py-3.5 text-[10px] font-black uppercase tracking-[0.2em] rounded-xl transition-all border-none cursor-pointer ${activeTab === 'mnunuzi' ? 'bg-primary text-white shadow-xl shadow-primary/20' : 'text-text-muted hover:text-text-main'}`}
              >
                Mnunuzi
              </button>
            </div>
          )}

          <div className="space-y-5">
            {modalType === 'jiunge' && (
              <div className="space-y-2 text-left">
                <label className="text-[10px] font-extrabold text-text-main uppercase tracking-[0.25em] pl-1">Jina Kamili</label>
                <input 
                  type="text" 
                  placeholder="Mfano: Amina Hassan" 
                  value={formName}
                  onChange={(e) => setFormName(e.target.value)}
                  className="w-full bg-app-bg border border-border-subtle rounded-xl px-6 py-4 text-sm font-semibold outline-none focus:border-primary transition-all shadow-inner placeholder:text-text-muted/40" 
                />
              </div>
            )}
            <div className="space-y-2 text-left">
              <label className="text-[10px] font-extrabold text-text-main uppercase tracking-[0.25em] pl-1">ID / Simu</label>
              <input 
                type="tel" 
                placeholder="0xxx xxx xxx" 
                value={formPhone}
                onChange={(e) => setFormPhone(e.target.value)}
                className="w-full bg-app-bg border border-border-subtle rounded-xl px-6 py-4 text-sm font-semibold outline-none focus:border-primary transition-all shadow-inner placeholder:text-text-muted/40" 
              />
            </div>
            {modalType === 'jiunge' && (
              <div className="space-y-2 text-left">
                <label className="text-[10px] font-extrabold text-text-main uppercase tracking-[0.25em] pl-1">Eneo Lako</label>
                <select 
                  value={formLocation}
                  onChange={(e) => setFormLocation(e.target.value)}
                  className="w-full bg-app-bg border border-border-subtle rounded-xl px-6 py-4 text-sm font-semibold outline-none focus:border-primary appearance-none cursor-pointer shadow-inner"
                >
                  <option value="">Chagua mkoa...</option>
                  {['Dar es Salaam', 'Arusha', 'Mwanza', 'Morogoro', 'Dodoma', 'Mbeya', 'Tanga', 'Kilimanjaro'].map(m => (
                    <option key={m}>{m}</option>
                  ))}
                </select>
              </div>
            )}
          </div>

          <Button className="w-full py-5 text-base rounded-2xl shadow-2xl shadow-primary/20 border-none" onClick={handleAuthAction}>
            {modalType === 'jiunge' ? `Jisajili Kama ${activeTab === 'mkulima' ? 'Mkulima' : 'Mnunuzi'}` : 'Ingia kwenye Mfumo'}
          </Button>

          <p className="text-center text-[11px] font-bold text-text-muted uppercase tracking-widest leading-loose">
            {modalType === 'jiunge' ? 'Una akaunti tayari?' : 'Huna akaunti ya mfumo?'} {' '}
            <button 
              onClick={() => setModalType(modalType === 'jiunge' ? 'ingia' : 'jiunge')}
              className="text-primary font-black hover:underline bg-transparent border-none cursor-pointer uppercase"
            >
              {modalType === 'jiunge' ? 'Ingia hapa' : 'Jisajili sasa'}
            </button>
          </p>
        </div>
      </Modal>

      <style>{`
        @keyframes shrink {
          from { width: 100%; }
          to { width: 0%; }
        }
        .animate-shrink {
          animation: shrink 3s linear forwards;
        }
      `}</style>
    </div>
  );
}
