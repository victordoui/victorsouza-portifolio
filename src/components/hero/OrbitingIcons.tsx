import { motion } from 'framer-motion';

interface TechIcon {
  name: string;
  icon: string;
  color: string;
}

const techIcons: TechIcon[] = [
  { name: 'React', icon: '⚛️', color: 'hsl(var(--primary))' },
  { name: 'TypeScript', icon: '📘', color: 'hsl(var(--primary))' },
  { name: 'Node.js', icon: '🟢', color: 'hsl(var(--primary))' },
  { name: 'Python', icon: '🐍', color: 'hsl(var(--primary))' },
  { name: 'AI', icon: '🤖', color: 'hsl(var(--primary))' },
  { name: 'Database', icon: '🗄️', color: 'hsl(var(--primary))' },
];

const OrbitingIcons = () => {
  return (
    <div className="absolute inset-0 pointer-events-none">
      {techIcons.map((tech, index) => {
        const angle = (360 / techIcons.length) * index;
        const delay = index * 0.5;
        
        return (
          <motion.div
            key={tech.name}
            className="absolute top-1/2 left-1/2 w-10 h-10 flex items-center justify-center"
            style={{
              transformOrigin: 'center center',
            }}
            animate={{
              rotate: [angle, angle + 360],
            }}
            transition={{
              duration: 20,
              repeat: Infinity,
              ease: 'linear',
              delay,
            }}
          >
            <motion.div
              className="absolute flex items-center justify-center w-10 h-10 bg-card/80 backdrop-blur-sm rounded-full border border-border shadow-lg"
              style={{
                transform: `translateX(140px)`,
              }}
              animate={{
                rotate: [-angle, -angle - 360],
              }}
              transition={{
                duration: 20,
                repeat: Infinity,
                ease: 'linear',
                delay,
              }}
              whileHover={{ scale: 1.2 }}
            >
              <span className="text-lg" title={tech.name}>
                {tech.icon}
              </span>
            </motion.div>
          </motion.div>
        );
      })}
    </div>
  );
};

export default OrbitingIcons;
