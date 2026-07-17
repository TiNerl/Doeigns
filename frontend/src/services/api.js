const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

function obterToken() {
  return localStorage.getItem('token');
}

function extrairMensagem(dados, respostaOk) {
  if (respostaOk) return null;
  if (!dados) return 'Erro inesperado ao falar com a API.';
  if (Array.isArray(dados.message)) return dados.message.join(', ');
  return dados.message || 'Erro inesperado ao falar com a API.';
}

async function requisitar(caminho, { metodo = 'GET', corpo, formData = false } = {}) {
  const cabecalhos = {};
  const token = obterToken();
  if (token) cabecalhos['Authorization'] = `Bearer ${token}`;
  if (!formData && corpo !== undefined) cabecalhos['Content-Type'] = 'application/json';

  const resposta = await fetch(`${BASE_URL}/api${caminho}`, {
    method: metodo,
    headers: cabecalhos,
    body: formData ? corpo : corpo !== undefined ? JSON.stringify(corpo) : undefined,
  });

  const texto = await resposta.text();
  let dados = null;
  if (texto) {
    try {
      dados = JSON.parse(texto);
    } catch {
      dados = texto;
    }
  }

  if (!resposta.ok) {
    const erro = new Error(extrairMensagem(dados, resposta.ok));
    erro.status = resposta.status;
    erro.payload = dados;
    throw erro;
  }

  return dados;
}

export const api = {
  get: (caminho) => requisitar(caminho),
  post: (caminho, corpo, opcoes = {}) => requisitar(caminho, { metodo: 'POST', corpo, ...opcoes }),
  patch: (caminho, corpo) => requisitar(caminho, { metodo: 'PATCH', corpo }),
};

export { BASE_URL };
