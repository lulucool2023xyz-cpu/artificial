import { useState, useEffect } from "react";
import { X, FileText, AlertCircle } from "lucide-react";
import { Link } from "react-router-dom";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";

interface TermsAgreementModalProps {
  isOpen: boolean;
  onAccept: () => void;
  onDecline: () => void;
}

/**
 * Terms Agreement Modal Component
 * Purpose: Show terms and service agreement for first-time users
 * 
 * Features:
 * - Displays terms and service content
 * - Requires user acceptance before proceeding
 * - Elegant design with gold accents
 */
export function TermsAgreementModal({ isOpen, onAccept, onDecline }: TermsAgreementModalProps) {
  const [hasScrolled, setHasScrolled] = useState(false);
  const [agreeToTerms, setAgreeToTerms] = useState(false);

  useEffect(() => {
    // Check if user has already accepted terms
    const hasAccepted = localStorage.getItem("termsAccepted");
    if (hasAccepted === "true") {
      onAccept();
    }
  }, [onAccept]);

  const handleAccept = () => {
    if (agreeToTerms) {
      localStorage.setItem("termsAccepted", "true");
      onAccept();
    }
  };

  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const target = e.currentTarget;
    const scrollPercentage = (target.scrollTop / (target.scrollHeight - target.clientHeight)) * 100;
    if (scrollPercentage > 80) {
      setHasScrolled(true);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={() => { }}>
      <DialogContent
        className="max-w-4xl max-h-[85vh] sm:max-h-[90vh] bg-gradient-to-b from-[#0A0A0A] to-[#1A1A1A] border-2 border-[#FFD700]/20 p-0 overflow-hidden flex flex-col"
        aria-describedby="terms-description"
      >
        <div className="relative">
          {/* Header with gradient */}
          <div className="bg-gradient-to-r from-[#FFD700]/10 via-[#FFD700]/5 to-transparent p-6 border-b border-[#FFD700]/20">
            <DialogHeader>
              <div className="flex items-center gap-3 mb-2">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#FFD700]/20 to-[#FFD700]/10 flex items-center justify-center border border-[#FFD700]/30">
                  <FileText className="w-6 h-6 text-[#FFD700]" />
                </div>
                <div>
                  <DialogTitle className="text-2xl font-bold text-white">
                    Terms of Service & Privacy Policy
                  </DialogTitle>
                  <DialogDescription id="terms-description" className="text-[#B0B0B0] mt-1">
                    Please read and accept our terms to continue
                  </DialogDescription>
                </div>
              </div>
            </DialogHeader>
          </div>

          {/* Content - Reduced height for mobile */}
          <ScrollArea
            className="h-[40vh] sm:h-[50vh] px-6 py-4 flex-1"
            onScrollCapture={handleScroll}
          >
            <div className="space-y-6 text-[#E0E0E0]">
              <div>
                <h2 className="text-xl font-bold text-[#FFD700] mb-3">1. Acceptance of Terms</h2>
                <p className="text-sm leading-relaxed">
                  By accessing and using Orenax platform, you accept and agree to be bound by the terms and
                  provision of this agreement. If you do not agree to abide by the above, please do not
                  use this service.
                </p>
              </div>

              <div>
                <h2 className="text-xl font-bold text-[#FFD700] mb-3">2. Use License</h2>
                <p className="text-sm leading-relaxed">
                  Permission is granted to temporarily use our services for personal, non-commercial
                  transitory viewing only. This is the grant of a license, not a transfer of title, and
                  under this license you may not modify or copy the materials.
                </p>
              </div>

              <div>
                <h2 className="text-xl font-bold text-[#FFD700] mb-3">3. Restrictions</h2>
                <p className="text-sm leading-relaxed">
                  You may not modify, copy, distribute, transmit, display, perform, reproduce, publish,
                  license, create derivative works from, transfer, or sell any information obtained from
                  our services without prior written consent.
                </p>
              </div>

              <div>
                <h2 className="text-xl font-bold text-[#FFD700] mb-3">4. Privacy Policy</h2>
                <p className="text-sm leading-relaxed">
                  We respect your privacy and are committed to protecting your personal data. We collect
                  only necessary information to provide and improve our services. Your data is encrypted
                  and stored securely. We do not sell your personal information to third parties.
                </p>
              </div>

              <div>
                <h2 className="text-xl font-bold text-[#FFD700] mb-3">5. Disclaimer</h2>
                <p className="text-sm leading-relaxed">
                  The materials on our platform are provided on an 'as is' basis. We make no warranties,
                  expressed or implied, and hereby disclaim and negate all other warranties including,
                  without limitation, implied warranties or conditions of merchantability.
                </p>
              </div>

              <div>
                <h2 className="text-xl font-bold text-[#FFD700] mb-3">6. Limitations</h2>
                <p className="text-sm leading-relaxed">
                  In no event shall Orenax or its suppliers be liable for any damages (including,
                  without limitation, damages for loss of data or profit, or due to business interruption)
                  arising out of the use or inability to use our services.
                </p>
              </div>

              <div>
                <h2 className="text-xl font-bold text-[#FFD700] mb-3">7. Contact</h2>
                <p className="text-sm leading-relaxed">
                  For questions about these Terms of Service, please contact us at{" "}
                  <Link to="/company/about" className="text-[#FFD700] hover:text-[#FFA500] underline">
                    legal@orenax.com
                  </Link>
                </p>
              </div>

              <div className="pt-4 border-t border-[#FFD700]/20">
                <p className="text-xs text-[#B0B0B0]">
                  Last updated: January 2025
                </p>
              </div>
            </div>
          </ScrollArea>

          {/* Footer with checkbox and buttons */}
          <div className="bg-gradient-to-t from-[#0A0A0A] to-transparent p-6 border-t border-[#FFD700]/20">
            <div className="flex items-start gap-3 mb-4">
              <input
                type="checkbox"
                id="agree-terms"
                checked={agreeToTerms}
                onChange={(e) => setAgreeToTerms(e.target.checked)}
                className={cn(
                  "mt-1 w-5 h-5 rounded border-2 cursor-pointer transition-all",
                  "bg-[#1A1A1A] border-[#FFD700]/30",
                  "checked:bg-[#FFD700] checked:border-[#FFD700]",
                  "focus:ring-2 focus:ring-[#FFD700]/50 focus:ring-offset-2 focus:ring-offset-[#0A0A0A]",
                  agreeToTerms && "ring-2 ring-[#FFD700]/50"
                )}
              />
              <label
                htmlFor="agree-terms"
                className="text-sm text-[#E0E0E0] cursor-pointer flex-1"
              >
                I have read and agree to the{" "}
                <Link to="/company/terms" className="text-[#FFD700] hover:text-[#FFA500] underline font-medium">
                  Terms of Service
                </Link>
                {" "}and{" "}
                <Link to="/company/privacy" className="text-[#FFD700] hover:text-[#FFA500] underline font-medium">
                  Privacy Policy
                </Link>
              </label>
            </div>

            <div className="flex items-center gap-3">
              <Button
                onClick={handleAccept}
                disabled={!agreeToTerms}
                className={cn(
                  "flex-1 bg-gradient-to-r from-[#FFD700] to-[#FFA500] text-black font-semibold",
                  "hover:from-[#FFA500] hover:to-[#FF8C00]",
                  "disabled:opacity-50 disabled:cursor-not-allowed",
                  "transition-all duration-200 shadow-lg shadow-[#FFD700]/20"
                )}
              >
                Accept & Continue
              </Button>
              <Button
                onClick={onDecline}
                variant="outline"
                className={cn(
                  "border-2 border-[#FFD700]/30 text-[#FFD700]",
                  "hover:bg-[#FFD700]/10 hover:border-[#FFD700]/50",
                  "transition-all duration-200"
                )}
              >
                Decline
              </Button>
            </div>

            {!hasScrolled && (
              <div className="mt-3 flex items-center gap-2 text-xs text-[#B0B0B0]">
                <AlertCircle className="w-4 h-4" />
                <span>Please scroll to read all terms</span>
              </div>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

