import React, { useState, useEffect } from 'react';
import { useTheme } from '../../context/ThemeContext';
import { Sun, Moon, Bell, Lock, Globe } from 'lucide-react';
import api from '../../services/api';
import { toast } from 'react-hot-toast';

const SettingRow = ({ label, description, children }) => (
  <div className="flex items-center justify-between py-6 border-b border-glass-border last:border-0">
    <div>
      <p className="text-sm text-text-primary font-bold uppercase tracking-wider">{label}</p>
      {description && <p className="text-[10px] text-text-muted mt-1 uppercase tracking-widest font-bold opacity-60">{description}</p>}
    </div>
    {children}
  </div>
);

const AdminSettings = () => {
  const { theme, toggleTheme } = useTheme();
  const [settings, setSettings] = useState({
    ambient_mode: theme === 'dark',
    operational_alerts: true,
    vault_levels: true,
    multi_factor_auth: false,
  });

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const response = await api.get('/settings');
        if (response.data && Object.keys(response.data).length > 0) {
          const parsed = {
            ambient_mode: response.data.ambient_mode === '1',
            operational_alerts: response.data.operational_alerts !== '0',
            vault_levels: response.data.vault_levels !== '0',
            multi_factor_auth: response.data.multi_factor_auth === '1',
          };
          setSettings(prev => ({ ...prev, ...parsed }));
          
          if (parsed.ambient_mode && theme === 'light') toggleTheme();
          if (!parsed.ambient_mode && theme === 'dark') toggleTheme();
        }
      } catch (error) {
        console.error('Failed to load settings', error);
      }
    };
    fetchSettings();
  }, []);

  const updateSetting = async (key, value) => {
    const newSettings = { ...settings, [key]: value };
    setSettings(newSettings);
    
    if (key === 'ambient_mode') {
      toggleTheme();
    }

    try {
      await api.post('/settings', { [key]: value ? '1' : '0' });
      toast.success('Settings synchronized securely');
    } catch (error) {
      console.error('Failed to save settings', error);
      toast.error('Failed to sync settings with server');
    }
  };

  return (
    <div className="space-y-6 max-w-2xl">
      {[
        {
          title: 'System Appearance', icon: Sun, items: [
            { label: 'Ambient Mode', description: 'Switch between dark and light ecosystem', action: (
              <button onClick={() => updateSetting('ambient_mode', !settings.ambient_mode)} className={`relative w-12 h-6 rounded-full transition-all duration-500 shadow-inner ${settings.ambient_mode ? 'bg-cyan-500' : 'bg-slate-300'}`}>
                <span className={`absolute top-0.5 w-5 h-5 rounded-full bg-white shadow-lg transition-transform duration-500 ${settings.ambient_mode ? 'translate-x-6' : 'translate-x-0.5'}`} />
              </button>
            )},
          ]
        },
        {
          title: 'Operational Alerts', icon: Bell, items: [
            { label: 'Order Dispatch', description: 'Real-time acquisition notifications', action: <input type="checkbox" checked={settings.operational_alerts} onChange={(e) => updateSetting('operational_alerts', e.target.checked)} className="w-4 h-4 rounded accent-cyan-500 cursor-pointer" /> },
            { label: 'Vault Levels', description: 'Inventory depletion warnings', action: <input type="checkbox" checked={settings.vault_levels} onChange={(e) => updateSetting('vault_levels', e.target.checked)} className="w-4 h-4 rounded accent-cyan-500 cursor-pointer" /> },
          ]
        },
        {
          title: 'Secure Access', icon: Lock, items: [
            { label: 'Multi-Factor Auth', description: 'Bespoke identity verification', action: <input type="checkbox" checked={settings.multi_factor_auth} onChange={(e) => updateSetting('multi_factor_auth', e.target.checked)} className="w-4 h-4 rounded accent-cyan-500 cursor-pointer" /> },
          ]
        },
      ].map(section => (
        <div key={section.title} className="bg-aether-700 border border-glass-border rounded-2xl p-8 shadow-sm">
          <div className="flex items-center gap-3 mb-6 pb-4 border-b border-glass-border">
            <div className="w-8 h-8 rounded-lg bg-cyan-500/10 flex items-center justify-center">
              <section.icon className="w-4 h-4 text-cyan-500" />
            </div>
            <h3 className="text-sm font-bold text-text-primary uppercase tracking-widest">{section.title}</h3>
          </div>
          {section.items.map(item => (
            <SettingRow key={item.label} label={item.label} description={item.description}>
              {item.action}
            </SettingRow>
          ))}
        </div>
      ))}
    </div>
  );
};

export default AdminSettings;
