import { Card } from "@/components/ui/card";
import { PencilLine, Lightbulb, Search, User2, Globe, Layers } from "lucide-react";
import { useNavigate } from "react-router-dom";

const features = [
  {
    icon: PencilLine,
    title: "AI Document Generation",
    description: "Create legal documents, contracts, and petitions with intelligent AI assistance. Save hours of drafting time.",
    color: "bg-blue-100 text-blue-700",
    link: "/documents",
  },
  {
    icon: Lightbulb,
    title: "Smart Quizzes",
    description: "Test your knowledge with AI-generated quizzes. Get instant feedback and personalized learning paths.",
    color: "bg-yellow-100 text-yellow-700",
    link: "/quizzes",
  },
  {
    icon: Search,
    title: "Case Law Research",
    description: "Access thousands of case laws with AI-powered summarization and intelligent search capabilities.",
    color: "bg-green-100 text-green-700",
    link: "/case-law",
  },
  {
    icon: User2,
    title: "AI Legal Assistant",
    description: "Get instant answers to legal questions, guidance on procedures, and contextual help 24/7.",
    color: "bg-purple-100 text-purple-700",
    link: "/society",
  },
  {
    icon: Globe,
    title: "Legal News Feed",
    description: "Stay updated with the latest amendments, judgments, and legal developments with AI-curated content.",
    color: "bg-red-100 text-red-700",
    link: "/news",
  },
  {
    icon: Layers,
    title: "Career Opportunities",
    description: "Discover internships, jobs, and competitions tailored to your profile and interests.",
    color: "bg-pink-100 text-pink-700",
    link: "/careers",
  },
];

const Features = () => {
  const navigate = useNavigate();

  return (
    <section id="features" className="py-24 bg-muted/30">
      <div className="container mx-auto px-4">
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
          <h2 className="text-4xl md:text-5xl font-bold">
            Everything You Need to Excel
          </h2>
          <p className="text-lg text-muted-foreground">
            Comprehensive tools powered by AI to transform your legal learning and practice
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <Card
              key={index}
              className="p-8 rounded-xl border border-border shadow-md hover:shadow-lg transition-all duration-300 group cursor-pointer bg-white"
              onClick={() => navigate(feature.link)}
            >
              <div className={`${feature.color} mb-6 w-14 h-14 flex items-center justify-center rounded-full shadow group-hover:scale-110 transition-transform`}>
                <feature.icon className="h-8 w-8" />
              </div>
              <h3 className="text-lg font-semibold mb-2">{feature.title}</h3>
              <p className="text-muted-foreground leading-relaxed">
                {feature.description}
              </p>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;
