import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { FileText, Brain, Scale, Newspaper, Briefcase, MessageSquare, LogOut, Globe2 } from "lucide-react";
import Chatbot from "@/components/Chatbot";

// Supported languages
const languages = [
  { code: "en", label: "English" },
  { code: "mr", label: "Marathi" },
  { code: "hi", label: "Hindi" },
  { code: "fr", label: "French" }
];

// All UI text to translate
const originalTexts = {
  title: "Your Dashboard",
  subtitle: "Access all features from one place",
  features: [
    { icon: FileText, title: "Document Generator", path: "/documents", color: "text-blue-500" },
    { icon: Brain, title: "Quizzes & Tests", path: "/quizzes", color: "text-purple-500" },
    { icon: Scale, title: "Case Law Library", path: "/case-law", color: "text-amber-500" },
    { icon: Newspaper, title: "Legal News", path: "/news", color: "text-green-500" },
    { icon: Briefcase, title: "Career Corner", path: "/careers", color: "text-red-500" },
    { icon: MessageSquare, title: "Law Society", path: "/society", color: "text-indigo-500" },
  ],
  featureDesc: "Click to access"
};

const Dashboard = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [language, setLanguage] = useState("en");
  const [displayTexts, setDisplayTexts] = useState(originalTexts);

  // Call backend translation endpoint for each string
  const handleLanguageChange = async (e) => {
    const lang = e.target.value;
    setLanguage(lang);

    if (lang === "en") {
      setDisplayTexts(originalTexts);
      return;
    }

    try {
      // Translate main headings
      const [titleRes, subtitleRes, featureDescRes] = await Promise.all([
        axios.post("/api/translate", { text: originalTexts.title, targetLanguage: lang }),
        axios.post("/api/translate", { text: originalTexts.subtitle, targetLanguage: lang }),
        axios.post("/api/translate", { text: originalTexts.featureDesc, targetLanguage: lang }),
      ]);

      // Translate each feature's title
      const featureTitles = await Promise.all(
        originalTexts.features.map(feat =>
          axios.post("/api/translate", { text: feat.title, targetLanguage: lang })
        )
      );

      setDisplayTexts({
        ...originalTexts,
        title: titleRes.data.translation,
        subtitle: subtitleRes.data.translation,
        features: originalTexts.features.map((feat, idx) => ({
          ...feat,
          title: featureTitles[idx].data.translation
        })),
        featureDesc: featureDescRes.data.translation
      });
    } catch (err) {
      setDisplayTexts(originalTexts); // fallback to English
    }
  };

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <div
      className="min-h-screen bg-gradient-subtle"
      style={{
        backgroundImage: 'url("/img/BG1.jpg")',
        backgroundRepeat: "no-repeat",
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundAttachment: "fixed"
      }}
    >
      <nav className="bg-background/80 backdrop-blur-sm border-b sticky top-0 z-40">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <Scale className="h-6 w-6 text-primary" />
            <span className="text-xl font-bold">LawLink</span>
          </div>
          <div className="flex items-center gap-4">
            <div className="relative">
              <Globe2 className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <select
                className="pl-8 pr-4 py-1 rounded border border-muted-foreground/40 bg-background text-sm focus:outline-none"
                value={language}
                onChange={handleLanguageChange}
              >
                {languages.map(lang => (
                  <option key={lang.code} value={lang.code}>{lang.label}</option>
                ))}
              </select>
            </div>
            <span className="text-sm text-muted-foreground">Welcome, {user?.name}</span>
            <Button variant="outline" size="sm" onClick={handleLogout}>
              <LogOut className="h-4 w-4 mr-2" />
              Logout
            </Button>
          </div>
        </div>
      </nav>
      <main className="container mx-auto px-4 py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">{displayTexts.title}</h1>
          <p className="text-muted-foreground">{displayTexts.subtitle}</p>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {displayTexts.features.map((feature) => (
            <Card
              key={feature.path}
              className="cursor-pointer hover:shadow-elegant transition-all"
              onClick={() => navigate(feature.path)}
            >
              <CardHeader>
                <feature.icon className={`h-12 w-12 ${feature.color} mb-4`} />
                <CardTitle>{feature.title}</CardTitle>
                <CardDescription>
                  {displayTexts.featureDesc} {feature.title.toLowerCase()}
                </CardDescription>
              </CardHeader>
            </Card>
          ))}
        </div>
      </main>
      <Chatbot />
    </div>
  );
};

export default Dashboard;
