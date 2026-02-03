

# Plano: Sistema de Internacionalização (i18n) com Detecção Automática de Idioma

## Resumo
Implementar um sistema que detecta automaticamente o idioma do navegador do visitante e exibe todo o conteúdo em português ou inglês. Adicionar um botão de bandeira ao lado do toggle de tema para permitir troca manual de idioma.

---

## Como Vai Funcionar

1. Quando alguém acessa seu site, o sistema verifica o idioma do navegador
2. Se o navegador estiver em português, mostra tudo em português
3. Se estiver em inglês (ou outro idioma), mostra em inglês
4. Uma bandeira pequena ao lado do botão de tema permite trocar manualmente
5. A escolha do usuário é salva no navegador para próximas visitas

---

## Arquivos a Criar

### 1. `src/contexts/LanguageContext.tsx`
Contexto global que gerencia o idioma atual e fornece função para trocar.

**Funcionalidades:**
- Detecta idioma do navegador automaticamente
- Salva preferência no localStorage
- Fornece hook `useLanguage()` para acessar traduções

---

### 2. `src/locales/pt.ts`
Arquivo com todas as traduções em português.

```text
Exemplo de estrutura:
- navigation: Início, Sobre, Projetos, Contato, Blog, Painel, Sair
- hero: Olá eu sou, Desenvolvedor Front-End, Ver Projetos, Contato, Baixar CV
- about: Sobre Mim, Tecnologias & Ferramentas
- projects: Meus Projetos
- contact: Vamos Conversar, Enviar Mensagem
- footer: Todos os direitos reservados
```

---

### 3. `src/locales/en.ts`
Arquivo com todas as traduções em inglês.

```text
Exemplo de estrutura:
- navigation: Home, About, Projects, Contact, Blog, Dashboard, Logout
- hero: Hello, I'm, Front-End Developer, View Projects, Contact, Download CV
- about: About Me, Technologies & Tools
- projects: My Projects
- contact: Let's Talk, Send Message
- footer: All rights reserved
```

---

### 4. `src/components/LanguageSwitcher.tsx`
Componente de bandeira para trocar idioma manualmente.

**Visual:**
- Bandeira do Brasil (🇧🇷) quando em português
- Bandeira dos EUA/UK (🇺🇸) quando em inglês
- Botão pequeno ao lado do toggle de tema
- Tooltip mostrando "Português" ou "English"

---

## Arquivos a Modificar

### 1. `src/App.tsx`
- Envolver toda a aplicação com `LanguageProvider`

### 2. `src/components/Navigation.tsx`
- Adicionar `LanguageSwitcher` ao lado do botão de tema
- Trocar textos fixos por traduções: Início, Sobre, Projetos, Contato, Blog, Painel, Sair, Login

### 3. `src/components/HeroSection.tsx`
- Trocar "Olá, eu sou" → tradução
- Trocar roles (Desenvolvedor, Analista, Especialista) → traduções
- Trocar descrição → tradução
- Trocar "Ver Projetos", "Contato", "Baixar CV" → traduções

### 4. `src/components/AboutSection.tsx`
- Trocar "Sobre Mim" → tradução
- Trocar "Tecnologias & Ferramentas" → tradução
- Trocar descrições das skills → traduções

### 5. `src/components/ExperienceSection.tsx`
- Trocar "Experiência Profissional" → tradução
- Trocar descrições de cargo e realizações → traduções

### 6. `src/components/ProjectsSection.tsx`
- Trocar "Meus Projetos" → tradução
- Trocar textos de loading e "nenhum projeto" → traduções

### 7. `src/components/ContactSection.tsx`
- Trocar "Vamos Conversar" → tradução
- Trocar labels do formulário → traduções
- Trocar "Enviar Mensagem" → tradução

### 8. `src/components/Footer.tsx`
- Trocar textos de serviços e navegação → traduções
- Trocar "Todos os direitos reservados" → tradução

---

## Detalhes Técnicos

### Estrutura do Contexto
```typescript
interface LanguageContextType {
  language: 'pt' | 'en';
  setLanguage: (lang: 'pt' | 'en') => void;
  t: (key: string) => string; // função de tradução
}
```

### Detecção Automática
```typescript
const detectLanguage = () => {
  const saved = localStorage.getItem('preferred-language');
  if (saved) return saved;
  
  const browserLang = navigator.language.slice(0, 2);
  return browserLang === 'pt' ? 'pt' : 'en';
};
```

### Componente LanguageSwitcher
- Usa emoji de bandeira ou ícones SVG
- Posicionado entre Desktop Navigation e Theme Toggle
- No mobile, aparece no menu hamburguer também
- Animação suave na troca de bandeira

---

## Ordem de Implementação

1. Criar arquivos de tradução (`pt.ts` e `en.ts`)
2. Criar contexto de idioma (`LanguageContext.tsx`)
3. Criar componente de troca (`LanguageSwitcher.tsx`)
4. Integrar no `App.tsx`
5. Atualizar `Navigation.tsx` com bandeira e traduções
6. Atualizar `HeroSection.tsx` com traduções
7. Atualizar demais componentes com traduções

---

## Resultado Final

- Visitantes de países lusófonos verão o site em português automaticamente
- Visitantes internacionais verão em inglês
- Bandeira pequena ao lado do modo escuro para troca manual
- Preferência salva para próximas visitas
- Transição suave entre idiomas

