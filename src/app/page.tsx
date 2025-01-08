"use client"; // Adicione essa linha no topo

import { useState } from 'react';
import Image from 'next/image';

interface Message {
  text: string;
  sender: 'user' | 'bot';
}

export default function ChatPage() {
  const [messages, setMessages] = useState<Message[]>([]); // Histórico de mensagens
  const [input, setInput] = useState(''); // Entrada do usuário
  const [isLoading, setIsLoading] = useState(false);

  // Atualiza a mensagem digitada
  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInput(e.target.value);
  };

  // Função para enviar a mensagem e processar a resposta
  const handleSendMessage = async () => {
    if (!input.trim()) return; // Ignora mensagens vazias

    const newMessage: Message = { text: input, sender: 'user' };
    setMessages((prev) => [...prev, newMessage]); // Adiciona a mensagem ao histórico
    setInput(''); // Limpa a entrada
    setIsLoading(true);

    try {
      const res = await fetch('/api/ask', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          question: input,
          agent: 'bae',
        }),
      });

      if (!res.ok) {
        console.error('Erro na resposta da API /api/ask, Status:', res.status);
        const errorDetails = await res.text();
        console.error('Detalhes do erro:', errorDetails);
        throw new Error('Erro ao buscar resposta do servidor');
      }

      const data = await res.json();
      const botMessage: Message = { text: data.response || 'Resposta não disponível', sender: 'bot' };
      setMessages((prev) => [...prev, botMessage]); // Adiciona a resposta ao histórico

    } catch (error) {
      console.error('Erro ao enviar a mensagem:', error);
      const errorMessage: Message = { text: 'Erro ao buscar resposta. Tente novamente.', sender: 'bot' };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-white">
      <div className="p-8 bg-gray-100 rounded-lg shadow-lg w-full max-w-lg">
        <div className="flex items-center mb-4 relative">
          <Image 
            src="/mascote-bae.png" 
            alt="Mascote Baê"
            width={60} 
            height={60} 
            className="mr-4"
          />
          <h1 className="text-xl font-bold text-gray-800">
            Tire suas Dúvidas sobre a TGA
          </h1>
          <div className="absolute top-0 left-16 bg-white border border-gray-300 p-2 rounded-lg shadow-lg">
            <span className="text-sm text-gray-800">Oi, sou Baê! O Agente de Inteligência Artificial da Gestão da Aprendizagem! Em que posso te ajudar?</span>
          </div>
        </div>

        <div className="h-96 overflow-y-auto p-4 bg-white rounded-lg border border-gray-300 mb-4">
          {messages.map((msg, index) => (
            <div 
              key={index} 
              className={`mb-2 ${msg.sender === 'user' ? 'text-right' : 'text-left'}`}
            >
              <span 
                className={`inline-block p-2 rounded-lg ${msg.sender === 'user' ? 'bg-blue-500 text-white' : 'bg-gray-300 text-black'}`}
              >
                {msg.text}
              </span>
            </div>
          ))}
        </div>

        {isLoading && (
          <div className="text-center text-gray-600 mb-4">
            Pensando{'.'.repeat((Math.floor(Date.now() / 1000) % 3) + 1)}
          </div>
        )}

        <textarea 
          placeholder="Digite sua mensagem..."
          value={input}
          onChange={handleInputChange}
          className="w-full p-4 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 mb-4 h-24 resize-y"
        />

        <button 
          onClick={handleSendMessage}
          className="w-full p-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700"
          disabled={isLoading}
        >
          {isLoading ? 'Enviando...' : 'Enviar'}
        </button>
      </div>
    </div>
  );
}
