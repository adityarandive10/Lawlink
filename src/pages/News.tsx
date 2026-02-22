import { useState, useEffect, useCallback } from 'react';

// --- MOCK UI COMPONENTS (Ensuring single-file runnability) ---
// Note: These mock the look and feel of shadcn/ui components using pure Tailwind CSS.

// Simple Toast/Notification System
const useToast = () => {
	const [toast, setToast] = useState(null);

	const showToast = useCallback(({ title, description, variant = 'default' }) => {
		setToast({ title, description, variant });
		setTimeout(() => setToast(null), 3500);
	}, []);

	const ToastContainer = () => toast && (
		<div className={`fixed top-4 right-4 p-4 rounded-lg shadow-2xl z-50 transition-all duration-300 ${
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
const Newspaper = (props) => <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 22h16a2 2 0 0 0 2-2V4a2 2 0 0 0-2-2H8a2 2 0 0 0-2 2v16a2 2 0 0 1-2 2zm0 0a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h2.5"/><path d="M16 10H8"/><path d="M16 14H8"/><path d="M18 18H8"/></svg>;
const Calendar = (props) => <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>;
const Loader = (props) => <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="animate-spin"><path d="M21 12a9 9 0 1 1-6.219-8.56"/></svg>;

// Base UI Components
const Card = ({ children, className = '' }) => <div className={`bg-white dark:bg-gray-800 rounded-2xl shadow-xl transition-all duration-300 ${className}`}>{children}</div>;
const CardHeader = ({ children, className = '' }) => <div className={`p-6 border-b border-gray-100 dark:border-gray-700 ${className}`}>{children}</div>;
const CardContent = ({ children, className = '' }) => <div className={`p-6 ${className}`}>{children}</div>;
const CardTitle = ({ children, className = '' }) => <h2 className={`text-xl font-bold text-gray-900 dark:text-white ${className}`}>{children}</h2>;
const CardDescription = ({ children, className = '' }) => <p className={`text-sm text-gray-500 dark:text-gray-400 mt-1 ${className}`}>{children}</p>;

const Button = ({ children, onClick, disabled, variant = 'default', size = 'default', className = '' }) => {
	let baseClasses = 'inline-flex items-center justify-center font-semibold rounded-lg transition-all duration-200 focus:outline-none focus:ring-4 ';
	let sizeClasses = size === 'sm' ? 'px-3 py-1.5 text-sm' : 'px-6 py-3';

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

const Badge = ({ children, variant = 'default', className = '' }) => {
    let baseClasses = 'inline-flex items-center px-3 py-1 text-xs font-medium rounded-full';
    if (variant === 'default') {
        baseClasses += ' bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200';
    } else if (variant === 'secondary') {
        baseClasses += ' bg-gray-200 text-gray-700 dark:bg-gray-700 dark:text-gray-300';
    } else if (variant === 'outline') {
        baseClasses += ' border border-gray-300 text-gray-700 dark:border-gray-600 dark:text-gray-300';
    }
    return <span className={`${baseClasses} ${className}`}>{children}</span>;
};

// Placeholder for an external Chatbot component
const Chatbot = () => <div className="p-4 border-t border-gray-200 dark:border-gray-700 text-center text-sm text-gray-400 dark:text-gray-600">
	<p>Chatbot component placeholder.</p>
</div>;

// --- END MOCK UI COMPONENTS ---

// --- AXIOS MOCK FOR RELIABLE API CALLS ---
const callApiWithBackoff = async (url, payload, retries = 3) => {
    for (let i = 0; i < retries; i++) {
      try {
        const response = await fetch(url, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });
        const data = await response.json();
        
        if (!response.ok) {
          throw new Error(data.error?.message || `API returned status ${response.status}`);
        }
        
        return { data };
      } catch (error) {
        if (i === retries - 1) throw error;
        const delay = Math.pow(2, i) * 1000 + Math.random() * 1000;
        await new Promise(resolve => setTimeout(resolve, delay));
      }
    }
};

const axios = {
    post: callApiWithBackoff
};
// --- END AXIOS MOCK ---

// LLM Configuration
const LLM_MODEL = 'gemini-2.5-flash'; 
const API_KEY = "AIzaSyCreeHrx4wyiSjf_cxE6VEmUp74mSb1Mfs"; // Key inserted here

interface NewsItem {
	title: string;
	summary: string;
	category: string;
	date: string;
}

const News = () => {
	const { toast, ToastContainer } = useToast();
	const [news, setNews] = useState<NewsItem[]>([]);
	const [loading, setLoading] = useState(true);

	// REMOVED: Mock navigation back (disabled in Canvas)
	// const handleBack = () => { /* No action */ };

	useEffect(() => {
		fetchNews();
	}, []);

	const fetchNews = async () => {
		setLoading(true);

		const systemInstruction = "You are an AI legal news aggregator. Your output MUST be a single JSON array, and nothing else. Follow the structure precisely: [{\"title\": \"...\", \"summary\": \"...\", \"category\": \"Constitutional/Criminal/Corporate/etc\", \"date\": \"YYYY-MM-DD\"}]. Generate 10 realistic and current news updates and amendments.";
        
        const userQuery = `Generate 10 recent and current legal news updates and amendments.`;
        
        // --- API URL with Key ---
        const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/${LLM_MODEL}:generateContent?key=${API_KEY}`;
        // -------------------------
		
		const payload = {
			contents: [{ parts: [{ text: userQuery }] }],
            systemInstruction: { parts: [{ text: systemInstruction }] },
            tools: [{ "google_search": {} }],
		};

		try {
			const response = await axios.post(apiUrl, payload);
			const text = response.data.candidates?.[0]?.content?.parts?.[0]?.text;
			
			if (!text) {
				throw new Error('No text generated or empty response.');
			}
			
			const jsonMatch = text.match(/\[[\s\S]*\]/); 
			
			if (jsonMatch) {
				const parsed = JSON.parse(jsonMatch[0]);
				
                if (Array.isArray(parsed) && parsed.length > 0) {
                    setNews(parsed);
                    toast({ title: 'Success', description: 'Legal news feed updated.', variant: 'default' });
                } else {
                    throw new Error('AI output was an empty or invalid news JSON array.');
                }

			} else {
				throw new Error('Failed to parse JSON structure from AI output.');
			}
		} catch (error) {
			console.error('API Error:', error);
			setNews([]);
			toast({ 
                title: 'AI Service Error', 
                description: `Failed to fetch news. Check console for details.`, 
                variant: 'destructive' 
            });
		} finally {
			setLoading(false);
		}
	};

	return (
		<div className="min-h-screen bg-gray-50 dark:bg-gray-900 font-sans text-gray-900 dark:text-white transition-colors duration-300">
			<ToastContainer />
			
			{/* Elevated Navigation Bar */}
			<nav className="sticky top-0 z-10 bg-white/80 dark:bg-gray-800/90 backdrop-blur-md shadow-md">
				<div className="container mx-auto px-4 py-3 flex justify-between items-center max-w-5xl">
					<Button variant="ghost" onClick={() => {}} className="text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400">
						<ArrowLeft className="h-4 w-4 mr-2" />
						Workspace
					</Button>
					<div className="text-lg font-bold text-blue-600 dark:text-blue-400">Legal News Feed</div>
				</div>
			</nav>

			<main className="container mx-auto px-4 py-12">
				<div className="max-w-5xl mx-auto space-y-8">
					
					{/* Header Card with Refresh Button */}
					<Card className="shadow-2xl flex items-center justify-between p-6">
						<div>
							<CardTitle className="flex items-center gap-3 text-3xl">
								<Newspaper className="h-7 w-7 text-blue-600 dark:text-blue-400" />
								Legal News & Amendments
							</CardTitle>
							<CardDescription>
								Stay updated with the latest developments in various fields of law.
							</CardDescription>
						</div>
						<Button onClick={fetchNews} disabled={loading} size="sm" className="ml-4">
							{loading ? (
								<Loader className="h-5 w-5" />
							) : (
								"Refresh Feed"
							)}
						</Button>
					</Card>

					{/* News List */}
					{loading && news.length === 0 ? (
						<Card>
							<CardContent className="py-12 text-center text-blue-600 dark:text-blue-400">
								<Loader className="h-8 w-8 mx-auto mb-4" />
								<p className="font-medium">Fetching the latest legal news...</p>
							</CardContent>
						</Card>
					) : (
						news.map((item, idx) => (
							<Card key={idx} className="hover:shadow-elegant transition-all duration-300 hover:border-blue-300 dark:hover:border-blue-500 border border-transparent">
								<CardHeader className="border-b-0 pb-0">
									<div className="flex justify-between items-start gap-4">
										<div className="flex-1">
											<CardTitle className="text-xl">{item.title}</CardTitle>
											<div className="flex flex-wrap items-center gap-3 mt-3">
												<Badge variant="default">{item.category}</Badge>
												<span className="text-sm text-gray-500 dark:text-gray-400 flex items-center gap-1">
													<Calendar className="h-4 w-4" />
													{item.date}
												</span>
											</div>
										</div>
									</div>
								</CardHeader>
								<CardContent>
									<p className="text-base text-gray-700 dark:text-gray-300 leading-relaxed">{item.summary}</p>
								</CardContent>
							</Card>
						))
					)}

					{/* Empty State */}
					{!loading && news.length === 0 && (
						<Card>
							<CardContent className="py-12 text-center text-gray-500 dark:text-gray-400">
								<Newspaper className="h-10 w-10 mx-auto mb-4" />
								<p className="text-lg font-medium">No News Available</p>
								<p className="text-sm">Click 'Refresh Feed' to generate new legal updates.</p>
							</CardContent>
						</Card>
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

export default News;
