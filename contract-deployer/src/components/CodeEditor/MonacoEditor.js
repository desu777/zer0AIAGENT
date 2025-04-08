import React, { useRef, useEffect } from 'react';
import Editor from "@monaco-editor/react";

const MonacoEditor = ({ 
  value,
  onChange,
  height = "500px",
  language = "solidity",
  theme = "vs-dark",
  options = {}
}) => {
  const editorRef = useRef(null);
  
  // Funkcja do obsługi zmiany wartości edytora
  const handleEditorChange = (value) => {
    if (onChange) {
      onChange(value);
    }
  };
  
  // Funkcja do ustawienia referencji do instancji edytora
  const handleEditorDidMount = (editor) => {
    editorRef.current = editor;
    
    // Opcjonalne: Formatuj kod podczas montowania
    setTimeout(() => {
      editor.getAction('editor.action.formatDocument')?.run();
    }, 300);
  };
  
  // Efekt dla formatowania kodu przy zmianie wartości
  useEffect(() => {
    if (editorRef.current && value) {
      setTimeout(() => {
        editorRef.current.getAction('editor.action.formatDocument')?.run();
      }, 300);
    }
  }, [value]);
  
  return (
    <Editor
      height={height}
      language={language}
      value={value}
      theme={theme}
      onChange={handleEditorChange}
      onMount={handleEditorDidMount}
      options={{
        minimap: { enabled: false },
        scrollBeyondLastLine: false,
        fontSize: 14,
        wordWrap: "on",
        automaticLayout: true,
        tabSize: 2,
        ...options
      }}
    />
  );
};

export default MonacoEditor; 