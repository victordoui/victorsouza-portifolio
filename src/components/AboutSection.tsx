import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Brain, Code, Zap, Database, Palette, Rocket } from 'lucide-react';
import AnimatedSection from '@/components/AnimatedSection';
import { motion } from 'framer-motion';
import { useLanguage } from '@/contexts/LanguageContext';

const AboutSection = () => {
  const { translations } = useLanguage();

  const skills = [
    { icon: Code, title: translations.about.skills.frontend.title, description: translations.about.skills.frontend.description, color: 'text-primary' },
    { icon: Brain, title: translations.about.skills.ai.title, description: translations.about.skills.ai.description, color: 'text-primary' },
    { icon: Zap, title: translations.about.skills.vibe.title, description: translations.about.skills.vibe.description, color: 'text-primary' },
    { icon: Database, title: translations.about.skills.data.title, description: translations.about.skills.data.description, color: 'text-primary' },
    { icon: Palette, title: translations.about.skills.design.title, description: translations.about.skills.design.description, color: 'text-primary' },
    { icon: Rocket, title: translations.about.skills.innovation.title, description: translations.about.skills.innovation.description, color: 'text-primary' },
  ];

  const technologies = [
    'React', 'TypeScript', 'Next.js', 'Node.js', 'Python', 'JavaScript',
    'Tailwind CSS', 'Supabase', 'PostgreSQL', 'Git', 'Figma', 'AWS',
    'TRAE', 'Lovable', 'Cursor', 'String', 'N8N'
  ];

  return (
    <section id="about" className="section-padding bg-muted/30">
      <div className="container mx-auto px-4 lg:px-8">
        <AnimatedSection className="text-center mb-16">
          <h2 className="font-display text-3xl md:text-4xl lg:text-5xl font-bold mb-6 hero-gradient-text">
            {translations.about.title}
          </h2>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
            {translations.about.description}
          </p>
        </AnimatedSection>

        <div className="grid lg:grid-cols-2 gap-16 items-center mb-20">
          {/* About Content */}
          <AnimatedSection delay={0.1}>
            <h3 className="font-display text-2xl font-semibold mb-6 text-foreground">
              {translations.about.subtitle}
            </h3>
            <div className="space-y-4 text-muted-foreground">
              <p>{translations.about.paragraph1}</p>
              <p>{translations.about.paragraph2}</p>
              <p>{translations.about.paragraph3}</p>
            </div>
          </AnimatedSection>

          {/* Technologies */}
          <AnimatedSection delay={0.2} direction="right">
            <h3 className="font-display text-xl font-semibold mb-6 text-foreground">
              {translations.about.technologiesTitle}
            </h3>
            <div className="flex flex-wrap gap-3">
              {technologies.map((tech, index) => (
                <motion.div
                  key={tech}
                  initial={{ opacity: 0, scale: 0.8 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.05, duration: 0.3 }}
                >
                  <Badge 
                    variant="secondary" 
                    className="px-4 py-2 text-sm font-medium hover:scale-105 transition-transform duration-200"
                  >
                    {tech}
                  </Badge>
                </motion.div>
              ))}
            </div>
          </AnimatedSection>
        </div>

        {/* Modern Skills Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {skills.map((skill, index) => (
            <AnimatedSection key={skill.title} delay={index * 0.1}>
              <Card className="group border shadow-sm hover:shadow-md transition-all duration-300 h-full">
                <CardContent className="p-6">
                  <div className="flex items-center mb-4">
                    <div className="p-3 rounded-lg bg-primary/10 mr-4 group-hover:scale-110 transition-transform duration-300">
                      <skill.icon className={`h-6 w-6 ${skill.color}`} />
                    </div>
                    <h4 className="font-semibold text-foreground text-lg">{skill.title}</h4>
                  </div>
                  <p className="text-muted-foreground text-sm leading-relaxed">{skill.description}</p>
                </CardContent>
              </Card>
            </AnimatedSection>
          ))}
        </div>
      </div>
    </section>
  );
};

export default AboutSection;
