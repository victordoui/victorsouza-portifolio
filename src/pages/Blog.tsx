import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Calendar, ArrowLeft, Home } from 'lucide-react';
import { Link } from 'react-router-dom';

interface Artigo {
  id: string;
  titulo: string;
  resumo: string;
  conteudo: string;
  data_publicacao: string;
  imagem_url?: string;
  ordem_exibicao: number;
}

export default function Blog() {
  const [artigos, setArtigos] = useState<Artigo[]>([]);
  const [selectedArticle, setSelectedArticle] = useState<Artigo | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchArtigos();
  }, []);

  useEffect(() => {
    if (selectedArticle) {
      window.scrollTo(0, 0);
    }
  }, [selectedArticle]);

  const fetchArtigos = async () => {
    const { data, error } = await supabase
      .from('artigos')
      .select('*')
      .order('ordem_exibicao', { ascending: false })
      .order('data_publicacao', { ascending: false });

    if (!error && data) {
      setArtigos(data);
    }
    setLoading(false);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <p className="text-muted-foreground">Carregando artigos...</p>
      </div>
    );
  }

  if (selectedArticle) {
    return (
      <div className="min-h-screen bg-background py-8">
        <div className="max-w-4xl mx-auto px-6">
          {/* Header with navigation */}
          <div className="flex items-center justify-between mb-8">
            <button
              onClick={() => setSelectedArticle(null)}
              className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              Voltar aos artigos
            </button>
            <Link 
              to="/" 
              className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
            >
              <Home className="w-5 h-5" />
              <span>Voltar ao Site</span>
            </Link>
          </div>
          
          <article className="prose prose-lg max-w-none">
            {/* Hero Image */}
            {selectedArticle.imagem_url && (
              <div className="relative w-full aspect-[16/9] mb-12 rounded-xl overflow-hidden shadow-2xl">
                <img 
                  src={selectedArticle.imagem_url}
                  alt={selectedArticle.titulo}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent"></div>
              </div>
            )}
            
            <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-6 leading-tight">
              {selectedArticle.titulo}
            </h1>
            
            <div className="flex items-center gap-2 mb-12 text-muted-foreground border-l-4 border-primary pl-6 py-3 bg-muted/20 rounded-r-lg">
              <Calendar className="w-5 h-5" />
              <span className="text-lg">
                {new Date(selectedArticle.data_publicacao).toLocaleDateString('pt-BR', {
                  weekday: 'long',
                  year: 'numeric',
                  month: 'long', 
                  day: 'numeric'
                })}
              </span>
            </div>
            
            <div className="text-foreground text-lg leading-relaxed whitespace-pre-wrap tracking-wide">
              {selectedArticle.conteudo}
            </div>
          </article>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background py-8">
      <div className="max-w-6xl mx-auto px-6">
        {/* Header with return button */}
        <div className="flex items-center justify-between mb-8">
          <Link 
            to="/" 
            className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
          >
            <Home className="w-5 h-5" />
            <span>Voltar ao Site</span>
          </Link>
        </div>
        
        <div className="text-center mb-16">
          <h1 className="text-4xl font-bold text-foreground mb-4">Blog</h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Artigos sobre desenvolvimento, inteligência artificial e tecnologia
          </p>
        </div>

        {artigos.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-muted-foreground">Nenhum artigo publicado ainda.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            {artigos.map((artigo, index) => (
              <Card 
                key={artigo.id} 
                className="group relative overflow-hidden border cursor-pointer hover:scale-[1.03] transition-all duration-300"
                onClick={() => setSelectedArticle(artigo)}
              >
                {/* Hero Image */}
                {artigo.imagem_url && (
                  <div className="relative aspect-video overflow-hidden">
                    <img 
                      src={artigo.imagem_url}
                      alt={artigo.titulo}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
                    <div className="absolute top-4 right-4">
                      <Badge variant="secondary" className="bg-white/90 text-foreground">
                        <Calendar className="w-3 h-3 mr-1" />
                        {new Date(artigo.data_publicacao).toLocaleDateString('pt-BR')}
                      </Badge>
                    </div>
                  </div>
                )}
                
                {/* Content */}
                <div className="relative z-10 p-8">
                  {!artigo.imagem_url && (
                    <div className="flex items-center gap-2 text-sm text-muted-foreground mb-4">
                      <Calendar className="w-4 h-4" />
                      <span>{new Date(artigo.data_publicacao).toLocaleDateString('pt-BR')}</span>
                    </div>
                  )}
                  
                  <CardTitle className="text-2xl md:text-3xl leading-tight group-hover:text-primary transition-colors duration-300 mb-4">
                    {artigo.titulo}
                  </CardTitle>
                  
                  <p className="text-muted-foreground leading-relaxed text-lg mb-6 line-clamp-3">
                    {artigo.resumo}
                  </p>
                  
                  {/* Read more indicator */}
                  <div className="flex items-center gap-2 text-primary font-semibold text-base group-hover:gap-3 transition-all duration-300">
                    <span>Ler artigo completo</span>
                    <ArrowLeft className="w-5 h-5 rotate-180 group-hover:translate-x-2 transition-transform duration-300" />
                  </div>
                </div>
                
                {/* Bottom white bar */}
                <div className="absolute bottom-0 left-0 right-0 h-2 bg-white transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"></div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}