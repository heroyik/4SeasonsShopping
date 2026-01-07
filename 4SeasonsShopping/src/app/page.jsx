"use client";

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, ShoppingCart } from 'lucide-react';
import { getAssetPath } from '@/config';

import styles from './page.module.css';
import clsx from 'clsx';

const SEASONS = [
  { 
    id: 'spring', 
    name: 'Spring Collection', 
    tagline: 'Bloom into style.', 
    description: "Awaken your senses with breezy tailoring and soft pastels. Designed for the fresh start you've been waiting for.",
    price: '$299', 
    color: 'var(--color-spring-accent)',
    bg: 'var(--color-spring)' 
  },
  { 
    id: 'summer', 
    name: 'Summer Vibes', 
    tagline: 'Chasing Sunsets.', 
    description: "Effortless linen meets bold attitude. Stay cool in the heat of the moment with our lightweight essentials.",
    price: '$199', 
    color: 'var(--color-summer-accent)',
    bg: 'var(--color-summer)' 
  },
  { 
    id: 'autumn', 
    name: 'Autumn Essence', 
    tagline: 'Layered Sophistication.', 
    description: "Rich earth tones and structured layers. Embrace the changing breeze with warmth and undeniable class.",
    price: '$349', 
    color: 'var(--color-autumn-accent)',
    bg: 'var(--color-autumn)' 
  },
  { 
    id: 'winter', 
    name: 'Winter Chill', 
    tagline: 'Bold Elegance.', 
    description: "Conquer the cold with premium wool and sharp silhouettes. Maximum warmth, zero compromise on style.",
    price: '$450', 
    color: 'var(--color-winter-accent)',
    bg: 'var(--color-winter)' 
  },
];

import dynamic from 'next/dynamic';
import { X } from 'lucide-react';

const ARViewer = dynamic(() => import('@/components/dom/ARViewer'), { ssr: false });
const Scene = dynamic(() => import('@/components/canvas/Scene'), { ssr: false });

export default function Home() {
  const [currentSeason, setCurrentSeason] = useState(SEASONS[0]);
  const [direction, setDirection] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [isAROpen, setIsAROpen] = useState(false);

  // Auto-play effect
  useEffect(() => {
    if (isPaused || isAROpen) return;

    const interval = setInterval(() => {
      setCurrentSeason((prev) => {
        const currentIndex = SEASONS.findIndex(s => s.id === prev.id);
        const nextIndex = (currentIndex + 1) % SEASONS.length;
        setDirection(1); // Always move forward
        return SEASONS[nextIndex];
      });
    }, 4000); // Change every 4 seconds

    return () => clearInterval(interval);
  }, [isPaused, isAROpen]);

  const handleSeasonChange = (season) => {
    setIsPaused(true); // Stop auto-play when user interacts
    
    // Determine direction for animation based on index
    const currentIndex = SEASONS.findIndex(s => s.id === currentSeason.id);
    const newIndex = SEASONS.findIndex(s => s.id === season.id);
    setDirection(newIndex > currentIndex ? 1 : -1);
    setCurrentSeason(season);
  };

  const handleViewDetails = () => {
    setIsPaused(true);
    setIsAROpen(true);
  };

  return (
    <div className={styles.mainWrapper} style={{ backgroundColor: currentSeason.bg }}>
      
      {/* 3D Background Layer */}
      <Scene season={currentSeason.id} />



      {/* AR Modal Overlay */}
      <AnimatePresence>
        {isAROpen && (
          <motion.div 
            className={styles.arOverlay}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.3 }}
          >
            <button 
              className={styles.closeArBtn} 
              onClick={() => setIsAROpen(false)}
            >
              <X size={18} color="black" /> Close
            </button>
            <ARViewer modelSrc={getAssetPath(`${currentSeason.id}.glb`)} />
          </motion.div>
        )}
      </AnimatePresence>

      {/* UI Overlay */}
      <div className={styles.uiContainer}>
        
        {/* Main Text Content */}
        <div className={styles.heroContent}>
          <AnimatePresence mode='wait' custom={direction}>
            <motion.div
               key={currentSeason.id}
               initial={{ opacity: 0, x: direction * 50 }}
               animate={{ opacity: 1, x: 0 }}
               exit={{ opacity: 0, x: direction * -50 }}
               transition={{ duration: 0.5, ease: "circOut" }}
            >
              <span className={styles.tagline}>{currentSeason.tagline}</span>
              <h1 className={styles.title} style={{ color: currentSeason.color }}>
                {currentSeason.name.split(' ')[0]}
              </h1>
              <h2 className={styles.subtitle}>
                {currentSeason.name.split(' ')[1] || 'Collection'}
              </h2>
              
              <p className={styles.description}>
                {currentSeason.description}
              </p>

              <div className={styles.priceTag}>
                {currentSeason.price}
              </div>

              <div className={styles.actions}>
                <button className={styles.primaryBtn} style={{ backgroundColor: currentSeason.color }}>
                  Add to Cart <ShoppingCart size={18} />
                </button>
                <button onClick={handleViewDetails} className={styles.secondaryBtn}>
                  View Details
                </button>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Season Selector (Bento/Slider style) */}
        <div className={styles.selectorWrapper}>
          <div className={styles.selectorLabel}>Select Season</div>
          <div className={styles.selectorGrid}>
            {SEASONS.map((season) => (
              <button
                key={season.id}
                onClick={() => handleSeasonChange(season)}
                className={clsx(styles.seasonBtn, currentSeason.id === season.id && styles.active)}
                aria-label={`Select ${season.name}`}
              >
                <div 
                  className={styles.colorDot} 
                  style={{ backgroundColor: season.color }}
                />
                <span className={styles.seasonName}>{season.id}</span>
                {currentSeason.id === season.id && (
                  <motion.div 
                    layoutId="active-ring" 
                    className={styles.activeRing} 
                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                  />
                )}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
