import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Calendar, Clock, ArrowRight } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useNavigate } from 'react-router-dom';
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
    const {
      data,
      error
    } = await supabase.from('artigos').select('*').order('ordem_exibicao', {
      ascending: false
    }).order('data_publicacao', {
      ascending: false
    }).limit(3);
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
  return <div className="my-16">
      

      

      
    </div>;
};
export default ArticlesPreview;