

# Plano: Melhorias na Hero Section

## Resumo das Alterações
Vou fazer 3 modificações na sua Hero Section conforme solicitado:

---

## 1. Remover Badge "Disponível para oportunidades"

Vou remover o componente `StatusBadge` que aparece acima do seu nome.

**Arquivo:** `src/components/HeroSection.tsx`
- Remover a importação do `StatusBadge`
- Remover o bloco que renderiza o badge (linhas 65-68)

---

## 2. Aumentar o Tamanho da Foto

Vou ajustar as classes CSS da foto para que ela apareça maior na tela.

**Arquivo:** `src/components/hero/GlassmorphismPhoto.tsx`
- Alterar `max-w-md` para `max-w-lg` ou `max-w-xl`
- Ajustar `aspect-square lg:aspect-[4/5]` para permitir uma visualização maior

---

## 3. Adicionar Efeito de Background na Hero

Vou adicionar o componente `EnhancedBackgroundBeams` que já existe no projeto. Este componente cria linhas animadas elegantes que fluem pelo fundo, dando um efeito moderno e profissional.

**Arquivo:** `src/components/HeroSection.tsx`
- Importar `EnhancedBackgroundBeams` de `@/components/ui/enhanced-background-beams`
- Adicionar o componente no fundo da Hero Section junto com os outros efeitos

---

## Resultado Esperado

Sua Hero Section terá:
- Foto maior e mais destacada
- Visual mais limpo sem o badge
- Efeito de linhas animadas no background criando profundidade visual

---

## Detalhes Técnicos

### Arquivos Modificados:
1. `src/components/HeroSection.tsx` - Remover StatusBadge e adicionar EnhancedBackgroundBeams
2. `src/components/hero/GlassmorphismPhoto.tsx` - Aumentar tamanho da imagem

### Componentes Utilizados:
- `EnhancedBackgroundBeams` - já existe em `src/components/ui/enhanced-background-beams.tsx`
- Usa Framer Motion para animações suaves
- Respeita preferência de movimento reduzido do sistema

