import { memo, useState } from "react";
import { Book, Code, Zap, Settings, FileText, Search, Copy, Check } from "lucide-react";
import { NavigationBar } from "@/components/landing/NavigationBar";
import { Footer } from "@/components/landing/Footer";
import { BackToTop } from "@/components/landing/BackToTop";
import { PageTransition } from "@/components/PageTransition";
import { Breadcrumb } from "@/components/Breadcrumb";
import { BackgroundGrid } from "@/components/landing/BackgroundGrid";
import { ScrollReveal } from "@/components/ui/ScrollReveal";
import { BatikPattern } from "@/components/landing/BatikPattern";
import { OrnamentFrame } from "@/components/landing/OrnamentFrame";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

const docsSections = [
  {
    icon: Zap,
    title: "Quick Start",
    content: "Get started with our AI platform in minutes. Learn the basics and start building amazing applications."
  },
  {
    icon: Code,
    title: "API Reference",
    content: "Complete API documentation with examples. Integrate our AI capabilities into your applications."
  },
  {
    icon: Settings,
    title: "Configuration",
    content: "Configure and customize the AI platform to meet your specific needs and requirements."
  },
  {
    icon: FileText,
    title: "Guides & Tutorials",
    content: "Step-by-step guides and tutorials to help you make the most of our AI platform features."
  }
];

const Documentation = memo(function Documentation() {
  const [copiedCode, setCopiedCode] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedCode(id);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  const codeExamples = {
    quickStart: `// Install the Orenax SDK
npm install @orenax/sdk

// Initialize the client
import { OrenaxClient } from '@orenax/sdk';

const client = new OrenaxClient({
  apiKey: 'your-api-key-here',
  baseURL: 'https://api.orenax.com'
});

// Make your first API call
const response = await client.chat.complete({
  message: 'Hello, Orenax!',
  model: 'orenax-pro'
});

console.log(response);`,
    authentication: `// Using API Key in headers
const response = await fetch('https://api.orenax.com/v1/chat', {
  method: 'POST',
  headers: {
    'Authorization': 'Bearer your-api-key-here',
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    message: 'Hello!',
    model: 'orenax-pro'
  })
});`,
    voiceProcessing: `// Voice processing example
const audioFile = await client.voice.process({
  audio: audioBlob,
  language: 'id',
  format: 'wav'
});

const transcription = await audioFile.transcribe();
console.log('Transcription:', transcription.text);`
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
                <div className="text-center mb-12">
                  <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold font-heading mb-4 sm:mb-6">
                    <span className="text-glow">Documentation</span>
                  </h1>
                  <div className="w-16 h-1 mx-auto bg-indonesian-gold opacity-60 mb-4"></div>
                  <p className="text-lg max-w-2xl mx-auto text-muted-foreground mb-8">
                    Everything you need to know about using Orenax
                  </p>
                  
                  {/* Search Bar */}
                  <div className="max-w-2xl mx-auto">
                    <div className="relative">
                      <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                      <input
                        type="text"
                        placeholder="Search documentation..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full pl-12 pr-4 py-3 rounded-lg border border-border bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-indonesian-gold focus:ring-offset-2 focus:ring-offset-background"
                      />
                    </div>
                  </div>
                </div>
              </ScrollReveal>

              <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                {/* Sidebar Navigation */}
                <div className="lg:col-span-1">
                  <ScrollReveal delay={0.2} duration={0.7} distance={20}>
                    <div className="sticky top-24">
                      <OrnamentFrame variant="jawa" className="border rounded-xl p-4 backdrop-blur-sm">
                        <h3 className="font-semibold text-foreground mb-4">Table of Contents</h3>
                        <nav className="space-y-2">
                          <a href="#getting-started" className="block text-sm text-muted-foreground hover:text-foreground transition-colors">Getting Started</a>
                          <a href="#introduction" className="block text-sm text-muted-foreground hover:text-foreground transition-colors ml-4">Introduction</a>
                          <a href="#quick-start" className="block text-sm text-muted-foreground hover:text-foreground transition-colors ml-4">Quick Start Guide</a>
                          <a href="#installation" className="block text-sm text-muted-foreground hover:text-foreground transition-colors ml-4">Installation</a>
                          <a href="#authentication" className="block text-sm text-muted-foreground hover:text-foreground transition-colors ml-4">Authentication</a>
                          <a href="#api-reference" className="block text-sm text-muted-foreground hover:text-foreground transition-colors mt-4">API Reference</a>
                          <a href="#guides" className="block text-sm text-muted-foreground hover:text-foreground transition-colors mt-4">Guides & Tutorials</a>
                          <a href="#faq" className="block text-sm text-muted-foreground hover:text-foreground transition-colors mt-4">FAQ</a>
                        </nav>
                      </OrnamentFrame>
                    </div>
                  </ScrollReveal>
                </div>

                {/* Main Content */}
                <div className="lg:col-span-3 space-y-8">
                  {/* Getting Started Section */}
                  <ScrollReveal delay={0.2} duration={0.7} distance={30}>
                    <div id="getting-started">
                      <h2 className="text-3xl font-bold font-heading mb-6 text-foreground">Getting Started</h2>
                      
                      {/* Introduction */}
                      <OrnamentFrame variant="jawa" className="border rounded-xl p-6 sm:p-8 backdrop-blur-sm mb-6">
                        <div id="introduction">
                          <h3 className="text-2xl font-bold mb-4 text-foreground">Introduction to Orenax</h3>
                          <div className="space-y-4 text-muted-foreground">
                            <p>
                              Orenax is a next-generation AI platform that combines voice, vision, reasoning, and cultural knowledge to create an unprecedented platform for human-machine interaction. Built with cutting-edge technology, Orenax enables developers to integrate advanced AI capabilities into their applications with ease.
                            </p>
                            <p>
                              Our platform offers real-time voice processing, computer vision, deep reasoning capabilities, and intelligent chat features. Whether you're building a mobile app, web service, or enterprise solution, Orenax provides the tools you need to create exceptional AI-powered experiences.
                            </p>
                            
                            {/* YouTube Video */}
                            <div className="mt-6">
                              <h4 className="font-semibold text-foreground mb-3">Watch Our Demo Video</h4>
                              <div className="relative w-full" style={{ paddingBottom: '56.25%' }}>
                                <iframe
                                  className="absolute top-0 left-0 w-full h-full rounded-lg"
                                  src="https://www.youtube.com/embed/0pzqQ4lym1U"
                                  title="Orenax Demo Video"
                                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                  allowFullScreen
                                ></iframe>
                              </div>
                            </div>
                            
                            <div className="mt-6">
                              <h4 className="font-semibold text-foreground mb-3">Key Features</h4>
                              <ul className="space-y-2 ml-6 list-disc">
                                <li>Natural voice interaction with support for multiple languages</li>
                                <li>Real-time computer vision and object detection</li>
                                <li>Advanced reasoning and problem-solving capabilities</li>
                                <li>Contextual conversations with intelligent memory</li>
                                <li>Cultural insights and knowledge integration</li>
                              </ul>
                            </div>

                            <div className="mt-6">
                              <h4 className="font-semibold text-foreground mb-3">Use Cases</h4>
                              <ul className="space-y-2 ml-6 list-disc">
                                <li>Customer service chatbots and virtual assistants</li>
                                <li>Content analysis and generation</li>
                                <li>Educational platforms and tutoring systems</li>
                                <li>Healthcare applications and medical assistance</li>
                                <li>Multilingual communication tools</li>
                              </ul>
                            </div>
                          </div>
                        </div>
                      </OrnamentFrame>

                      {/* Quick Start Guide */}
                      <OrnamentFrame variant="jawa" className="border rounded-xl p-6 sm:p-8 backdrop-blur-sm mb-6">
                        <div id="quick-start">
                          <h3 className="text-2xl font-bold mb-4 text-foreground">Quick Start Guide</h3>
                          <div className="space-y-6 text-muted-foreground">
                            <div>
                              <h4 className="font-semibold text-foreground mb-2">Step 1: Sign Up and Get Your API Key</h4>
                              <p>Create an account on Orenax and navigate to the API Keys section in your dashboard. Generate a new API key and keep it secure.</p>
                            </div>
                            
                            <div>
                              <h4 className="font-semibold text-foreground mb-2">Step 2: Install the SDK</h4>
                              <p>Install the Orenax SDK using your preferred package manager:</p>
                              <div className="relative mt-3">
                                <pre className="bg-primary/10 p-4 rounded-lg overflow-x-auto text-sm">
                                  <code className="text-foreground">{codeExamples.quickStart.split('\n').slice(0, 3).join('\n')}</code>
                                </pre>
                                <button
                                  onClick={() => copyToClipboard(codeExamples.quickStart.split('\n').slice(0, 3).join('\n'), 'install')}
                                  className="absolute top-2 right-2 p-2 hover:bg-primary/20 rounded transition-colors"
                                >
                                  {copiedCode === 'install' ? <Check className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4" />}
                                </button>
                              </div>
                            </div>

                            <div>
                              <h4 className="font-semibold text-foreground mb-2">Step 3: Initialize the Client</h4>
                              <p>Create a new instance of the Orenax client with your API key:</p>
                              <div className="relative mt-3">
                                <pre className="bg-primary/10 p-4 rounded-lg overflow-x-auto text-sm">
                                  <code className="text-foreground">{codeExamples.quickStart.split('\n').slice(4, 11).join('\n')}</code>
                                </pre>
                                <button
                                  onClick={() => copyToClipboard(codeExamples.quickStart.split('\n').slice(4, 11).join('\n'), 'init')}
                                  className="absolute top-2 right-2 p-2 hover:bg-primary/20 rounded transition-colors"
                                >
                                  {copiedCode === 'init' ? <Check className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4" />}
                                </button>
                              </div>
                            </div>

                            <div>
                              <h4 className="font-semibold text-foreground mb-2">Step 4: Make Your First API Call</h4>
                              <p>Test the connection by making a simple chat completion request:</p>
                              <div className="relative mt-3">
                                <pre className="bg-primary/10 p-4 rounded-lg overflow-x-auto text-sm">
                                  <code className="text-foreground">{codeExamples.quickStart.split('\n').slice(13, 18).join('\n')}</code>
                                </pre>
                                <button
                                  onClick={() => copyToClipboard(codeExamples.quickStart.split('\n').slice(13, 18).join('\n'), 'first-call')}
                                  className="absolute top-2 right-2 p-2 hover:bg-primary/20 rounded transition-colors"
                                >
                                  {copiedCode === 'first-call' ? <Check className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4" />}
                                </button>
                              </div>
                            </div>

                            <div>
                              <h4 className="font-semibold text-foreground mb-2">Step 5: Explore Advanced Features</h4>
                              <p>Once you're comfortable with basic usage, explore our advanced features like voice processing, vision analysis, and deep reasoning modes.</p>
                            </div>
                          </div>
                        </div>
                      </OrnamentFrame>

                      {/* Installation */}
                      <OrnamentFrame variant="jawa" className="border rounded-xl p-6 sm:p-8 backdrop-blur-sm mb-6">
                        <div id="installation">
                          <h3 className="text-2xl font-bold mb-4 text-foreground">Installation</h3>
                          <div className="space-y-4 text-muted-foreground">
                            <div>
                              <h4 className="font-semibold text-foreground mb-2">System Requirements</h4>
                              <ul className="space-y-2 ml-6 list-disc">
                                <li>Node.js 18.0 or higher (for JavaScript/TypeScript SDK)</li>
                                <li>Python 3.8 or higher (for Python SDK)</li>
                                <li>Modern web browser with ES6+ support</li>
                                <li>Active internet connection</li>
                              </ul>
                            </div>

                            <div>
                              <h4 className="font-semibold text-foreground mb-2">Installation Methods</h4>
                              <div className="space-y-3 mt-3">
                                <div>
                                  <p className="font-medium text-foreground mb-1">npm (Node.js)</p>
                                  <div className="relative">
                                    <pre className="bg-primary/10 p-3 rounded-lg overflow-x-auto text-sm">
                                      <code className="text-foreground">npm install @orenax/sdk</code>
                                    </pre>
                                  </div>
                                </div>
                                <div>
                                  <p className="font-medium text-foreground mb-1">yarn</p>
                                  <div className="relative">
                                    <pre className="bg-primary/10 p-3 rounded-lg overflow-x-auto text-sm">
                                      <code className="text-foreground">yarn add @orenax/sdk</code>
                                    </pre>
                                  </div>
                                </div>
                                <div>
                                  <p className="font-medium text-foreground mb-1">pip (Python)</p>
                                  <div className="relative">
                                    <pre className="bg-primary/10 p-3 rounded-lg overflow-x-auto text-sm">
                                      <code className="text-foreground">pip install orenax-sdk</code>
                                    </pre>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </OrnamentFrame>

                      {/* Authentication */}
                      <OrnamentFrame variant="jawa" className="border rounded-xl p-6 sm:p-8 backdrop-blur-sm mb-6">
                        <div id="authentication">
                          <h3 className="text-2xl font-bold mb-4 text-foreground">Authentication</h3>
                          <div className="space-y-4 text-muted-foreground">
                            <p>
                              All API requests to Orenax require authentication using an API key. Your API key should be kept secure and never exposed in client-side code or public repositories.
                            </p>
                            
                            <div>
                              <h4 className="font-semibold text-foreground mb-2">Getting Your API Key</h4>
                              <ol className="space-y-2 ml-6 list-decimal">
                                <li>Log in to your Orenax account</li>
                                <li>Navigate to Settings → API Keys</li>
                                <li>Click "Generate New API Key"</li>
                                <li>Copy and securely store your API key</li>
                              </ol>
                            </div>

                            <div>
                              <h4 className="font-semibold text-foreground mb-2">Using API Keys</h4>
                              <p>Include your API key in the Authorization header of all requests:</p>
                              <div className="relative mt-3">
                                <pre className="bg-primary/10 p-4 rounded-lg overflow-x-auto text-sm">
                                  <code className="text-foreground">{codeExamples.authentication}</code>
                                </pre>
                                <button
                                  onClick={() => copyToClipboard(codeExamples.authentication, 'auth')}
                                  className="absolute top-2 right-2 p-2 hover:bg-primary/20 rounded transition-colors"
                                >
                                  {copiedCode === 'auth' ? <Check className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4" />}
                                </button>
                              </div>
                            </div>

                            <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-lg p-4 mt-4">
                              <p className="text-sm text-yellow-600 dark:text-yellow-400">
                                <strong>Security Best Practice:</strong> Never commit API keys to version control. Use environment variables or secure secret management systems.
                              </p>
                            </div>
                          </div>
                        </div>
                      </OrnamentFrame>
                    </div>
                  </ScrollReveal>

                  {/* API Reference Section */}
                  <ScrollReveal delay={0.3} duration={0.7} distance={30}>
                    <div id="api-reference">
                      <h2 className="text-3xl font-bold font-heading mb-6 text-foreground">API Reference</h2>
                      
                      <OrnamentFrame variant="jawa" className="border rounded-xl p-6 sm:p-8 backdrop-blur-sm mb-6">
                        <h3 className="text-xl font-bold mb-4 text-foreground">Endpoints</h3>
                        <div className="space-y-4 text-muted-foreground">
                          <div>
                            <h4 className="font-semibold text-foreground mb-2">POST /v1/chat/complete</h4>
                            <p>Send a message and receive AI-generated responses.</p>
                          </div>
                          <div>
                            <h4 className="font-semibold text-foreground mb-2">POST /v1/voice/process</h4>
                            <p>Process audio files for transcription and analysis.</p>
                          </div>
                          <div>
                            <h4 className="font-semibold text-foreground mb-2">POST /v1/vision/analyze</h4>
                            <p>Analyze images and extract information.</p>
                          </div>
                        </div>
                      </OrnamentFrame>

                      <OrnamentFrame variant="jawa" className="border rounded-xl p-6 sm:p-8 backdrop-blur-sm mb-6">
                        <h3 className="text-xl font-bold mb-4 text-foreground">Rate Limits</h3>
                        <div className="space-y-2 text-muted-foreground">
                          <p>Free tier: 100 requests per hour</p>
                          <p>Pro tier: 1,000 requests per hour</p>
                          <p>Enterprise: Custom limits based on agreement</p>
                        </div>
                      </OrnamentFrame>

                      <OrnamentFrame variant="jawa" className="border rounded-xl p-6 sm:p-8 backdrop-blur-sm mb-6">
                        <h3 className="text-xl font-bold mb-4 text-foreground">Error Codes</h3>
                        <div className="space-y-3 text-muted-foreground">
                          <div>
                            <code className="bg-primary/10 px-2 py-1 rounded text-sm">400</code> - Bad Request
                          </div>
                          <div>
                            <code className="bg-primary/10 px-2 py-1 rounded text-sm">401</code> - Unauthorized
                          </div>
                          <div>
                            <code className="bg-primary/10 px-2 py-1 rounded text-sm">429</code> - Rate Limit Exceeded
                          </div>
                          <div>
                            <code className="bg-primary/10 px-2 py-1 rounded text-sm">500</code> - Internal Server Error
                          </div>
                        </div>
                      </OrnamentFrame>
                    </div>
                  </ScrollReveal>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8 mb-12">
                {docsSections.map((section, index) => {
                  const Icon = section.icon;
                  return (
                    <ScrollReveal
                      key={index}
                      delay={0.2 + index * 0.1}
                      duration={0.7}
                      distance={30}
                    >
                      <OrnamentFrame variant="jawa" className="border rounded-xl p-6 sm:p-8 backdrop-blur-sm">
                        <div className="flex items-center gap-3 mb-4">
                          <Icon className="w-8 h-8 text-indonesian-gold" />
                          <h3 className="text-xl font-bold text-foreground">{section.title}</h3>
                        </div>
                        <p className="text-muted-foreground">{section.content}</p>
                      </OrnamentFrame>
                    </ScrollReveal>
                  );
                })}
              </div>

                  {/* Guides Section */}
                  <ScrollReveal delay={0.4} duration={0.7} distance={30}>
                    <div id="guides">
                      <h2 className="text-3xl font-bold font-heading mb-6 text-foreground">Guides & Tutorials</h2>
                      
                      <OrnamentFrame variant="jawa" className="border rounded-xl p-6 sm:p-8 backdrop-blur-sm mb-6">
                        <h3 className="text-xl font-bold mb-4 text-foreground">Basic Usage</h3>
                        <p className="text-muted-foreground mb-4">
                          Learn how to integrate Orenax into your application with step-by-step tutorials covering common use cases and best practices.
                        </p>
                      </OrnamentFrame>

                      <OrnamentFrame variant="jawa" className="border rounded-xl p-6 sm:p-8 backdrop-blur-sm mb-6">
                        <h3 className="text-xl font-bold mb-4 text-foreground">Advanced Features</h3>
                        <p className="text-muted-foreground mb-4">
                          Explore advanced capabilities including custom model training, webhook integrations, and batch processing.
                        </p>
                      </OrnamentFrame>

                      <OrnamentFrame variant="jawa" className="border rounded-xl p-6 sm:p-8 backdrop-blur-sm mb-6">
                        <h3 className="text-xl font-bold mb-4 text-foreground">Best Practices</h3>
                        <p className="text-muted-foreground mb-4">
                          Follow our recommended practices for error handling, rate limiting, security, and performance optimization.
                        </p>
                      </OrnamentFrame>

                      <OrnamentFrame variant="jawa" className="border rounded-xl p-6 sm:p-8 backdrop-blur-sm mb-6">
                        <h3 className="text-xl font-bold mb-4 text-foreground">Troubleshooting</h3>
                        <p className="text-muted-foreground mb-4">
                          Common issues and their solutions, debugging tips, and how to get help when you're stuck.
                        </p>
                      </OrnamentFrame>
                    </div>
                  </ScrollReveal>

                  {/* FAQ Section */}
                  <ScrollReveal delay={0.5} duration={0.7} distance={30}>
                    <div id="faq">
                      <OrnamentFrame variant="jawa" className="border rounded-xl p-6 sm:p-8 backdrop-blur-sm">
                        <h3 className="text-2xl font-bold text-foreground mb-6">FAQ</h3>
                  <Accordion type="single" collapsible className="w-full">
                    <AccordionItem value="item-1" className="border-b border-border">
                      <AccordionTrigger className="text-foreground hover:text-indonesian-gold">How do I get started?</AccordionTrigger>
                      <AccordionContent className="text-muted-foreground">
                        Start by visiting our Get Started page and following the quick start guide. You can also try our Playground to experiment with features.
                      </AccordionContent>
                    </AccordionItem>
                    <AccordionItem value="item-2" className="border-b border-border">
                      <AccordionTrigger className="text-foreground hover:text-indonesian-gold">What languages are supported?</AccordionTrigger>
                      <AccordionContent className="text-muted-foreground">
                        Our platform supports multiple languages including Indonesian, English, and many others. Voice recognition works best with Indonesian and English.
                      </AccordionContent>
                    </AccordionItem>
                    <AccordionItem value="item-3" className="border-b border-border">
                      <AccordionTrigger className="text-foreground hover:text-indonesian-gold">How accurate is the AI?</AccordionTrigger>
                      <AccordionContent className="text-muted-foreground">
                        Our AI models are trained on large datasets and achieve high accuracy rates. Voice recognition accuracy is above 95% for Indonesian language.
                      </AccordionContent>
                    </AccordionItem>
                    <AccordionItem value="item-4">
                      <AccordionTrigger className="text-foreground hover:text-indonesian-gold">Can I integrate this into my application?</AccordionTrigger>
                      <AccordionContent className="text-muted-foreground">
                        Yes! We provide comprehensive API documentation and SDKs for easy integration into your existing applications.
                      </AccordionContent>
                    </AccordionItem>
                  </Accordion>
                </OrnamentFrame>
                    </div>
                  </ScrollReveal>
                </div>
              </div>
            </div>
          </section>
        </div>
        <Footer />
        <BackToTop />
      </div>
    </PageTransition>
  );
});

export default Documentation;

