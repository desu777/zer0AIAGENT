import React from 'react';

const ChatMessage = ({ message, theme }) => {
  const { content, isUser, isError, timestamp } = message;
  
  // CSS for animation effects
  const zeroCssStyle = `
    @keyframes floatAnimation {
      0% { transform: translateY(0px) rotate(0deg); }
      25% { transform: translateY(-3px) rotate(-1deg); }
      50% { transform: translateY(-5px) rotate(0deg); }
      75% { transform: translateY(-3px) rotate(1deg); }
      100% { transform: translateY(0px) rotate(0deg); }
    }
    
    @keyframes glowAnimation {
      0% { box-shadow: 0 0 3px rgba(255, 105, 180, 0.5); }
      50% { box-shadow: 0 0 10px rgba(255, 105, 180, 0.8), 0 0 15px rgba(173, 216, 230, 0.4); }
      100% { box-shadow: 0 0 3px rgba(255, 105, 180, 0.5); }
    }
  `;
  
  // Funkcja formatująca czas
  const formatTime = (date) => {
    if (!date) return '';
    const time = new Date(date);
    return time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };
  
  // Funkcja formatująca kod w wiadomości - wrapa kod w odpowiednie tagi
  const formatMessage = (content) => {
    if (!content) return '';

    // Wykrywanie bloków kodu Solidity i dodawanie kolorowania składni
    let formattedContent = content.replace(
      /```solidity\n([\s\S]*?)```/g, 
      (match, code) => {
        return `<pre style="
          background-color: ${theme.bg.main === '#050505' ? '#121212' : '#f5f5f5'};
          padding: 12px;
          border-radius: 8px;
          overflow-x: auto;
          font-family: monospace;
          margin: 16px 0;
          border-left: 4px solid ${theme.primary.main};
        "><code>${escapeHtml(code)}</code></pre>`;
      }
    );
    
    // Wykrywanie bloków kodu bez określonego języka
    formattedContent = formattedContent.replace(
      /```([\s\S]*?)```/g, 
      (match, code) => {
        return `<pre style="
          background-color: ${theme.bg.main === '#050505' ? '#121212' : '#f5f5f5'};
          padding: 12px;
          border-radius: 8px;
          overflow-x: auto;
          font-family: monospace;
          margin: 16px 0;
        "><code>${escapeHtml(code)}</code></pre>`;
      }
    );
    
    // Wykrywanie tekstu w jednej linii z tickami
    formattedContent = formattedContent.replace(
      /`([^`]+)`/g, 
      (match, code) => {
        return `<code style="
          background-color: ${theme.bg.main === '#050505' ? '#121212' : '#f5f5f5'};
          padding: 2px 4px;
          border-radius: 4px;
          font-family: monospace;
        ">${escapeHtml(code)}</code>`;
      }
    );
    
    return formattedContent;
  };
  
  // Funkcja do escapowania znaków HTML
  const escapeHtml = (unsafe) => {
    return unsafe
         .replace(/&/g, "&amp;")
         .replace(/</g, "&lt;")
         .replace(/>/g, "&gt;")
         .replace(/"/g, "&quot;")
         .replace(/'/g, "&#039;");
   };
  
  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: isUser ? 'flex-end' : 'flex-start',
      marginBottom: '16px'
    }}>
      <div style={{
        display: 'flex',
        flexDirection: isUser ? 'row-reverse' : 'row',
        alignItems: 'flex-end',
        maxWidth: '90%'
      }}>
        {/* User or zer0 avatar */}
        {!isError && (
          <div style={{
            width: '28px',
            height: '28px',
            marginRight: isUser ? '0' : '8px',
            marginLeft: isUser ? '8px' : '0',
            marginBottom: '4px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}>
            {isUser ? (
              <div style={{
                width: '28px',
                height: '28px',
                borderRadius: '50%',
                backgroundColor: theme.primary.light,
                color: theme.primary.main,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '12px',
                fontWeight: 'bold'
              }}>
                You
              </div>
            ) : (
              <div style={{
                width: '28px',
                height: '28px',
                borderRadius: '50%',
                overflow: 'hidden',
                border: '1px solid rgba(255, 105, 180, 0.3)',
                animation: 'floatAnimation 4s ease-in-out infinite, glowAnimation 3s ease-in-out infinite',
              }}>
                <img 
                  src={theme.bg.main === '#050505' ? "/zer0.jpg" : "/zer02.jpg"}
                  alt="zer0"
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                  }}
                />
                <style>{zeroCssStyle}</style>
              </div>
            )}
          </div>
        )}
        
        {/* Message bubble */}
        <div style={{
          maxWidth: isUser ? '85%' : '85%',
          backgroundColor: isUser 
            ? theme.primary.light 
            : (isError 
              ? `rgba(${theme.bg.main === '#050505' ? '255, 78, 82, 0.1' : '254, 78, 82, 0.1'})` 
              : theme.bg.main === '#050505' ? theme.bg.panel : theme.bg.panel),
          padding: '12px 16px',
          borderRadius: '16px',
          borderTopRightRadius: isUser ? '4px' : '16px',
          borderTopLeftRadius: !isUser ? '4px' : '16px',
          color: isError 
            ? theme.system.error 
            : theme.bg.text,
          boxShadow: !isUser && !isError ? '0 2px 8px rgba(0,0,0,0.05)' : 'none',
          border: !isUser && !isError ? '1px solid rgba(255,105,180,0.1)' : 'none'
        }}>
          <div 
            dangerouslySetInnerHTML={{ __html: formatMessage(content) }} 
            style={{ 
              fontSize: '14px',
              lineHeight: '1.6'
            }}
          />
        </div>
      </div>
      
      {/* Timestamp */}
      <div style={{
        fontSize: '12px',
        color: theme.system.text,
        marginTop: '4px',
        marginLeft: isUser ? 'auto' : '36px',  // Adjusted to align with the avatar
        marginRight: isUser ? '8px' : 'auto'
      }}>
        {isUser ? 'You' : 'zer0'} • {formatTime(timestamp)}
      </div>
    </div>
  );
};

export default ChatMessage; 