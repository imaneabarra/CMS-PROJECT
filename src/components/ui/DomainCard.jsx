import React from 'react';
import { motion } from 'framer-motion';
import { getProductImageUrl } from '../../utils/imageHelper';

const DomainCard = ({ domain, index = 0 }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.6, delay: index * 0.15 }}
      className="relative overflow-hidden rounded-2xl cursor-pointer group aspect-[4/3]"
    >
      {/* Background Image */}
      <img
        src={getProductImageUrl(domain.image)}
        alt={domain.title}
        className="absolute inset-0 w-full h-full object-cover transition-transform duration-[1500ms] group-hover:scale-110 group-hover:brightness-110"
      />

      {/* Dark Overlay - Dynamic Gradient */}
      <div className="absolute inset-0 bg-gradient-to-t from-aether-900/90 via-aether-900/30 to-transparent group-hover:from-aether-900/70 transition-all duration-700" />

      {/* Content */}
      <div className="absolute inset-0 flex flex-col justify-end p-6 md:p-8">
        <motion.span 
          initial={{ opacity: 0, x: -10 }}
          whileInView={{ opacity: 1, x: 0 }}
          className="text-[10px] tracking-[0.4em] uppercase text-cyan-500 font-bold mb-2"
        >
          {domain.subtitle}
        </motion.span>
        <h3 className="font-serif text-2xl md:text-3xl text-white font-medium tracking-tight uppercase leading-tight group-hover:text-cyan-500 transition-colors duration-500">
          {domain.title}
        </h3>
      </div>

      {/* Hover border glow */}
      <div className="absolute inset-0 rounded-2xl border border-transparent group-hover:border-cyan-500/30 transition-all duration-500" />
    </motion.div>
  );
};

export default DomainCard;
