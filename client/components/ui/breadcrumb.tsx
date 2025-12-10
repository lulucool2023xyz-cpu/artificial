import * as React from "react";
import { Link, useLocation } from "react-router-dom";
import { ChevronRight, Home } from "lucide-react";
import { cn } from "@/lib/utils";

interface BreadcrumbItem {
  label: string;
  href?: string;
  icon?: React.ReactNode;
}

interface BreadcrumbProps {
  items?: BreadcrumbItem[];
  showHome?: boolean;
  className?: string;
}

// Route to label mapping
const routeLabels: Record<string, string> = {
  chat: "AI Chat",
  creative: "Creative Studio",
  culture: "Culture Explorer",
  library: "Library",
  subscription: "Subscription",
  settings: "Settings",
  prompts: "My Prompts",
  image: "Image Studio",
  video: "Video Studio",
  audio: "Audio Studio",
  script: "Script Writer",
  tourism: "Live Tourism",
  commercial: "Commercial Maker",
};

/**
 * Breadcrumb Navigation Component
 * 
 * Automatically generates breadcrumbs from the current URL
 * or accepts custom items.
 */
export function Breadcrumb({ items, showHome = true, className }: BreadcrumbProps) {
  const location = useLocation();
  
  // Generate breadcrumb items from URL if not provided
  const breadcrumbItems = React.useMemo(() => {
    if (items) return items;
    
    const pathSegments = location.pathname.split("/").filter(Boolean);
    
    return pathSegments.map((segment, index) => {
      const href = "/" + pathSegments.slice(0, index + 1).join("/");
      const label = routeLabels[segment] || segment.charAt(0).toUpperCase() + segment.slice(1);
      
      return {
        label,
        href: index < pathSegments.length - 1 ? href : undefined, // Last item is current page
      };
    });
  }, [items, location.pathname]);

  if (breadcrumbItems.length === 0 && !showHome) {
    return null;
  }

  return (
    <nav
      aria-label="Breadcrumb"
      className={cn(
        "flex items-center gap-1.5 text-sm text-muted-foreground",
        className
      )}
    >
      {showHome && (
        <>
          <Link
            to="/"
            className="flex items-center gap-1 hover:text-foreground transition-colors"
          >
            <Home className="w-4 h-4" />
            <span className="sr-only">Home</span>
          </Link>
          {breadcrumbItems.length > 0 && (
            <ChevronRight className="w-4 h-4 text-muted-foreground/50" />
          )}
        </>
      )}
      
      {breadcrumbItems.map((item, index) => (
        <React.Fragment key={index}>
          {item.href ? (
            <Link
              to={item.href}
              className="hover:text-foreground transition-colors flex items-center gap-1"
            >
              {item.icon}
              {item.label}
            </Link>
          ) : (
            <span className="text-foreground font-medium flex items-center gap-1">
              {item.icon}
              {item.label}
            </span>
          )}
          
          {index < breadcrumbItems.length - 1 && (
            <ChevronRight className="w-4 h-4 text-muted-foreground/50" />
          )}
        </React.Fragment>
      ))}
    </nav>
  );
}

// Compact breadcrumb for mobile
export function BreadcrumbCompact({ className }: { className?: string }) {
  const location = useLocation();
  
  const currentLabel = React.useMemo(() => {
    const pathSegments = location.pathname.split("/").filter(Boolean);
    const lastSegment = pathSegments[pathSegments.length - 1];
    return routeLabels[lastSegment] || lastSegment?.charAt(0).toUpperCase() + lastSegment?.slice(1) || "Home";
  }, [location.pathname]);

  return (
    <div className={cn("flex items-center gap-2 text-sm", className)}>
      <Link to="/" className="text-muted-foreground hover:text-foreground transition-colors">
        <Home className="w-4 h-4" />
      </Link>
      <ChevronRight className="w-4 h-4 text-muted-foreground/50" />
      <span className="text-foreground font-medium">{currentLabel}</span>
    </div>
  );
}

export default Breadcrumb;
