import { NextResponse } from 'next/server';

// Função para disparar o workflow no GitHub Actions
export async function POST(req: Request) {
  try {
    // Obtém os dados enviados na requisição
    const { question, answer } = await req.json();

    // URL do GitHub Actions que aciona o workflow
    const githubActionsUrl = 'https://api.github.com/repos/BlockSyncLab/tga/actions/workflows/update-log.yml/dispatches';

    // Enviar requisição para disparar o GitHub Actions
    const response = await fetch(githubActionsUrl, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.GITHUB_TOKEN}`, // Autenticação usando token de acesso
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        ref: 'master', // Branch onde o workflow será executado (pode ser 'main', dependendo da sua configuração)
        inputs: {
          question, // A pergunta enviada
          answer,   // A resposta recebida
        },
      }),
    });

    // Verifica se a resposta foi bem-sucedida
    if (!response.ok) {
      throw new Error('Erro ao disparar o GitHub Actions');
    }

    // Retorna sucesso
    return NextResponse.json({ message: 'Log enviado para atualização no GitHub.' });

  } catch (error) {
    console.error('Erro ao disparar atualização:', error);
    return NextResponse.json({ error: 'Erro ao disparar atualização do log' }, { status: 500 });
  }
}
