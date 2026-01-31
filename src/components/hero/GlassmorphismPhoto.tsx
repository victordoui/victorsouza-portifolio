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
      {/* Photo without background or frame */}
      <div className="relative group">
        <img
          src={src}
          alt={alt}
          className="w-full max-w-md mx-auto object-cover aspect-square lg:aspect-[4/5] transition-all duration-700 group-hover:scale-105"
          loading="eager"
        />
      </div>
      
      {/* Orbiting icons */}
      <OrbitingIcons />
    </motion.div>
  );
};

export default GlassmorphismPhoto;
