import React, { useState, useMemo } from 'react';
import { ImageIcon } from 'lucide-react';
import { getProductImageUrl } from '../../utils/imageHelper';

/**
 * ProductImage Component
 * 
 * Handles fallback for missing or broken images with a professional tech placeholder.
 */
const ProductImage = ({ src, alt, className = "", ...props }) => {
  const [error, setError] = useState(false);

  // Process the image URL through the global helper
  const resolvedSrc = useMemo(() => {
    return getProductImageUrl(src);
  }, [src]);

  // Professional tech placeholder keywords based on context
  const getPlaceholderUrl = (altText) => {
    const text = altText?.toLowerCase() || '';
    if (text.includes('camera') || text.includes('cctv')) return 'https://images.unsplash.com/photo-1557597774-9d273605dfa9?w=800&q=80';
    if (text.includes('nvr') || text.includes('dvr') || text.includes('server')) return 'https://images.unsplash.com/photo-1558494949-ef010cbdcc48?w=800&q=80';
    if (text.includes('router') || text.includes('switch') || text.includes('networking')) return 'https://images.unsplash.com/photo-1544197150-b99a580bb7a8?w=800&q=80';
    if (text.includes('pc') || text.includes('laptop')) return 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=800&q=80';
    
    // Default high-end tech abstract
    return 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=800&q=80';
  };

  if (error || !resolvedSrc) {
    return (
      <div className={`relative bg-slate-800 flex items-center justify-center overflow-hidden ${className}`}>
        <img 
          src={getPlaceholderUrl(alt)} 
          alt="Technical Placeholder" 
          className="absolute inset-0 w-full h-full object-cover opacity-40 grayscale"
        />
        <div className="relative z-10 flex flex-col items-center gap-2">
          <ImageIcon className="w-8 h-8 text-cyan-500/50" />
          <span className="text-[8px] font-black uppercase tracking-[0.3em] text-cyan-500/40">Hardware Preview Unavailable</span>
        </div>
      </div>
    );
  }

  return (
    <img
      src={resolvedSrc}
      alt={alt}
      className={className}
      onError={() => setError(true)}
      {...props}
    />
  );
};

export default ProductImage;
