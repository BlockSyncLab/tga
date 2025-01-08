import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const { question, answer } = await req.json();

    // Disparar o GitHub Actions (ou realizar qualquer outra ação necessária)
    const response = await fetch('https://api.github.com/repos/BlockSyncLab/tga/actions/workflows/update-log.yml/dispatches', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.GITHUB_TOKEN}`,  // GitHub Token que você deve criar em seus segredos
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        ref: 'master',  // Branch onde o workflow do GitHub Actions estará rodando
        inputs: {
          question,
          answer,
        },
      })
    });

    // Verifica se a resposta foi bem-sucedida
    if (!response.ok) {
      throw new Error('Erro ao disparar o GitHub Actions');
    }

    return NextResponse.json({ message: 'Log enviado para atualização no GitHub.' });

  } catch (error) {
    console.error('Erro ao disparar atualização:', error);
    return NextResponse.json({ error: 'Erro ao disparar atualização do log' }, { status: 500 });
  }
}
