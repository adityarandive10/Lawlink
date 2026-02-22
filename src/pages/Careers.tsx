import { useState, useEffect, useCallback } from 'react';

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
const Briefcase = (props) => <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="7" width="20" height="14" rx="2" ry="2"/><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/><path d="M22 10H2"/></svg>;
const MapPin = (props) => <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0z"/><circle cx="12" cy="10" r="3"/></svg>;
const Clock = (props) => <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>;
const ExternalLink = (props) => <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M15 3h6v6"/><path d="M10 14 21 3"/><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/></svg>;
const Loader = (props) => <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="animate-spin"><path d="M21 12a9 9 0 1 1-6.219-8.56"/></svg>;

// Base UI Components
const Card = ({ children, className = '' }) => <div className={`bg-white dark:bg-gray-800 rounded-xl shadow-xl transition-all duration-300 ${className}`}>{children}</div>;
const CardHeader = ({ children, className = '' }) => <div className={`p-6 border-b border-gray-100 dark:border-gray-700 ${className}`}>{children}</div>;
const CardContent = ({ children, className = '' }) => <div className={`p-6 ${className}`}>{children}</div>;
const CardTitle = ({ children, className = '' }) => <h2 className={`text-2xl font-bold text-gray-900 dark:text-white ${className}`}>{children}</h2>;
const CardDescription = ({ children, className = '' }) => <p className={`text-sm text-gray-500 dark:text-gray-400 mt-1 ${className}`}>{children}</p>;

const Button = ({ children, onClick, disabled, variant = 'default', size = 'default', className = '' }) => {
	let baseClasses = 'inline-flex items-center justify-center font-semibold rounded-lg transition-all duration-200 focus:outline-none focus:ring-4 ';
	let sizeClasses = size === 'icon' ? 'p-2' : 'px-6 py-3';

	if (variant === 'default') {
		baseClasses += ' bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500/50';
	} else if (variant === 'outline') {
		baseClasses += ' border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 focus:ring-gray-300/50';
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

const getBadgeColor = (type) => {
	switch (type.toLowerCase()) {
		case 'internship': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300';
		case 'job': return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300';
		case 'competition': return 'bg-teal-100 text-teal-800 dark:bg-teal-900 dark:text-teal-300';
		default: return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300';
	}
}

const Badge = ({ variant = 'default', children, className = '' }) => {
	let baseClasses = 'px-3 py-1 text-xs font-medium rounded-full inline-flex items-center';
	
	if (variant === 'default' && typeof children === 'string') {
		baseClasses += ' ' + getBadgeColor(children);
	} else if (variant === 'outline') {
		baseClasses += ' border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300';
	} else {
		baseClasses += ' bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300';
	}

	return (
		<span className={`${baseClasses} ${className}`}>
			{children}
		</span>
	);
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

// LLM Configuration and Types
const LLM_MODEL = 'gemini-2.5-flash-preview-05-20';
const API_KEY = "AIzaSyCreeHrx4wyiSjf_cxE6VEmUp74mSb1Mfs"; // Key provided by user

// Using simple JS object structure for state instead of TypeScript interface
// interface Opportunity { title: string; organization: string; type: string; location: string; duration: string; description: string; }

const Careers = () => {
	const { toast, ToastContainer } = useToast();
	
	// Disable navigation as this is a single-file Canvas
	const handleBack = () => {
		// No action performed
	};
	
	const [opportunities, setOpportunities] = useState([]);
	const [loading, setLoading] = useState(true);

	const fetchOpportunities = useCallback(async () => {
		setLoading(true);
		
		const systemInstruction = "You are an expert career counselor. Your output MUST be a single JSON array, and nothing else. Generate 10 diverse, realistic legal career opportunities (jobs, internships, and competitions). Structure: [{\"title\": \"...\", \"organization\": \"...\", \"type\": \"Internship/Job/Competition\", \"location\": \"...\", \"duration\": \"...\", \"description\": \"...\"}].";
		const userQuery = `Generate 10 legal career opportunities for law students and graduates.`;

		const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/${LLM_MODEL}:generateContent?key=${API_KEY}`;
		
		const payload = {
			contents: [{ parts: [{ text: userQuery }] }],
			systemInstruction: { parts: [{ text: systemInstruction }] },
            // Adding search grounding for more realistic opportunities
            tools: [{ "google_search": {} }], 
		};

		try {
			const response = await axios.post(apiUrl, payload);
			const text = response.data.candidates?.[0]?.content?.parts?.[0]?.text;
			
			if (!text) {
				throw new Error('No text generated.');
			}
			
			const jsonMatch = text.match(/\[[\s\S]*\]/);
			if (jsonMatch) {
				const parsed = JSON.parse(jsonMatch[0]);
				setOpportunities(parsed);
				toast({ title: 'Success', description: `Loaded ${parsed.length} career opportunities.`, variant: 'default' });
			} else {
				throw new Error('Failed to parse JSON from AI output.');
			}

		} catch (error) {
			console.error('API Error:', error);
			toast({ title: 'Fetch Failed', description: `Could not load opportunities: ${error.message}`, variant: 'destructive' });
		} finally {
			setLoading(false);
		}
	}, [toast]);

	useEffect(() => {
		fetchOpportunities();
	}, [fetchOpportunities]);

	const applyForOpportunity = (title) => {
		toast({ title: 'Interest Expressed', description: `Your interest in "${title}" has been recorded! (Note: This is a simulation.)` });
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
						<Briefcase className="h-6 w-6 text-blue-600 dark:text-blue-400" />
						Legal Career Hub
					</div>
					<Button onClick={fetchOpportunities} disabled={loading} size="sm" className="ml-4">
						{loading ? (
							<Loader className="h-5 w-5" />
						) : (
							"Reload"
						)}
					</Button>
				</div>
			</nav>

			<main className="container mx-auto px-4 py-12">
				<div className="max-w-5xl mx-auto space-y-8">
					
					{/* Header Card */}
					<Card className="shadow-2xl border-t-4 border-blue-600 dark:border-blue-400">
						<CardHeader>
							<CardTitle className="text-3xl flex items-center gap-3">
								<Briefcase className="h-7 w-7 text-blue-600 dark:text-blue-400" />
								Career Corner
							</CardTitle>
							<CardDescription>
								Discover the latest internships, job openings, and legal competitions generated by AI.
							</CardDescription>
						</CardHeader>
					</Card>

					{/* Loading State */}
					{loading && opportunities.length === 0 && (
						<div className="flex flex-col items-center justify-center p-12 text-blue-600 dark:text-blue-400 bg-white dark:bg-gray-800 rounded-xl shadow-xl">
							<Loader className="h-10 w-10 mb-4" />
							<p className="text-lg font-medium">Scanning for legal career opportunities...</p>
							<p className="text-sm text-gray-500 dark:text-gray-400 mt-2">Compiling job descriptions and internship details.</p>
						</div>
					)}
					
					{/* Opportunities List */}
					{!loading && opportunities.length > 0 && (
						<div className="space-y-6">
							{opportunities.map((opp, idx) => (
								<Card key={idx} className="shadow-lg hover:shadow-2xl transition-shadow duration-300">
									<CardHeader>
										<div className="flex justify-between items-start gap-4">
											<div className="flex-1">
												<CardTitle className="text-xl text-gray-900 dark:text-white">{opp.title}</CardTitle>
												<CardDescription className="mt-1 text-base font-semibold text-blue-700 dark:text-blue-300">
													{opp.organization}
												</CardDescription>
											</div>
										</div>
										<div className="flex flex-wrap gap-3 mt-3">
											{/* Type Badge (Dynamic Color) */}
											<Badge variant="default">{opp.type}</Badge>
											
											{/* Location Badge */}
											<Badge variant="outline" className="flex items-center gap-1 font-medium">
												<MapPin className="h-4 w-4 text-gray-500 dark:text-gray-400" />
												{opp.location}
											</Badge>
											
											{/* Duration Badge */}
											<Badge variant="outline" className="flex items-center gap-1 font-medium">
												<Clock className="h-4 w-4 text-gray-500 dark:text-gray-400" />
												{opp.duration}
											</Badge>
										</div>
									</CardHeader>
									<CardContent className="space-y-4">
										<p className="text-base leading-relaxed text-gray-700 dark:text-gray-200">{opp.description}</p>
										<Button 
											onClick={() => applyForOpportunity(opp.title)} 
											className="w-full text-lg shadow-md hover:shadow-lg"
										>
											<ExternalLink className="h-5 w-5 mr-3" />
											Express Interest / Apply
										</Button>
									</CardContent>
								</Card>
							))}
						</div>
					)}

					{/* Empty State */}
					{!loading && opportunities.length === 0 && (
						<div className="p-12 text-center text-gray-400 dark:text-gray-600 bg-white dark:bg-gray-800 rounded-xl shadow-xl">
							<Briefcase className="h-12 w-12 mx-auto mb-4" />
							<p className="text-lg font-medium">No career opportunities found.</p>
							<p className="text-sm mt-1">Try reloading or searching for different criteria.</p>
							<Button onClick={fetchOpportunities} className="mt-4">
								<Loader className="h-4 w-4 mr-2" />
								Reload Opportunities
							</Button>
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

export default Careers;
