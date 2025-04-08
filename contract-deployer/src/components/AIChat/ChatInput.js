import React, { useState, useRef, useEffect } from 'react';
import { Send } from 'lucide-react';

const ChatInput = ({ sendMessage, theme, isTyping }) => {
  const [inputValue, setInputValue] = useState('');
  const inputRef = useRef(null);
  
  // Auto-focus on input after loading
  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, []);

  // Function to send message
  const handleSendMessage = async () => {
    if (inputValue.trim() && !isTyping) {
      try {
        setInputValue(''); // Wcześniej czyścimy input, aby nie klikać podwójnie
        await sendMessage(inputValue.trim());
      } catch (error) {
        console.error('Error sending message from input:', error);
        // Input już jest pusty, więc nie musimy go przywracać
      }
    }
  };

  // Handle Enter key (without Shift)
  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  // Adjust textarea height to content
  const adjustHeight = (e) => {
    const element = e.target;
    element.style.height = 'auto';
    element.style.height = (element.scrollHeight) + 'px';
  };

  return (
    <div style={{
      position: 'relative',
      marginTop: 'auto'
    }}>
      <textarea
        ref={inputRef}
        value={inputValue}
        onChange={(e) => {
          setInputValue(e.target.value);
          adjustHeight(e);
        }}
        onKeyDown={handleKeyDown}
        placeholder={isTyping ? "zer0 is floating around with ideas..." : "Tell me what contract you'd like to create!"}
        disabled={isTyping}
        style={{
          width: '100%',
          resize: 'none',
          minHeight: '56px',
          maxHeight: '150px',
          overflowY: 'auto',
          backgroundColor: theme.bg.secondary,
          color: theme.bg.text,
          border: `1px solid ${theme.bg.main === '#050505' ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)'}`,
          borderRadius: '16px',
          padding: '16px 48px 16px 16px',
          outline: 'none',
          fontSize: '14px',
          fontFamily: 'inherit',
          boxSizing: 'border-box'
        }}
      />
      <button
        onClick={handleSendMessage}
        disabled={!inputValue.trim() || isTyping}
        style={{
          position: 'absolute',
          right: '12px',
          bottom: '12px',
          background: 'linear-gradient(135deg, #1e90ff, #ff69b4)',
          border: 'none',
          borderRadius: '50%',
          width: '32px',
          height: '32px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          cursor: !inputValue.trim() || isTyping ? 'not-allowed' : 'pointer',
          opacity: !inputValue.trim() || isTyping ? 0.5 : 1,
          color: 'white',
          transition: 'all 0.2s ease',
          boxShadow: '0 2px 8px rgba(255,105,180,0.3)'
        }}
      >
        <Send size={16} />
      </button>
    </div>
  );
};

export default ChatInput; 