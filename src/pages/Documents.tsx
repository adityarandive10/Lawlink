import { useState, useCallback } from 'react';

// --- MOCK UI COMPONENTS ---
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

// Icon components
const ArrowLeft = (props) => <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m12 19-7-7 7-7"/><path d="M19 12H5"/></svg>;
const FileText = (props) => <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z"/><path d="M14 2v4a2 2 0 0 0 2 2h4"/><path d="M10 9H8"/><path d="M16 13H8"/><path d="M16 17H8"/></svg>;
const Loader = (props) => <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="animate-spin"><path d="M21 12a9 9 0 1 1-6.219-8.56"/></svg>;

// Base UI Components
const Card = ({ children, className = '' }) => <div className={`bg-white dark:bg-gray-800 rounded-2xl shadow-xl transition-all duration-300 ${className}`}>{children}</div>;
const CardHeader = ({ children, className = '' }) => <div className={`p-6 border-b border-gray-100 dark:border-gray-700 ${className}`}>{children}</div>;
const CardContent = ({ children, className = '' }) => <div className={`p-6 ${className}`}>{children}</div>;
const CardTitle = ({ children, className = '' }) => <h2 className={`text-2xl font-bold text-gray-900 dark:text-white ${className}`}>{children}</h2>;
const CardDescription = ({ children, className = '' }) => <p className={`text-sm text-gray-500 dark:text-gray-400 mt-1 ${className}`}>{children}</p>;
const Label = ({ children, htmlFor, className = '' }) => <label htmlFor={htmlFor} className={`text-sm font-medium text-gray-700 dark:text-gray-300 block mb-1 ${className}`}>{children}</label>;

const commonInputClasses = 'w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200';
const Input = (props) => <input {...props} className={commonInputClasses + ' ' + (props.className || '')} />;
const Textarea = (props) => <textarea {...props} className={commonInputClasses + ' resize-none ' + (props.className || '')} />;

const Button = ({ children, onClick, disabled, variant = 'default', size = 'default', className = '' }) => {
	let baseClasses = 'inline-flex items-center justify-center font-semibold rounded-lg transition-all duration-200 focus:outline-none focus:ring-4 ';
	let sizeClasses = size === 'sm' ? 'px-3 py-1.5 text-sm' : 'px-6 py-3';

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

// Select component
const Select = ({ value, onValueChange, children }) => {
	return (
		<div className="relative">
			<select
				value={value}
				onChange={(e) => onValueChange(e.target.value)}
				className={`${commonInputClasses} appearance-none cursor-pointer pr-10`}
			>
				{children}
			</select>
			<div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700 dark:text-gray-300">
				<svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/></svg>
			</div>
		</div>
	);
};

const SelectTrigger = ({ children }) => <>{children}</>;
const SelectValue = ({ placeholder }) => <option value="" disabled>{placeholder}</option>;
const SelectContent = ({ children }) => <>{children}</>;
const SelectItem = ({ value, children }) => <option value={value}>{children}</option>;

// --- MOCK AI SERVICE ---
const mockAIService = {
	generateDocument: async (docType, details) => {
		// Simulate API delay
		await new Promise(resolve => setTimeout(resolve, 2000));
		
		const documentTemplates = {
			contract: `EMPLOYMENT AGREEMENT

This Employment Agreement ("Agreement") is made and entered into as of ${new Date().toLocaleDateString()} between:

EMPLOYER: [Company Name], a corporation organized under the laws of [State]
EMPLOYEE: [Employee Name], residing at [Address]

ARTICLE 1: POSITION AND DUTIES
1.1 Position: The Employee shall serve as [Job Title].
1.2 Duties: The Employee shall perform all duties customary to the position and such other duties as may be assigned by the Employer.

ARTICLE 2: COMPENSATION
2.1 Salary: The Employee shall receive an annual salary of $[Amount], payable in accordance with the Employer's standard payroll practices.
2.2 Benefits: The Employee shall be eligible to participate in the Employer's benefit programs.

ARTICLE 3: TERM AND TERMINATION
3.1 Term: This Agreement shall commence on [Start Date] and continue until terminated.
3.2 Termination: Either party may terminate this Agreement with [Number] days' written notice.

${details}

IN WITNESS WHEREOF, the parties have executed this Agreement as of the date first above written.

_________________________
[Company Representative]

_________________________
[Employee]`,

			agreement: `NON-DISCLOSURE AGREEMENT

This Non-Disclosure Agreement ("Agreement") is made between:

DISCLOSING PARTY: [Company Name]
RECEIVING PARTY: [Recipient Name]

1. CONFIDENTIAL INFORMATION
The term "Confidential Information" shall mean all information disclosed by either party.

2. OBLIGATIONS
The Receiving Party shall hold and maintain the Confidential Information in strictest confidence.

3. TERM
This Agreement shall remain in effect for [Number] years from the date hereof.

${details}

Signed this ${new Date().toLocaleDateString()}

_________________________
[Disclosing Party]

_________________________
[Receiving Party]`,

			affidavit: `AFFIDAVIT OF IDENTITY

STATE OF [State]
COUNTY OF [County]

BEFORE ME, the undersigned authority, personally appeared [Your Name] ("Affiant"), who after being duly sworn, deposes and says:

1. I, [Your Full Name], am the individual identified in the attached documents.
2. My date of birth is [Date of Birth].
3. My social security number is [SSN].
4. I reside at [Your Address].

${details}

FURTHER AFFIANT SAYETH NAUGHT.

_________________________
[Your Signature]

SWORN TO AND SUBSCRIBED before me this ______ day of ____________, 20____.

_________________________
Notary Public`
		};

		return documentTemplates[docType] || `LEGAL DOCUMENT - ${docType.toUpperCase()}

This document has been generated based on your requirements:

${details}

Document Type: ${docType}
Generated Date: ${new Date().toLocaleDateString()}

[Insert appropriate legal content here based on the document type and provided details]`;
	}
};

const Documents = () => {
	const { toast, ToastContainer } = useToast();
	
	const handleBack = () => {
		// No action performed as external routing is not available
	};
	
	const [docType, setDocType] = useState('');
	const [details, setDetails] = useState('');
	const [generatedDoc, setGeneratedDoc] = useState('');
	const [loading, setLoading] = useState(false);

	const generateDocument = async () => {
		if (!docType || !details) {
			toast({ 
				title: 'Input Required', 
				description: 'Please select a document type and provide detailed instructions.', 
				variant: 'destructive' 
			});
			return;
		}

		setLoading(true);
		setGeneratedDoc('');

		try {
			// Use mock service instead of API call
			const document = await mockAIService.generateDocument(docType, details);
			setGeneratedDoc(document);
			toast({ 
				title: 'Success', 
				description: 'Document generated successfully!', 
				variant: 'default' 
			});
		} catch (error) {
			console.error('Generation Error:', error);
			toast({ 
				title: 'Generation Error', 
				description: 'Failed to generate document. Please try again.', 
				variant: 'destructive' 
			});
		} finally {
			setLoading(false);
		}
	};

	// Function to structure the document content
	const renderStructuredDocument = (content) => {
		if (!content) return null;
		
		const lines = content.split('\n');
		let structuredContent = [];
		
		for (let i = 0; i < lines.length; i++) {
			const line = lines[i].trim();
			if (!line) continue;
			
			// Detect headings
			if (
				(line.toUpperCase() === line && line.length < 100 && !line.includes('.')) ||
				line.endsWith(':') ||
				line.includes('ARTICLE') ||
				line.includes('SECTION')
			) {
				structuredContent.push(
					<h3 key={i} className="text-lg font-bold text-gray-900 dark:text-white mt-6 mb-3 pb-2 border-b border-gray-200 dark:border-gray-700">
						{line}
					</h3>
				);
			} 
			// Detect numbered clauses
			else if (/^\d+\.\d+\s/.test(line) || /^\d+\.\s/.test(line)) {
				structuredContent.push(
					<div key={i} className="mb-3 ml-4">
						<p className="text-gray-900 dark:text-gray-100 leading-relaxed">{line}</p>
					</div>
				);
			}
			// Regular paragraphs
			else {
				structuredContent.push(
					<p key={i} className="mb-4 text-gray-900 dark:text-gray-100 leading-relaxed">
						{line}
					</p>
				);
			}
		}
		
		return structuredContent;
	};

	return (
		<div className="min-h-screen bg-gray-50 dark:bg-gray-900 font-sans text-gray-900 dark:text-white transition-colors duration-300">
			<ToastContainer />
			
			{/* Navigation Bar */}
			<nav className="sticky top-0 z-10 bg-white/80 dark:bg-gray-800/90 backdrop-blur-md shadow-md">
				<div className="container mx-auto px-4 py-3 flex justify-between items-center">
					<Button variant="ghost" onClick={handleBack} className="text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400">
						<ArrowLeft className="h-4 w-4 mr-2" />
						Workspace
					</Button>
					<div className="text-lg font-bold text-blue-600 dark:text-blue-400">AI Legal Drafter</div>
				</div>
			</nav>

			{/* Main Two-Column Layout */}
			<main className="container mx-auto px-4 py-8">
				<div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
					
					{/* Column 1: Input Form */}
					<div className="lg:sticky lg:top-[70px] lg:h-[calc(100vh-100px)]">
						<Card className="p-0 shadow-2xl h-full flex flex-col">
							<CardHeader>
								<CardTitle className="flex items-center gap-3">
									<FileText className="h-7 w-7 text-blue-600 dark:text-blue-400" />
									Drafting Instructions
								</CardTitle>
								<CardDescription>
									Select the document type and provide detailed requirements.
								</CardDescription>
							</CardHeader>
							<CardContent className="space-y-6 flex-grow flex flex-col">
								<div className="space-y-2">
									<Label htmlFor="docType">Document Type</Label>
									<Select value={docType} onValueChange={setDocType}>
										<SelectValue placeholder="Select a legal document template" />
										<SelectContent>
											<SelectItem value="contract">Employment Contract</SelectItem>
											<SelectItem value="agreement">Non-Disclosure Agreement (NDA)</SelectItem>
											<SelectItem value="affidavit">Affidavit of Identity</SelectItem>
											<SelectItem value="petition">Divorce Petition</SelectItem>
											<SelectItem value="poa">Power of Attorney</SelectItem>
											<SelectItem value="notice">Legal Notice</SelectItem>
										</SelectContent>
									</Select>
								</div>

								<div className="space-y-2 flex-grow flex flex-col">
									<Label htmlFor="details">Document Details</Label>
									<Textarea
										id="details"
										value={details}
										onChange={(e) => setDetails(e.target.value)}
										placeholder="Provide specific details like names, dates, amounts, terms, and any special requirements..."
										rows={12}
										className="flex-grow min-h-[150px] lg:min-h-0"
									/>
								</div>

								<Button 
									onClick={generateDocument} 
									disabled={loading} 
									className="w-full mt-4 bg-blue-600 hover:bg-blue-700"
								>
									{loading ? (
										<span className="flex items-center">
											<Loader className="h-5 w-5 mr-3" />
											Drafting Document...
										</span>
									) : (
										'Generate Legal Document'
									)}
								</Button>
							</CardContent>
						</Card>
					</div>

					{/* Column 2: Generated Document Output */}
					<div className="lg:h-[calc(100vh-100px)] lg:overflow-y-auto">
						<Card className={`p-0 shadow-2xl h-full ${!generatedDoc && 'border-dashed border-2 border-gray-300 dark:border-gray-700'}`}>
							<CardHeader>
								<CardTitle>
									{generatedDoc ? 'Document Preview' : 'Output Document'}
								</CardTitle>
								<CardDescription>
									{generatedDoc ? 'Review your generated legal document' : 'Generated document will appear here'}
								</CardDescription>
							</CardHeader>
							<CardContent className="h-full">
								{loading && (
									<div className="flex flex-col items-center justify-center h-full min-h-[300px] text-blue-600 dark:text-blue-400">
										<Loader className="h-10 w-10 mb-4" />
										<p className="text-lg font-medium">Generating document...</p>
										<p className="text-sm text-gray-500 dark:text-gray-400 mt-2">Please wait while we create your document</p>
									</div>
								)}
								{!loading && generatedDoc ? (
									<div className="document-output bg-white dark:bg-gray-800 p-6 lg:p-8 border border-gray-100 dark:border-gray-700 rounded-lg">
										<div className="legal-document text-gray-900 dark:text-gray-100 leading-relaxed">
											{renderStructuredDocument(generatedDoc)}
										</div>
									</div>
								) : !loading && (
									<div className="flex items-center justify-center h-full min-h-[300px] text-gray-400 dark:text-gray-600">
										<div className="text-center p-8">
											<FileText className="h-12 w-12 mx-auto mb-4" />
											<p className="text-lg font-medium">Your document will appear here</p>
											<p className="text-sm mt-1">Fill out the form and click Generate</p>
										</div>
									</div>
								)}
							</CardContent>
						</Card>
					</div>
				</div>
			</main>
		</div>
	);
};

export default Documents;