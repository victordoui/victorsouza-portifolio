import { Calendar, BarChart3, Code } from 'lucide-react';
import AnimatedSection from '@/components/AnimatedSection';
import { motion } from 'framer-motion';

const ExperienceSection = () => {
  const experiences = [{
    company: "UNIG - UNIVERSIDADE NOVA IGUAÇU",
    position: "Analista de Dados",
    period: "Atual",
    description: "Atuo como Analista de Dados e Facilities, unindo tecnologia e gestão para otimizar processos operacionais. Trabalho com análise e interpretação de dados, criação de soluções e sistemas para agilizar processos e tornar as operações mais eficazes, além de auxiliar na tomada de decisões estratégicas.",
    highlights: ["Criei e desenvolvi o VStock, um sistema completo de almoxarifado e estoque para controle de entrada, saída e transferências de produtos", "Utilização da Lovable, Cursor, Trae e Supabase como banco de dados, integrando automações com n8n e String AI para envio de confirmações automáticas por e-mail às equipes", "Vibe coding para aumentar a eficiência do sistema, Otimização dos processos de gestão de materiais, reduzindo retrabalho e melhorando a comunicação entre setores"],
    icon: BarChart3
  }, {
    company: "BNDES - BANCO NACIONAL DO DESENVOLVIMENTO",
    position: "Analista de sistemas Estagiário",
    period: "1 ano e 8 meses",
    description: "Desenvolvedor Front-end, Correção de páginas, ajustes portal do cliente, criação de testes automatizados em Cypress das aplicações novas implementadas no portal do cliente e outras antigas.",
    highlights: [],
    icon: Code
  }];

  return (
    <section id="experience" className="py-20 lg:py-32 relative content-visibility-auto">
      <div className="container mx-auto px-4 lg:px-8">
        {/* Header */}
        <AnimatedSection className="text-center mb-16">
          <h2 className="text-4xl lg:text-6xl font-display font-bold mb-6 hero-gradient-text">
            Experiência Profissional
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Minha trajetória profissional em análise de dados e desenvolvimento
          </p>
        </AnimatedSection>

        {/* Timeline */}
        <div className="max-w-4xl mx-auto">
          <div className="relative">
            {/* Timeline Line */}
            <motion.div 
              className="absolute left-8 top-0 bottom-0 w-px bg-border"
              initial={{ scaleY: 0 }}
              whileInView={{ scaleY: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 1, ease: "easeOut" }}
              style={{ transformOrigin: 'top' }}
            />

            {/* Experience Items */}
            <div className="space-y-12">
              {experiences.map((exp, index) => (
                <AnimatedSection 
                  key={index} 
                  delay={0.2 + index * 0.2}
                  className="relative flex items-start gap-8"
                >
                  {/* Timeline Dot */}
                  <motion.div 
                    className="relative z-10 flex-shrink-0"
                    initial={{ scale: 0 }}
                    whileInView={{ scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.3 + index * 0.2, duration: 0.4, type: "spring" }}
                  >
                    <div className="w-16 h-16 bg-card border-2 border-border rounded-full flex items-center justify-center shadow-elegant">
                      <exp.icon className="w-6 h-6 text-foreground" />
                    </div>
                  </motion.div>

                  {/* Content */}
                  <div className="flex-1 min-w-0 pb-8">
                    <div className="bg-card border border-border rounded-xl p-6 shadow-elegant transition-smooth hover:shadow-lg">
                      {/* Header */}
                      <div className="mb-4">
                        <h3 className="font-display text-xl font-bold text-foreground mb-2">
                          {exp.company}
                        </h3>
                        <div className="flex flex-col sm:flex-row sm:items-center gap-2 mb-2">
                          <span className="text-lg font-medium text-foreground">
                            {exp.position}
                          </span>
                          <div className="flex items-center text-muted-foreground">
                            <Calendar className="w-4 h-4 mr-1" />
                            <span className="text-sm">{exp.period}</span>
                          </div>
                        </div>
                      </div>

                      {/* Description */}
                      <p className="text-muted-foreground mb-4 leading-relaxed">
                        {exp.description}
                      </p>

                      {/* Highlights */}
                      {exp.highlights.length > 0 && (
                        <div className="space-y-2">
                          <h4 className="font-medium text-foreground mb-2">Principais realizações:</h4>
                          <ul className="space-y-2">
                            {exp.highlights.map((highlight, highlightIndex) => (
                              <motion.li 
                                key={highlightIndex} 
                                className="flex items-start gap-2 text-sm text-muted-foreground"
                                initial={{ opacity: 0, x: -10 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: 0.4 + highlightIndex * 0.1 }}
                              >
                                <div className="w-1.5 h-1.5 bg-primary rounded-full mt-2 flex-shrink-0"></div>
                                <span className="leading-relaxed">{highlight}</span>
                              </motion.li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                  </div>
                </AnimatedSection>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ExperienceSection;
