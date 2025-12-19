export const BASE_URL = 'https://dwdm-psw-heroes-api.onrender.com/api';

export const PUBLIC_ID = '52XRk2CU';
export const PRIVATE_ID = 'G_wXJBHEJkqRhJpP';

const headers = {
  'Accept': 'application/json',
  'Content-Type': 'application/json'
};

// GET - devolver a lista de todos os usuários
export const getUsers = async () => {
  try {
    const res = await fetch(`${BASE_URL}/users/`, { headers });
    if (!res.ok) throw new Error(`Erro: ${res.status}`);
    return await res.json();
  } catch (error) {
    console.error('Erro em getUsers:', error);
    throw error;
  }
};

// GET - lista de super-heróis de um usuário específico
export const getHeroes = async (publicId = PUBLIC_ID) => {
  try {
    const res = await fetch(`${BASE_URL}/users/${publicId}`, { headers });
    if (!res.ok) throw new Error(`Erro: ${res.status}`);
    const data = await res.json();
    console.log('API Response - getHeroes:', data);
    return data;
  } catch (error) {
    console.error('Erro em getHeroes:', error);
    throw error;
  }
};

// GET - top 3 heróis de um usuário
export const getTopHeroes = async (publicId = PUBLIC_ID) => {
  try {
    const res = await fetch(`${BASE_URL}/users/${publicId}/top`, { headers });
    if (!res.ok) throw new Error(`Erro: ${res.status}`);
    const data = await res.json();
    console.log('API Response - getTopHeroes:', data);
    return data;
  } catch (error) {
    console.error('Erro em getTopHeroes:', error);
    throw error;
  }
};

// POST - grava lista de super-heróis de um usuário
export const postHeroes = async (heroesArray, secretId = PRIVATE_ID) => {
  try {
    console.log('API Request - postHeroes:', heroesArray);
    const res = await fetch(`${BASE_URL}/users/${secretId}`, {
      method: 'POST',
      headers,
      body: JSON.stringify(heroesArray)
    });
    if (!res.ok) throw new Error(`Erro: ${res.status}`);
    const data = await res.json();
    console.log('API Response - postHeroes:', data);
    return data;
  } catch (error) {
    console.error('Erro em postHeroes:', error);
    throw error;
  }
};

// POST - grava top-3 heróis de um usuário
export const postTopHeroes = async (topHeroesArray, secretId = PRIVATE_ID) => {
  try {
    console.log('API Request - postTopHeroes:', topHeroesArray);
    const res = await fetch(`${BASE_URL}/users/${secretId}/top`, {
      method: 'POST',
      headers,
      body: JSON.stringify(topHeroesArray)
    });
    if (!res.ok) throw new Error(`Erro: ${res.status}`);
    const data = await res.json();
    console.log('API Response - postTopHeroes:', data);
    return data;
  } catch (error) {
    console.error('Erro em postTopHeroes:', error);
    throw error;
  }
};

// DELETE - remove um herói específico
export const deleteHero = async (heroId, secretId = PRIVATE_ID) => {
  try {
    console.log('API Request - deleteHero:', heroId);
    
    // Primeiro, busca os heróis atuais
    const currentHeroes = await getHeroes(PUBLIC_ID);
    
    // Remove o herói da lista
    const updatedHeroes = currentHeroes.filter(hero => hero.id !== heroId);
    
    // Envia a lista atualizada
    return await postHeroes(updatedHeroes, secretId);
  } catch (error) {
    console.error('Erro em deleteHero:', error);
    throw error;
  }
};

// Função para testar a conexão com a API
export const testApiConnection = async () => {
  try {
    console.log('Testando conexão com API...');
    
    // Teste 1: Verificar se a base URL está acessível
    const ping = await fetch(BASE_URL);
    console.log('Ping status:', ping.status);
    
    // Teste 2: Verificar se o usuário existe
    const userData = await getHeroes();
    console.log('Dados do usuário:', userData);
    
    // Teste 3: Verificar favoritos
    const topData = await getTopHeroes();
    console.log('Dados dos favoritos:', topData);
    
    return {
      success: true,
      userData,
      topData,
      message: 'API conectada com sucesso'
    };
  } catch (error) {
    console.error('Erro na conexão com API:', error);
    return {
      success: false,
      error: error.message,
      message: 'Falha na conexão com API'
    };
  }
};

// Função para resetar dados (útil para desenvolvimento)
export const resetUserData = async (secretId = PRIVATE_ID) => {
  try {
    console.log('Resetando dados do usuário...');
    
    // Resetar lista de heróis para vazia
    const emptyHeroes = await postHeroes([], secretId);
    
    // Resetar favoritos para vazia
    const emptyFavorites = await postTopHeroes([], secretId);
    
    return {
      heroes: emptyHeroes,
      favorites: emptyFavorites,
      message: 'Dados resetados com sucesso'
    };
  } catch (error) {
    console.error('Erro ao resetar dados:', error);
    throw error;
  }
};

// Função para validar a estrutura de um herói
export const validateHeroStructure = (hero) => {
  const requiredFields = ['name', 'image'];
  const missingFields = requiredFields.filter(field => !hero[field]);
  
  if (missingFields.length > 0) {
    throw new Error(`Campos obrigatórios faltando: ${missingFields.join(', ')}`);
  }
  
  // Garantir que o herói tenha a estrutura correta
  return {
    id: hero.id || Date.now(), // ID temporário se não existir
    name: hero.name,
    image: hero.image,
    superpower: hero.superpower || '',
    createdAt: hero.createdAt || new Date().toISOString()
  };
};

// Função para garantir IDs únicos
export const ensureUniqueIds = (heroesArray) => {
  const seenIds = new Set();
  return heroesArray.map(hero => {
    if (!hero.id) {
      // Gerar ID único se não existir
      let newId;
      do {
        newId = Math.floor(Math.random() * 1000000);
      } while (seenIds.has(newId));
      
      seenIds.add(newId);
      return { ...hero, id: newId };
    }
    
    seenIds.add(hero.id);
    return hero;
  });
};

// Função para sincronizar dados entre estado local e API
export const syncDataWithApi = async (localHeroes, localFavorites, secretId = PRIVATE_ID) => {
  try {
    console.log('Sincronizando dados com API...');
    
    // 1. Sincronizar heróis
    const heroesResponse = await postHeroes(localHeroes, secretId);
    
    // 2. Sincronizar favoritos
    const favoritesResponse = await postTopHeroes(localFavorites, secretId);
    
    return {
      heroes: heroesResponse,
      favorites: favoritesResponse,
      synced: true,
      timestamp: new Date().toISOString()
    };
  } catch (error) {
    console.error('Erro na sincronização:', error);
    throw error;
  }
};