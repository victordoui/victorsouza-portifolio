import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Brain, Code, Zap, Database, Palette, Rocket } from 'lucide-react';

const AboutSection = () => {
  const skills = [
    { icon: Code, title: 'Frontend Development', description: 'React, TypeScript, Next.js, Tailwind CSS', color: 'text-primary' },
    { icon: Brain, title: 'Inteligência Artificial', description: 'Machine Learning, Data Analysis, Python', color: 'text-primary' },
    { icon: Zap, title: 'Vibe Code Solutions', description: 'Automação, Workflows, Integração APIs', color: 'text-primary' },
    { icon: Database, title: 'Análise de Dados', description: 'SQL, Power BI, Analytics, Insights', color: 'text-primary' },
    { icon: Palette, title: 'UI/UX Design', description: 'Figma, Design Systems, User Experience', color: 'text-primary' },
    { icon: Rocket, title: 'Inovação', description: 'Soluções criativas, Otimização, Performance', color: 'text-primary' },
  ];

  const technologies = [
    'React', 'TypeScript', 'Next.js', 'Node.js', 'Python', 'JavaScript',
    'Tailwind CSS', 'Supabase', 'PostgreSQL', 'Git', 'Figma', 'AWS',
    'TRAE', 'Lovable', 'Cursor', 'String', 'N8N'
  ];

  return (
    <section id="about" className="section-padding bg-muted/30">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="font-display text-3xl md:text-4xl lg:text-5xl font-bold mb-6 hero-gradient-text">
            Sobre Mim
          </h2>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
            Sou um desenvolvedor apaixonado por tecnologia, sempre buscando maneiras inovadoras 
            de resolver problemas complexos através de soluções elegantes e eficientes.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-16 items-center mb-20">
          {/* About Content */}
          <div className="animate-fade-in">
            <h3 className="font-display text-2xl font-semibold mb-6 text-foreground">
              Transformando ideias em realidade digital
            </h3>
            <div className="space-y-4 text-muted-foreground">
              <p>
                Com mais de 3 anos de experiência em desenvolvimento frontend e análise de dados, 
                especializo-me em criar interfaces intuitivas e soluções inteligentes que 
                combinam design excepcional com performance otimizada.
              </p>
              <p>
                Minha paixão pela inteligência artificial e automação me levou a desenvolver 
                soluções vibe code que aceleram processos e maximizam a eficiência empresarial.
              </p>
              <p>
                Acredito que a melhor tecnologia é aquela que simplifica a vida das pessoas, 
                e é com essa filosofia que abordo cada projeto - sempre focando na experiência 
                do usuário e na inovação.
              </p>
            </div>
          </div>

          {/* Technologies */}
          <div className="animate-slide-in-right">
            <h3 className="font-display text-xl font-semibold mb-6 text-foreground">
              Tecnologias & Ferramentas
            </h3>
            <div className="flex flex-wrap gap-3">
              {technologies.map((tech) => (
                <Badge 
                  key={tech} 
                  variant="secondary" 
                  className="px-4 py-2 text-sm font-medium hover:scale-105 transition-transform duration-200"
                >
                  {tech}
                </Badge>
              ))}
            </div>
          </div>
        </div>

        {/* Modern Skills Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {skills.map((skill, index) => (
            <Card 
              key={skill.title} 
              className="group border shadow-sm hover:shadow-md transition-all duration-300"
              style={{ animationDelay: `${index * 0.15}s` }}
            >
              <CardContent className="p-6">
                <div className="flex items-center mb-4">
                  <div className="p-3 rounded-lg bg-primary/10 mr-4">
                    <skill.icon className={`h-6 w-6 ${skill.color}`} />
                  </div>
                  <h4 className="font-semibold text-foreground text-lg">{skill.title}</h4>
                </div>
                <p className="text-muted-foreground text-sm leading-relaxed">{skill.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default AboutSection;