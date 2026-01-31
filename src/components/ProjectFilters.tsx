import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';

interface ProjectFiltersProps {
  technologies: string[];
  selectedTech: string | null;
  onSelectTech: (tech: string | null) => void;
}

const ProjectFilters = ({ technologies, selectedTech, onSelectTech }: ProjectFiltersProps) => {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="flex flex-wrap justify-center gap-2 mb-12"
    >
      <Button
        variant={selectedTech === null ? "default" : "outline"}
        size="sm"
        onClick={() => onSelectTech(null)}
        className="rounded-full transition-all duration-300"
      >
        Todos
      </Button>
      {technologies.map((tech) => (
        <Button
          key={tech}
          variant={selectedTech === tech ? "default" : "outline"}
          size="sm"
          onClick={() => onSelectTech(tech)}
          className="rounded-full transition-all duration-300"
        >
          {tech}
        </Button>
      ))}
    </motion.div>
  );
};

export default ProjectFilters;
