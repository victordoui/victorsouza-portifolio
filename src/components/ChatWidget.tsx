import React, { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { MessageCircle, X, Send } from 'lucide-react';

interface Message {
  id: string;
  text: string;
  isBot: boolean;
  timestamp: Date;
}

const ChatWidget = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: 'Olá! Sou o assistente virtual do Victor. Posso responder sobre seus projetos, experiência e tecnologias. Como posso ajudar?',
      isBot: true,
      timestamp: new Date()
    }
  ]);
  const [inputText, setInputText] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(scrollToBottom, [messages]);

  const getResponse = (userMessage: string): string => {
    const message = userMessage.toLowerCase();
    
    // Respostas sobre projetos
    if (message.includes('projeto') || message.includes('portfolio')) {
      return 'Victor trabalha com projetos focados em React, TypeScript, Python e IA. Seus principais projetos incluem dashboards interativos, sistemas de automação e aplicações web modernas. Você pode ver todos os projetos na seção "Projetos" do portfólio!';
    }
    
    // Respostas sobre tecnologias
    if (message.includes('tecnologia') || message.includes('stack') || message.includes('linguagem')) {
      return 'Victor domina: Frontend (React, TypeScript, Tailwind CSS), Backend (Python, Node.js, Supabase), Banco de Dados (PostgreSQL, MongoDB), DevOps (Docker, Git) e Inteligência Artificial (Machine Learning, NLP, LLMs).';
    }
    
    // Respostas sobre experiência
    if (message.includes('experiência') || message.includes('trabalho') || message.includes('carreira')) {
      return 'Victor é desenvolvedor fullstack com foco em IA e automação. Tem experiência em criar soluções completas, desde o frontend até integração com APIs de IA. Especialista em engenharia de prompts e desenvolvimento de chatbots.';
    }
    
    // Respostas sobre contato
    if (message.includes('contato') || message.includes('email') || message.includes('linkedin')) {
      return 'Você pode entrar em contato com Victor através da seção "Contato" no final da página, ou conectar via LinkedIn. Ele está sempre aberto para discutir projetos e oportunidades!';
    }
    
    // Respostas sobre IA
    if (message.includes('ia') || message.includes('inteligencia artificial') || message.includes('ai') || message.includes('machine learning')) {
      return 'Victor é especialista em IA, com foco em engenharia de prompts, integração de LLMs, automação inteligente e desenvolvimento de chatbots. Trabalha com OpenAI, Anthropic e outras tecnologias de ponta.';
    }
    
    // Respostas sobre React/Frontend
    if (message.includes('react') || message.includes('frontend') || message.includes('interface')) {
      return 'Victor é expert em React e TypeScript, criando interfaces modernas e responsivas. Utiliza Tailwind CSS, componentes reutilizáveis e as melhores práticas de desenvolvimento frontend.';
    }
    
    // Resposta padrão
    return 'Interessante! Victor trabalha com desenvolvimento fullstack e IA. Posso te contar sobre seus projetos, tecnologias ou experiência. O que gostaria de saber especificamente?';
  };

  const handleSendMessage = () => {
    if (!inputText.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: inputText,
      isBot: false,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputText('');

    // Simular delay de digitação do bot
    setTimeout(() => {
      const botResponse: Message = {
        id: (Date.now() + 1).toString(),
        text: getResponse(inputText),
        isBot: true,
        timestamp: new Date()
      };
      setMessages(prev => [...prev, botResponse]);
    }, 1000);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSendMessage();
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {/* Chat Toggle Button */}
      {!isOpen && (
        <Button
          onClick={() => setIsOpen(true)}
          className="rounded-full w-14 h-14 bg-primary hover:bg-primary/90 shadow-lg"
        >
          <MessageCircle className="w-6 h-6" />
        </Button>
      )}

      {/* Chat Window */}
      {isOpen && (
        <Card className="w-80 h-96 flex flex-col bg-background border shadow-2xl">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b bg-primary text-primary-foreground rounded-t-lg">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-green-400 rounded-full"></div>
              <span className="font-medium">Assistente Victor</span>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsOpen(false)}
              className="text-primary-foreground hover:bg-primary-foreground/20"
            >
              <X className="w-4 h-4" />
            </Button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.isBot ? 'justify-start' : 'justify-end'}`}
              >
                <div
                  className={`max-w-[80%] p-3 rounded-lg text-sm ${
                    message.isBot
                      ? 'bg-muted text-muted-foreground'
                      : 'bg-primary text-primary-foreground'
                  }`}
                >
                  {message.text}
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div className="p-4 border-t">
            <div className="flex gap-2">
              <Input
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Digite sua pergunta..."
                className="flex-1"
              />
              <Button onClick={handleSendMessage} size="sm">
                <Send className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </Card>
      )}
    </div>
  );
};

export default ChatWidget;