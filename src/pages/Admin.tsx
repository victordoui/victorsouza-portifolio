import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from '@/hooks/use-toast';
import { ImageUpload } from '@/components/ImageUpload';
import { AdminPreview } from '@/components/AdminPreview';
import { FocalPointPicker } from '@/components/ui/focal-point-picker';
import { Trash2, Edit, Plus, ExternalLink, Github, Calendar, Sparkles, Upload, ArrowLeft, Eye, Settings, Loader2, Inbox, Mail, MailOpen, ArrowUpDown } from 'lucide-react';
import { ProjectOrderingControls } from '@/components/ProjectOrderingControls';
import { ArticleOrderingControls } from '@/components/ArticleOrderingControls';
import { useNavigate } from 'react-router-dom';

interface Projeto {
  id: string;
  titulo: string;
  descricao: string;
  tecnologias: string[];
  imagem_url?: string;
  link_demo?: string;
  link_codigo?: string;
  data_criacao: string;
  ordem_exibicao?: number;
  title_align?: 'left' | 'center' | 'right' | 'justify';
  description_align?: 'left' | 'center' | 'right' | 'justify';
  image_fit?: 'cover' | 'contain';
  image_focal_x?: number;
  image_focal_y?: number;
}

interface Artigo {
  id: string;
  titulo: string;
  resumo: string;
  conteudo: string;
  data_publicacao: string;
  imagem_url?: string;
  ordem_exibicao?: number;
  title_align?: 'left' | 'center' | 'right' | 'justify';
  resumo_align?: 'left' | 'center' | 'right' | 'justify';
  conteudo_align?: 'left' | 'center' | 'right' | 'justify';
  image_fit?: 'cover' | 'contain';
  image_focal_x?: number;
  image_focal_y?: number;
}

interface Message {
  id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  read: boolean;
  created_at: string;
}

export default function Admin() {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const [projetos, setProjetos] = useState<Projeto[]>([]);
  const [artigos, setArtigos] = useState<Artigo[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);
  const [activeTab, setActiveTab] = useState<'preview' | 'projetos' | 'artigos' | 'mensagens' | 'configuracoes'>('preview');
  const [showProjectOrdering, setShowProjectOrdering] = useState(false);
  const [showArticleOrdering, setShowArticleOrdering] = useState(false);
  
  // Site settings state
  const [siteSettings, setSiteSettings] = useState({
    github_url: '',
    linkedin_url: '',
    instagram_url: '',
    twitter_url: '',
    youtube_url: '',
    email: '',
    telefone: '',
    whatsapp: '',
    endereco: '',
    cv_path: '',
    cv_mime_type: '',
    cv_size: 0
  });
  const [cvFile, setCvFile] = useState<File | null>(null);
  const [isLoadingSettings, setIsLoadingSettings] = useState(false);
  const [editingProject, setEditingProject] = useState<Projeto | null>(null);
  const [editingArticle, setEditingArticle] = useState<Artigo | null>(null);
  const [showProjectForm, setShowProjectForm] = useState(false);
  const [showArticleForm, setShowArticleForm] = useState(false);
  const [imageUploading, setImageUploading] = useState(false);
  const [articleImageUploading, setArticleImageUploading] = useState(false);

  const [projectForm, setProjectForm] = useState({
    titulo: '',
    descricao: '',
    tecnologias: '',
    link_demo: '',
    link_codigo: '',
    imagem_url: '',
    title_align: 'left' as 'left' | 'center' | 'right' | 'justify',
    description_align: 'left' as 'left' | 'center' | 'right' | 'justify',
    image_fit: 'cover' as 'cover' | 'contain',
    image_focal_x: 50,
    image_focal_y: 50,
  });

  const [articleForm, setArticleForm] = useState({
    titulo: '',
    resumo: '',
    conteudo: '',
    imagem_url: '',
    title_align: 'left' as 'left' | 'center' | 'right' | 'justify',
    resumo_align: 'left' as 'left' | 'center' | 'right' | 'justify',
    conteudo_align: 'left' as 'left' | 'center' | 'right' | 'justify',
    image_fit: 'cover' as 'cover' | 'contain',
    image_focal_x: 50,
    image_focal_y: 50,
  });

  useEffect(() => {
    if (user) {
      fetchProjetos();
      fetchArtigos();
      fetchMessages();
      fetchSiteSettings();
    }
  }, [user]);

  const fetchProjetos = async () => {
    const { data, error } = await supabase
      .from('projetos')
      .select('*')
      .order('ordem_exibicao', { ascending: false })
      .order('data_criacao', { ascending: false });

    if (error) {
      toast({ title: 'Erro', description: 'Erro ao carregar projetos', variant: 'destructive' });
      return;
    }

    setProjetos((data || []) as Projeto[]);
  };

  const fetchArtigos = async () => {
    const { data, error } = await supabase
      .from('artigos')
      .select('*')
      .order('ordem_exibicao', { ascending: false })
      .order('data_publicacao', { ascending: false });

    if (error) {
      toast({ title: 'Erro', description: 'Erro ao carregar artigos', variant: 'destructive' });
      return;
    }

    setArtigos((data || []) as Artigo[]);
  };

  const fetchMessages = async () => {
    const { data, error } = await supabase
      .from('messages')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      toast({ title: 'Erro', description: 'Erro ao carregar mensagens', variant: 'destructive' });
      return;
    }

    setMessages(data || []);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const handleProjectSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validação: verificar se tem imagem
    if (!projectForm.imagem_url) {
      toast({ 
        title: 'Erro', 
        description: 'Por favor, adicione uma imagem ao projeto antes de salvar.', 
        variant: 'destructive' 
      });
      return;
    }

    // Verificar se ainda está fazendo upload
    if (imageUploading) {
      toast({ 
        title: 'Aguarde', 
        description: 'Aguarde o upload da imagem terminar antes de salvar.', 
        variant: 'destructive' 
      });
      return;
    }
    
    const projectData = {
      titulo: projectForm.titulo,
      descricao: projectForm.descricao,
      tecnologias: projectForm.tecnologias.split(',').map(t => t.trim()).filter(t => t),
      link_demo: projectForm.link_demo || null,
      link_codigo: projectForm.link_codigo || null,
      imagem_url: projectForm.imagem_url,
      title_align: projectForm.title_align,
      description_align: projectForm.description_align,
      image_fit: projectForm.image_fit,
      image_focal_x: projectForm.image_focal_x,
      image_focal_y: projectForm.image_focal_y,
      user_id: user?.id,
    };

    let error;

    if (editingProject) {
      const { error: updateError } = await supabase
        .from('projetos')
        .update(projectData)
        .eq('id', editingProject.id);
      error = updateError;
    } else {
      const { error: insertError } = await supabase
        .from('projetos')
        .insert(projectData);
      error = insertError;
    }

    if (error) {
      console.error('Erro ao salvar projeto:', error);
      toast({ title: 'Erro', description: 'Erro ao salvar projeto', variant: 'destructive' });
      return;
    }

    toast({ title: 'Sucesso', description: 'Projeto salvo com sucesso!' });
    setProjectForm({ 
      titulo: '', 
      descricao: '', 
      tecnologias: '', 
      link_demo: '', 
      link_codigo: '', 
      imagem_url: '',
      title_align: 'left',
      description_align: 'left',
      image_fit: 'cover',
      image_focal_x: 50,
      image_focal_y: 50,
    });
    setEditingProject(null);
    setShowProjectForm(false);
    fetchProjetos();
  };

  const handleArticleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const articleData = {
      titulo: articleForm.titulo,
      resumo: articleForm.resumo,
      conteudo: articleForm.conteudo,
      imagem_url: articleForm.imagem_url || null,
      title_align: articleForm.title_align,
      resumo_align: articleForm.resumo_align,
      conteudo_align: articleForm.conteudo_align,
      image_fit: articleForm.image_fit,
      image_focal_x: articleForm.image_focal_x,
      image_focal_y: articleForm.image_focal_y,
      user_id: user?.id,
    };

    let error;

    if (editingArticle) {
      const { error: updateError } = await supabase
        .from('artigos')
        .update(articleData)
        .eq('id', editingArticle.id);
      error = updateError;
    } else {
      const { error: insertError } = await supabase
        .from('artigos')
        .insert(articleData);
      error = insertError;
    }

    if (error) {
      toast({ title: 'Erro', description: 'Erro ao salvar artigo', variant: 'destructive' });
      return;
    }

    toast({ title: 'Sucesso', description: 'Artigo salvo com sucesso!' });
    setArticleForm({ 
      titulo: '', 
      resumo: '', 
      conteudo: '', 
      imagem_url: '',
      title_align: 'left',
      resumo_align: 'left',
      conteudo_align: 'left',
      image_fit: 'cover',
      image_focal_x: 50,
      image_focal_y: 50,
    });
    setEditingArticle(null);
    setShowArticleForm(false);
    fetchArtigos();
  };

  const deleteProject = async (id: string) => {
    if (!confirm('Tem certeza que deseja excluir este projeto?')) return;

    const { error } = await supabase
      .from('projetos')
      .delete()
      .eq('id', id);

    if (error) {
      toast({ title: 'Erro', description: 'Erro ao excluir projeto', variant: 'destructive' });
      return;
    }

    toast({ title: 'Sucesso', description: 'Projeto excluído com sucesso!' });
    fetchProjetos();
  };

  const deleteArticle = async (id: string) => {
    if (!confirm('Tem certeza que deseja excluir este artigo?')) return;

    const { error } = await supabase
      .from('artigos')
      .delete()
      .eq('id', id);

    if (error) {
      toast({ title: 'Erro', description: 'Erro ao excluir artigo', variant: 'destructive' });
      return;
    }

    toast({ title: 'Sucesso', description: 'Artigo excluído com sucesso!' });
    fetchArtigos();
  };

  const editProject = (project: Projeto) => {
    setEditingProject(project);
    setProjectForm({
      titulo: project.titulo,
      descricao: project.descricao,
      tecnologias: project.tecnologias.join(', '),
      link_demo: project.link_demo || '',
      link_codigo: project.link_codigo || '',
      imagem_url: project.imagem_url || '',
      title_align: project.title_align || 'left',
      description_align: project.description_align || 'left',
      image_fit: project.image_fit || 'cover',
      image_focal_x: project.image_focal_x || 50,
      image_focal_y: project.image_focal_y || 50,
    });
    setShowProjectForm(true);
  };

  // Helper function to get public URL for storage files
  const getStoragePublicUrl = (fileName: string) => {
    const { data } = supabase.storage
      .from('projeto-images')
      .getPublicUrl(fileName);
    return data.publicUrl;
  };

  const editArticle = (article: Artigo) => {
    setEditingArticle(article);
    setArticleForm({
      titulo: article.titulo,
      resumo: article.resumo,
      conteudo: article.conteudo,
      imagem_url: article.imagem_url || '',
      title_align: article.title_align || 'left',
      resumo_align: article.resumo_align || 'left',
      conteudo_align: article.conteudo_align || 'left',
      image_fit: article.image_fit || 'cover',
      image_focal_x: article.image_focal_x || 50,
      image_focal_y: article.image_focal_y || 50,
    });
    setShowArticleForm(true);
  };

  // Site settings functions
  const fetchSiteSettings = async () => {
    const { data, error } = await supabase
      .from('site_settings')
      .select('*')
      .single();

    if (error && error.code !== 'PGRST116') { // PGRST116 = no rows returned
      toast({ title: 'Erro', description: 'Erro ao carregar configurações', variant: 'destructive' });
      return;
    }

    if (data) {
      setSiteSettings(data);
    }
  };

  const handleSiteSettingsSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoadingSettings(true);

    try {
      const settingsData = {
        ...siteSettings,
        updated_by: user?.id,
      };

      const { data: existingSettings } = await supabase
        .from('site_settings')
        .select('id')
        .single();

      let error;
      if (existingSettings) {
        const { error: updateError } = await supabase
          .from('site_settings')
          .update(settingsData)
          .eq('id', existingSettings.id);
        error = updateError;
      } else {
        const { error: insertError } = await supabase
          .from('site_settings')
          .insert(settingsData);
        error = insertError;
      }

      if (error) throw error;

      toast({ title: 'Sucesso', description: 'Configurações salvas com sucesso!' });
    } catch (error) {
      console.error('Erro ao salvar configurações:', error);
      toast({ title: 'Erro', description: 'Erro ao salvar configurações', variant: 'destructive' });
    } finally {
      setIsLoadingSettings(false);
    }
  };

  const handleCvUpload = async () => {
    if (!cvFile) return;

    try {
      // Delete old CV if exists
      if (siteSettings.cv_path) {
        await supabase.storage
          .from('site-assets')
          .remove([siteSettings.cv_path]);
      }

      // Upload new CV
      const fileName = `cv-${Date.now()}.${cvFile.name.split('.').pop()}`;
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('site-assets')
        .upload(fileName, cvFile);

      if (uploadError) throw uploadError;

      // Update site settings with new CV info
      const updatedSettings = {
        ...siteSettings,
        cv_path: uploadData.path,
        cv_mime_type: cvFile.type,
        cv_size: cvFile.size,
        updated_by: user?.id,
      };

      // Save to database
      const { data: existingSettings } = await supabase
        .from('site_settings')
        .select('id')
        .single();

      let error;
      if (existingSettings) {
        const { error: updateError } = await supabase
          .from('site_settings')
          .update(updatedSettings)
          .eq('id', existingSettings.id);
        error = updateError;
      } else {
        const { error: insertError } = await supabase
          .from('site_settings')
          .insert(updatedSettings);
        error = insertError;
      }

      if (error) throw error;

      setSiteSettings(updatedSettings);
      setCvFile(null);
      toast({ title: 'Sucesso', description: 'Currículo carregado e salvo com sucesso!' });
    } catch (error) {
      console.error('Erro ao fazer upload do currículo:', error);
      toast({ title: 'Erro', description: 'Erro ao fazer upload do currículo', variant: 'destructive' });
    }
  };

  const markMessageAsRead = async (messageId: string) => {
    const { error } = await supabase
      .from('messages')
      .update({ read: true })
      .eq('id', messageId);

    if (error) {
      toast({ title: 'Erro', description: 'Erro ao marcar mensagem como lida', variant: 'destructive' });
      return;
    }

    fetchMessages();
  };

  const deleteMessage = async (messageId: string) => {
    if (!confirm('Tem certeza que deseja excluir esta mensagem?')) return;

    const { error } = await supabase
      .from('messages')
      .delete()
      .eq('id', messageId);

    if (error) {
      toast({ title: 'Erro', description: 'Erro ao excluir mensagem', variant: 'destructive' });
      return;
    }

    toast({ title: 'Sucesso', description: 'Mensagem excluída com sucesso!' });
    fetchMessages();
  };

  const unreadMessagesCount = messages.filter(msg => !msg.read).length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5 relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 mesh-background opacity-30"></div>
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-3xl animate-pulse"></div>
      <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-secondary/10 rounded-full blur-3xl animate-pulse delay-1000"></div>

      <div className="relative z-10 p-6">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="flex justify-between items-center mb-8">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate('/')}
              className="hover:bg-accent"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Voltar ao Site
            </Button>
            
            <Button 
              onClick={() => signOut()} 
              variant="outline"
              className="hover:bg-destructive/10 hover:border-destructive"
            >
              Sair
            </Button>
          </div>

          {/* Título centralizado */}
          <div className="text-center mb-8">
            <div className="flex items-center justify-center space-x-2 mb-2">
              <Sparkles className="h-6 w-6 text-primary" />
              <h1 className="text-4xl font-bold text-foreground">Painel Administrativo</h1>
            </div>
            <p className="text-lg text-muted-foreground">Gerencie seus projetos e artigos</p>
          </div>

          {/* Navigation Tabs */}
          <div className="flex flex-wrap gap-2 mb-8">
            <Button
              onClick={() => setActiveTab('preview')}
              variant={activeTab === 'preview' ? 'default' : 'outline'}
              className={activeTab === 'preview' ? '' : 'hover:bg-accent'}
            >
              <Eye className="w-4 h-4 mr-2" />
              Prévia do Site
            </Button>
            <Button
              onClick={() => setActiveTab('projetos')}
              variant={activeTab === 'projetos' ? 'default' : 'outline'}
              className={activeTab === 'projetos' ? '' : 'hover:bg-accent'}
            >
              <Settings className="w-4 h-4 mr-2" />
              Projetos ({projetos.length})
            </Button>
            <Button
              onClick={() => setActiveTab('artigos')}
              variant={activeTab === 'artigos' ? 'default' : 'outline'}
              className={activeTab === 'artigos' ? '' : 'hover:bg-accent'}
            >
              <Settings className="w-4 h-4 mr-2" />
              Artigos ({artigos.length})
            </Button>
            <Button
              onClick={() => setActiveTab('mensagens')}
              variant={activeTab === 'mensagens' ? 'default' : 'outline'}
              className={activeTab === 'mensagens' ? '' : 'hover:bg-accent'}
            >
              <Inbox className="w-4 h-4 mr-2" />
              Mensagens ({messages.length})
              {unreadMessagesCount > 0 && (
                <Badge className="ml-2 bg-red-500 text-white">{unreadMessagesCount}</Badge>
              )}
            </Button>
            <Button
              onClick={() => setActiveTab('configuracoes')}
              variant={activeTab === 'configuracoes' ? 'default' : 'outline'}
              className={activeTab === 'configuracoes' ? '' : 'hover:bg-accent'}
            >
              <Settings className="w-4 h-4 mr-2" />
              Configurações
            </Button>
          </div>

          {/* Preview Tab */}
          {activeTab === 'preview' && (
            <AdminPreview projects={projetos} articles={artigos} />
          )}

          {/* Projects Tab */}
          {activeTab === 'projetos' && (
            <div className="space-y-8">
              <div className="flex justify-between items-center">
                <h2 className="text-2xl font-semibold text-foreground">Gerenciar Projetos</h2>
                <div className="flex space-x-2">
                  <Button
                    onClick={() => setShowProjectOrdering(!showProjectOrdering)}
                    variant="outline"
                  >
                    <ArrowUpDown className="w-4 h-4 mr-2" />
                    Reordenar
                  </Button>
                  <Button
                    onClick={() => {
                      setEditingProject(null);
                      setProjectForm({ 
                        titulo: '', 
                        descricao: '', 
                        tecnologias: '', 
                        link_demo: '', 
                        link_codigo: '', 
                        imagem_url: '',
                        title_align: 'left',
                        description_align: 'left',
                        image_fit: 'cover',
                        image_focal_x: 50,
                        image_focal_y: 50,
                      });
                      setShowProjectForm(true);
                    }}
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Novo Projeto
                  </Button>
                </div>
              </div>

              {/* Project Ordering Controls */}
              {showProjectOrdering && (
                <ProjectOrderingControls 
                  projects={projetos} 
                  onReorder={fetchProjetos}
                />
              )}

              {showProjectForm && (
                <Card className="glass-card backdrop-blur-xl border-white/20 shadow-2xl">
                  <CardHeader className="border-b border-white/10">
                    <CardTitle className="flex items-center space-x-2">
                      <Upload className="h-5 w-5 text-primary" />
                      <span>{editingProject ? 'Editar Projeto' : 'Novo Projeto'}</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-6">
                    <form onSubmit={handleProjectSubmit} className="space-y-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-4">
                          <Input
                            placeholder="Título do projeto"
                            value={projectForm.titulo}
                            onChange={(e) => setProjectForm({ ...projectForm, titulo: e.target.value })}
                            required
                            className="glass-card backdrop-blur-sm border-white/20"
                          />
                          <Textarea
                            placeholder="Descrição do projeto"
                            value={projectForm.descricao}
                            onChange={(e) => setProjectForm({ ...projectForm, descricao: e.target.value })}
                            required
                            rows={4}
                            className="glass-card backdrop-blur-sm border-white/20"
                          />
                          <Input
                            placeholder="Tecnologias (separadas por vírgula)"
                            value={projectForm.tecnologias}
                            onChange={(e) => setProjectForm({ ...projectForm, tecnologias: e.target.value })}
                            className="glass-card backdrop-blur-sm border-white/20"
                          />
                          <Input
                            placeholder="Link do Demo (opcional)"
                            value={projectForm.link_demo}
                            onChange={(e) => setProjectForm({ ...projectForm, link_demo: e.target.value })}
                            className="glass-card backdrop-blur-sm border-white/20"
                          />
                          <Input
                            placeholder="Link do Código (opcional)"
                            value={projectForm.link_codigo}
                            onChange={(e) => setProjectForm({ ...projectForm, link_codigo: e.target.value })}
                            className="glass-card backdrop-blur-sm border-white/20"
                          />
                          
                          {/* Text Alignment Controls */}
                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <label className="block text-sm font-medium mb-2">Alinhamento do Título</label>
                              <Select 
                                value={projectForm.title_align} 
                                onValueChange={(value: 'left' | 'center' | 'right' | 'justify') => setProjectForm({ ...projectForm, title_align: value })}
                              >
                                <SelectTrigger className="glass-card backdrop-blur-sm border-white/20">
                                  <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="left">Esquerda</SelectItem>
                                  <SelectItem value="center">Centralizado</SelectItem>
                                  <SelectItem value="right">Direita</SelectItem>
                                  <SelectItem value="justify">Justificado</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>
                            
                            <div>
                              <label className="block text-sm font-medium mb-2">Alinhamento da Descrição</label>
                              <Select 
                                value={projectForm.description_align} 
                                onValueChange={(value: 'left' | 'center' | 'right' | 'justify') => setProjectForm({ ...projectForm, description_align: value })}
                              >
                                <SelectTrigger className="glass-card backdrop-blur-sm border-white/20">
                                  <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="left">Esquerda</SelectItem>
                                  <SelectItem value="center">Centralizado</SelectItem>
                                  <SelectItem value="right">Direita</SelectItem>
                                  <SelectItem value="justify">Justificado</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>
                          </div>
                        </div>
                        
                          <div>
                            <label className="block text-sm font-medium mb-3">Imagem do Projeto *</label>
                            <ImageUpload
                              onImageUploaded={(url) => setProjectForm({ ...projectForm, imagem_url: url })}
                              currentImage={projectForm.imagem_url}
                              onImageRemoved={() => setProjectForm({ ...projectForm, imagem_url: '' })}
                              onUploadStart={() => setImageUploading(true)}
                              onUploadEnd={() => setImageUploading(false)}
                            />
                            {!projectForm.imagem_url && (
                              <p className="text-xs text-muted-foreground mt-2 text-amber-500">
                                * Imagem obrigatória para salvar o projeto
                              </p>
                            )}
                            
                            {/* Image Controls */}
                            {projectForm.imagem_url && (
                              <div className="mt-4 space-y-4">
                                <div>
                                  <label className="block text-sm font-medium mb-2">Ajuste da Imagem</label>
                                  <Select 
                                    value={projectForm.image_fit} 
                                    onValueChange={(value: 'cover' | 'contain') => setProjectForm({ ...projectForm, image_fit: value })}
                                  >
                                    <SelectTrigger className="glass-card backdrop-blur-sm border-white/20">
                                      <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                      <SelectItem value="cover">Cobrir (Cover)</SelectItem>
                                      <SelectItem value="contain">Conter (Contain)</SelectItem>
                                    </SelectContent>
                                  </Select>
                                </div>
                                
                                <FocalPointPicker
                                  imageUrl={projectForm.imagem_url}
                                  focalX={projectForm.image_focal_x}
                                  focalY={projectForm.image_focal_y}
                                  onFocalPointChange={(x, y) => setProjectForm({ ...projectForm, image_focal_x: x, image_focal_y: y })}
                                />
                              </div>
                            )}
                          </div>
                      </div>
                      
                      <div className="flex space-x-3 pt-4 border-t border-white/10">
                        <Button 
                          type="submit" 
                          disabled={imageUploading || !projectForm.imagem_url}
                          className="disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          {imageUploading ? (
                            <>
                              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                              Aguardando Upload...
                            </>
                          ) : (
                            <>
                              {editingProject ? 'Atualizar' : 'Criar'} Projeto
                            </>
                          )}
                        </Button>
                        <Button
                          type="button"
                          variant="outline"
                          onClick={() => {
                            setShowProjectForm(false);
                            setEditingProject(null);
                            setProjectForm({ 
                              titulo: '', 
                              descricao: '', 
                              tecnologias: '', 
                              link_demo: '', 
                              link_codigo: '', 
                              imagem_url: '',
                              title_align: 'left',
                              description_align: 'left',
                              image_fit: 'cover',
                              image_focal_x: 50,
                              image_focal_y: 50,
                            });
                          }}
                          className="glass-card backdrop-blur-sm border-white/20 hover:bg-white/5"
                        >
                          Cancelar
                        </Button>
                      </div>
                    </form>
                  </CardContent>
                </Card>
              )}

              {/* Projects Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {projetos.map((project) => (
                  <Card key={project.id} className="glass-card backdrop-blur-xl border-white/20 shadow-xl group hover:shadow-2xl transition-all duration-300">
                    {project.imagem_url && (
                      <div className="relative h-48 overflow-hidden rounded-t-lg">
                        <img
                          src={project.imagem_url}
                          alt={project.titulo}
                          className="w-full h-full transition-transform duration-300 group-hover:scale-105"
                          style={{
                            objectFit: (project.image_fit as 'cover' | 'contain') || 'cover',
                            objectPosition: `${project.image_focal_x || 50}% ${project.image_focal_y || 50}%`
                          }}
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
                      </div>
                    )}
                    
                    <CardHeader className="pb-3">
                      <CardTitle className="text-lg group-hover:text-primary transition-colors" style={{ textAlign: (project.title_align as 'left' | 'center' | 'right' | 'justify') || 'left' }}>
                        {project.titulo}
                      </CardTitle>
                      <div className="flex items-center text-xs text-muted-foreground">
                        <Calendar className="h-3 w-3 mr-1" />
                        {formatDate(project.data_criacao)}
                      </div>
                    </CardHeader>
                    
                    <CardContent className="space-y-4">
                      <p className="text-muted-foreground text-sm line-clamp-2" style={{ textAlign: (project.description_align as 'left' | 'center' | 'right' | 'justify') || 'left' }}>{project.descricao}</p>
                      
                      <div className="flex flex-wrap gap-1">
                        {project.tecnologias.slice(0, 3).map((tech, index) => (
                          <Badge key={index} variant="secondary" className="text-xs bg-primary/10 text-primary">
                            {tech}
                          </Badge>
                        ))}
                        {project.tecnologias.length > 3 && (
                          <Badge variant="outline" className="text-xs">
                            +{project.tecnologias.length - 3}
                          </Badge>
                        )}
                      </div>
                      
                      <div className="flex space-x-2 pt-2">
                        {project.link_demo && (
                          <Button size="sm" variant="outline" asChild className="flex-1 text-xs">
                            <a href={project.link_demo} target="_blank" rel="noopener noreferrer">
                              <ExternalLink className="h-3 w-3 mr-1" />
                              Demo
                            </a>
                          </Button>
                        )}
                        {project.link_codigo && (
                          <Button size="sm" variant="outline" asChild className="flex-1 text-xs">
                            <a href={project.link_codigo} target="_blank" rel="noopener noreferrer">
                              <Github className="h-3 w-3 mr-1" />
                              Código
                            </a>
                          </Button>
                        )}
                      </div>
                      
                      <div className="flex space-x-2 pt-2 border-t border-white/10">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => editProject(project)}
                          className="flex-1 hover:bg-primary/10 hover:border-primary"
                        >
                          <Edit className="w-3 h-3 mr-1" />
                          Editar
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => deleteProject(project.id)}
                          className="hover:bg-destructive/10 hover:border-destructive hover:text-destructive"
                        >
                          <Trash2 className="w-3 h-3" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          )}

          {/* Articles Tab */}
          {activeTab === 'artigos' && (
            <div className="space-y-8">
              <div className="flex justify-between items-center">
                <h2 className="text-2xl font-semibold text-foreground">Gerenciar Artigos</h2>
                <div className="flex space-x-2">
                  <Button
                    onClick={() => setShowArticleOrdering(!showArticleOrdering)}
                    variant="outline"
                  >
                    <ArrowUpDown className="w-4 h-4 mr-2" />
                    Reordenar
                  </Button>
                  <Button
                    onClick={() => {
                      setEditingArticle(null);
                      setArticleForm({ 
                        titulo: '', 
                        resumo: '', 
                        conteudo: '', 
                        imagem_url: '',
                        title_align: 'left',
                        resumo_align: 'left',
                        conteudo_align: 'left',
                        image_fit: 'cover',
                        image_focal_x: 50,
                        image_focal_y: 50,
                      });
                      setShowArticleForm(true);
                    }}
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Novo Artigo
                  </Button>
                </div>
              </div>

              {/* Article Ordering Controls */}
              {showArticleOrdering && (
                <ArticleOrderingControls 
                  articles={artigos} 
                  onReorder={fetchArtigos}
                />
              )}

              {showArticleForm && (
                <Card className="glass-card backdrop-blur-xl border-white/20 shadow-2xl">
                  <CardHeader className="border-b border-white/10">
                    <CardTitle>{editingArticle ? 'Editar Artigo' : 'Novo Artigo'}</CardTitle>
                  </CardHeader>
                  <CardContent className="p-6">
                    <form onSubmit={handleArticleSubmit} className="space-y-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-4">
                          <Input
                            placeholder="Título do artigo"
                            value={articleForm.titulo}
                            onChange={(e) => setArticleForm({ ...articleForm, titulo: e.target.value })}
                            required
                            className="glass-card backdrop-blur-sm border-white/20"
                          />
                          <Textarea
                            placeholder="Resumo do artigo"
                            value={articleForm.resumo}
                            onChange={(e) => setArticleForm({ ...articleForm, resumo: e.target.value })}
                            required
                            rows={3}
                            className="glass-card backdrop-blur-sm border-white/20"
                          />
                          <Textarea
                            placeholder="Conteúdo completo do artigo"
                            value={articleForm.conteudo}
                            onChange={(e) => setArticleForm({ ...articleForm, conteudo: e.target.value })}
                            rows={12}
                            required
                            className="glass-card backdrop-blur-sm border-white/20"
                          />
                          
                          {/* Text Alignment Controls */}
                          <div className="grid grid-cols-3 gap-4">
                            <div>
                              <label className="block text-sm font-medium mb-2">Alinhamento do Título</label>
                              <Select 
                                value={articleForm.title_align} 
                                onValueChange={(value: 'left' | 'center' | 'right' | 'justify') => setArticleForm({ ...articleForm, title_align: value })}
                              >
                                <SelectTrigger className="glass-card backdrop-blur-sm border-white/20">
                                  <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="left">Esquerda</SelectItem>
                                  <SelectItem value="center">Centralizado</SelectItem>
                                  <SelectItem value="right">Direita</SelectItem>
                                  <SelectItem value="justify">Justificado</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>
                            
                            <div>
                              <label className="block text-sm font-medium mb-2">Alinhamento do Resumo</label>
                              <Select 
                                value={articleForm.resumo_align} 
                                onValueChange={(value: 'left' | 'center' | 'right' | 'justify') => setArticleForm({ ...articleForm, resumo_align: value })}
                              >
                                <SelectTrigger className="glass-card backdrop-blur-sm border-white/20">
                                  <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="left">Esquerda</SelectItem>
                                  <SelectItem value="center">Centralizado</SelectItem>
                                  <SelectItem value="right">Direita</SelectItem>
                                  <SelectItem value="justify">Justificado</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>
                            
                            <div>
                              <label className="block text-sm font-medium mb-2">Alinhamento do Conteúdo</label>
                              <Select 
                                value={articleForm.conteudo_align} 
                                onValueChange={(value: 'left' | 'center' | 'right' | 'justify') => setArticleForm({ ...articleForm, conteudo_align: value })}
                              >
                                <SelectTrigger className="glass-card backdrop-blur-sm border-white/20">
                                  <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="left">Esquerda</SelectItem>
                                  <SelectItem value="center">Centralizado</SelectItem>
                                  <SelectItem value="right">Direita</SelectItem>
                                  <SelectItem value="justify">Justificado</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>
                          </div>
                        </div>
                        
                          <div>
                            <label className="block text-sm font-medium mb-3">Imagem de Capa (opcional)</label>
                            <ImageUpload
                              onImageUploaded={(url) => setArticleForm({ ...articleForm, imagem_url: url })}
                              currentImage={articleForm.imagem_url}
                              onImageRemoved={() => setArticleForm({ ...articleForm, imagem_url: '' })}
                              onUploadStart={() => setArticleImageUploading(true)}
                              onUploadEnd={() => setArticleImageUploading(false)}
                            />
                            <p className="text-xs text-muted-foreground mt-2">
                              Imagem opcional para exibir no card do artigo no blog
                            </p>
                            
                            {/* Image Controls */}
                            {articleForm.imagem_url && (
                              <div className="mt-4 space-y-4">
                                <div>
                                  <label className="block text-sm font-medium mb-2">Ajuste da Imagem</label>
                                  <Select 
                                    value={articleForm.image_fit} 
                                    onValueChange={(value: 'cover' | 'contain') => setArticleForm({ ...articleForm, image_fit: value })}
                                  >
                                    <SelectTrigger className="glass-card backdrop-blur-sm border-white/20">
                                      <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                      <SelectItem value="cover">Cobrir (Cover)</SelectItem>
                                      <SelectItem value="contain">Conter (Contain)</SelectItem>
                                    </SelectContent>
                                  </Select>
                                </div>
                                
                                <FocalPointPicker
                                  imageUrl={articleForm.imagem_url}
                                  focalX={articleForm.image_focal_x}
                                  focalY={articleForm.image_focal_y}
                                  onFocalPointChange={(x, y) => setArticleForm({ ...articleForm, image_focal_x: x, image_focal_y: y })}
                                />
                              </div>
                            )}
                          </div>
                      </div>
                      
                      <div className="flex space-x-3 pt-4 border-t border-white/10">
                        <Button 
                          type="submit"
                          disabled={articleImageUploading}
                        >
                          {articleImageUploading ? (
                            <>
                              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                              Aguardando Upload...
                            </>
                          ) : (
                            <>
                              {editingArticle ? 'Atualizar' : 'Publicar'} Artigo
                            </>
                          )}
                        </Button>
                        <Button
                          type="button"
                          variant="outline"
                          onClick={() => {
                            setShowArticleForm(false);
                            setEditingArticle(null);
                            setArticleForm({ 
                              titulo: '', 
                              resumo: '', 
                              conteudo: '', 
                              imagem_url: '',
                              title_align: 'left',
                              resumo_align: 'left',
                              conteudo_align: 'left',
                              image_fit: 'cover',
                              image_focal_x: 50,
                              image_focal_y: 50,
                            });
                          }}
                          className="glass-card backdrop-blur-sm border-white/20 hover:bg-white/5"
                        >
                          Cancelar
                        </Button>
                      </div>
                    </form>
                  </CardContent>
                </Card>
              )}

              {/* Articles Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {artigos.map((article) => (
                  <Card key={article.id} className="glass-card backdrop-blur-xl border-white/20 shadow-xl group hover:shadow-2xl transition-all duration-300">
                    <CardHeader className="pb-3">
                      <CardTitle className="text-lg group-hover:text-primary transition-colors">
                        {article.titulo}
                      </CardTitle>
                      <div className="flex items-center text-xs text-muted-foreground">
                        <Calendar className="h-3 w-3 mr-1" />
                        {formatDate(article.data_publicacao)}
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <p className="text-muted-foreground text-sm line-clamp-3">{article.resumo}</p>
                      <div className="flex space-x-2 pt-2 border-t border-white/10">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => editArticle(article)}
                          className="flex-1 hover:bg-primary/10 hover:border-primary"
                        >
                          <Edit className="w-3 h-3 mr-1" />
                          Editar
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => deleteArticle(article.id)}
                          className="hover:bg-destructive/10 hover:border-destructive hover:text-destructive"
                        >
                          <Trash2 className="w-3 h-3" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          )}

          {/* Messages Tab */}
          {activeTab === 'mensagens' && (
            <div className="space-y-8">
              <div className="flex justify-between items-center">
                <h2 className="text-2xl font-semibold text-foreground">Caixa de Entrada</h2>
                <div className="flex items-center space-x-2">
                  <Badge variant="outline" className="text-sm">
                    Total: {messages.length}
                  </Badge>
                  {unreadMessagesCount > 0 && (
                    <Badge className="bg-red-500 text-white">
                      Não lidas: {unreadMessagesCount}
                    </Badge>
                  )}
                </div>
              </div>

              {messages.length === 0 ? (
                <Card className="glass-card backdrop-blur-xl border-white/20 shadow-xl">
                  <CardContent className="text-center py-12">
                    <Inbox className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
                    <h3 className="text-lg font-semibold mb-2">Nenhuma mensagem ainda</h3>
                    <p className="text-muted-foreground">
                      As mensagens enviadas através do formulário de contato aparecerão aqui.
                    </p>
                  </CardContent>
                </Card>
              ) : (
                <div className="space-y-4">
                  {messages.map((message) => (
                    <Card key={message.id} className={`glass-card backdrop-blur-xl border-white/20 shadow-xl transition-all duration-300 hover:shadow-2xl ${
                      !message.read ? 'border-primary/50 bg-primary/5' : ''
                    }`}>
                      <CardHeader className="pb-3">
                        <div className="flex items-start justify-between">
                          <div className="flex items-center space-x-3">
                            <div className={`w-3 h-3 rounded-full ${message.read ? 'bg-muted-foreground' : 'bg-primary'}`} />
                            <div>
                              <CardTitle className="text-lg flex items-center space-x-2">
                                <span>{message.name}</span>
                                {!message.read && (
                                  <Badge className="bg-primary text-primary-foreground text-xs">Nova</Badge>
                                )}
                              </CardTitle>
                              <div className="flex items-center space-x-4 text-sm text-muted-foreground mt-1">
                                <span className="flex items-center">
                                  <Mail className="h-3 w-3 mr-1" />
                                  {message.email}
                                </span>
                                <span className="flex items-center">
                                  <Calendar className="h-3 w-3 mr-1" />
                                  {formatDate(message.created_at)}
                                </span>
                              </div>
                            </div>
                          </div>
                          <div className="flex space-x-2">
                            {!message.read && (
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => markMessageAsRead(message.id)}
                                className="hover:bg-primary/10 hover:border-primary"
                              >
                                <MailOpen className="w-3 h-3 mr-1" />
                                Marcar como lida
                              </Button>
                            )}
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => deleteMessage(message.id)}
                              className="hover:bg-destructive/10 hover:border-destructive hover:text-destructive"
                            >
                              <Trash2 className="w-3 h-3" />
                            </Button>
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div>
                          <h4 className="font-semibold text-foreground mb-2">Assunto:</h4>
                          <p className="text-sm text-muted-foreground">{message.subject}</p>
                        </div>
                        <div>
                          <h4 className="font-semibold text-foreground mb-2">Mensagem:</h4>
                          <div className="bg-muted/30 rounded-lg p-4">
                            <p className="text-sm leading-relaxed whitespace-pre-wrap">{message.message}</p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-4 pt-2 border-t border-white/10">
                          <Button
                            size="sm"
                            variant="outline"
                            asChild
                            className="hover:bg-primary/10 hover:border-primary"
                          >
                            <a href={`mailto:${message.email}?subject=Re: ${message.subject}`}>
                              <Mail className="w-3 h-3 mr-1" />
                              Responder por Email
                            </a>
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Configurações Tab */}
          {activeTab === 'configuracoes' && (
            <div className="space-y-8">
              <div className="flex justify-between items-center">
                <h2 className="text-2xl font-semibold text-foreground">Configurações do Site</h2>
              </div>

              <Card className="glass-card backdrop-blur-xl border-white/20 shadow-2xl">
                <CardHeader className="border-b border-white/10">
                  <CardTitle className="flex items-center space-x-2">
                    <Settings className="h-5 w-5 text-primary" />
                    <span>Informações do Site</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-6">
                  <form onSubmit={handleSiteSettingsSubmit} className="space-y-8">
                    
                    {/* Redes Sociais */}
                    <div>
                      <h3 className="text-lg font-semibold mb-4 text-foreground">Redes Sociais</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <Input
                          placeholder="GitHub URL"
                          value={siteSettings.github_url}
                          onChange={(e) => setSiteSettings({ ...siteSettings, github_url: e.target.value })}
                          className="glass-card backdrop-blur-sm border-white/20"
                        />
                        <Input
                          placeholder="LinkedIn URL"
                          value={siteSettings.linkedin_url}
                          onChange={(e) => setSiteSettings({ ...siteSettings, linkedin_url: e.target.value })}
                          className="glass-card backdrop-blur-sm border-white/20"
                        />
                        <Input
                          placeholder="Instagram URL"
                          value={siteSettings.instagram_url}
                          onChange={(e) => setSiteSettings({ ...siteSettings, instagram_url: e.target.value })}
                          className="glass-card backdrop-blur-sm border-white/20"
                        />
                        <Input
                          placeholder="Twitter/X URL"
                          value={siteSettings.twitter_url}
                          onChange={(e) => setSiteSettings({ ...siteSettings, twitter_url: e.target.value })}
                          className="glass-card backdrop-blur-sm border-white/20"
                        />
                        <Input
                          placeholder="YouTube URL"
                          value={siteSettings.youtube_url}
                          onChange={(e) => setSiteSettings({ ...siteSettings, youtube_url: e.target.value })}
                          className="glass-card backdrop-blur-sm border-white/20"
                        />
                      </div>
                    </div>

                    {/* Informações de Contato */}
                    <div>
                      <h3 className="text-lg font-semibold mb-4 text-foreground">Informações de Contato</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <Input
                          placeholder="E-mail"
                          type="email"
                          value={siteSettings.email}
                          onChange={(e) => setSiteSettings({ ...siteSettings, email: e.target.value })}
                          className="glass-card backdrop-blur-sm border-white/20"
                        />
                        <Input
                          placeholder="Telefone"
                          value={siteSettings.telefone}
                          onChange={(e) => setSiteSettings({ ...siteSettings, telefone: e.target.value })}
                          className="glass-card backdrop-blur-sm border-white/20"
                        />
                        <Input
                          placeholder="WhatsApp"
                          value={siteSettings.whatsapp}
                          onChange={(e) => setSiteSettings({ ...siteSettings, whatsapp: e.target.value })}
                          className="glass-card backdrop-blur-sm border-white/20"
                        />
                        <Input
                          placeholder="Endereço"
                          value={siteSettings.endereco}
                          onChange={(e) => setSiteSettings({ ...siteSettings, endereco: e.target.value })}
                          className="glass-card backdrop-blur-sm border-white/20"
                        />
                      </div>
                    </div>

                    {/* Upload de Currículo */}
                    <div>
                      <h3 className="text-lg font-semibold mb-4 text-foreground">Currículo</h3>
                      <div className="space-y-4">
                        {siteSettings.cv_path && (
                          <div className="p-4 glass-card backdrop-blur-sm border-white/20 rounded-lg">
                            <p className="text-sm text-foreground">
                              <strong>Arquivo atual:</strong> {siteSettings.cv_path.split('/').pop()}
                            </p>
                            <p className="text-xs text-muted-foreground">
                              Tamanho: {(siteSettings.cv_size / 1024 / 1024).toFixed(2)} MB
                            </p>
                          </div>
                        )}
                        <div className="flex items-center gap-4">
                          <Input
                            type="file"
                            accept=".pdf"
                            onChange={(e) => setCvFile(e.target.files?.[0] || null)}
                            className="glass-card backdrop-blur-sm border-white/20"
                          />
                          <Button
                            type="button"
                            onClick={handleCvUpload}
                            disabled={!cvFile}
                            variant="outline"
                          >
                            <Upload className="w-4 h-4 mr-2" />
                            Upload CV
                          </Button>
                        </div>
                        <p className="text-xs text-muted-foreground">
                          Apenas arquivos PDF são aceitos. Este arquivo será usado no botão "Baixar CV" da página inicial.
                        </p>
                      </div>
                    </div>

                    <div className="flex space-x-3 pt-6 border-t border-white/10">
                      <Button 
                        type="submit"
                        disabled={isLoadingSettings}
                      >
                        {isLoadingSettings ? (
                          <>
                            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                            Salvando...
                          </>
                        ) : (
                          'Salvar Configurações'
                        )}
                      </Button>
                    </div>
                  </form>
                </CardContent>
              </Card>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
