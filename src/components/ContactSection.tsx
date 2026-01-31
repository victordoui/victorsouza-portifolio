import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Mail, MapPin, Phone, Send } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useSiteSettings } from '@/hooks/useSiteSettings';
import { supabase } from '@/integrations/supabase/client';
import AnimatedSection from '@/components/AnimatedSection';
import { motion } from 'framer-motion';

const ContactSection = () => {
  const { settings } = useSiteSettings();
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const { error } = await supabase
        .from('messages')
        .insert({
          name: formData.name,
          email: formData.email,
          subject: formData.subject,
          message: formData.message,
          read: false
        });

      if (error) throw error;

      toast({
        title: "Mensagem enviada!",
        description: "Obrigado pelo contato. Responderei em breve!",
      });

      setFormData({
        name: '',
        email: '',
        subject: '',
        message: ''
      });
    } catch (error) {
      console.error('Erro ao enviar mensagem:', error);
      toast({
        title: "Erro ao enviar mensagem",
        description: "Tente novamente mais tarde.",
        variant: "destructive"
      });
    }
  };

  const contactInfo = [
    {
      icon: Mail,
      title: 'Email',
      value: settings.email || 'victordoui@gmail.com',
      href: `mailto:${settings.email || 'victordoui@gmail.com'}`
    },
    {
      icon: Phone,
      title: 'Telefone',
      value: settings.telefone || '+55 (21) 98790-2208',
      href: `tel:${settings.telefone?.replace(/\D/g, '') || '+5521987902208'}`
    },
    {
      icon: MapPin,
      title: 'Localização',
      value: settings.endereco || 'Rio de Janeiro, RJ - Brasil',
      href: '#'
    }
  ];

  return (
    <section id="contact" className="section-padding bg-muted/30">
      <div className="container mx-auto px-4 lg:px-8">
        <AnimatedSection className="text-center mb-16">
          <h2 className="font-display text-3xl md:text-4xl lg:text-5xl font-bold mb-6 text-gradient-modern">
            Vamos Conversar
          </h2>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
            Tem um projeto em mente? Quer discutir uma ideia ou simplesmente bater um papo sobre tecnologia? 
            Estou sempre aberto a novas oportunidades e conexões.
          </p>
        </AnimatedSection>

        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16">
          {/* Contact Form */}
          <AnimatedSection delay={0.1}>
            <Card className="shadow-lg">
              <CardHeader>
                <CardTitle className="text-2xl font-display">Envie uma Mensagem</CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="name">Nome</Label>
                      <Input
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        placeholder="Seu nome completo"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email">Email</Label>
                      <Input
                        id="email"
                        name="email"
                        type="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        placeholder="seu@email.com"
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="subject">Assunto</Label>
                    <Input
                      id="subject"
                      name="subject"
                      value={formData.subject}
                      onChange={handleInputChange}
                      placeholder="Como posso ajudar?"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="message">Mensagem</Label>
                    <Textarea
                      id="message"
                      name="message"
                      value={formData.message}
                      onChange={handleInputChange}
                      placeholder="Conte-me mais sobre seu projeto ou ideia..."
                      rows={6}
                      required
                    />
                  </div>

                  <Button type="submit" size="lg" className="w-full">
                    <Send className="mr-2 h-5 w-5" />
                    Enviar Mensagem
                  </Button>
                </form>
              </CardContent>
            </Card>
          </AnimatedSection>

          {/* Contact Information */}
          <AnimatedSection delay={0.2} direction="right">
            <div className="space-y-8">
              <div>
                <h3 className="font-display text-2xl font-semibold mb-6 text-foreground">
                  Informações de Contato
                </h3>
                <p className="text-muted-foreground mb-8">
                  Prefere outro meio de contato? Aqui estão algumas alternativas:
                </p>
              </div>

              <div className="space-y-6">
                {contactInfo.map((info, index) => (
                  <motion.div 
                    key={info.title} 
                    className="p-6 rounded-lg border shadow-sm hover:shadow-md transition-all duration-300 group"
                    initial={{ opacity: 0, x: 20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.1 * index }}
                  >
                    <div className="flex items-center space-x-4">
                      <div className="flex-shrink-0">
                        <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                          <info.icon className="h-6 w-6 text-primary" />
                        </div>
                      </div>
                      <div className="flex-1">
                        <h4 className="font-semibold text-lg text-foreground mb-1">{info.title}</h4>
                        <a 
                          href={info.href}
                          className="text-muted-foreground hover:text-primary transition-colors duration-300 text-sm font-medium"
                        >
                          {info.value}
                        </a>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>

              {/* Enhanced CTA */}
              <motion.div 
                className="rounded-lg border p-6 bg-muted/30"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.4 }}
              >
                <h4 className="font-semibold text-foreground mb-4 text-lg flex items-center">
                  ⚡ <span className="ml-2">Resposta Rápida Garantida</span>
                </h4>
                <p className="text-muted-foreground text-sm leading-relaxed">
                  Costumo responder a todas as mensagens em até 24 horas. 
                  Para projetos urgentes, entre em contato via WhatsApp para uma resposta ainda mais rápida.
                </p>
              </motion.div>
            </div>
          </AnimatedSection>
        </div>
      </div>
    </section>
  );
};

export default ContactSection;
