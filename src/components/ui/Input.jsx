import React, { useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';

const Input = ({ label, type = 'text', placeholder, icon: Icon, value, onChange, name, required = false, error, helperText, className = '' }) => {
  const [showPassword, setShowPassword] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  
  const isPassword = type === 'password';
  const inputType = isPassword ? (showPassword ? 'text' : 'password') : type;

  return (
    <div className={`space-y-2 w-full ${className}`}>
      {label && (
        <label className={`block text-[10px] tracking-[0.2em] uppercase font-bold transition-colors duration-300 ${error ? 'text-red-400' : isFocused ? 'text-cyan-500' : 'text-text-muted'}`}>
          {label} {required && <span className="text-cyan-500/50">*</span>}
        </label>
      )}
      <div className="relative group">
        {Icon && (
          <div className={`absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none transition-colors duration-300 ${error ? 'text-red-400/50' : isFocused ? 'text-cyan-500' : 'text-text-muted/50 group-hover:text-text-muted'}`}>
            {React.isValidElement(Icon) ? Icon : <Icon className="w-4 h-4" />}
          </div>
        )}
        <input
          type={inputType}
          name={name}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          required={required}
          className={`glass-input ${Icon ? 'pl-11' : ''} ${isPassword ? 'pr-11' : ''} ${error ? 'border-red-500/50 focus:ring-red-500/20 focus:border-red-500' : ''}`}
        />
        {isPassword && (
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-text-muted hover:text-text-primary transition-colors"
          >
            {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
          </button>
        )}
        
        {/* Subtle focus glow */}
        <div className={`absolute -inset-0.5 rounded-xl bg-cyan-500/10 blur-md transition-opacity duration-300 pointer-events-none -z-10 ${isFocused && !error ? 'opacity-100' : 'opacity-0'}`} />
      </div>
      
      {(error || helperText) && (
        <p className={`text-[10px] tracking-wider uppercase font-bold mt-1 ${error ? 'text-red-400' : 'text-text-muted opacity-60'}`}>
          {error || helperText}
        </p>
      )}
    </div>
  );
};

export default Input;
