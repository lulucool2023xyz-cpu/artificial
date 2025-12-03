import { memo } from "react";
import { CheckCircle2, AlertCircle, XCircle, Clock, Mail } from "lucide-react";
import { Link } from "react-router-dom";
import { NavigationBar } from "@/components/landing/NavigationBar";
import { Footer } from "@/components/landing/Footer";
import { BackToTop } from "@/components/landing/BackToTop";
import { PageTransition } from "@/components/PageTransition";
import { Breadcrumb } from "@/components/Breadcrumb";
import { BackgroundGrid } from "@/components/landing/BackgroundGrid";
import { ScrollReveal } from "@/components/ui/ScrollReveal";
import { BatikPattern } from "@/components/landing/BatikPattern";
import { OrnamentFrame } from "@/components/landing/OrnamentFrame";

const systemStatus = {
  overall: "operational",
  services: [
    { name: "API Service", status: "operational", responseTime: "45ms" },
    { name: "Web Application", status: "operational", responseTime: "120ms" },
    { name: "Voice Processing", status: "operational", responseTime: "280ms" },
    { name: "Database", status: "operational", responseTime: "12ms" },
    { name: "Authentication", status: "operational", responseTime: "35ms" },
  ],
  metrics: {
    averageResponse: "45ms",
    uptime: "99.98%",
    period: "Last 30 days"
  }
};

const changelogEntries = [
  {
    version: "2.4.0",
    date: "3 Desember 2025",
    newFeatures: [
      "Introduced real-time collaboration mode for team workspaces",
      "Added support for 15 new languages in voice processing",
      "Launched advanced analytics dashboard with custom metrics"
    ],
    improvements: [
      "Enhanced voice recognition accuracy by 25%",
      "Reduced API response time from 60ms to 45ms",
      "Improved mobile app performance and stability"
    ],
    bugFixes: [
      "Fixed issue where large file uploads would timeout",
      "Resolved authentication error on Safari browsers",
      "Corrected timezone display in activity logs"
    ]
  },
  {
    version: "2.3.0",
    date: "3 Desember 2025",
    newFeatures: [
      "Added batch processing for multiple file uploads",
      "Implemented custom voice model training",
      "New export functionality for conversation history"
    ],
    improvements: [
      "Optimized database queries for faster response times",
      "Improved error messages and user feedback",
      "Enhanced security with additional authentication layers"
    ],
    bugFixes: [
      "Fixed memory leak in long-running sessions",
      "Resolved issue with special characters in file names",
      "Corrected pagination in search results"
    ]
  },
  {
    version: "2.2.0",
    date: "3 Desember 2025",
    newFeatures: [
      "Launched mobile app for iOS and Android",
      "Added dark mode support across all platforms",
      "Introduced webhook integrations for third-party services"
    ],
    improvements: [
      "Redesigned user interface for better accessibility",
      "Improved voice recognition for regional accents",
      "Enhanced API rate limiting and throttling"
    ],
    bugFixes: [
      "Fixed crash when processing very large text inputs",
      "Resolved issue with concurrent user sessions",
      "Corrected date formatting in various locales"
    ]
  },
  {
    version: "2.1.0",
    date: "3 Desember 2025",
    newFeatures: [
      "Added support for real-time video analysis",
      "Implemented advanced search with filters",
      "New notification system for important updates"
    ],
    improvements: [
      "Improved overall system performance by 30%",
      "Enhanced data encryption and security measures",
      "Optimized resource usage for better scalability"
    ],
    bugFixes: [
      "Fixed issue with session timeout notifications",
      "Resolved problem with file format detection",
      "Corrected display issues on high-DPI screens"
    ]
  },
  {
    version: "2.0.0",
    date: "3 Desember 2025",
    newFeatures: [
      "Complete platform redesign and architecture overhaul",
      "New AI model with improved accuracy and speed",
      "Multi-language support for 50+ languages"
    ],
    improvements: [
      "Major performance improvements across all services",
      "Enhanced user experience with new UI/UX design",
      "Improved documentation and developer resources"
    ],
    bugFixes: [
      "Resolved critical security vulnerabilities",
      "Fixed data synchronization issues",
      "Corrected various UI/UX inconsistencies"
    ]
  }
];

const incidents = [
  {
    date: "3 Desember 2025",
    issue: "Temporary API slowdown",
    duration: "15 minutes",
    resolution: "Resolved - Database connection pool optimization"
  },
  {
    date: "3 Desember 2025",
    issue: "Voice processing service interruption",
    duration: "8 minutes",
    resolution: "Resolved - Load balancer configuration update"
  }
];

const Status = memo(function Status() {
  const getStatusIcon = (status: string) => {
    switch (status) {
      case "operational":
        return <CheckCircle2 className="w-5 h-5 text-green-500" />;
      case "degraded":
        return <AlertCircle className="w-5 h-5 text-yellow-500" />;
      case "down":
        return <XCircle className="w-5 h-5 text-red-500" />;
      default:
        return <Clock className="w-5 h-5 text-gray-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "operational":
        return "text-green-500";
      case "degraded":
        return "text-yellow-500";
      case "down":
        return "text-red-500";
      default:
        return "text-gray-500";
    }
  };

  return (
    <PageTransition>
      <div className="min-h-screen bg-background text-foreground transition-colors duration-300">
        <NavigationBar />
        <div className="pt-16 sm:pt-20">
          <section className="section-container section-padding relative overflow-hidden">
            <BackgroundGrid opacity="opacity-[0.02]" size="100px" />
            <BatikPattern variant="parang" opacity="opacity-[0.02]" speed={30} />
            
            <div className="relative z-10 max-w-7xl mx-auto">
              <Breadcrumb className="mb-8" />
              
              <ScrollReveal delay={0.1} duration={0.7} distance={30}>
                <div className="text-center mb-16 sm:mb-20">
                  <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold font-heading mb-4 sm:mb-6">
                    <span className="text-glow">Status & Changelog</span>
                  </h1>
                  <div className="w-16 h-1 mx-auto bg-indonesian-gold opacity-60 mb-4"></div>
                  <p className="text-lg max-w-2xl mx-auto text-muted-foreground">
                    Stay updated with the latest changes and system status of Orenax
                  </p>
                </div>
              </ScrollReveal>

              {/* System Status Section */}
              <ScrollReveal delay={0.2} duration={0.7} distance={30}>
                <OrnamentFrame variant="jawa" className="border rounded-xl p-6 sm:p-8 backdrop-blur-sm mb-12">
                  <h2 className="text-2xl font-bold font-heading mb-6 text-foreground">System Status</h2>
                  
                  {/* Overall Status */}
                  <div className="flex items-center gap-3 mb-8 p-4 bg-primary/10 rounded-lg">
                    {getStatusIcon(systemStatus.overall)}
                    <div>
                      <h3 className="font-semibold text-foreground">All Systems Operational</h3>
                      <p className="text-sm text-muted-foreground">All services are running normally</p>
                    </div>
                  </div>

                  {/* Services Status Table */}
                  <div className="mb-8">
                    <h3 className="text-lg font-semibold mb-4 text-foreground">Services Status</h3>
                    <div className="space-y-3">
                      {systemStatus.services.map((service, index) => (
                        <div key={index} className="flex items-center justify-between p-4 border border-border rounded-lg hover:bg-primary/5 transition-colors">
                          <div className="flex items-center gap-3">
                            {getStatusIcon(service.status)}
                            <span className="font-medium text-foreground">{service.name}</span>
                          </div>
                          <div className="flex items-center gap-4">
                            <span className={`text-sm font-medium ${getStatusColor(service.status)}`}>
                              {service.status.charAt(0).toUpperCase() + service.status.slice(1)}
                            </span>
                            <span className="text-sm text-muted-foreground">{service.responseTime}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Metrics */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-6 border-t border-border">
                    <div className="text-center">
                      <p className="text-2xl font-bold text-foreground">{systemStatus.metrics.averageResponse}</p>
                      <p className="text-sm text-muted-foreground">Average API Response</p>
                    </div>
                    <div className="text-center">
                      <p className="text-2xl font-bold text-foreground">{systemStatus.metrics.uptime}</p>
                      <p className="text-sm text-muted-foreground">Uptime ({systemStatus.metrics.period})</p>
                    </div>
                    <div className="text-center">
                      <p className="text-2xl font-bold text-green-500">0</p>
                      <p className="text-sm text-muted-foreground">Active Incidents</p>
                    </div>
                  </div>
                </OrnamentFrame>
              </ScrollReveal>

              {/* Changelog Section */}
              <ScrollReveal delay={0.3} duration={0.7} distance={30}>
                <div className="mb-12">
                  <h2 className="text-2xl font-bold font-heading mb-8 text-foreground">Changelog / Release Notes</h2>
                  
                  <div className="space-y-8">
                    {changelogEntries.map((entry, index) => (
                      <OrnamentFrame key={index} variant="jawa" className="border rounded-xl p-6 sm:p-8 backdrop-blur-sm">
                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 pb-4 border-b border-border">
                          <div>
                            <h3 className="text-xl font-bold text-foreground mb-1">Version {entry.version}</h3>
                            <p className="text-sm text-muted-foreground">{entry.date}</p>
                          </div>
                        </div>

                        {entry.newFeatures.length > 0 && (
                          <div className="mb-6">
                            <h4 className="font-semibold text-foreground mb-3 flex items-center gap-2">
                              <CheckCircle2 className="w-4 h-4 text-green-500" />
                              New Features
                            </h4>
                            <ul className="space-y-2 ml-6">
                              {entry.newFeatures.map((feature, idx) => (
                                <li key={idx} className="text-muted-foreground list-disc">{feature}</li>
                              ))}
                            </ul>
                          </div>
                        )}

                        {entry.improvements.length > 0 && (
                          <div className="mb-6">
                            <h4 className="font-semibold text-foreground mb-3 flex items-center gap-2">
                              <AlertCircle className="w-4 h-4 text-blue-500" />
                              Improvements
                            </h4>
                            <ul className="space-y-2 ml-6">
                              {entry.improvements.map((improvement, idx) => (
                                <li key={idx} className="text-muted-foreground list-disc">{improvement}</li>
                              ))}
                            </ul>
                          </div>
                        )}

                        {entry.bugFixes.length > 0 && (
                          <div>
                            <h4 className="font-semibold text-foreground mb-3 flex items-center gap-2">
                              <XCircle className="w-4 h-4 text-red-500" />
                              Bug Fixes
                            </h4>
                            <ul className="space-y-2 ml-6">
                              {entry.bugFixes.map((fix, idx) => (
                                <li key={idx} className="text-muted-foreground list-disc">{fix}</li>
                              ))}
                            </ul>
                          </div>
                        )}
                      </OrnamentFrame>
                    ))}
                  </div>
                </div>
              </ScrollReveal>

              {/* Incident History */}
              <ScrollReveal delay={0.4} duration={0.7} distance={30}>
                <OrnamentFrame variant="jawa" className="border rounded-xl p-6 sm:p-8 backdrop-blur-sm mb-12">
                  <h2 className="text-2xl font-bold font-heading mb-6 text-foreground">Incident History</h2>
                  
                  {incidents.length === 0 ? (
                    <p className="text-muted-foreground text-center py-8">No recent incidents to report.</p>
                  ) : (
                    <div className="space-y-4">
                      {incidents.map((incident, index) => (
                        <div key={index} className="p-4 border border-border rounded-lg">
                          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-2">
                            <h3 className="font-semibold text-foreground">{incident.issue}</h3>
                            <span className="text-sm text-muted-foreground">{incident.date}</span>
                          </div>
                          <div className="flex items-center gap-4 text-sm text-muted-foreground">
                            <span>Duration: {incident.duration}</span>
                            <span>•</span>
                            <span>{incident.resolution}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </OrnamentFrame>
              </ScrollReveal>

              {/* Subscribe Section */}
              <ScrollReveal delay={0.5} duration={0.7} distance={30}>
                <OrnamentFrame variant="jawa" className="border rounded-xl p-6 sm:p-8 backdrop-blur-sm">
                  <div className="text-center">
                    <Mail className="w-12 h-12 mx-auto mb-4 text-indonesian-gold" />
                    <h2 className="text-2xl font-bold font-heading mb-4 text-foreground">Subscribe to Updates</h2>
                    <p className="text-muted-foreground mb-6 max-w-md mx-auto">
                      Get notified about status updates, new features, and important announcements via email.
                    </p>
                    <form className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
                      <input
                        type="email"
                        placeholder="Enter your email"
                        className="flex-1 px-4 py-3 rounded-lg border border-border bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-indonesian-gold focus:ring-offset-2 focus:ring-offset-background"
                      />
                      <button
                        type="submit"
                        className="px-6 py-3 bg-indonesian-gold text-black font-semibold rounded-lg hover:bg-indonesian-gold/90 transition-colors focus:outline-none focus:ring-2 focus:ring-indonesian-gold focus:ring-offset-2 focus:ring-offset-background"
                      >
                        Subscribe
                      </button>
                    </form>
                  </div>
                </OrnamentFrame>
              </ScrollReveal>
            </div>
          </section>
        </div>
        <Footer />
        <BackToTop />
      </div>
    </PageTransition>
  );
});

export default Status;

