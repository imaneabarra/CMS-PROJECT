import React from 'react';
import { useAuth } from '../../hooks/useAuth';
import Button from '../../components/ui/Button';

const Profile = () => {
  const { user, logout } = useAuth();

  if (!user) return <div className="text-center py-20 text-text-muted min-h-[60vh] font-bold uppercase tracking-widest">Please log in to view your profile.</div>;

  return (
    <div className="container mx-auto px-4 py-24 max-w-4xl min-h-[70vh]">
      <h1 className="text-4xl font-serif text-text-primary mb-10 uppercase tracking-widest font-bold">My Account</h1>
      
      <div className="glass-card p-10 border-glass-border shadow-2xl">
        <div className="flex flex-col md:flex-row items-center gap-8 mb-10 border-b border-glass-border pb-10">
          <div className="w-24 h-24 bg-cyan-500/10 border border-cyan-500/20 rounded-full flex items-center justify-center text-cyan-500 text-4xl font-serif shadow-lg">
            {user.name ? user.name.charAt(0).toUpperCase() : 'U'}
          </div>
          <div className="text-center md:text-left">
            <h2 className="text-2xl font-serif text-text-primary font-bold uppercase tracking-wider">{user.name}</h2>
            <p className="text-text-secondary font-medium uppercase tracking-widest text-xs mt-1">{user.email}</p>
            <span className="inline-block mt-4 px-4 py-1.5 bg-aether-800 border border-glass-border rounded-full text-[10px] font-bold text-cyan-500 uppercase tracking-[0.2em] shadow-sm">
              Status: {user.role} Member
            </span>
          </div>
        </div>

        <h3 className="text-xl font-serif text-text-primary mb-6 uppercase tracking-widest font-bold">Acquisition History</h3>
        <div className="text-center py-16 text-text-muted bg-aether-800 rounded-2xl border border-glass-border font-bold uppercase tracking-widest text-[10px] opacity-60">
          Your collection is currently empty.
        </div>
        
        <div className="mt-10 flex justify-end">
          <Button variant="secondary" onClick={logout} className="px-8 py-4 text-[10px] font-bold uppercase tracking-[0.2em] text-red-500 border-red-500/30 hover:bg-red-500/5 hover:border-red-500 transition-all">
            Secure Sign Out
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Profile;
