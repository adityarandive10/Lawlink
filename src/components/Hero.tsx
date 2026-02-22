import { Button } from "@/components/ui/button";
import { ArrowRight, Sparkles, BookOpen, FileText } from "lucide-react";
import { useNavigate } from "react-router-dom";
import heroImage from "@/assets/hero-legal.jpg";

const Hero = () => {
  const navigate = useNavigate();
  
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background Image with Overlay */}
      <div className="absolute inset-0 z-0">
        <img
          src={heroImage}
          alt="Legal education and practice"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-hero opacity-90" />
      </div>

      {/* Content */}
      <div className="container relative z-10 mx-auto px-4 py-32">
        <div className="max-w-4xl mx-auto text-center space-y-8 animate-slide-up">
          <div className="">
            
            
          </div>

          <h1 className="text-5xl md:text-7xl font-bold text-primary-foreground leading-tight">
            Master Law with
            <span className="block bg-gradient-accent bg-clip-text text-transparent">
              AI-Powered Learning
            </span>
          </h1>

          <p className="text-xl md:text-2xl text-primary-foreground/90 max-w-2xl mx-auto leading-relaxed">
            Transform your legal education and practice with intelligent document generation, 
            interactive learning, and comprehensive case law research—all in one platform.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-6">
            <Button variant="hero" size="lg" className="group" onClick={() => navigate('/register')}>
              Start Learning Free
              <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
            </Button>
            <Button 
              variant="outline" 
              size="lg" 
              className="bg-background/10 backdrop-blur-sm border-primary-foreground/20 text-primary-foreground hover:bg-background/20"
              onClick={() => navigate('/dashboard')}
            >
              Watch Demo
            </Button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pt-16 max-w-3xl mx-auto">
            <div className="space-y-2">
              <div className="text-4xl font-bold text-secondary">10K+</div>
              <div className="text-primary-foreground/80">Legal Documents</div>
            </div>
            <div className="space-y-2">
              <div className="text-4xl font-bold text-secondary">5K+</div>
              <div className="text-primary-foreground/80">Case Laws</div>
            </div>
            <div className="space-y-2">
              <div className="text-4xl font-bold text-secondary">AI</div>
              <div className="text-primary-foreground/80">Powered Assistant</div>
            </div>
          </div>
        </div>
      </div>

      {/* Decorative Elements */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-background to-transparent" />
    </section>
  );
};

export default Hero;
