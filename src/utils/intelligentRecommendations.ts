// Tipos para o sistema de recomendações
export interface ProjectRecommendation {
  id: string;
  titulo: string;
  descricao: string;
  tecnologias: string[];
  imagem_url?: string;
  similarity: number;
}

// Função para calcular similaridade entre arrays de tecnologias
export const calculateTechnologySimilarity = (
  tech1: string[],
  tech2: string[]
): number => {
  const set1 = new Set(tech1.map(t => t.toLowerCase()));
  const set2 = new Set(tech2.map(t => t.toLowerCase()));
  
  const intersection = new Set([...set1].filter(x => set2.has(x)));
  const union = new Set([...set1, ...set2]);
  
  // Jaccard similarity
  return intersection.size / union.size;
};

// Função para calcular similaridade textual simples
export const calculateTextSimilarity = (text1: string, text2: string): number => {
  const words1 = text1.toLowerCase().split(/\s+/);
  const words2 = text2.toLowerCase().split(/\s+/);
  
  const set1 = new Set(words1);
  const set2 = new Set(words2);
  
  const intersection = new Set([...set1].filter(x => set2.has(x)));
  const union = new Set([...set1, ...set2]);
  
  return intersection.size / union.size;
};

// Função principal para gerar recomendações
export const getProjectRecommendations = (
  currentProject: any,
  allProjects: any[],
  maxRecommendations: number = 3
): ProjectRecommendation[] => {
  if (!currentProject || !allProjects.length) return [];
  
  const recommendations = allProjects
    .filter(project => project.id !== currentProject.id)
    .map(project => {
      // Calcular similaridade baseada em tecnologias (peso 70%)
      const techSimilarity = calculateTechnologySimilarity(
        currentProject.tecnologias || [],
        project.tecnologias || []
      );
      
      // Calcular similaridade baseada em texto (peso 30%)
      const textSimilarity = calculateTextSimilarity(
        currentProject.descricao || '',
        project.descricao || ''
      );
      
      // Pontuação final ponderada
      const similarity = (techSimilarity * 0.7) + (textSimilarity * 0.3);
      
      return {
        id: project.id,
        titulo: project.titulo,
        descricao: project.descricao,
        tecnologias: project.tecnologias || [],
        imagem_url: project.imagem_url,
        similarity
      };
    })
    .sort((a, b) => b.similarity - a.similarity)
    .slice(0, maxRecommendations);
  
  return recommendations;
};

// Função para busca semântica local
export const performSemanticSearch = (
  query: string,
  projects: any[],
  articles: any[] = []
): { projects: any[]; articles: any[] } => {
  const searchTerms = query.toLowerCase().split(/\s+/);
  
  // Mapear tecnologias para sinônimos/categorias
  const techSynonyms: { [key: string]: string[] } = {
    'frontend': ['react', 'vue', 'angular', 'javascript', 'html', 'css', 'tailwind'],
    'backend': ['node', 'python', 'java', 'php', 'api', 'server'],
    'database': ['mysql', 'postgresql', 'mongodb', 'sql', 'nosql', 'banco'],
    'mobile': ['react native', 'flutter', 'ios', 'android', 'app'],
    'ai': ['inteligencia artificial', 'machine learning', 'ml', 'chatbot', 'nlp'],
    'dashboard': ['grafico', 'chart', 'visualizacao', 'analytics', 'bi', 'dados'],
    'ecommerce': ['loja', 'vendas', 'carrinho', 'pagamento', 'stripe']
  };
  
  // Expandir termos de busca com sinônimos
  const expandedTerms = new Set(searchTerms);
  searchTerms.forEach(term => {
    Object.entries(techSynonyms).forEach(([category, synonyms]) => {
      if (synonyms.some(syn => syn.includes(term) || term.includes(syn))) {
        expandedTerms.add(category);
        synonyms.forEach(syn => expandedTerms.add(syn));
      }
    });
  });
  
  // Buscar projetos
  const searchedProjects = projects
    .map(project => {
      let score = 0;
      const searchableText = [
        project.titulo,
        project.descricao,
        ...(project.tecnologias || [])
      ].join(' ').toLowerCase();
      
      expandedTerms.forEach(term => {
        if (searchableText.includes(term)) {
          score += 1;
        }
      });
      
      return { ...project, searchScore: score };
    })
    .filter(project => project.searchScore > 0)
    .sort((a, b) => b.searchScore - a.searchScore);
  
  // Buscar artigos
  const searchedArticles = articles
    .map(article => {
      let score = 0;
      const searchableText = [
        article.titulo,
        article.resumo,
        article.conteudo
      ].join(' ').toLowerCase();
      
      expandedTerms.forEach(term => {
        if (searchableText.includes(term)) {
          score += 1;
        }
      });
      
      return { ...article, searchScore: score };
    })
    .filter(article => article.searchScore > 0)
    .sort((a, b) => b.searchScore - a.searchScore);
  
  return {
    projects: searchedProjects,
    articles: searchedArticles
  };
};

// Função para gerar resumo automático (versão simples)
export const generateSimpleSummary = (content: string, maxLength: number = 160): string => {
  if (!content || content.length <= maxLength) return content;
  
  // Dividir em sentenças
  const sentences = content.split(/[.!?]+/).filter(s => s.trim().length > 0);
  
  if (sentences.length === 0) return content.substring(0, maxLength) + '...';
  
  // Pegar as primeiras sentenças que cabem no limite
  let summary = '';
  for (const sentence of sentences) {
    const newSummary = summary + (summary ? '. ' : '') + sentence.trim();
    if (newSummary.length > maxLength) break;
    summary = newSummary;
  }
  
  // Se ainda está vazio, pegar substring
  if (!summary) {
    summary = content.substring(0, maxLength);
  }
  
  return summary + (summary.length < content.length ? '...' : '');
};