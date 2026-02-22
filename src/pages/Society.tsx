import { useState, useEffect, useCallback, useRef } from 'react';

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

const ArrowLeft = (props) => <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m12 19-7-7 7-7"/><path d="M19 12H5"/></svg>;
const MessageSquare = (props) => <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>;
const Send = (props) => <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m22 2-7 20-4-9-9-4 20-7z"/></svg>;
const Loader = (props) => <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="animate-spin"><path d="M21 12a9 9 0 1 1-6.219-8.56"/></svg>;

const Card = ({ children, className = '' }) => <div className={`bg-white dark:bg-gray-800 rounded-xl shadow-2xl transition-all duration-300 ${className}`}>{children}</div>;
const CardHeader = ({ children, className = '' }) => <div className={`p-6 border-b border-gray-100 dark:border-gray-700 ${className}`}>{children}</div>;
const CardContent = ({ children, className = '' }) => <div className={`p-6 ${className}`}>{children}</div>;
const CardTitle = ({ children, className = '' }) => <h2 className={`text-2xl font-bold text-gray-900 dark:text-white ${className}`}>{children}</h2>;
const CardDescription = ({ children, className = '' }) => <p className={`text-sm text-gray-500 dark:text-gray-400 mt-1 ${className}`}>{children}</p>;
const commonInputClasses = 'w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200';
const Input = (props) => <input {...props} className={commonInputClasses + ' ' + (props.className || '')} />;

const Button = ({ children, onClick, disabled, variant = 'default', size = 'default', className = '' }) => {
  let baseClasses = 'inline-flex items-center justify-center font-semibold rounded-lg transition-all duration-200 focus:outline-none focus:ring-4 ';
  let sizeClasses = size === 'icon' ? 'p-3' : 'px-6 py-3';

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

const Chatbot = () => <div className="p-4 border-t border-gray-200 dark:border-gray-700 text-center text-sm text-gray-400 dark:text-gray-600">
  <p>Chatbot component placeholder.</p>
</div>;

// --- END MOCK UI COMPONENTS ---

// Helper to get a consistent color for a given user ID
const getUserColor = (id) => {
    // Generates a hash-based color to visually distinguish users
    const hash = id.split('').reduce((acc, char) => char.charCodeAt(0) + ((acc << 5) - acc), 0);
    const color = Math.floor(Math.abs(hash) / 100000) % 360; // Hue between 0 and 360
    return `hsl(${color}, 60%, 45%)`;
};

// --- LOGIC: LOCAL STORAGE PERSISTENCE ---
const LOCAL_STORAGE_KEY = 'law_society_chat_messages';
const LOCAL_USER_ID_KEY = 'law_society_user_id';

const Society = () => {
  const { toast, ToastContainer } = useToast();
  const messagesEndRef = useRef(null);
  
  // State for user identity (local storage based)
  const [userId, setUserId] = useState(null);
  const [userName, setUserName] = useState('');

  // Chat State
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [isSending, setIsSending] = useState(false);
  const isAuthReady = !!userId; // Simulating "Auth Ready" by checking if userId exists

  // Mock navigation back (disabled in Canvas)
  const handleBack = () => { /* No action */ };

  // 1. Initialize User ID and Load Messages from localStorage
  useEffect(() => {
    // Load or generate user ID (simulating persistent user)
    let storedId = localStorage.getItem(LOCAL_USER_ID_KEY);
    if (!storedId) {
        // Generate a simple UUID-like ID
        storedId = 'local-' + Math.random().toString(36).substring(2, 10);
        localStorage.setItem(LOCAL_USER_ID_KEY, storedId);
    }
    setUserId(storedId);
    setUserName(`User-${storedId.substring(6, 10)}`); // Display name from last 4 chars

    // Load messages
    const storedMessages = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (storedMessages) {
        // Ensure timestamps are correctly converted to Date objects
        const parsedMessages = JSON.parse(storedMessages).map(m => ({
            ...m,
            timestamp: new Date(m.timestamp),
        }));
        setMessages(parsedMessages);
    }
  }, []);

  // 2. Scroll to Bottom Effect
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // 3. Save Messages to localStorage Callback
  const saveMessages = useCallback((newMessages) => {
    setMessages(newMessages);
    // Save objects with serializable date strings
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(newMessages.map(m => ({
        ...m,
        timestamp: m.timestamp.toISOString(),
    }))));
  }, []);

  // 4. SEND MESSAGE FUNCTION (Local Storage Logic)
  const sendMessage = () => {
    if (!input.trim() || !userId) return;

    setIsSending(true);
    const messageText = input.trim();
    setInput(''); // Clear input immediately for better UX

    const newMessage = {
        id: Date.now().toString(),
        userId: userId,
        user: userName,
        text: messageText,
        timestamp: new Date(),
    };

    const newMessages = [...messages, newMessage];
    saveMessages(newMessages);

    // No actual sending delay, but keep isSending brief for visual effect
    setTimeout(() => {
        setIsSending(false);
    }, 200); 
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 font-sans text-gray-900 dark:text-white transition-colors duration-300">
      <ToastContainer />
      
      {/* Elevated Navigation Bar */}
      <nav className="sticky top-0 z-10 bg-white/80 dark:bg-gray-800/90 backdrop-blur-md shadow-lg">
        <div className="container mx-auto px-4 py-3 flex justify-between items-center max-w-5xl">
          <Button variant="ghost" onClick={handleBack} className="text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Workspace
          </Button>
          <div className="text-xl font-bold text-blue-800 dark:text-blue-300 flex items-center gap-2">
            <MessageSquare className="h-6 w-6 text-blue-600 dark:text-blue-400" />
            Law Society Chat
          </div>
        </div>
      </nav>

      <main className="container mx-auto px-4 py-12">
        <div className="max-w-5xl mx-auto">
          <Card className="h-[75vh] flex flex-col shadow-2xl border-t-4 border-blue-600 dark:border-blue-400">
            <CardHeader>
              <CardTitle className="text-3xl flex items-center gap-3">
                <MessageSquare className="h-7 w-7 text-blue-600 dark:text-blue-400" />
                Local Discussion Forum
              </CardTitle>
              <CardDescription>
                Messages are stored only in your browser. (Your User ID: **{userId || 'Loading...'}**)
              </CardDescription>
            </CardHeader>
            
            <CardContent className="flex-1 flex flex-col overflow-hidden p-6">
              <div className="flex-1 overflow-y-auto space-y-4 mb-4 pr-2">
                {messages.length === 0 && !isAuthReady ? (
                  <div className="text-center text-blue-500 py-12">
                    <Loader className="h-8 w-8 mx-auto mb-2" />
                    Initializing local chat...
                  </div>
                ) : messages.length === 0 ? (
                  <div className="text-center text-gray-500 dark:text-gray-400 py-12">
                    Start the conversation! Be the first to post.
                  </div>
                ) : (
                  messages.map((msg) => (
                    <div
                      key={msg.id}
                      className={`flex ${msg.userId === userId ? 'justify-end' : 'justify-start'}`}
                    >
                      <div
                        className={`max-w-[80%] md:max-w-[65%] p-3 rounded-xl shadow-md transition-all duration-200 ${
                          msg.userId === userId 
                            ? 'bg-blue-600 text-white rounded-br-none' 
                            : 'bg-gray-100 dark:bg-gray-700 rounded-tl-none'
                        }`}
                      >
                        <div className="flex justify-between items-start mb-1">
                          <span 
                            className="font-bold text-sm" 
                            style={{ color: msg.userId === userId ? 'white' : getUserColor(msg.userId) }}
                          >
                            {msg.user}
                          </span>
                          <span className={`text-xs ml-4 ${msg.userId === userId ? 'text-blue-100' : 'text-gray-400 dark:text-gray-500'}`}>
                            {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </span>
                        </div>
                        <p className={`text-base leading-snug ${msg.userId === userId ? 'text-white' : 'text-gray-900 dark:text-gray-100'}`}>{msg.text}</p>
                      </div>
                    </div>
                  ))
                )}
                <div ref={messagesEndRef} />
              </div>

              <div className="flex gap-3 pt-4 border-t border-gray-100 dark:border-gray-700">
                <Input
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                  placeholder="Type your message..."
                  disabled={!isAuthReady || isSending}
                  className="p-4"
                />
                <Button 
                  onClick={sendMessage} 
                  disabled={!input.trim() || !isAuthReady || isSending}
                  size="icon"
                >
                  {isSending ? <Loader className="h-5 w-5" /> : <Send className="h-5 w-5" />}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>

      {/* Footer / Chatbot Placeholder */}
      <footer className="mt-8">
        <Chatbot />
      </footer>

      {/* Custom Styles for better visual appeal */}
      <style>{`
        /* Custom font import (using Inter for a modern look) */
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@100..900&display=swap');
        
        .font-sans { font-family: 'Inter', sans-serif; }

        /* General Dark Mode adjustments for backgrounds */
        .dark .bg-gray-50 {
             background-color: #0f172a; /* Slate-900 */
        }
      `}</style>
      
    </div>
  );
};

export default Society;
