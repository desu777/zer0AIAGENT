import { useState, useCallback, useEffect } from 'react';
import { sendPromptToAI, suggestedPrompts as defaultSuggestions } from '../services/aiService';

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

  // Function to send messages to AI
  const sendMessage = useCallback(async (content) => {
    try {
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
      const aiResponse = await sendPromptToAI(updatedMessages);
      
      // Add AI response to history
      const aiMessage = { content: aiResponse, isUser: false, timestamp: new Date() };
      setMessages(prev => [...prev, aiMessage]);
      
      // Check if the message contains Solidity code and pass it
      const codeMatch = aiResponse.match(/```solidity\n([\s\S]*?)```/);
      if (codeMatch && codeMatch[1]) {
        onCodeGenerated(codeMatch[1]);
      }
      
      return aiResponse;
    } catch (error) {
      console.error('Error communicating with AI:', error);
      
      // Add error message
      setMessages(prev => [
        ...prev, 
        { 
          content: 'An error occurred while communicating with AI. Please try again.', 
          isUser: false, 
          isError: true, 
          timestamp: new Date() 
        }
      ]);
      
      throw error;
    } finally {
      setIsTyping(false);
    }
  }, [onCodeGenerated]); // Removed messages from dependencies to avoid loops

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