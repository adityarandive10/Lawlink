import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { GraduationCap, Scale, Users } from "lucide-react";
import { useNavigate } from "react-router-dom";

const roles = [
  {
    icon: GraduationCap,
    title: "Student",
    description: "Access interactive quizzes, case law library, and AI-powered learning tools",
    features: ["Quiz Generation", "Study Materials", "Career Guidance"],
    color: "text-accent",
    role: "student",
  },
  {
    icon: Scale,
    title: "Lawyer",
    description: "Generate legal documents, research case laws, and stay updated with amendments",
    features: ["Document Drafting", "Case Research", "Legal Updates"],
    color: "text-secondary",
    role: "lawyer",
  },
  {
    icon: Users,
    title: "Client",
    description: "Connect with legal professionals and access simplified legal information",
    features: ["Legal Consultation", "Document Templates", "Expert Network"],
    color: "text-primary",
    role: "client",
  },
];

const RoleSelection = () => {
  const navigate = useNavigate();
  
  return (
    <section className="py-24 bg-background">
      <div className="container mx-auto px-4">
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
          <h2 className="text-4xl md:text-5xl font-bold">
            Choose Your Path
          </h2>
          <p className="text-lg text-muted-foreground">
            Tailored experiences for every user type
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {roles.map((role, index) => (
            <Card
              key={index}
              className="p-8 bg-gradient-card border-border hover:shadow-lg transition-all duration-300 group text-center"
            >
              <div className={`${role.color} mb-6 p-4 bg-muted rounded-full w-fit mx-auto group-hover:scale-110 transition-transform`}>
                <role.icon className="h-8 w-8" />
              </div>
              <h3 className="text-2xl font-bold mb-4">{role.title}</h3>
              <p className="text-muted-foreground mb-6 leading-relaxed">
                {role.description}
              </p>
              <ul className="space-y-2 mb-6 text-sm text-muted-foreground">
                {role.features.map((feature, idx) => (
                  <li key={idx} className="flex items-center justify-center gap-2">
                    <div className="h-1.5 w-1.5 rounded-full bg-secondary" />
                    {feature}
                  </li>
                ))}
              </ul>
              <Button 
                variant="outline" 
                className="w-full group-hover:bg-primary group-hover:text-primary-foreground transition-colors"
                onClick={() => navigate(`/register?role=${role.role}`)}
              >
                Get Started as {role.title}
              </Button>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default RoleSelection;
