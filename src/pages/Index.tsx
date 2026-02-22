import { Link, useNavigate } from 'react-router-dom';
import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import Features from "@/components/Features";
import RoleSelection from "@/components/RoleSelection";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

const Index = () => {
  const navigate = useNavigate();
  
  return (
    <div className="min-h-screen">
      <Navbar />
      <Hero />
      <Features />
      <RoleSelection />
      
      {/* CTA Section */}
      <section className="py-24 bg-gradient-hero">
        <div className="container mx-auto px-4 text-center">
          <div className="max-w-3xl mx-auto space-y-8">
            <h2 className="text-4xl md:text-5xl font-bold text-primary-foreground">
              Ready to Transform Your Legal Journey?
            </h2>
            <p className="text-xl text-primary-foreground/90">
              Join thousands of students and professionals already excelling with LawLink
            </p>
            <Button variant="hero" size="lg" className="group" asChild>
              <Link to="/register">
                Start Free Trial
                <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 bg-muted/30 border-t border-border">
        <div className="container mx-auto px-4">
          <div className="text-center text-muted-foreground">
            <p>© 2025 LawLink. AI-Enhanced Legal Learning Platform.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
