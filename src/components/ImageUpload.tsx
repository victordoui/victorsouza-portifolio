
import { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Upload, X, Image as ImageIcon, Loader2 } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/useAuth';

interface ImageUploadProps {
  onImageUploaded: (url: string) => void;
  currentImage?: string;
  onImageRemoved?: () => void;
  onUploadStart?: () => void;
  onUploadEnd?: () => void;
}

export const ImageUpload = ({ 
  onImageUploaded, 
  currentImage, 
  onImageRemoved,
  onUploadStart,
  onUploadEnd 
}: ImageUploadProps) => {
  const [uploading, setUploading] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { user } = useAuth();

  const uploadImage = async (file: File) => {
    try {
      setUploading(true);
      onUploadStart?.();

      // Check if user is authenticated
      if (!user) {
        toast({
          title: 'Erro',
          description: 'Você precisa estar logado para fazer upload de imagens.',
          variant: 'destructive',
        });
        return;
      }

      // Validate file type
      if (!file.type.startsWith('image/')) {
        toast({
          title: 'Erro',
          description: 'Por favor, selecione apenas arquivos de imagem.',
          variant: 'destructive',
        });
        return;
      }

      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        toast({
          title: 'Erro',
          description: 'A imagem deve ter no máximo 5MB.',
          variant: 'destructive',
        });
        return;
      }

      // Generate secure filename with user ID and timestamp
      const fileExt = file.name.split('.').pop()?.toLowerCase();
      const timestamp = Date.now();
      const randomString = Math.random().toString(36).substring(2, 8);
      const fileName = `${user.id}-${timestamp}-${randomString}.${fileExt}`;

      console.log('Iniciando upload para o bucket projeto-images:', fileName);

      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('projeto-images')
        .upload(fileName, file, {
          contentType: file.type,
          upsert: false
        });

      if (uploadError) {
        console.error('Erro no upload:', uploadError);
        if (uploadError.message.includes('already exists')) {
          toast({
            title: 'Erro',
            description: 'Um arquivo com este nome já existe. Tente novamente.',
            variant: 'destructive',
          });
        } else {
          throw uploadError;
        }
        return;
      }

      console.log('Upload realizado com sucesso:', uploadData);

      // Get public URL
      const { data } = supabase.storage
        .from('projeto-images')
        .getPublicUrl(fileName);

      console.log('URL pública gerada:', data.publicUrl);

      onImageUploaded(data.publicUrl);
      
      toast({
        title: 'Sucesso',
        description: 'Imagem carregada com sucesso!',
      });
    } catch (error) {
      console.error('Error uploading image:', error);
      toast({
        title: 'Erro',
        description: 'Erro ao fazer upload da imagem. Verifique sua conexão e tente novamente.',
        variant: 'destructive',
      });
    } finally {
      setUploading(false);
      onUploadEnd?.();
    }
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDragIn = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(true);
  };

  const handleDragOut = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      uploadImage(e.dataTransfer.files[0]);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      uploadImage(e.target.files[0]);
    }
  };

  const removeImage = () => {
    if (onImageRemoved) {
      onImageRemoved();
    }
  };

  return (
    <div className="space-y-4">
      {currentImage ? (
        <Card className="relative overflow-hidden">
          <div className="relative h-48 w-full">
            <img
              src={currentImage}
              alt="Upload preview"
              className="w-full h-full object-cover"
              onError={() => {
                console.error('Erro ao carregar imagem:', currentImage);
                toast({
                  title: 'Aviso',
                  description: 'Erro ao carregar a imagem. Verifique se a URL está correta.',
                  variant: 'destructive',
                });
              }}
            />
            <div className="absolute inset-0 bg-black/50 opacity-0 hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
              <Button
                variant="destructive"
                size="sm"
                onClick={removeImage}
                className="backdrop-blur-sm"
              >
                <X className="h-4 w-4 mr-2" />
                Remover
              </Button>
            </div>
          </div>
          <div className="p-3 bg-green-50 border-l-4 border-green-400">
            <p className="text-sm text-green-700">✅ Imagem carregada com sucesso!</p>
          </div>
        </Card>
      ) : (
        <Card
          className={`relative border-2 border-dashed transition-all duration-300 ${
            dragActive
              ? 'border-primary bg-primary/5'
              : 'border-muted-foreground/25 hover:border-primary/50'
          }`}
          onDragEnter={handleDragIn}
          onDragLeave={handleDragOut}
          onDragOver={handleDrag}
          onDrop={handleDrop}
        >
          <div className="p-8 text-center">
            <div className="mb-4 flex justify-center">
              {uploading ? (
                <Loader2 className="h-12 w-12 text-primary animate-spin" />
              ) : (
                <div className="relative">
                  <ImageIcon className="h-12 w-12 text-muted-foreground" />
                  <Upload className="h-6 w-6 text-primary absolute -bottom-1 -right-1" />
                </div>
              )}
            </div>
            
            <h3 className="text-lg font-semibold mb-2">
              {uploading ? 'Carregando imagem...' : 'Adicionar imagem do projeto'}
            </h3>
            
            <p className="text-sm text-muted-foreground mb-4">
              {uploading 
                ? 'Por favor, aguarde...' 
                : 'Arraste e solte uma imagem aqui ou clique para selecionar'
              }
            </p>
            
            <div className="flex flex-col sm:flex-row gap-2 justify-center">
              <Button
                type="button"
                variant="outline"
                onClick={() => fileInputRef.current?.click()}
                disabled={uploading}
                className="glass-card backdrop-blur-sm"
              >
                <Upload className="h-4 w-4 mr-2" />
                {uploading ? 'Carregando...' : 'Selecionar Arquivo'}
              </Button>
            </div>
            
            <p className="text-xs text-muted-foreground mt-3">
              Formatos suportados: JPG, PNG, GIF, WebP (máx. 5MB)
            </p>

            {uploading && (
              <div className="mt-4 p-3 bg-blue-50 border-l-4 border-blue-400">
                <p className="text-sm text-blue-700">
                  📤 Fazendo upload da imagem... Por favor, aguarde antes de salvar o projeto.
                </p>
              </div>
            )}
          </div>
          
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleFileSelect}
            className="hidden"
          />
        </Card>
      )}
    </div>
  );
};
