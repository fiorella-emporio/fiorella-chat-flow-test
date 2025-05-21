
import { Message } from "@/types/chat";

const N8N_ENDPOINT = "https://n8n.liberato.pro.br/webhook/fiorella-chat";

export async function sendMessageToAgent(conversationId: string, message: string): Promise<Message> {
  try {
    const response = await fetch(N8N_ENDPOINT, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        conversationId,
        message,
      }),
    });

    if (!response.ok) {
      throw new Error("Falha ao enviar mensagem para o agente");
    }

    const data = await response.json();
    
    
    // Normally, we'd use the real response from n8n here
    // For testing purposes, we'll simulate a response
    return {
      id: Math.random().toString(36).substring(2, 11),
      text: data.output || "Olá! Como posso ajudar você hoje?",
      sender: "agent",
      timestamp: Date.now(),
      delivered: true,
    };
  } catch (error) {
    console.error("Erro ao enviar mensagem:", error);
    
    // For demo purposes, we'll return a simulated response
    // return {
    //   id: Math.random().toString(36).substring(2, 11),
    //   text: "Olá! Sou o assistente virtual da Fiorella. Como posso te ajudar hoje?",
    //   sender: "agent",
    //   timestamp: Date.now(),
    //   delivered: true,
    // };
  }
}
