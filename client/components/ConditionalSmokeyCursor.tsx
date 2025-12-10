import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import SmokeyCursor from "@/components/SmokeyCursor";

/**
 * Conditional SmokeyCursor Component
 * Purpose: Show SmokeyCursor only on landing page and public pages, not on chat pages
 * 
 * Features:
 * - Automatically detects current route
 * - Only renders on public/landing pages
 * - Disabled on chat and authenticated pages
 */
export function ConditionalSmokeyCursor() {
  const location = useLocation();
  const [shouldShow, setShouldShow] = useState(false);

  useEffect(() => {
    // List of paths where SmokeyCursor should NOT appear
    // SmokeyCursor should ONLY appear on landing page (/) and public pages
    const excludedPaths = [
      '/chat',
      '/chat/history',
      '/chat/settings',
      '/chat/profile',
      '/culture',
      '/creative',
      '/product/playground',
      '/auth/login',
      '/auth/signup',
      '/auth/forgot-password',
    ];

    // Check if current path starts with any excluded path
    const isExcluded = excludedPaths.some(path => location.pathname.startsWith(path));

    // Show SmokeyCursor only on landing page and other public pages
    setShouldShow(!isExcluded);
  }, [location.pathname]);

  if (!shouldShow) {
    return null;
  }

  return <SmokeyCursor />;
}



