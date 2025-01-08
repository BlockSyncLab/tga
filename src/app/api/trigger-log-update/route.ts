import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const { question, answer } = await req.json();

    // Disparar o GitHub Actions (ou realizar qualquer outra ação necessária)
    await fetch('https://api.github.com/repos/SEU_USUARIO/SEU_REPOSITORIO/actions/workflows/update-log.yml/dispatches', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.GITHUB_TOKEN}`,  // GitHub Token que você deve criar em seus segredos
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        ref: 'main',  // Branch onde o workflow do GitHub Actions estará rodando
        inputs: {
          question,
          answer,
        },
      });

    return NextResponse.json({ message: 'Log enviado para atualização no GitHub.' });

  } catch (error) {
    console.error('Erro ao disparar atualização:', error);
    return NextResponse.json({ error: 'Erro ao disparar atualização do log' }, { status: 500 });
  }
}
