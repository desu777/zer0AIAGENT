import React, { useRef, useEffect, useState } from 'react';
import ChatMessage from './ChatMessage';
import ChatInput from './ChatInput';
import Panel from '../Shared/Panel';
import Button from '../Shared/Button';
import { RefreshCw, ArrowDown } from 'lucide-react';

const AIChat = ({ 
  messages, 
  sendMessage, 
  isTyping, 
  suggestedPrompts, 
  clearChat,
  theme 
}) => {
  const messagesEndRef = useRef(null);
  const [autoScroll, setAutoScroll] = useState(false);
  const messagesContainerRef = useRef(null);
  const [isAtBottom, setIsAtBottom] = useState(true);
  
  // Only scroll to the newest message if autoScroll is enabled
  useEffect(() => {
    if (autoScroll && messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, autoScroll]);
  
  // Check if scrolled to bottom
  useEffect(() => {
    const handleScroll = () => {
      if (messagesContainerRef.current) {
        const { scrollTop, scrollHeight, clientHeight } = messagesContainerRef.current;
        const atBottom = Math.abs(scrollHeight - clientHeight - scrollTop) < 50;
        setIsAtBottom(atBottom);
      }
    };
    
    const container = messagesContainerRef.current;
    if (container) {
      container.addEventListener('scroll', handleScroll);
      return () => container.removeEventListener('scroll', handleScroll);
    }
  }, []);
  
  // Enhanced CSS for the anime-style character
  const zeroCssStyle = `
    @keyframes floatAnimation {
      0% { transform: translateY(0px) rotate(0deg); }
      25% { transform: translateY(-5px) rotate(-2deg); }
      50% { transform: translateY(-10px) rotate(0deg); }
      75% { transform: translateY(-5px) rotate(2deg); }
      100% { transform: translateY(0px) rotate(0deg); }
    }
    
    @keyframes glowAnimation {
      0% { box-shadow: 0 0 5px rgba(255, 105, 180, 0.5); }
      50% { box-shadow: 0 0 15px rgba(255, 105, 180, 0.8), 0 0 25px rgba(173, 216, 230, 0.4); }
      100% { box-shadow: 0 0 5px rgba(255, 105, 180, 0.5); }
    }
    
    /* Custom scrollbar styles */
    .messages-container::-webkit-scrollbar {
      width: 8px;
    }
    
    .messages-container::-webkit-scrollbar-track {
      background: ${theme.bg.main === '#050505' ? '#333' : '#e0e0e0'};
      border-radius: 4px;
    }
    
    .messages-container::-webkit-scrollbar-thumb {
      background: ${theme.bg.main === '#050505' ? '#555' : '#bdbdbd'};
      border-radius: 4px;
    }
    
    .messages-container::-webkit-scrollbar-thumb:hover {
      background: ${theme.bg.main === '#050505' ? '#777' : '#9e9e9e'};
    }
  `;

  return (
    <Panel theme={theme} title={
      <div style={{ 
        display: 'flex', 
        alignItems: 'center', 
        gap: '8px',
        justifyContent: 'center',
        width: '100%'
      }}>
        <div 
          style={{
            width: "56px",
            height: "56px",
            borderRadius: '50%',
            position: 'relative',
            animation: 'floatAnimation 4s ease-in-out infinite, glowAnimation 3s ease-in-out infinite',
            border: '1px solid rgba(255, 105, 180, 0.3)',
            overflow: 'hidden'
          }}
        >
          <img 
            src={theme.bg.main === '#050505' ? "/zer0.jpg" : "/zer02.jpg"}
            alt="zer0"
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              borderRadius: '50%'
            }}
          />
        </div>
        <style>{zeroCssStyle}</style>
        <span style={{ 
          background: 'linear-gradient(90deg, #1e90ff, #ff69b4)', 
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          fontWeight: 'bold'
        }}>
          zer0 Assistant
        </span>
      </div>
    }>
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        height: '600px',
      }}>
        {/* Action buttons */}
        <div style={{
          display: 'flex',
          justifyContent: 'flex-end',
          marginBottom: '12px'
        }}>
          <Button
            onClick={clearChat}
            variant="secondary"
            size="small"
            icon={<RefreshCw size={14} />}
            theme={theme}
            disabled={messages.length === 0 || isTyping}
          >
            Clear chat
          </Button>
        </div>
        
        {/* Messages container */}
        <div 
          ref={messagesContainerRef}
          className="messages-container"
          style={{
            flex: 1,
            overflowY: 'auto',
            padding: '16px',
            backgroundColor: theme.bg.secondary,
            borderRadius: '16px',
            marginBottom: '16px',
            position: 'relative'
          }}
        >
          {messages.length === 0 ? (
            <div style={{
              color: theme.system.text,
              textAlign: 'center',
              marginTop: '32px'
            }}>
              <h3 style={{ 
                background: 'linear-gradient(90deg, #1e90ff, #ff69b4)', 
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                display: 'inline-block'
              }}>
                zer0 Contract Assistant
              </h3>
              <p>I'm zer0! Tell me what smart contract you'd like to create, and I'll help you build it with a smile!</p>
              <div style={{
                display: 'flex',
                flexWrap: 'wrap',
                gap: '8px',
                justifyContent: 'center',
                marginTop: '24px'
              }}>
                {suggestedPrompts.map((prompt, index) => (
                  <button
                    key={index}
                    onClick={async () => {
                      try {
                        console.log("Sending suggested prompt:", prompt);
                        await sendMessage(prompt.trim());
                      } catch (error) {
                        console.error('Error sending suggested prompt:', error);
                      }
                    }}
                    style={{
                      background: theme.primary.light,
                      color: theme.primary.main,
                      border: 'none',
                      borderRadius: '16px',
                      padding: '8px 12px',
                      fontSize: '14px',
                      cursor: 'pointer',
                      transition: 'transform 0.2s ease',
                      ':hover': {
                        transform: 'translateY(-2px)'
                      }
                    }}
                  >
                    {prompt}
                  </button>
                ))}
              </div>
            </div>
          ) : (
            <>
              {messages.map((message, index) => (
                <ChatMessage 
                  key={index}
                  message={message} 
                  theme={theme}
                />
              ))}
              
              {/* Scroll to bottom button */}
              {messages.length > 2 && !isAtBottom && (
                <Button
                  onClick={() => {
                    setAutoScroll(true);
                    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
                    setTimeout(() => setAutoScroll(false), 1000);
                  }}
                  variant="secondary"
                  size="small"
                  icon={<ArrowDown size={14} />}
                  theme={theme}
                  style={{
                    position: 'sticky',
                    bottom: '10px',
                    left: '50%',
                    transform: 'translateX(-50%)',
                    opacity: 0.7,
                    zIndex: 5
                  }}
                >
                  Latest
                </Button>
              )}
            </>
          )}
          
          {isTyping && (
            <div style={{
              color: theme.system.text,
              fontSize: '14px',
              padding: '8px',
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}>
              <div className="typing-indicator">
                <span style={{
                  display: 'inline-block',
                  width: '8px',
                  height: '8px',
                  borderRadius: '50%',
                  background: 'linear-gradient(135deg, #1e90ff, #ff69b4)',
                  animation: 'typingAnimation 1.4s infinite both',
                  marginRight: '4px',
                  animationDelay: '0s'
                }}></span>
                <span style={{
                  display: 'inline-block',
                  width: '8px',
                  height: '8px',
                  borderRadius: '50%',
                  background: 'linear-gradient(135deg, #1e90ff, #ff69b4)',
                  animation: 'typingAnimation 1.4s infinite both',
                  marginRight: '4px',
                  animationDelay: '0.2s'
                }}></span>
                <span style={{
                  display: 'inline-block',
                  width: '8px',
                  height: '8px',
                  borderRadius: '50%',
                  background: 'linear-gradient(135deg, #1e90ff, #ff69b4)',
                  animation: 'typingAnimation 1.4s infinite both',
                  marginRight: '4px',
                  animationDelay: '0.4s'
                }}></span>
                <style>{`
                  @keyframes typingAnimation {
                    0%, 100% { transform: translateY(0); }
                    50% { transform: translateY(-5px); }
                  }
                `}</style>
              </div>
              zer0 is thinking...
            </div>
          )}
          
          <div ref={messagesEndRef} />
        </div>
        
        {/* Message input */}
        <ChatInput 
          sendMessage={sendMessage} 
          theme={theme}
          isTyping={isTyping}
        />
      </div>
    </Panel>
  );
};

export default AIChat; 