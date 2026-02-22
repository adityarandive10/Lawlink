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
const Brain = (props) => <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 18a4 4 0 0 0-4-4H4a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4a4 4 0 0 0 4-4"/><path d="M12 18a4 4 0 0 1 4-4h4a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2h-4a4 4 0 0 1-4-4"/><path d="M12 18v6"/><path d="M12 12V4"/><path d="M12 14v-4"/><path d="M18 10a4 4 0 0 1 0 8"/><path d="M6 10a4 4 0 0 0 0 8"/></svg>;
const CheckCircle = (props) => <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><path d="M9 11l3 3L22 4"/></svg>;
const XCircle = (props) => <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><path d="m15 9-6 6"/><path d="m9 9 6 6"/></svg>;
const Loader = (props) => <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="animate-spin"><path d="M21 12a9 9 0 1 1-6.219-8.56"/></svg>;

// Base UI Components
const Card = ({ children, className = '' }) => <div className={`bg-white dark:bg-gray-800 rounded-2xl shadow-xl transition-all duration-300 ${className}`}>{children}</div>;
const CardHeader = ({ children, className = '' }) => <div className={`p-6 border-b border-gray-100 dark:border-gray-700 ${className}`}>{children}</div>;
const CardContent = ({ children, className = '' }) => <div className={`p-6 ${className}`}>{children}</div>;
const CardTitle = ({ children, className = '' }) => <h2 className={`text-2xl font-bold text-gray-900 dark:text-white ${className}`}>{children}</h2>;
const CardDescription = ({ children, className = '' }) => <p className={`text-sm text-gray-500 dark:text-gray-400 mt-1 ${className}`}>{children}</p>;
const Label = ({ children, htmlFor, className = '' }) => <label htmlFor={htmlFor} className={`text-sm font-medium text-gray-700 dark:text-gray-300 block mb-1 ${className}`}>{children}</label>;

const commonInputClasses = 'w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200';

const Button = ({ children, onClick, disabled, variant = 'default', size = 'default', className = '' }) => {
	let baseClasses = 'inline-flex items-center justify-center font-semibold rounded-lg transition-all duration-200 focus:outline-none focus:ring-4 ';
	let sizeClasses = size === 'lg' ? 'px-8 py-4 text-lg' : (size === 'sm' ? 'px-3 py-1.5 text-sm' : 'px-6 py-3');

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

// Mock RadioGroup
const RadioGroup = ({ children }) => <div className="space-y-3">{children}</div>;

// --- MOCK QUIZ SERVICE WITH 20 QUESTIONS PER TOPIC ---
const mockQuizService = {
	generateQuiz: async (topic) => {
		// Simulate API delay
		await new Promise(resolve => setTimeout(resolve, 1500));
		
		const quizTemplates = {
			'Constitutional Law': [
				{ question: "Which amendment guarantees freedom of speech, press, and assembly?", options: ["First Amendment", "Fourth Amendment", "Fifth Amendment", "Tenth Amendment"], correct: 0 },
				{ question: "The landmark case establishing judicial review was:", options: ["Marbury v. Madison", "McCulloch v. Maryland", "Brown v. Board", "Roe v. Wade"], correct: 0 },
				{ question: "The 'necessary and proper' clause is found in which article?", options: ["Article I", "Article II", "Article III", "Article IV"], correct: 0 },
				{ question: "Which amendment prohibits cruel and unusual punishment?", options: ["Eighth Amendment", "Fourth Amendment", "Sixth Amendment", "Fourteenth Amendment"], correct: 0 },
				{ question: "The principle of 'one person, one vote' was established in:", options: ["Reynolds v. Sims", "Baker v. Carr", "Both A and B", "Neither A nor B"], correct: 2 },
				{ question: "Which clause requires states to honor the public acts of other states?", options: ["Full Faith and Credit Clause", "Commerce Clause", "Supremacy Clause", "Privileges and Immunities Clause"], correct: 0 },
				{ question: "The power of Congress to regulate interstate commerce comes from:", options: ["Commerce Clause", "Necessary and Proper Clause", "General Welfare Clause", "Supremacy Clause"], correct: 0 },
				{ question: "Which case established the 'separate but equal' doctrine?", options: ["Plessy v. Ferguson", "Dred Scott v. Sandford", "Lochner v. New York", "Gitlow v. New York"], correct: 0 },
				{ question: "The right to privacy was first recognized in:", options: ["Griswold v. Connecticut", "Roe v. Wade", "Lawrence v. Texas", "Obergefell v. Hodges"], correct: 0 },
				{ question: "Which amendment guarantees the right to bear arms?", options: ["Second Amendment", "First Amendment", "Fourth Amendment", "Fifth Amendment"], correct: 0 },
				{ question: "The 'exclusionary rule' was applied to states through:", options: ["Mapp v. Ohio", "Miranda v. Arizona", "Gideon v. Wainwright", "Terry v. Ohio"], correct: 0 },
				{ question: "Which case established the 'clear and present danger' test?", options: ["Schenck v. United States", "Brandenburg v. Ohio", "Texas v. Johnson", "Tinker v. Des Moines"], correct: 0 },
				{ question: "The 'Lemon test' is used for cases involving:", options: ["Establishment Clause", "Free Exercise Clause", "Equal Protection", "Due Process"], correct: 0 },
				{ question: "Which amendment guarantees the right to a speedy trial?", options: ["Sixth Amendment", "Fifth Amendment", "Seventh Amendment", "Eighth Amendment"], correct: 0 },
				{ question: "The 'incorporation doctrine' applies the Bill of Rights to states through:", options: ["Fourteenth Amendment", "Tenth Amendment", "Commerce Clause", "Necessary and Proper Clause"], correct: 0 },
				{ question: "Which case legalized same-sex marriage nationwide?", options: ["Obergefell v. Hodges", "Lawrence v. Texas", "United States v. Windsor", "Bowers v. Hardwick"], correct: 0 },
				{ question: "The 'right to remain silent' comes from which amendment?", options: ["Fifth Amendment", "Fourth Amendment", "Sixth Amendment", "Eighth Amendment"], correct: 0 },
				{ question: "Which case established the 'Miranda warnings'?", options: ["Miranda v. Arizona", "Escobedo v. Illinois", "Gideon v. Wainwright", "Mapp v. Ohio"], correct: 0 },
				{ question: "The 'double jeopardy' clause is found in which amendment?", options: ["Fifth Amendment", "Fourth Amendment", "Sixth Amendment", "Eighth Amendment"], correct: 0 },
				{ question: "Which case ended racial segregation in public schools?", options: ["Brown v. Board of Education", "Plessy v. Ferguson", "Shelley v. Kraemer", "Loving v. Virginia"], correct: 0 }
			],
			'Criminal Law': [
				{ question: "The standard of proof in criminal cases is:", options: ["Beyond reasonable doubt", "Preponderance of evidence", "Clear and convincing", "Probable cause"], correct: 0 },
				{ question: "What does 'mens rea' refer to?", options: ["Guilty mind", "Guilty act", "Criminal intent", "Both A and C"], correct: 3 },
				{ question: "Which is NOT a common law felony?", options: ["Murder", "Robbery", "Burglary", "Drug possession"], correct: 3 },
				{ question: "The 'exclusionary rule' prohibits use of:", options: ["Illegally obtained evidence", "Hearsay evidence", "Circumstantial evidence", "Character evidence"], correct: 0 },
				{ question: "What is 'actus reus'?", options: ["Guilty act", "Guilty mind", "Criminal result", "Causal connection"], correct: 0 },
				{ question: "Which defense argues the defendant didn't understand right from wrong?", options: ["Insanity defense", "Duress", "Self-defense", "Entrapment"], correct: 0 },
				{ question: "The maximum punishment for misdemeanors is typically:", options: ["One year in jail", "Five years in prison", "Life imprisonment", "Death penalty"], correct: 0 },
				{ question: "What is 'double jeopardy'?", options: ["Being tried twice for same offense", "Multiple charges for one act", "Appealing a conviction", "Pleading guilty twice"], correct: 0 },
				{ question: "Which is an inchoate crime?", options: ["Attempt", "Conspiracy", "Solicitation", "All of the above"], correct: 3 },
				{ question: "The 'Miranda rights' come from which amendment?", options: ["Fifth Amendment", "Fourth Amendment", "Sixth Amendment", "Eighth Amendment"], correct: 0 },
				{ question: "What is 'habeas corpus'?", options: ["Challenge to unlawful detention", "Right to speedy trial", "Protection from double jeopardy", "Right to counsel"], correct: 0 },
				{ question: "Which is NOT an element of murder?", options: ["Unlawful killing", "Malice aforethought", "Premeditation", "All are elements"], correct: 2 },
				{ question: "The 'felony murder rule' applies when:", options: ["Death occurs during felony", "Premeditated murder", "Accidental killing", "Self-defense killing"], correct: 0 },
				{ question: "What is 'entrapment'?", options: ["Government induces crime", "Police use excessive force", "Illegal search", "Coerced confession"], correct: 0 },
				{ question: "Which amendment prohibits excessive bail?", options: ["Eighth Amendment", "Fourth Amendment", "Fifth Amendment", "Sixth Amendment"], correct: 0 },
				{ question: "What is 'corpus delicti'?", options: ["Body of the crime", "Criminal intent", "Physical evidence", "Criminal act"], correct: 0 },
				{ question: "The 'castle doctrine' allows:", options: ["Use of force in home", "Self-defense anywhere", "Defense of property", "Preemptive strikes"], correct: 0 },
				{ question: "Which is NOT a justification defense?", options: ["Self-defense", "Defense of others", "Insanity", "Necessity"], correct: 2 },
				{ question: "What is 'nolo contendere'?", options: ["No contest plea", "Guilty plea", "Not guilty plea", "Alford plea"], correct: 0 },
				{ question: "The 'beyond reasonable doubt' standard requires:", options: ["Moral certainty", "Absolute certainty", "Probable certainty", "Substantial certainty"], correct: 0 }
			],
			'Contract Law': [
				{ question: "The three essential elements of a contract are:", options: ["Offer, acceptance, consideration", "Writing, signature, delivery", "Capacity, legality, intent", "Performance, payment, termination"], correct: 0 },
				{ question: "Which doctrine requires certain contracts to be in writing?", options: ["Statute of Frauds", "Parol Evidence Rule", "Mirror Image Rule", "Consideration Doctrine"], correct: 0 },
				{ question: "What is 'consideration'?", options: ["Something of legal value", "Adequate market value", "Fair exchange", "Written promise"], correct: 0 },
				{ question: "The 'mailbox rule' applies to:", options: ["Acceptance of offers", "Rejection of offers", "Revocation of offers", "All communications"], correct: 0 },
				{ question: "Which is NOT a required element for contract formation?", options: ["Writing", "Offer", "Acceptance", "Consideration"], correct: 0 },
				{ question: "The 'parol evidence rule' prohibits:", options: ["Contradicting written terms", "Explaining ambiguous terms", "Showing fraud", "Proving mistake"], correct: 0 },
				{ question: "What is 'quantum meruit'?", options: ["Reasonable value of services", "Breach of contract", "Specific performance", "Liquidated damages"], correct: 0 },
				{ question: "Which remedy requires performance of the contract?", options: ["Specific performance", "Damages", "Rescission", "Reformation"], correct: 0 },
				{ question: "The 'mirror image rule' requires acceptance to:", options: ["Match offer exactly", "Be in writing", "Be communicated promptly", "Include consideration"], correct: 0 },
				{ question: "What is an 'implied contract'?", options: ["Created by parties' conduct", "Written but not signed", "Oral agreement", "Modified contract"], correct: 0 },
				{ question: "Which defense argues the contract was signed under threat?", options: ["Duress", "Undue influence", "Mistake", "Misrepresentation"], correct: 0 },
				{ question: "The 'statute of limitations' for contracts is typically:", options: ["3-6 years", "1 year", "10 years", "No time limit"], correct: 0 },
				{ question: "What are 'liquidated damages'?", options: ["Predetermined damages", "Punitive damages", "Compensatory damages", "Nominal damages"], correct: 0 },
				{ question: "Which is NOT a type of contract?", options: ["Unilateral", "Bilateral", "Executory", "All are types"], correct: 3 },
				{ question: "The 'doctrine of substantial performance' applies when:", options: ["Minor contract breaches", "Material breaches", "Anticipatory breaches", "No breaches"], correct: 0 },
				{ question: "What is 'anticipatory repudiation'?", options: ["Announcing breach before due date", "Refusing to negotiate", "Demanding better terms", "Delaying performance"], correct: 0 },
				{ question: "The 'UCC' governs which type of contracts?", options: ["Sale of goods", "Real estate", "Employment", "All contracts"], correct: 0 },
				{ question: "Which is required for contract capacity?", options: ["Mental competence", "Legal age", "Sober state", "All of the above"], correct: 3 },
				{ question: "What is 'rescission'?", options: ["Canceling the contract", "Modifying the contract", "Enforcing the contract", "Interpreting the contract"], correct: 0 },
				{ question: "The 'purpose test' determines:", options: ["Contract legality", "Adequacy of consideration", "Capacity of parties", "Formation of offer"], correct: 0 }
			],
			'Property Law': [
				{ question: "The highest form of property ownership is:", options: ["Fee simple absolute", "Life estate", "Leasehold", "Easement"], correct: 0 },
				{ question: "What is 'adverse possession'?", options: ["Acquiring title through continuous use", "Leasing property", "Inheriting property", "Purchasing property"], correct: 0 },
				{ question: "The document that proves ownership is:", options: ["Deed", "Mortgage", "Lease", "Title insurance"], correct: 0 },
				{ question: "Which estate lasts for the life of a person?", options: ["Life estate", "Fee simple", "Leasehold", "Easement"], correct: 0 },
				{ question: "What is an 'easement'?", options: ["Right to use another's land", "Ownership interest", "Lease agreement", "Mortgage lien"], correct: 0 },
				{ question: "The 'recording statute' protects:", options: ["Bona fide purchasers", "Adverse possessors", "Tenants", "Mortgage lenders"], correct: 0 },
				{ question: "Which is NOT a type of concurrent ownership?", options: ["Fee simple", "Joint tenancy", "Tenancy in common", "Tenancy by entirety"], correct: 0 },
				{ question: "What is a 'covenant running with the land'?", options: ["Binding future owners", "Temporary agreement", "Personal promise", "Lease provision"], correct: 0 },
				{ question: "The 'rule against perpetuities' limits:", options: ["Future interests", "Present interests", "Lease terms", "Easements"], correct: 0 },
				{ question: "What is 'eminent domain'?", options: ["Government taking property", "Private property sale", "Adverse possession", "Inheritance"], correct: 0 },
				{ question: "Which provides the most protection to tenants?", options: ["Warranty of habitability", "Quiet enjoyment", "Security deposit", "Lease term"], correct: 0 },
				{ question: "The 'bundle of rights' includes:", options: ["Possession, use, exclusion", "Only possession", "Only use", "Only exclusion"], correct: 0 },
				{ question: "What is a 'fixture'?", options: ["Personal property attached to land", "Movable property", "Real property document", "Lease agreement"], correct: 0 },
				{ question: "Which is required for valid deed?", options: ["Writing, signature, delivery", "Recording, notarization, payment", "Witnesses, seal, consideration", "All of the above"], correct: 0 },
				{ question: "The 'doctrine of worthier title' applies to:", options: ["Future interests", "Present interests", "Leaseholds", "Easements"], correct: 0 },
				{ question: "What is 'waste'?", options: ["Damage to property", "Reasonable use", "Improvement", "Maintenance"], correct: 0 },
				{ question: "The 'Torrens system' is for:", options: ["Title registration", "Property taxation", "Zoning regulation", "Environmental protection"], correct: 0 },
				{ question: "Which is NOT a freehold estate?", options: ["Leasehold", "Fee simple", "Life estate", "Fee tail"], correct: 0 },
				{ question: "What is 'livery of seisin'?", options: ["Ancient land transfer ceremony", "Modern deed recording", "Lease execution", "Mortgage signing"], correct: 0 },
				{ question: "The 'rule in Shelley's Case' deals with:", options: ["Future interests", "Present possessory interests", "Lease agreements", "Easements"], correct: 0 }
			],
			'Corporate Law': [
				{ question: "The fiduciary duty requiring careful decision-making is:", options: ["Duty of care", "Duty of loyalty", "Duty of obedience", "Duty of disclosure"], correct: 0 },
				{ question: "What protects shareholders from corporate debts?", options: ["Limited liability", "Corporate veil", "Indemnification", "Insurance"], correct: 0 },
				{ question: "The 'business judgment rule' protects directors who:", options: ["Act in good faith with due care", "Always make profitable decisions", "Never take risks", "Follow shareholder demands"], correct: 0 },
				{ question: "Corporate bylaws govern:", options: ["Internal corporate affairs", "External relations", "Government compliance", "Shareholder investments"], correct: 0 },
				{ question: "Directors owe fiduciary duties to:", options: ["Corporation and shareholders", "CEO only", "Employees only", "Government only"], correct: 0 },
				{ question: "What is 'piercing the corporate veil'?", options: ["Holding shareholders liable", "Protecting directors", "Limiting liability", "Incorporating"], correct: 0 },
				{ question: "The 'duty of loyalty' prohibits:", options: ["Self-dealing", "Poor decisions", "Risk-taking", "All business activities"], correct: 0 },
				{ question: "Which document creates a corporation?", options: ["Articles of incorporation", "Bylaws", "Shareholder agreement", "Corporate resolution"], correct: 0 },
				{ question: "The 'ultra vires' doctrine limits:", options: ["Corporate powers", "Shareholder rights", "Director duties", "Officer compensation"], correct: 0 },
				{ question: "What is a 'derivative lawsuit'?", options: ["Shareholder suing on behalf of corporation", "Corporation suing shareholder", "Director suing officer", "Employee suing director"], correct: 0 },
				{ question: "The 'RMBCA' is a:", options: ["Model corporation law", "Federal statute", "SEC regulation", "Tax code"], correct: 0 },
				{ question: "Which is NOT a corporate characteristic?", options: ["Limited liability", "Perpetual existence", "Centralized management", "Personal liability"], correct: 3 },
				{ question: "The 'proxy system' allows:", options: ["Voting by representation", "Direct voting only", "Management control", "Government oversight"], correct: 0 },
				{ question: "What is a 'close corporation'?", options: ["Few shareholders, no public trading", "Many shareholders, public trading", "Government-owned", "Non-profit"], correct: 0 },
				{ question: "The 'Williams Act' regulates:", options: ["Tender offers", "IPO filings", "Annual meetings", "Dividend payments"], correct: 0 },
				{ question: "Directors are elected by:", options: ["Shareholders", "CEO", "Employees", "Government"], correct: 0 },
				{ question: "What is 'insider trading'?", options: ["Trading on non-public information", "Legal stock trading", "Market speculation", "Investment strategy"], correct: 0 },
				{ question: "The 'Sarbanes-Oxley Act' addresses:", options: ["Corporate governance", "Antitrust issues", "Environmental compliance", "Labor relations"], correct: 0 },
				{ question: "Which is a defense to hostile takeover?", options: ["Poison pill", "Friendly merger", "Stock buyback", "Dividend increase"], correct: 0 },
				{ question: "The 'duty of care' requires directors to:", options: ["Be informed and deliberate", "Always succeed", "Avoid all risks", "Follow majority opinion"], correct: 0 }
			],
			'Family Law': [
				{ question: "The 'best interests of the child' standard applies to:", options: ["Child custody", "Adoption", "Child support", "All of the above"], correct: 3 },
				{ question: "What is required for common law marriage?", options: ["Cohabitation and holding out as married", "Written agreement", "Religious ceremony", "Children together"], correct: 0 },
				{ question: "No-fault divorce requires:", options: ["Irreconcilable differences", "Adultery proof", "Abuse evidence", "Abandonment proof"], correct: 0 },
				{ question: "Prenuptial agreements typically address:", options: ["Property division", "Child custody", "Daily responsibilities", "Religious upbringing"], correct: 0 },
				{ question: "The legal process for establishing paternity is:", options: ["Paternity action", "Filiation proceeding", "Maternity suit", "Parentage establishment"], correct: 0 },
				{ question: "What is 'palimony'?", options: ["Support after non-marital relationship", "Alimony payment", "Child support", "Property settlement"], correct: 0 },
				{ question: "The 'Uniform Child Custody Jurisdiction Act' determines:", options: ["Which court has jurisdiction", "Custody standards", "Support amounts", "Visitation schedules"], correct: 0 },
				{ question: "What is 'emancipation'?", options: ["Minor attaining legal independence", "Divorce decree", "Marriage dissolution", "Adoption finalization"], correct: 0 },
				{ question: "The 'putative spouse doctrine' protects:", options: ["Good faith belief in valid marriage", "Common law spouses", "Engaged couples", "Domestic partners"], correct: 0 },
				{ question: "What is 'equitable distribution'?", options: ["Fair property division", "Equal property division", "Automatic property division", "No property division"], correct: 0 },
				{ question: "The 'tender years doctrine' presumed:", options: ["Mother should have custody of young children", "Father should have custody", "Joint custody is best", "Grandparents should have custody"], correct: 0 },
				{ question: "What is 'annulment'?", options: ["Declaration marriage never existed", "Divorce", "Legal separation", "Marriage counseling"], correct: 0 },
				{ question: "The 'interlocutory decree' in divorce is:", options: ["Temporary order", "Final judgment", "Appeal decision", "Settlement agreement"], correct: 0 },
				{ question: "What is 'quantum meruit' in family law?", options: ["Reasonable value of services", "Child support calculation", "Alimony determination", "Property valuation"], correct: 0 },
				{ question: "The 'Uniform Parentage Act' governs:", options: ["Parent-child relationships", "Marriage requirements", "Divorce procedures", "Adoption standards"], correct: 0 },
				{ question: "What is 'separate maintenance'?", options: ["Support during separation", "Divorce settlement", "Child support", "Property division"], correct: 0 },
				{ question: "The 'clean hands doctrine' requires:", options: ["Petitioner acted fairly", "Respondent acted fairly", "Both acted fairly", "Neither acted fairly"], correct: 0 },
				{ question: "What is 'collaborative divorce'?", options: ["Settlement without litigation", "Court-mediated divorce", "Default divorce", "Contested divorce"], correct: 0 },
				{ question: "The 'discovery process' in divorce involves:", options: ["Exchanging information", "Court hearings", "Mediation sessions", "Trial proceedings"], correct: 0 },
				{ question: "What is 'pendente lite' support?", options: ["Temporary support during case", "Permanent alimony", "Child support", "Property settlement"], correct: 0 }
			]
		};

		return quizTemplates[topic] || [];
	}
};

const Quizzes = () => {
	const { toast, ToastContainer } = useToast();
	
	const handleBack = () => {
		// No action performed as external routing is not available
	};
	
	const [topic, setTopic] = useState('');
	const [questions, setQuestions] = useState([]);
	const [answers, setAnswers] = useState({});
	const [showResults, setShowResults] = useState(false);
	const [loading, setLoading] = useState(false);

	const generateQuiz = async () => {
		if (!topic) {
			toast({ title: 'Input Required', description: 'Please select a topic.', variant: 'destructive' });
			return;
		}

		setLoading(true);
		setQuestions([]);
		
		try {
			const quizQuestions = await mockQuizService.generateQuiz(topic);
			setQuestions(quizQuestions);
			setAnswers({});
			setShowResults(false);
			toast({ 
				title: 'Success', 
				description: `Quiz with ${quizQuestions.length} questions generated!`, 
				variant: 'default' 
			});
		} catch (error) {
			console.error('Generation Error:', error);
			toast({ 
				title: 'Generation Error', 
				description: 'Failed to generate quiz. Please try again.', 
				variant: 'destructive' 
			});
		} finally {
			setLoading(false);
		}
	};

	const submitQuiz = () => {
		const answeredCount = Object.keys(answers).length;
		if (answeredCount < questions.length) {
			toast({ 
				title: 'Wait!', 
				description: `Please answer all ${questions.length} questions before submitting.`, 
				variant: 'destructive' 
			});
			return;
		}

		setShowResults(true);
		const score = questions.filter((q, i) => answers[i] === q.options[q.correct]).length;
		toast({ 
			title: 'Quiz Complete', 
			description: `You scored ${score}/${questions.length}!`, 
			variant: 'default' 
		});
	};

	const handleAnswerChange = (qIdx, val) => {
		if (!showResults) {
			setAnswers({ ...answers, [qIdx]: val });
		}
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
					<div className="text-lg font-bold text-blue-600 dark:text-blue-400">AI Legal Quizzer</div>
				</div>
			</nav>

			<main className="container mx-auto px-4 py-12">
				<div className="max-w-4xl mx-auto space-y-8">
					
					{/* Input Card */}
					<Card className="shadow-2xl">
						<CardHeader>
							<CardTitle className="flex items-center gap-3 text-3xl">
								<Brain className="h-7 w-7 text-blue-600 dark:text-blue-400" />
								Generate a Quiz
							</CardTitle>
							<CardDescription>
								Test your knowledge in legal studies with 20 challenging multiple-choice questions.
							</CardDescription>
						</CardHeader>
						<CardContent className="space-y-6">
							<div className="space-y-2">
								<Label htmlFor="topic-select">Select Topic</Label>
								<Select value={topic} onValueChange={setTopic}>
									<SelectValue placeholder="Choose a topic" />
									<SelectContent>
										<SelectItem value="Constitutional Law">Constitutional Law</SelectItem>
										<SelectItem value="Criminal Law">Criminal Law</SelectItem>
										<SelectItem value="Contract Law">Contract Law</SelectItem>
										<SelectItem value="Property Law">Property Law</SelectItem>
										<SelectItem value="Corporate Law">Corporate Law</SelectItem>
										<SelectItem value="Family Law">Family Law</SelectItem>
									</SelectContent>
								</Select>
							</div>

							<Button onClick={generateQuiz} disabled={loading} className="w-full bg-blue-600 hover:bg-blue-700">
								{loading ? (
									<span className="flex items-center">
										<Loader className="h-5 w-5 mr-3" />
										Generating 20 Questions...
									</span>
								) : (
									'Generate 20 Question Quiz'
								)}
							</Button>
						</CardContent>
					</Card>

					{/* Questions List */}
					{questions.length > 0 && (
						<>
							{questions.map((q, qIdx) => {
								const isAnswered = !!answers[qIdx];
								const cardClassName = showResults 
									? (answers[qIdx] === q.options[q.correct] ? 'shadow-green-500/30' : 'shadow-red-500/30') 
									: (isAnswered ? 'shadow-blue-500/30 border-blue-200' : '');

								return (
									<Card key={qIdx} className={`shadow-xl ${cardClassName}`}>
										<CardHeader>
											<CardTitle className="text-xl flex justify-between items-center">
												<span className="text-gray-600 dark:text-gray-400 font-medium">Question {qIdx + 1}</span>
												{showResults && (
													answers[qIdx] === q.options[q.correct] 
													? <CheckCircle className="h-6 w-6 text-green-500" />
													: <XCircle className="h-6 w-6 text-red-500" />
												)}
											</CardTitle>
											<CardDescription className="text-lg font-semibold mt-2 text-gray-900 dark:text-white">
												{q.question}
											</CardDescription>
										</CardHeader>
										<CardContent>
											<RadioGroup>
												{q.options.map((opt, oIdx) => {
													const isSelected = answers[qIdx] === opt;
													const isCorrect = opt === q.options[q.correct];
													let optionClasses = 'flex items-center space-x-3 p-3 rounded-lg border transition-all duration-200 cursor-pointer text-gray-900 dark:text-gray-100';

													if (showResults) {
														if (isCorrect) {
															optionClasses += ' border-green-500 bg-green-50 dark:bg-green-900/40 font-bold';
														} else if (isSelected && !isCorrect) {
															optionClasses += ' border-red-500 bg-red-50 dark:bg-red-900/40 line-through opacity-70';
														} else {
															optionClasses += ' border-gray-200 dark:border-gray-700 opacity-50';
														}
													} else {
														optionClasses += isSelected 
															? ' border-blue-500 bg-blue-50 dark:bg-blue-900/40 shadow-md' 
															: ' border-gray-200 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-700';
													}

													return (
														<div 
															key={oIdx} 
															className={optionClasses}
															onClick={() => handleAnswerChange(qIdx, opt)}
														>
															<div className={`h-5 w-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 transition-colors duration-150 ${
																isSelected 
																	? (showResults && isCorrect ? 'border-green-600 bg-green-600' : 'border-blue-600 bg-blue-600')
																	: 'border-gray-400 dark:border-gray-500'
															}`}>
																{(isSelected || (showResults && isCorrect)) && <div className="h-2.5 w-2.5 rounded-full bg-white"></div>}
															</div>
															
															<span className="flex-1">
																{opt}
																{showResults && isCorrect && isSelected && (
																	<span className="text-green-600 ml-2 font-bold">(Correct)</span>
																)}
																{showResults && isCorrect && !isSelected && (
																	<span className="text-green-600 ml-2 font-bold">(Correct Answer)</span>
																)}
															</span>
														</div>
													);
												})}
											</RadioGroup>
										</CardContent>
									</Card>
								);
							})}

							{/* Submit Button */}
							{!showResults && (
								<Button onClick={submitQuiz} className="w-full shadow-lg hover:shadow-xl" size="lg">
									Submit Quiz
								</Button>
							)}
						</>
					)}
				</div>
			</main>
		</div>
	);
};

export default Quizzes;