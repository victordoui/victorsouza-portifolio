import React from 'react';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import SmartSearch from '@/components/SmartSearch';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';

const Search = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <main className="container mx-auto px-4 py-24">
        <div className="mb-8">
          <Button
            variant="ghost"
            onClick={() => navigate('/')}
            className="mb-4"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Voltar ao portfólio
          </Button>
          <h1 className="text-4xl font-bold text-center mb-2">
            Busca Inteligente
          </h1>
          <p className="text-muted-foreground text-center max-w-2xl mx-auto">
            Encontre projetos e artigos usando busca semântica. 
            Digite termos relacionados e descubra conteúdo relevante mesmo sem palavras exatas.
          </p>
        </div>
        
        <SmartSearch />
      </main>
      <Footer />
    </div>
  );
};

export default Search;