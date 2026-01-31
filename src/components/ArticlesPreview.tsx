import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Calendar, Clock, ArrowRight } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useNavigate } from 'react-router-dom';
import AnimatedSection from '@/components/AnimatedSection';
import { motion } from 'framer-motion';

interface Artigo {
  id: string;
  titulo: string;
  resumo: string;
  conteudo: string;
  data_publicacao: string;
  imagem_url: string | null;
}

const ArticlesPreview = () => {
  const [artigos, setArtigos] = useState<Artigo[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchArtigos();
  }, []);

  const fetchArtigos = async () => {
    const { data, error } = await supabase
      .from('artigos')
      .select('*')
      .order('ordem_exibicao', { ascending: false })
      .order('data_publicacao', { ascending: false })
      .limit(3);
    
    if (!error && data) {
      setArtigos(data);
    }
    setLoading(false);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const getReadingTime = (content: string) => {
    const wordsPerMinute = 200;
    const words = content.trim().split(/\s+/).length;
    const minutes = Math.ceil(words / wordsPerMinute);
    return `${minutes} min de leitura`;
  };

  if (loading || artigos.length === 0) {
    return null;
  }

  return (
    <section className="section-padding">
      <div className="container mx-auto px-4 lg:px-8">
        <AnimatedSection className="text-center mb-16">
          <h2 className="text-4xl lg:text-6xl font-display font-bold mb-6 hero-gradient-text">
            Artigos do Blog
          </h2>
          <p className="text-muted-foreground mb-8 leading-relaxed max-w-2xl mx-auto">
            Compartilho insights sobre desenvolvimento, tecnologia e experiências do mercado
          </p>
        </AnimatedSection>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-8">
          {artigos.map((artigo, index) => (
            <AnimatedSection key={artigo.id} delay={index * 0.1}>
              <Card 
                className="group bg-white/5 backdrop-blur-sm border-white/10 hover:bg-white/10 transition-all duration-500 cursor-pointer h-full"
                onClick={() => navigate('/blog')}
              >
                <CardContent className="p-6">
                  {artigo.imagem_url && (
                    <div className="mb-4 overflow-hidden rounded-lg">
                      <img 
                        src={artigo.imagem_url} 
                        alt={artigo.titulo}
                        className="w-full h-40 object-cover group-hover:scale-105 transition-transform duration-500"
                        loading="lazy"
                      />
                    </div>
                  )}
                  
                  <div className="flex items-center gap-4 text-sm text-muted-foreground mb-3">
                    <div className="flex items-center gap-1">
                      <Calendar className="h-4 w-4" />
                      <span>{formatDate(artigo.data_publicacao)}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock className="h-4 w-4" />
                      <span>{getReadingTime(artigo.conteudo)}</span>
                    </div>
                  </div>

                  <h4 className="font-semibold text-lg mb-3 text-foreground group-hover:text-primary transition-colors">
                    {artigo.titulo}
                  </h4>
                  
                  <p className="text-muted-foreground text-sm leading-relaxed line-clamp-3">
                    {artigo.resumo}
                  </p>

                  <div className="flex items-center justify-between mt-4">
                    <span className="text-sm text-primary font-medium">
                      Ler mais
                    </span>
                    <ArrowRight className="h-4 w-4 text-primary group-hover:translate-x-1 transition-transform duration-300" />
                  </div>
                </CardContent>
              </Card>
            </AnimatedSection>
          ))}
        </div>

        <AnimatedSection delay={0.3} className="text-center">
          <Button 
            variant="outline" 
            className="border-primary/30 hover:bg-primary/10 hover:border-primary transition-all duration-300"
            onClick={() => navigate('/blog')}
          >
            Ver Todos os Artigos
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </AnimatedSection>
      </div>
    </section>
  );
};

export default ArticlesPreview;
