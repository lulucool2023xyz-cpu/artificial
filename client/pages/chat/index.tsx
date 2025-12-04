import { memo, useState, useEffect } from "react";
import { PageTransition } from "@/components/PageTransition";
import AIChatbot from "@/components/chat/AIChatbot";
import { TermsAgreementModal } from "@/components/TermsAgreementModal";
import { useAuth } from "@/contexts/AuthContext";

/**
 * Main Chat Interface Page - New AI Chatbot
 * Purpose: Modern AI interaction hub with voice, camera, and multi-mode support
 * 
 * Features:
 * - Voice input (Mic)
 * - Camera input
 * - Multiple AI modes (Fast, Balance, Deep Learning)
 * - Chat history management
 * - Profile & Settings integration
 * - Monochrome theme with Indonesian cultural touch
 * - Terms agreement modal for first-time users
 */
const Chat = memo(function Chat() {
  const { isAuthenticated } = useAuth();
  const [showTermsModal, setShowTermsModal] = useState(false);

  useEffect(() => {
    // Check if user has accepted terms
    if (isAuthenticated) {
      const hasAccepted = localStorage.getItem("termsAccepted");
      if (hasAccepted !== "true") {
        setShowTermsModal(true);
      }
    }
  }, [isAuthenticated]);

  const handleAcceptTerms = () => {
    setShowTermsModal(false);
  };

  const handleDeclineTerms = () => {
    // Redirect to home or logout
    window.location.href = "/";
  };

  return (
    <PageTransition>
      <AIChatbot />
      <TermsAgreementModal
        isOpen={showTermsModal}
        onAccept={handleAcceptTerms}
        onDecline={handleDeclineTerms}
      />
    </PageTransition>
  );
});

export default Chat;

