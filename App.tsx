
import React, { useState, useEffect } from 'react';
import BookingForm from './components/BookingForm';
import AdminDashboard from './components/AdminDashboard';
import Modal from './components/Modal';
import { Reservation } from './types';
import { BUSINESS_INFO } from './constants';

const App: React.FC = () => {
  const [isBookingOpen, setIsBookingOpen] = useState(false);
  const [isAdminOpen, setIsAdminOpen] = useState(false);
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [passwordInput, setPasswordInput] = useState('');
  const [loginError, setLoginError] = useState(false);
  
  const [reservations, setReservations] = useState<Reservation[]>([]);

  const ADMIN_PASSWORD = "2009"; 

  // Charger les données sauvegardées au démarrage
  useEffect(() => {
    const saved = localStorage.getItem('barbier_reservations');
    if (saved) {
      setReservations(JSON.parse(saved));
    } else {
      // Données de démonstration par défaut
      const mockData: Reservation[] = [
        { id: '1', name: 'Exemple Client', email: '', phone: '514-000-0000', date: new Date().toISOString().split('T')[0], time: '10:30', service: 'Forfait Le Maître', status: 'confirmed', createdAt: new Date().toISOString() }
      ];
      setReservations(mockData);
    }
  }, []);

  // Sauvegarder automatiquement quand les réservations changent
  useEffect(() => {
    if (reservations.length > 0) {
      localStorage.setItem('barbier_reservations', JSON.stringify(reservations));
    }
  }, [reservations]);

  const handleAdminClick = () => {
    if (isAuthenticated) {
      setIsAdminOpen(true);
    } else {
      setIsLoginOpen(true);
    }
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (passwordInput === ADMIN_PASSWORD) {
      setIsAuthenticated(true);
      setIsLoginOpen(false);
      setIsAdminOpen(true);
      setLoginError(false);
      setPasswordInput('');
    } else {
      setLoginError(true);
      setPasswordInput('');
    }
  };

  const addReservation = (data: any) => {
    const newRes: Reservation = {
      ...data,
      id: Math.random().toString(36).substr(2, 9),
      status: 'pending',
      createdAt: new Date().toISOString()
    };
    setReservations(prev => [newRes, ...prev]);
  };

  const updateStatus = (id: string, status: Reservation['status']) => {
    if (status === 'cancelled') {
      if (confirm('Voulez-vous vraiment supprimer cette réservation ?')) {
        setReservations(prev => prev.filter(res => res.id !== id));
      }
    } else {
      setReservations(prev => prev.map(res => res.id === id ? { ...res, status } : res));
    }
  };

  const pendingCount = reservations.filter(r => r.status === 'pending').length;

  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <nav className="fixed top-0 inset-x-0 z-50 bg-white/70 backdrop-blur-xl border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-slate-900 rounded-xl flex items-center justify-center text-white">
              <i className="fas fa-scissors text-lg"></i>
            </div>
            <span className="font-black text-xl tracking-widest uppercase hidden sm:block">
              {BUSINESS_INFO.name}
            </span>
          </div>
          <div className="flex items-center gap-4">
            <button 
              onClick={handleAdminClick}
              className="relative text-slate-400 hover:text-slate-900 font-bold text-[10px] uppercase tracking-widest px-4 py-2 transition-colors flex items-center gap-2 group"
            >
              <i className="fas fa-lock text-[8px] opacity-0 group-hover:opacity-100 transition-opacity"></i>
              Accès Staff
              {pendingCount > 0 && (
                <span className="flex h-1.5 w-1.5 rounded-full bg-indigo-500 animate-pulse"></span>
              )}
            </button>
            <button 
              onClick={() => setIsBookingOpen(true)}
              className="bg-slate-900 text-white px-6 py-3 rounded-full font-bold text-sm hover:scale-105 active:scale-95 transition-all shadow-xl shadow-slate-200"
            >
              Rendez-vous
            </button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative h-[90vh] flex items-center justify-center overflow-hidden pt-20">
        <div className="absolute inset-0 bg-slate-900">
          <img 
            src="https://images.unsplash.com/photo-1503951914875-452162b0f3f1?q=80&w=2070&auto=format&fit=crop" 
            className="w-full h-full object-cover opacity-60 grayscale"
            alt="Ambiance"
          />
        </div>
        <div className="relative z-10 text-center px-6 max-w-4xl">
          <span className="inline-block px-4 py-1.5 bg-indigo-600 text-white text-[10px] font-black rounded-full mb-6 tracking-[0.3em] uppercase">
            Repentigny • Québec
          </span>
          <h1 className="text-5xl md:text-8xl font-black text-white mb-8 tracking-tighter leading-[0.85]">
            L'ART DU <br/>
            <span className="text-indigo-400">MAÎTRE BARBIER</span>
          </h1>
          <p className="text-white/80 text-lg mb-10 max-w-lg mx-auto font-medium leading-relaxed">
            Un service de prestige au 340 Rue Notre-Dame. Redécouvrez les classiques du soin pour homme.
          </p>
          <button 
            onClick={() => setIsBookingOpen(true)}
            className="px-10 py-5 bg-white text-slate-900 rounded-full font-black text-lg hover:bg-slate-100 transition-all shadow-2xl active:scale-95"
          >
            RÉSERVER VOTRE PLACE
          </button>
        </div>
      </section>

      {/* Map Section */}
      <section className="py-24 bg-slate-50 border-t border-slate-100">
        <div className="max-w-7xl mx-auto px-6 text-center">
           <h2 className="text-3xl font-black tracking-tight uppercase mb-8">NOUS TROUVER</h2>
           <p className="text-slate-500 font-medium mb-12">{BUSINESS_INFO.address} • {BUSINESS_INFO.phone}</p>
           <div className="relative h-[400px] w-full rounded-[3rem] overflow-hidden shadow-2xl border-8 border-white">
            <iframe 
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2787.234674697954!2d-73.4475512!3d45.7464014!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x4cc8ef801d0a5209%3A0xc3f58e0a8163f98e!2s340%20Rue%20Notre-Dame%2C%20Repentigny%2C%20QC%20J6A%202S4%2C%20Canada!5e0!3m2!1sfr!2sfr!4v1710000000000!5m2!1sfr!2sfr" 
              width="100%" height="100%" style={{ border: 0 }} allowFullScreen={true} loading="lazy" referrerPolicy="no-referrer-when-downgrade"
              className="grayscale contrast-125"
              title="Carte"
            ></iframe>
          </div>
        </div>
      </section>

      {/* Modals */}
      <Modal isOpen={isBookingOpen} onClose={() => setIsBookingOpen(false)} title="Réserver votre siège">
        <BookingForm onAddReservation={addReservation} />
      </Modal>

      <Modal isOpen={isLoginOpen} onClose={() => setIsLoginOpen(false)} title="Connexion Staff">
        <form onSubmit={handleLogin} className="space-y-6 py-4">
          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest ml-1">Mot de passe secret</label>
            <input 
              autoFocus
              required type="password"
              value={passwordInput}
              onChange={e => { setPasswordInput(e.target.value); setLoginError(false); }}
              className={`w-full px-5 py-4 bg-slate-50 border ${loginError ? 'border-red-500 ring-4 ring-red-500/10' : 'border-slate-100'} rounded-2xl focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 outline-none transition-all text-center text-xl tracking-widest`}
              placeholder="••••"
            />
            {loginError && <p className="text-red-500 text-[10px] font-bold uppercase text-center mt-2">Mot de passe incorrect</p>}
          </div>
          <button type="submit" className="w-full py-5 bg-slate-900 text-white font-black rounded-2xl shadow-xl active:scale-95 transition-all">
            ACCÉDER AU DASHBOARD
          </button>
        </form>
      </Modal>

      <Modal isOpen={isAdminOpen} onClose={() => setIsAdminOpen(false)} title={`Gestion des rendez-vous`}>
        <AdminDashboard reservations={reservations} onUpdateStatus={updateStatus} />
      </Modal>
    </div>
  );
};

export default App;
