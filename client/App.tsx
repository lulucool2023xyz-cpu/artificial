import "./global.css";

import { lazy, Suspense, useEffect } from "react";
import { Toaster } from "@/components/ui/toaster";
import { createRoot } from "react-dom/client";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ErrorBoundary } from "@/components/ErrorBoundary";
import { ScrollToTop } from "@/components/ScrollToTop";
import { LoadingSpinner } from "@/components/landing/LoadingSpinner";
import { AuthProvider } from "@/contexts/AuthContext";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { ThemeProvider } from "next-themes";
import { handleError, logError } from "@/lib/errorHandler";

// Lazy load pages for better performance
const Index = lazy(() => import("./pages/Index"));
const GetStarted = lazy(() => import("./pages/GetStarted"));

// Auth pages
const Login = lazy(() => import("./pages/auth/Login"));
const SignUp = lazy(() => import("./pages/auth/SignUp"));
const ForgotPassword = lazy(() => import("./pages/auth/ForgotPassword"));

// Chat pages
const Chat = lazy(() => import("./pages/chat/index"));
const ChatHistory = lazy(() => import("./pages/chat/history"));
const ChatSettings = lazy(() => import("./pages/chat/settings"));
const ChatProfile = lazy(() => import("./pages/chat/profile"));

// Product pages
const ProductFeatures = lazy(() => import("./pages/product/Features"));
const ProductDemo = lazy(() => import("./pages/product/Demo"));
const ProductUseCases = lazy(() => import("./pages/product/UseCases"));
const ProductPlayground = lazy(() => import("./pages/product/Playground"));

// Resources pages
const ResourcesDocumentation = lazy(() => import("./pages/resources/Documentation"));
const ResourcesBlog = lazy(() => import("./pages/resources/Blog"));
const ResourcesStatus = lazy(() => import("./pages/resources/Status"));

// Research page
const Research = lazy(() => import("./pages/Research"));

// Company pages
const CompanyAbout = lazy(() => import("./pages/company/About"));
const CompanyCareers = lazy(() => import("./pages/company/Careers"));
const CompanyPrivacy = lazy(() => import("./pages/company/Privacy"));
const CompanyTerms = lazy(() => import("./pages/company/Terms"));

const NotFound = lazy(() => import("./pages/NotFound"));

// Initialize QueryClient outside component to prevent re-initialization on re-renders
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
      staleTime: 5 * 60 * 1000, // 5 minutes
    },
    mutations: {
      // Mutations can still handle errors in the calling code
      retry: 1,
    },
  },
});

// Loading fallback component
const PageLoader = () => (
  <div className="bg-black min-h-screen flex items-center justify-center">
    <LoadingSpinner />
  </div>
);

// Global error handler setup
function GlobalErrorHandler() {
  useEffect(() => {
    // Handle unhandled promise rejections
    const handleUnhandledRejection = (event: PromiseRejectionEvent) => {
      event.preventDefault();
      const error = event.reason instanceof Error ? event.reason : new Error(String(event.reason));
      logError(error, { component: "GlobalErrorHandler", action: "unhandledRejection" });
      handleError(error);
    };

    // Handle global errors
    const handleGlobalError = (event: ErrorEvent) => {
      event.preventDefault();
      logError(event.error, { component: "GlobalErrorHandler", action: "globalError" });
    };

    window.addEventListener("unhandledrejection", handleUnhandledRejection);
    window.addEventListener("error", handleGlobalError);

    return () => {
      window.removeEventListener("unhandledrejection", handleUnhandledRejection);
      window.removeEventListener("error", handleGlobalError);
    };
  }, []);

  return null;
}

const App = () => (
  <ErrorBoundary
    onError={(error, errorInfo) => {
      logError(error, {
        component: "App",
        action: "componentError",
        additionalData: { componentStack: errorInfo.componentStack },
      });
    }}
  >
    <ThemeProvider attribute="class" defaultTheme="dark" enableSystem={false}>
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <AuthProvider>
        <GlobalErrorHandler />
        <Toaster />
        <Sonner />
        <BrowserRouter>
            <ScrollToTop />
            <Suspense fallback={<PageLoader />}>
          <Routes>
                {/* Auth Routes - Public */}
                <Route path="/login" element={<Login />} />
                <Route path="/auth/login" element={<Login />} /> {/* Backward compatibility */}
                <Route path="/auth/signup" element={<SignUp />} />
                <Route path="/auth/forgot-password" element={<ForgotPassword />} />
                
                {/* Chat Routes - Protected */}
                <Route
                  path="/chat"
                  element={
                    <ProtectedRoute>
                      <Chat />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/chat/history"
                  element={
                    <ProtectedRoute>
                      <ChatHistory />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/chat/settings"
                  element={
                    <ProtectedRoute>
                      <ChatSettings />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/chat/profile"
                  element={
                    <ProtectedRoute>
                      <ChatProfile />
                    </ProtectedRoute>
                  }
                />
                
                {/* Public Routes - No Authentication Required */}
                <Route path="/" element={<Index />} />
                <Route path="/get-started" element={<GetStarted />} />
                
                {/* Product Routes - Public Preview */}
                <Route path="/product/features" element={<ProductFeatures />} />
                <Route path="/product/demo" element={<ProductDemo />} />
                <Route path="/product/use-cases" element={<ProductUseCases />} />
                <Route
                  path="/product/playground"
                  element={
                    <ProtectedRoute>
                      <ProductPlayground />
                    </ProtectedRoute>
                  }
                />
                
                {/* Resources Routes - Public */}
                <Route path="/resources/documentation" element={<ResourcesDocumentation />} />
                <Route path="/resources/blog" element={<ResourcesBlog />} />
                <Route path="/resources/status" element={<ResourcesStatus />} />
                
                {/* Research Route - Public */}
                <Route path="/research" element={<Research />} />
                
                {/* Company Routes - Public */}
                <Route path="/company/about" element={<CompanyAbout />} />
                <Route path="/company/careers" element={<CompanyCareers />} />
                <Route path="/company/privacy" element={<CompanyPrivacy />} />
                <Route path="/company/terms" element={<CompanyTerms />} />
                
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
            </Suspense>
        </BrowserRouter>
        </AuthProvider>
      </TooltipProvider>
    </QueryClientProvider>
    </ThemeProvider>
  </ErrorBoundary>
);

createRoot(document.getElementById("root")!).render(<App />);
