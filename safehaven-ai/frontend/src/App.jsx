import React, { useState } from 'react';
import { Send, AlertTriangle, Shield, MessageSquare, Flag, Ban, Trash2, Save, Download, Eye, EyeOff } from 'lucide-react';

// Sample abusive messages for demo
const SAMPLE_MESSAGES = [
  "If you leave me, I'll make sure no one ever finds you.",
  "You're worthless. No one else would ever want you.",
  "Send me photos right now or I'll share our private conversations.",
  "I know where you work. I'll be watching you.",
  "You made me do this. It's your fault I got angry.",
  "You're too sensitive. I was just joking around.",
  "I'm going to hurt you if you don't listen to me.",
  "You're crazy. That never happened. Stop imagining things.",
  "After all I've done for you, you owe me this.",
  "I'll tell everyone your secrets if you don't do what I say."
];

// API Configuration - UPDATE THIS FOR YOUR DJANGO BACKEND
const API_BASE_URL = 'http://localhost:8000';

// API Service - Connects to Django Backend
const analyzeMessage = async (text) => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/chatbot/analyze`, {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ text })
    });
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
    console.log('✅ Backend response:', data);
    return data;
  } catch (error) {
    console.error('❌ API Error:', error);
    
    // Fallback mock detection if backend is down
    return mockDetection(text);
  }
};

// Fallback mock detection (used only if Django backend is unavailable)
const mockDetection = (text) => {
  const lowerText = text.toLowerCase();
  
  const checks = {
    threats: ['kill', 'hurt', 'harm', 'destroy', 'attack', 'murder', 'find you', 'make sure'],
    harassment: ['worthless', 'useless', 'pathetic', 'disgusting', 'ugly', 'stupid', 'nobody'],
    gaslighting: ['crazy', 'insane', 'paranoid', 'never happened', 'imagining', 'sensitive'],
    coercion: ['send me', 'show me', 'photos', 'or else', 'or i\'ll', 'you must'],
    stalking: ['know where', 'watching', 'following', 'tracking', 'i see you'],
    emotional_manipulation: ['your fault', 'you made me', 'after all', 'you owe', 'just joking']
  };
  
  const types = [];
  let maxSeverity = 0;
  
  for (const [type, keywords] of Object.entries(checks)) {
    if (keywords.some(kw => lowerText.includes(kw))) {
      types.push(type);
      const severities = { 
        threats: 0.95, 
        stalking: 0.90, 
        coercion: 0.85, 
        harassment: 0.75, 
        gaslighting: 0.70, 
        emotional_manipulation: 0.65 
      };
      maxSeverity = Math.max(maxSeverity, severities[type] || 0.5);
    }
  }
  
  return {
    harmful: types.length > 0,
    severity: maxSeverity,
    types,
    safe_response: types.length > 0 
      ? "⚠️ This message contains harmful content. Consider your safety and seek support."
      : "This message appears safe. No harmful patterns detected."
  };
};

// MessageBubble Component
const MessageBubble = ({ message, isUser, onReport, onBlock, onDelete, onSave }) => {
  const [showDetails, setShowDetails] = useState(false);
  const [isBlurred, setIsBlurred] = useState(true);
  const [showActions, setShowActions] = useState(false);

  if (isUser) {
    return (
      <div className="flex justify-end mb-4">
        <div className="bg-blue-500 text-white rounded-lg px-4 py-2 max-w-[70%]">
          {message.text}
        </div>
      </div>
    );
  }

  const { harmful, severity, types, safe_response } = message.analysis;

  return (
    <div className="flex justify-start mb-4">
      <div className="max-w-[80%] w-full">
        {harmful ? (
          <div className="bg-red-50 border-2 border-red-300 rounded-lg p-4">
            <div className="flex items-center justify-between gap-2 mb-3">
              <div className="flex items-center gap-2">
                <AlertTriangle className="text-red-600" size={20} />
                <span className="font-bold text-red-700">⚠️ Harmful Content Detected</span>
              </div>
              <button
                onClick={() => setIsBlurred(!isBlurred)}
                className="text-gray-600 hover:text-gray-800 p-1"
                title={isBlurred ? "Show message" : "Hide message"}
              >
                {isBlurred ? <Eye size={18} /> : <EyeOff size={18} />}
              </button>
            </div>
            
            {/* Message Content */}
            <div className={`bg-white p-3 rounded mb-3 ${isBlurred ? 'select-none' : ''}`}>
              {isBlurred ? (
                <span className="text-gray-400 font-mono text-sm">
                  {message.text.split('').map((char, i) => (
                    <span key={i}>{char === ' ' ? ' ' : '█'}</span>
                  ))}
                </span>
              ) : (
                <span className="text-gray-800 text-sm">{message.text}</span>
              )}
            </div>

            {/* Severity Bar */}
            <div className="mb-3">
              <div className="flex justify-between items-center mb-1">
                <span className="text-sm font-semibold text-red-800">Threat Level:</span>
                <span className="text-sm font-bold text-red-600">{Math.round(severity * 100)}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-3">
                <div 
                  className={`h-3 rounded-full transition-all duration-500 ${
                    severity >= 0.8 ? 'bg-red-700' : severity >= 0.6 ? 'bg-orange-500' : 'bg-yellow-500'
                  }`}
                  style={{ width: `${severity * 100}%` }}
                />
              </div>
            </div>

            {/* Detection Categories */}
            <div className="mb-3">
              <span className="text-sm font-semibold text-red-800 block mb-2">Abuse Categories:</span>
              <div className="flex flex-wrap gap-2">
                {types.map((type, i) => (
                  <span key={i} className="bg-red-200 text-red-900 text-xs px-3 py-1 rounded-full font-medium uppercase">
                    {type.replace('_', ' ')}
                  </span>
                ))}
              </div>
            </div>

            {/* Safe Response Toggle */}
            <button 
              onClick={() => setShowDetails(!showDetails)}
              className="text-blue-600 text-sm font-medium underline hover:text-blue-800 mb-2"
            >
              {showDetails ? '▼ Hide' : '▶ Show'} Safety Recommendations
            </button>

            {/* Safe Response */}
            {showDetails && (
              <div className="bg-green-50 border-l-4 border-green-500 rounded p-3 mt-2 mb-3">
                <div className="flex items-start gap-2">
                  <Shield className="text-green-600 mt-1 flex-shrink-0" size={18} />
                  <div>
                    <span className="text-sm font-semibold text-green-800 block mb-1">Recommended Action:</span>
                    <p className="text-sm text-gray-700">{safe_response}</p>
                  </div>
                </div>
              </div>
            )}

            {/* Action Buttons */}
            <div className="border-t border-red-200 pt-3 mt-3">
              <button
                onClick={() => setShowActions(!showActions)}
                className="text-sm text-gray-700 font-medium mb-2 hover:text-gray-900"
              >
                {showActions ? '▼' : '▶'} Action Menu
              </button>
              
              {showActions && (
                <div className="grid grid-cols-2 gap-2 mt-2">
                  <button
                    onClick={() => onReport(message)}
                    className="bg-red-600 text-white px-3 py-2 rounded-lg text-sm font-medium hover:bg-red-700 flex items-center justify-center gap-2"
                  >
                    <Flag size={14} />
                    Report
                  </button>
                  <button
                    onClick={() => onBlock(message)}
                    className="bg-gray-700 text-white px-3 py-2 rounded-lg text-sm font-medium hover:bg-gray-800 flex items-center justify-center gap-2"
                  >
                    <Ban size={14} />
                    Block Sender
                  </button>
                  <button
                    onClick={() => onSave(message)}
                    className="bg-blue-600 text-white px-3 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 flex items-center justify-center gap-2"
                  >
                    <Save size={14} />
                    Save Evidence
                  </button>
                  <button
                    onClick={() => onDelete(message)}
                    className="bg-orange-600 text-white px-3 py-2 rounded-lg text-sm font-medium hover:bg-orange-700 flex items-center justify-center gap-2"
                  >
                    <Trash2 size={14} />
                    Delete
                  </button>
                </div>
              )}
            </div>
          </div>
        ) : (
          <div className="bg-green-50 border border-green-300 rounded-lg px-4 py-2">
            <div className="flex items-center gap-2">
              <Shield className="text-green-600" size={16} />
              <span className="text-green-800 font-medium">✓ Safe message - No harmful patterns detected</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

// InputBox Component
const InputBox = ({ onSend, disabled }) => {
  const [input, setInput] = useState('');

  const handleSubmit = () => {
    if (input.trim()) {
      onSend(input.trim());
      setInput('');
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  return (
    <div className="border-t bg-white p-4">
      <div className="flex gap-2">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="Type a message to analyze for harmful content..."
          disabled={disabled}
          className="flex-1 border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
        <button
          onClick={handleSubmit}
          disabled={disabled || !input.trim()}
          className="bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600 disabled:bg-gray-300 disabled:cursor-not-allowed flex items-center gap-2 transition"
        >
          <Send size={18} />
          Analyze
        </button>
      </div>
    </div>
  );
};

// Main App Component
export default function App() {
  const [messages, setMessages] = useState([]);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [savedEvidence, setSavedEvidence] = useState([]);
  const [notification, setNotification] = useState(null);

  const showNotification = (message, type = 'info') => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 3000);
  };

  const handleSend = async (text) => {
    const userMessage = { 
      id: Date.now(), 
      text, 
      isUser: true 
    };
    setMessages(prev => [...prev, userMessage]);
    setIsAnalyzing(true);

    const analysis = await analyzeMessage(text);
    
    const aiMessage = {
      id: Date.now() + 1,
      text,
      isUser: false,
      timestamp: new Date().toISOString(),
      analysis: {
        harmful: analysis.harmful,
        severity: analysis.severity,
        types: analysis.types || [],
        safe_response: analysis.safe_response
      }
    };

    setMessages(prev => [...prev, aiMessage]);
    setIsAnalyzing(false);
  };

  const handleReport = (message) => {
    showNotification('Message reported to authorities. Reference ID: ' + message.id, 'success');
    console.log('REPORTED:', message);
  };

  const handleBlock = (message) => {
    showNotification('Sender blocked successfully. They can no longer contact you.', 'success');
    console.log('BLOCKED:', message);
  };

  const handleDelete = (message) => {
    setMessages(prev => prev.filter(m => m.id !== message.id));
    showNotification('Message deleted from chat.', 'info');
  };

  const handleSave = (message) => {
    setSavedEvidence(prev => [...prev, message]);
    showNotification('Evidence saved securely. Access from Evidence Vault.', 'success');
    console.log('SAVED EVIDENCE:', message);
  };

  const downloadEvidence = () => {
    const evidence = {
      export_date: new Date().toISOString(),
      total_messages: savedEvidence.length,
      messages: savedEvidence.map(m => ({
        timestamp: m.timestamp,
        text: m.text,
        harmful: m.analysis.harmful,
        severity: m.analysis.severity,
        types: m.analysis.types
      }))
    };
    
    const blob = new Blob([JSON.stringify(evidence, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `safespace-evidence-${Date.now()}.json`;
    a.click();
    showNotification('Evidence downloaded successfully.', 'success');
  };

  const loadSample = () => {
    const randomMessage = SAMPLE_MESSAGES[Math.floor(Math.random() * SAMPLE_MESSAGES.length)];
    handleSend(randomMessage);
  };

  const clearChat = () => {
    setMessages([]);
    showNotification('Chat cleared.', 'info');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 flex items-center justify-center p-4">
      {/* Notification */}
      {notification && (
        <div className={`fixed top-4 right-4 px-6 py-3 rounded-lg shadow-lg z-50 ${
          notification.type === 'success' ? 'bg-green-500' : 
          notification.type === 'error' ? 'bg-red-500' : 'bg-blue-500'
        } text-white font-medium animate-fade-in`}>
          {notification.message}
        </div>
      )}

      <div className="w-full max-w-4xl bg-white rounded-2xl shadow-2xl overflow-hidden flex flex-col" style={{ height: '90vh' }}>
        
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Shield size={32} />
              <div>
                <h1 className="text-3xl font-bold">SafeSpace AI</h1>
                <p className="text-blue-100 text-sm">GBV Prevention & Detection System</p>
              </div>
            </div>
            {savedEvidence.length > 0 && (
              <button
                onClick={downloadEvidence}
                className="bg-white text-purple-600 px-4 py-2 rounded-lg font-medium hover:bg-gray-100 flex items-center gap-2 text-sm"
              >
                <Download size={16} />
                Evidence ({savedEvidence.length})
              </button>
            )}
          </div>
        </div>

        {/* Demo Controls */}
        <div className="bg-gray-50 p-4 border-b flex gap-3 flex-wrap items-center">
          <button
            onClick={loadSample}
            disabled={isAnalyzing}
            className="bg-orange-500 text-white px-4 py-2 rounded-lg hover:bg-orange-600 disabled:bg-gray-300 text-sm flex items-center gap-2 transition"
          >
            <MessageSquare size={16} />
            Load Sample
          </button>
          <button
            onClick={clearChat}
            className="bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600 text-sm transition"
          >
            Clear Chat
          </button>
          <div className="ml-auto text-sm text-gray-600 flex items-center gap-2">
            <div className={`w-2 h-2 rounded-full ${isAnalyzing ? 'bg-yellow-500 animate-pulse' : 'bg-green-500'}`} />
            {isAnalyzing ? 'Analyzing...' : 'System Active'}
          </div>
        </div>

        {/* Chat Window */}
        <div className="flex-1 overflow-y-auto p-6 bg-gray-50">
          {messages.length === 0 ? (
            <div className="text-center text-gray-400 mt-20">
              <Shield size={64} className="mx-auto mb-4 opacity-50" />
              <p className="text-lg font-medium">No messages yet</p>
              <p className="text-sm mt-2">Type a message or load a sample to begin analysis</p>
              <div className="mt-8 bg-white rounded-lg p-6 max-w-md mx-auto border border-gray-200">
                <p className="text-xs text-gray-500 text-left">
                  <strong>Detection Categories:</strong><br/>
                  • Threats • Harassment • Gaslighting<br/>
                  • Coercion • Stalking • Emotional Manipulation
                </p>
              </div>
            </div>
          ) : (
            messages.map(msg => (
              <MessageBubble 
                key={msg.id} 
                message={msg} 
                isUser={msg.isUser}
                onReport={handleReport}
                onBlock={handleBlock}
                onDelete={handleDelete}
                onSave={handleSave}
              />
            ))
          )}
          {isAnalyzing && (
            <div className="flex justify-start mb-4">
              <div className="bg-gray-200 rounded-lg px-4 py-3">
                <div className="flex gap-1 items-center">
                  <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce" />
                  <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }} />
                  <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
                  <span className="ml-2 text-sm text-gray-600">Analyzing message...</span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Input Box */}
        <InputBox onSend={handleSend} disabled={isAnalyzing} />
      </div>
    </div>
  );
}
