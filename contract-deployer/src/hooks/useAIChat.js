import { useState, useCallback, useEffect } from 'react';
import { sendPromptToAI, suggestedPrompts as defaultSuggestions, extractTokenAddresses } from '../services/aiService';

export const useAIChat = (initialMessages = [], onCodeGenerated = () => {}) => {
  const [messages, setMessages] = useState(initialMessages);
  const [isTyping, setIsTyping] = useState(false);
  const [suggestedPrompts, setSuggestedPrompts] = useState(defaultSuggestions);
  
  // Effect for saving chat history to localStorage
  useEffect(() => {
    if (messages.length > 0) {
      localStorage.setItem('aiChatHistory', JSON.stringify(messages));
    }
  }, [messages]);
  
  // Effect for loading chat history from localStorage on initialization
  useEffect(() => {
    const savedHistory = localStorage.getItem('aiChatHistory');
    if (savedHistory && initialMessages.length === 0) {
      try {
        const parsedHistory = JSON.parse(savedHistory);
        // Use initializing function to avoid re-renders
        setMessages(() => parsedHistory);
      } catch (e) {
        console.error('Error loading chat history:', e);
      }
    }
  }, []); // Removed initialMessages from dependencies to avoid loops

  // Funkcja do ekstrakcji kodu z odpowiedzi AI
  const extractCodeFromResponse = useCallback((response) => {
    // Różne warianty wyciągania bloków kodu
    const patterns = [
      /```solidity\n([\s\S]*?)```/,     // Standard markdown
      /```\n([\s\S]*?)```/,             // No language specified
      /`([\s\S]*?)`/                    // Inline code (last resort)
    ];
    
    for (const pattern of patterns) {
      const match = response.match(pattern);
      if (match && match[1] && match[1].includes('pragma solidity')) {
        console.log('Found Solidity code block:', match[1]);
        return match[1].trim();
      }
    }
    
    return null;
  }, []);

  // Function to send messages to AI
  const sendMessage = useCallback(async (content) => {
    try {
      console.log("Sending message to AI:", content);
      
      // Walidacja treści wiadomości
      if (!content || content.trim() === '') {
        console.error("Empty message content");
        throw new Error("Message cannot be empty");
      }
      
      // Add user message to history
      const userMessage = { content, isUser: true, timestamp: new Date() };
      
      // Używamy stanu funkcjonalnego, aby mieć dostęp do najnowszego stanu
      let updatedMessages = [];
      setMessages(prev => {
        updatedMessages = [...prev, userMessage];
        return updatedMessages;
      });
      
      // Set "typing" state to true
      setIsTyping(true);
      
      // Wysyłamy kompletną historię wiadomości do API
      try {
        const aiResponse = await sendPromptToAI(updatedMessages);
        console.log("AI response received:", aiResponse?.substring(0, 100) + "...");
        
        // Add AI response to history
        const aiMessage = { content: aiResponse, isUser: false, timestamp: new Date() };
        setMessages(prev => [...prev, aiMessage]);
        
        // Ekstrakcja kodu Solidity
        const code = extractCodeFromResponse(aiResponse);
        
        if (code) {
          console.log('Extracted code type:', 
            code.includes('addLiquidity') && code.includes('swapAforB') ? 'liquidity pool' : 'token');
          
          // Jeśli to kod pool'a, ekstrahuj też adresy tokenów
          if (code.includes('addLiquidity') && code.includes('swapAforB')) {
            const tokenAddresses = extractTokenAddresses(code);
            console.log('Extracted token addresses:', tokenAddresses);
            
            // Przekaż kompletny kod do onCodeGenerated
            onCodeGenerated(code);
          } else {
            // Jeśli to standardowy token, przekaż tylko kod
            onCodeGenerated(code);
          }
        }
        
        return aiResponse;
      } catch (apiError) {
        console.error('API communication error:', apiError);
        
        // Sprawdź czy to problem z połączeniem
        if (apiError.message.includes('Network Error') || apiError.code === 'ECONNABORTED') {
          throw new Error('Network connection issue. Please check your internet connection and try again.');
        }
        
        // Sprawdź czy to błąd limitu API
        if (apiError.response && apiError.response.status === 429) {
          throw new Error('You\'ve reached the API rate limit. Please wait a moment before sending another message.');
        }
        
        // Inne błędy API
        throw new Error(`AI service error: ${apiError.message}`);
      }
    } catch (error) {
      console.error('Error in sendMessage:', error);
      
      // Add error message
      setMessages(prev => [
        ...prev, 
        { 
          content: `Error: ${error.message || 'An unexpected error occurred. Please try again.'}`, 
          isUser: false, 
          isError: true, 
          timestamp: new Date() 
        }
      ]);
      
      throw error;
    } finally {
      setIsTyping(false);
    }
  }, [onCodeGenerated, extractCodeFromResponse]);

  // Function to clear chat history
  const clearChat = useCallback(() => {
    setMessages([]);
    localStorage.removeItem('aiChatHistory');
  }, []);

  return {
    messages,
    sendMessage,
    isTyping,
    suggestedPrompts,
    clearChat
  };
}; 