import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';

interface SiteSettings {
  github_url?: string;
  linkedin_url?: string;
  instagram_url?: string;
  twitter_url?: string;
  youtube_url?: string;
  email?: string;
  telefone?: string;
  whatsapp?: string;
  endereco?: string;
  cv_path?: string;
  cv_mime_type?: string;
  cv_size?: number;
}

export const useSiteSettings = () => {
  const [settings, setSettings] = useState<SiteSettings>({});
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchSiteSettings();
  }, []);

  const fetchSiteSettings = async () => {
    try {
      const { data, error } = await supabase
        .from('site_settings')
        .select('*')
        .maybeSingle();

      if (error && error.code !== 'PGRST116') { // PGRST116 = no rows returned
        console.error('Error fetching site settings:', error);
        return;
      }

      if (data) {
        setSettings(data);
      }
    } catch (error) {
      console.error('Error fetching site settings:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const getCvDownloadUrl = () => {
    if (!settings.cv_path) return null;
    
    const { data } = supabase.storage
      .from('site-assets')
      .getPublicUrl(settings.cv_path);
    
    return data.publicUrl;
  };

  const downloadCv = async () => {
    if (!settings.cv_path) {
      toast({
        title: 'Arquivo não encontrado',
        description: 'Currículo não disponível para download no momento.',
        variant: 'destructive'
      });
      return;
    }

    try {
      // Fazer download do arquivo do Storage
      const { data, error } = await supabase.storage
        .from('site-assets')
        .download(settings.cv_path);

      if (error) {
        throw error;
      }

      // Criar URL para o arquivo baixado
      const url = URL.createObjectURL(data);
      
      // Criar elemento de link temporário para download
      const link = document.createElement('a');
      link.href = url;
      link.download = `curriculo-victor-souza.pdf`;
      document.body.appendChild(link);
      link.click();
      
      // Limpar
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      toast({
        title: 'Download iniciado',
        description: 'O currículo está sendo baixado...'
      });

    } catch (error) {
      console.error('Erro ao baixar currículo:', error);
      toast({
        title: 'Erro no download',
        description: 'Não foi possível baixar o currículo. Tente novamente.',
        variant: 'destructive'
      });
    }
  };

  return {
    settings,
    isLoading,
    getCvDownloadUrl,
    downloadCv,
    hasCv: !!settings.cv_path
  };
};