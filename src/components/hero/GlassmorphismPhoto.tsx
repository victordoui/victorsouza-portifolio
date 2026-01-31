import { motion } from 'framer-motion';
import OrbitingIcons from './OrbitingIcons';

interface GlassmorphismPhotoProps {
  src: string;
  alt: string;
}

const GlassmorphismPhoto = ({ src, alt }: GlassmorphismPhotoProps) => {
  return (
    <motion.div
      className="relative"
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: 0.2, duration: 0.8, ease: [0.25, 0.1, 0.25, 1] }}
    >
      {/* Animated gradient border */}
      <div className="absolute -inset-1 rounded-2xl bg-gradient-to-r from-primary/50 via-accent to-primary/50 opacity-75 blur-sm animate-gradient-rotate" />
      
      {/* Glassmorphism frame */}
      <div className="relative p-1 rounded-2xl bg-card/30 backdrop-blur-md border border-border/50">
        <div className="relative overflow-hidden rounded-xl group">
          <img
            src={src}
            alt={alt}
            className="w-full max-w-md mx-auto rounded-xl object-cover aspect-square lg:aspect-[4/5] transition-all duration-700 group-hover:scale-105"
            loading="eager"
          />
          
          {/* Subtle overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-background/20 via-transparent to-transparent pointer-events-none" />
        </div>
      </div>
      
      {/* Orbiting icons */}
      <OrbitingIcons />
    </motion.div>
  );
};

export default GlassmorphismPhoto;
