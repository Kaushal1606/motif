import { Link } from "react-router-dom";
import { Film } from "lucide-react";

const Footer = () => {
  return (
    <footer className="border-t border-border py-12">
      <div className="container px-4">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg gradient-primary flex items-center justify-center">
              <Film className="w-4 h-4 text-primary-foreground" />
            </div>
            <span className="text-xl font-bold">Motif</span>
          </Link>

          {/* Links */}
          <nav className="flex items-center gap-8">
            <Link to="/about" className="text-muted-foreground hover:text-foreground transition-colors">
              About
            </Link>
            <Link to="/pricing" className="text-muted-foreground hover:text-foreground transition-colors">
              Pricing
            </Link>
            <Link to="/terms" className="text-muted-foreground hover:text-foreground transition-colors">
              Terms
            </Link>
            <Link to="/privacy" className="text-muted-foreground hover:text-foreground transition-colors">
              Privacy
            </Link>
          </nav>

          {/* Copyright */}
          <p className="text-sm text-muted-foreground">
            © {new Date().getFullYear()} Motif. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
