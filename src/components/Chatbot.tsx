import { useState, useRef, useEffect, useCallback } from 'react';
import { Send, Bot, X } from 'lucide-react';

// --- MOCK UI COMPONENTS (Ensuring single-file runnability) ---
const useToast = () => {
    const [toast, setToast] = useState(null);
    const showToast = useCallback(({ title, description, variant = 'default' }) => {
      setToast({ title, description, variant });
      setTimeout(() => setToast(null), 3500);
    }, []);
    const ToastContainer = () => toast && (
      <div className={`fixed top-4 right-4 p-4 rounded-xl shadow-2xl z-50 transition-all duration-300 ${
        toast.variant === 'destructive' ? 'bg-red-600 text-white' : 'bg-gray-800 text-white'
      }`}>
        <div className="font-semibold">{toast.title}</div>
        <div className="text-sm opacity-90">{toast.description}</div>
      </div>
    );
    return { toast: showToast, ToastContainer };
  };

const Card = ({ children, className = '' }) => <div className={`bg-white dark:bg-gray-800 rounded-xl shadow-2xl transition-all duration-300 ${className}`}>{children}</div>;
const Input = (props) => <input {...props} className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200" />;
const Button = ({ children, onClick, disabled, size = 'default', variant = 'default', className = '' }) => {
    let baseClasses = 'inline-flex items-center justify-center font-semibold rounded-lg transition-all duration-200 focus:outline-none focus:ring-4 ';
    let sizeClasses = size === 'icon' ? 'p-3' : 'px-4 py-2';
    
    if (variant === 'default') {
        baseClasses += ' bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500/50';
    } else if (variant === 'ghost') {
        baseClasses += ' text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700';
    }

    const disabledClasses = disabled ? 'opacity-50 cursor-not-allowed' : '';

    return (
        <button
            onClick={onClick}
            disabled={disabled}
            className={`${baseClasses} ${sizeClasses} ${disabledClasses} ${className}`}
        >
            {children}
        </button>
    );
};
// --- END MOCK UI COMPONENTS ---

// --- AXIOS MOCK FOR RELIABLE API CALLS ---

// Utility function incorporating exponential backoff (like an advanced axios wrapper)
const callApiWithBackoff = async (url, payload, retries = 3) => {
  for (let i = 0; i < retries; i++) {
    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      const data = await response.json();
      if (response.ok) {
        // Return object structured like an Axios response: { data: ... }
        return { data };
      } else {
        throw new Error(data.error?.message || `API returned status ${response.status}`);
      }
    } catch (error) {
      if (i === retries - 1) throw error;
      const delay = Math.pow(2, i) * 1000 + Math.random() * 1000;
      await new Promise(resolve => setTimeout(resolve, delay));
    }
  }
};

// Expose the wrapper function as an 'axios' object for compatibility
const axios = {
    post: callApiWithBackoff
};

const GOOGLE_API_KEY = 'AIzaSyCreeHrx4wyiSjf_cxE6VEmUp74mSb1Mfs';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

const Chatbot = () => {
  const { toast, ToastContainer } = useToast();
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    { role: 'assistant', content: 'Hello! I\'m your AI legal assistant. How can I help you today? Please remember, I cannot give specific legal advice.' }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const sendMessage = async () => {
    if (!input.trim() || loading) return;

    const userMessage = input.trim();
    setInput('');
    setMessages(prev => [...prev, { role: 'user', content: userMessage }]);
    setLoading(true);

    try {
      // --- AXIOS IMPLEMENTATION HERE ---
      const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-05-20:generateContent?key=${GOOGLE_API_KEY}`;
      
      const payload = {
        contents: [{
            parts: [{
                text: `You are a helpful legal assistant. Answer this question concisely. If you cannot provide a definitive legal answer, state that this is not legal advice. Question: ${userMessage}`
            }]
        }],
        tools: [{ "google_search": {} }] // Enable grounding for up-to-date info
      };

      // Using the mocked axios.post (which contains backoff logic)
      const response = await axios.post(apiUrl, payload);
      const data = response.data;
      // --- END AXIOS IMPLEMENTATION ---
      
      const aiResponse = data.candidates?.[0]?.content?.parts?.[0]?.text || 'Error: Could not retrieve a valid response.';
      
      setMessages(prev => [...prev, { role: 'assistant', content: aiResponse }]);
    } catch (error) {
      console.error("Chatbot API Error:", error);
      toast({ title: 'Error', description: 'Failed to get response', variant: 'destructive' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <ToastContainer />
      <Button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 h-14 w-14 rounded-full shadow-2xl z-50 bg-blue-600 hover:bg-blue-700 transition-all duration-300"
        size="icon"
      >
        <Bot className="h-6 w-6" />
      </Button>

      {isOpen && (
        <Card className="fixed bottom-24 right-6 w-80 md:w-96 h-[500px] flex flex-col shadow-2xl z-50 border-t-4 border-blue-600">
          <div className="flex items-center justify-between p-4 border-b border-gray-100 dark:border-gray-700">
            <div className="flex items-center gap-2">
              <Bot className="h-5 w-5 text-blue-600" />
              <h3 className="font-bold text-lg text-gray-900 dark:text-white">Legal AI Assistant</h3>
            </div>
            <Button variant="ghost" size="icon" onClick={() => setIsOpen(false)}>
              <X className="h-4 w-4" />
            </Button>
          </div>

          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.map((msg, idx) => (
              <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[85%] p-3 rounded-xl shadow-sm text-sm transition-colors duration-200 ${
                  msg.role === 'user' 
                    ? 'bg-blue-600 text-white rounded-br-none' 
                    : 'bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white rounded-tl-none'
                }`}>
                  {msg.content}
                </div>
              </div>
            ))}
            {loading && (
              <div className="flex justify-start">
                <div className="bg-gray-100 dark:bg-gray-700 p-3 rounded-xl rounded-tl-none">
                  <div className="flex gap-1">
                    <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce" />
                    <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }} />
                    <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          <div className="p-4 border-t border-gray-100 dark:border-gray-700">
            <div className="flex gap-2">
              <Input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
                placeholder="Ask a legal question..."
                disabled={loading}
              />
              <Button onClick={sendMessage} disabled={loading || !input.trim()} size="icon">
                <Send className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </Card>
      )}
    </>
  );
};

export default Chatbot;
