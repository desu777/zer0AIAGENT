import React from 'react';
import { CheckCircle2, Copy } from 'lucide-react';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { oneDark, oneLight } from 'react-syntax-highlighter/dist/esm/styles/prism';

const ChatMessage = ({ message, theme }) => {
  const [copyStatus, setCopyStatus] = React.useState({});
  
  // Handle code copy
  const handleCopyCode = (code, blockId) => {
    navigator.clipboard.writeText(code).then(() => {
      setCopyStatus({ [blockId]: true });
      setTimeout(() => setCopyStatus({ [blockId]: false }), 2000);
    });
  };
  
  // Process message content for code blocks
  const processMessageContent = (content) => {
    if (!content) return [];
    
    const codeBlockRegex = /```([a-zA-Z]*)\n([\s\S]*?)```/g;
    const parts = [];
    let lastIndex = 0;
    let match;
    let codeBlockCounter = 0;
    
    while ((match = codeBlockRegex.exec(content)) !== null) {
      if (match.index > lastIndex) {
        parts.push({
          type: 'text',
          content: content.slice(lastIndex, match.index)
        });
      }
      
      const language = match[1] || 'javascript';
      const code = match[2].trim();
      const blockId = `code-block-${codeBlockCounter++}`;
      
      parts.push({
        type: 'code',
        language,
        content: code,
        id: blockId
      });
      
      lastIndex = match.index + match[0].length;
    }
    
    if (lastIndex < content.length) {
      parts.push({
        type: 'text',
        content: content.slice(lastIndex)
      });
    }
    
    return parts;
  };
  
  const parsedContent = processMessageContent(message.content);
  
  // Style for zer0 message bubble with soft gradient
  const zer0MessageStyle = {
    background: message.isUser ? theme.bg.main : 'linear-gradient(135deg, rgba(240,248,255,0.9), rgba(255,240,245,0.9))',
    color: message.isUser ? theme.bg.text : '#333',
    borderRadius: '16px',
    padding: '16px',
    maxWidth: '90%',
    width: 'fit-content',
    marginLeft: message.isUser ? 'auto' : '0',
    marginRight: message.isUser ? '0' : 'auto',
    border: message.isUser ? 'none' : '1px solid rgba(255,105,180,0.2)',
    boxShadow: message.isUser ? 'none' : '0 2px 10px rgba(0,0,0,0.05)',
    position: 'relative',
    overflow: 'hidden'
  };
  
  // Floating effect for zer0's messages
  const floatingEffectStyle = !message.isUser ? {
    content: '""',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundImage: 'radial-gradient(circle at 20% 30%, rgba(135,206,250,0.2) 0%, transparent 40%), radial-gradient(circle at 80% 70%, rgba(255,182,193,0.2) 0%, transparent 40%)',
    pointerEvents: 'none',
    zIndex: 0
  } : {};

  return (
    <div style={{
      display: 'flex',
      flexDirection: message.isUser ? 'row-reverse' : 'row',
      marginBottom: '20px',
      position: 'relative'
    }}>
      {/* Avatar */}
      <div style={{
        width: message.isUser ? '36px' : '48px',
        height: message.isUser ? '36px' : '48px',
        borderRadius: '50%',
        marginRight: message.isUser ? '0' : '10px',
        marginLeft: message.isUser ? '10px' : '0',
        backgroundColor: message.isUser ? theme.primary.light : 'transparent',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: message.isUser ? theme.primary.main : '#fff',
        fontWeight: 'bold',
        fontSize: '14px',
      }}>
        {message.isUser ? 'You' : (
          <div style={{
            width: '48px',
            height: '48px',
            borderRadius: '50%',
            position: 'relative',
            border: '1px solid rgba(255, 105, 180, 0.3)',
            overflow: 'hidden',
            animation: 'floatAnimation 4s ease-in-out infinite, glowAnimation 3s ease-in-out infinite',
          }}>
            <img 
              src="/zer0.jpg" 
              alt="zer0"
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'cover',
                borderRadius: '50%'
              }}
            />
          </div>
        )}
      </div>
      
      {/* Message content */}
      <div style={zer0MessageStyle}>
        {!message.isUser && <div style={floatingEffectStyle}></div>}
        <div style={{ position: 'relative', zIndex: 1 }}>
          {parsedContent.map((part, index) => {
            if (part.type === 'text') {
              return (
                <div key={`text-${index}`} style={{
                  whiteSpace: 'pre-wrap',
                  lineHeight: '1.6',
                  fontSize: '14px'
                }}>
                  {part.content}
                </div>
              );
            } else if (part.type === 'code') {
              const isCopied = copyStatus[part.id];
              return (
                <div key={`code-${index}`} style={{
                  position: 'relative',
                  margin: '16px 0',
                  borderRadius: '8px',
                  overflow: 'hidden'
                }}>
                  <div 
                    style={{
                      position: 'absolute',
                      top: '8px',
                      right: '8px',
                      zIndex: 10,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      width: '28px',
                      height: '28px',
                      borderRadius: '4px',
                      backgroundColor: theme.bg.main === '#050505' ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)',
                      cursor: 'pointer',
                      transition: 'all 0.2s ease'
                    }}
                    onClick={() => handleCopyCode(part.content, part.id)}
                  >
                    {isCopied ? <CheckCircle2 size={14} color="#10b981" /> : <Copy size={14} color={theme.system.text} />}
                  </div>
                  <SyntaxHighlighter
                    language={part.language}
                    style={theme.bg.main === '#050505' ? oneDark : oneLight}
                    customStyle={{
                      margin: 0,
                      borderRadius: '8px',
                      fontSize: '13px'
                    }}
                  >
                    {part.content}
                  </SyntaxHighlighter>
                </div>
              );
            }
            return null;
          })}
        </div>
      </div>
    </div>
  );
};

export default ChatMessage; 