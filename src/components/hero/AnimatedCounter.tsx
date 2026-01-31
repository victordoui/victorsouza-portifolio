import { useEffect, useState } from 'react';
import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';

interface CounterProps {
  end: number;
  duration?: number;
  suffix?: string;
  label: string;
}

const Counter = ({ end, duration = 2, suffix = '', label }: CounterProps) => {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });

  useEffect(() => {
    if (!isInView) return;

    let startTime: number;
    const step = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / (duration * 1000), 1);
      setCount(Math.floor(progress * end));
      if (progress < 1) {
        requestAnimationFrame(step);
      }
    };
    requestAnimationFrame(step);
  }, [isInView, end, duration]);

  return (
    <motion.div
      ref={ref}
      className="text-center"
      initial={{ opacity: 0, y: 20 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.5 }}
    >
      <div className="text-3xl lg:text-4xl font-bold text-foreground">
        {count}
        {suffix}
      </div>
      <div className="text-sm text-muted-foreground mt-1">{label}</div>
    </motion.div>
  );
};

interface AnimatedCounterProps {
  stats?: Array<{
    value: number;
    suffix?: string;
    label: string;
  }>;
}

const AnimatedCounter = ({ stats }: AnimatedCounterProps) => {
  const defaultStats = [
    { value: 15, suffix: '+', label: 'Projetos' },
    { value: 3, suffix: '+', label: 'Anos de Exp.' },
    { value: 10, suffix: '+', label: 'Tecnologias' },
  ];

  const displayStats = stats || defaultStats;

  return (
    <motion.div
      className="flex justify-center lg:justify-start gap-8 lg:gap-12"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.8, duration: 0.6 }}
    >
      {displayStats.map((stat, index) => (
        <Counter
          key={index}
          end={stat.value}
          suffix={stat.suffix}
          label={stat.label}
        />
      ))}
    </motion.div>
  );
};

export default AnimatedCounter;
