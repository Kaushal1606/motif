import { Link } from "react-router-dom";
import motifLogo from "@/assets/motif-logo.png";

const Footer = () => {
  return (
    <footer className="border-t border-border/30 py-10">
      <div className="container px-4">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          {/* Logo */}
          <Link to="/" className="flex items-center">
            <img src={motifLogo} alt="Motif" className="h-8 w-auto opacity-80 hover:opacity-100 transition-opacity" />
          </Link>

          {/* Links */}
          <nav className="flex items-center gap-6 text-sm">
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
            © {new Date().getFullYear()} Motif
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
