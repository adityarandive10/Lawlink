import { useState, useCallback } from 'react';

// --- MOCK UI COMPONENTS (Ensuring single-file runnability) ---

// Simple Toast/Notification System
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

// Icon components (using inline SVGs for stability)
const ArrowLeft = (props) => <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m12 19-7-7 7-7"/><path d="M19 12H5"/></svg>;
const Scale = (props) => <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m16 16 3-3V2H5v14l3 3m1-16v16"/><path d="M7 20v2l2-1 2 1 2-1 2 1 2-1V20"/><path d="M3 14h18"/></svg>;
const Search = (props) => <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>;
const Bookmark = (props) => <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m19 21-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"/></svg>;
const Loader = (props) => <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="animate-spin"><path d="M21 12a9 9 0 1 1-6.219-8.56"/></svg>;

// Base UI Components
const Card = ({ children, className = '' }) => <div className={`bg-white dark:bg-gray-800 rounded-xl shadow-2xl transition-all duration-300 ${className}`}>{children}</div>;
const CardHeader = ({ children, className = '' }) => <div className={`p-6 border-b border-gray-100 dark:border-gray-700 ${className}`}>{children}</div>;
const CardContent = ({ children, className = '' }) => <div className={`p-6 ${className}`}>{children}</div>;
const CardTitle = ({ children, className = '' }) => <h2 className={`text-2xl font-bold text-gray-900 dark:text-white ${className}`}>{children}</h2>;
const CardDescription = ({ children, className = '' }) => <p className={`text-sm text-gray-500 dark:text-gray-400 mt-1 ${className}`}>{children}</p>;
const commonInputClasses = 'w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200';
const Input = (props) => <input {...props} className={commonInputClasses + ' ' + (props.className || '')} />;

const Button = ({ children, onClick, disabled, variant = 'default', size = 'default', className = '' }) => {
  let baseClasses = 'inline-flex items-center justify-center font-semibold rounded-lg transition-all duration-200 focus:outline-none focus:ring-4 ';
  let sizeClasses = size === 'icon' ? 'p-2' : 'px-6 py-3';

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

// Placeholder for an external Chatbot component
const Chatbot = () => <div className="p-4 border-t border-gray-200 dark:border-gray-700 text-center text-sm text-gray-400 dark:text-gray-600">
  <p>Chatbot component placeholder.</p>
</div>;

// --- END MOCK UI COMPONENTS ---

// LLM Configuration and Types
const LLM_MODEL = 'gemini-2.5-flash-preview-05-20';
const API_KEY = "AIzaSyCreeHrx4wyiSjf_cxE6VEmUp74mSb1Mfs"; // Intentionally empty as per instructions

// Using simple JS object structure for state instead of TypeScript interface
// interface CaseResult { title: string; summary: string; citation: string; }

const CaseLaw = () => {
  const { toast, ToastContainer } = useToast();
  
  // Disable navigation as this is a single-file Canvas
  const handleBack = () => {
    // No action performed
  };
  
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  // bookmarks stores the titles of bookmarked cases
  const [bookmarks, setBookmarks] = useState([]);

  // Function to implement exponential backoff
  const callApiWithBackoff = async (url, options, retries = 3) => {
    for (let i = 0; i < retries; i++) {
      try {
        const response = await fetch(url, options);
        if (response.ok) {
          return response;
        }
        // Throw an error to trigger retry logic for non-OK responses
        throw new Error(`API returned status ${response.status}`);
      } catch (error) {
        if (i < retries - 1) {
          const delay = Math.pow(2, i) * 1000; // 1s, 2s, 4s
          await new Promise(resolve => setTimeout(resolve, delay));
        } else {
          throw error; // Throw final error after all retries
        }
      }
    }
  };

  const searchCases = async () => {
  if (!query) {
    toast({ title: 'Input Required', description: 'Please enter a search query.', variant: 'destructive' });
    return;
  }

  setLoading(true);
  setResults([]);

  const systemInstruction = "You are an expert legal researcher. Your output MUST be a single JSON array, and nothing else. Find and summarize 5 landmark legal cases related to the user's query. Structure: [{\"title\": \"...\", \"summary\": \"...\", \"citation\": \"...\"}].";
  const userQuery = `Find and summarize 5 landmark legal cases related to: ${query}`;

  const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/${LLM_MODEL}:generateContent?key=${API_KEY}`;

  const payload = {
    contents: [{ parts: [{ text: userQuery }] }],
    systemInstruction: { parts: [{ text: systemInstruction }] },
    tools: [{ "google_search": {} }],
  };

  try {
    const response = await callApiWithBackoff(apiUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });

    const data = await response.json();
    const text = data.candidates?.[0]?.content?.parts?.[0]?.text;

    if (!text) {
      throw new Error('No text generated.');
    }

    console.log('Raw AI response:', text); // Add this for debugging

    // Try to find the first JSON array in the text
    const firstBracket = text.indexOf('[');
    const lastBracket = text.lastIndexOf(']');
    if (firstBracket === -1 || lastBracket === -1) {
      throw new Error('No JSON array found in AI output.');
    }

    const jsonString = text.substring(firstBracket, lastBracket + 1);

    let parsed;
    try {
      parsed = JSON.parse(jsonString);
    } catch (parseError) {
      // If parsing fails, provide full raw text in error
      throw new Error(`JSON parsing error: ${parseError.message}. Full response: ${text}`);
    }

    setResults(parsed);
    toast({ title: 'Search Complete', description: `Found ${parsed.length} case summaries.`, variant: 'default' });
  } catch (error) {
    console.error('API Error:', error);
    toast({ title: 'Search Failed', description: `A search error occurred: ${error.message}`, variant: 'destructive' });
  } finally {
    setLoading(false);
  }
};


  const toggleBookmark = (title) => {
    if (bookmarks.includes(title)) {
      setBookmarks(bookmarks.filter(b => b !== title));
      toast({ title: 'Bookmark Removed', description: `${title} removed from favorites.` });
    } else {
      setBookmarks([...bookmarks, title]);
      toast({ title: 'Bookmarked', description: `${title} added to favorites.` });
    }
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
            <Scale className="h-6 w-6 text-blue-600 dark:text-blue-400" />
            Legal Case Finder
          </div>
        </div>
      </nav>

      <main className="container mx-auto px-4 py-12">
        <div className="max-w-5xl mx-auto space-y-8">
          
          {/* Search Input Card */}
          <Card className="shadow-2xl border-t-4 border-blue-600 dark:border-blue-400">
            <CardHeader>
              <CardTitle className="text-3xl flex items-center gap-3">
                <Search className="h-7 w-7 text-blue-600 dark:text-blue-400" />
                Case Law Search
              </CardTitle>
              <CardDescription>
                Enter a legal topic (e.g., 'First Amendment rights', 'Breach of contract') to find landmark cases.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex gap-4">
                <Input
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && searchCases()}
                  placeholder="Search for cases (e.g., copyright infringement, negligence)..."
                  className="flex-grow p-4 text-lg"
                />
                <Button onClick={searchCases} disabled={loading} className="p-4 flex-shrink-0">
                  {loading ? <Loader className="h-6 w-6" /> : <Search className="h-6 w-6" />}
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Loading State / Empty State */}
          {loading && (
            <div className="flex flex-col items-center justify-center p-12 text-blue-600 dark:text-blue-400 bg-white dark:bg-gray-800 rounded-xl shadow-xl">
              <Loader className="h-10 w-10 mb-4" />
              <p className="text-lg font-medium">Searching the Legal Archives...</p>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">The AI is compiling summaries of key cases for you.</p>
            </div>
          )}
          
          {!loading && results.length === 0 && query.length > 0 && (
            <div className="p-12 text-center text-gray-400 dark:text-gray-600 bg-white dark:bg-gray-800 rounded-xl shadow-xl">
              <Scale className="h-12 w-12 mx-auto mb-4" />
              <p className="text-lg font-medium">No results found for "{query}".</p>
              <p className="text-sm mt-1">Try broadening your search terms or checking for spelling.</p>
            </div>
          )}

          {/* Case Law Results List */}
          {!loading && results.length > 0 && (
            <div className="space-y-6">
              <h3 className="text-xl font-semibold text-gray-700 dark:text-gray-300">Search Results:</h3>
              {results.map((caseItem, idx) => {
                const isBookmarked = bookmarks.includes(caseItem.title);
                return (
                  <Card key={idx} className="shadow-xl hover:shadow-2xl transition-shadow duration-300">
                    <CardHeader className="flex flex-row items-start justify-between">
                      <div className="flex-grow pr-4">
                        <CardTitle className="text-xl text-blue-800 dark:text-blue-300">{caseItem.title}</CardTitle>
                        <CardDescription className="mt-1 text-base font-mono text-gray-600 dark:text-gray-400">
                          {caseItem.citation}
                        </CardDescription>
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => toggleBookmark(caseItem.title)}
                        className={`transition-all duration-200 ${isBookmarked ? 'text-blue-600 dark:text-blue-400 hover:bg-blue-50/10' : 'text-gray-400 hover:text-blue-600'}`}
                        aria-label={isBookmarked ? 'Remove bookmark' : 'Add bookmark'}
                      >
                        <Bookmark
                          className={`h-6 w-6 ${isBookmarked ? 'fill-current' : 'fill-none'}`}
                        />
                      </Button>
                    </CardHeader>
                    <CardContent>
                      <h4 className="font-semibold text-gray-700 dark:text-gray-300 mb-2">Summary:</h4>
                      <p className="text-base leading-relaxed text-gray-700 dark:text-gray-200">{caseItem.summary}</p>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          )}
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

export default CaseLaw;
