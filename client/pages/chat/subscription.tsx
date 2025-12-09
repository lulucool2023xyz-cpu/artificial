import { useState } from "react";
import { motion } from "framer-motion";
import { Check, X, Sparkles, Zap, Crown, ArrowRight, Shield, Clock, Users, ArrowLeft, Home, MessageSquare } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";

interface PricingTier {
  id: string;
  name: string;
  price: number;
  period: string;
  description: string;
  icon: React.ReactNode;
  popular?: boolean;
  features: {
    included: string[];
    excluded: string[];
  };
  limits: {
    messages: string;
    models: string[];
    storage: string;
    support: string;
  };
  color: string;
  gradient: string;
}

const pricingTiers: PricingTier[] = [
  {
    id: "free",
    name: "Free",
    price: 0,
    period: "forever",
    description: "Perfect for getting started with AI",
    icon: <Sparkles className="w-6 h-6" />,
    color: "text-blue-500",
    gradient: "from-blue-500/20 to-purple-500/20",
    features: {
      included: [
        "100 messages per month",
        "Access to basic AI models",
        "Text generation",
        "Community support",
        "Basic chat history",
      ],
      excluded: [
        "Advanced AI models",
        "Image generation",
        "Priority support",
        "Custom AI training",
        "API access",
      ],
    },
    limits: {
      messages: "100/month",
      models: ["GPT-3.5", "Claude Instant"],
      storage: "1 GB",
      support: "Community",
    },
  },
  {
    id: "pro",
    name: "Pro",
    price: 19,
    period: "month",
    description: "For power users and professionals",
    icon: <Zap className="w-6 h-6" />,
    popular: true,
    color: "text-purple-500",
    gradient: "from-purple-500/20 to-pink-500/20",
    features: {
      included: [
        "Unlimited messages",
        "All AI models including GPT-4",
        "Image generation (100/month)",
        "Priority support",
        "Advanced chat history",
        "Export conversations",
        "Custom instructions",
        "Early access to new features",
      ],
      excluded: [
        "Custom AI training",
        "API access",
        "Team collaboration",
      ],
    },
    limits: {
      messages: "Unlimited",
      models: ["GPT-4", "Claude 3.5", "Gemini Pro", "Llama 3"],
      storage: "50 GB",
      support: "Priority Email",
    },
  },
  {
    id: "enterprise",
    name: "Enterprise",
    price: 99,
    period: "month",
    description: "For teams and organizations",
    icon: <Crown className="w-6 h-6" />,
    color: "text-amber-500",
    gradient: "from-amber-500/20 to-orange-500/20",
    features: {
      included: [
        "Everything in Pro",
        "Unlimited image generation",
        "Custom AI model training",
        "API access with higher limits",
        "Team collaboration tools",
        "Dedicated account manager",
        "SLA guarantee",
        "Advanced analytics",
        "White-label options",
        "Custom integrations",
      ],
      excluded: [],
    },
    limits: {
      messages: "Unlimited",
      models: ["All models + Custom models"],
      storage: "500 GB",
      support: "24/7 Dedicated",
    },
  },
];

const Subscription = () => {
  const [billingPeriod, setBillingPeriod] = useState<"monthly" | "yearly">("monthly");
  const { toast } = useToast();
  const { user } = useAuth();
  const navigate = useNavigate();

  const handleSubscribe = (tierId: string) => {
    if (!user) {
      toast({
        title: "Authentication Required",
        description: "Please sign in to subscribe to a plan",
        variant: "destructive",
      });
      navigate("/auth/login");
      return;
    }

    if (tierId === "free") {
      toast({
        title: "Already on Free Plan",
        description: "You're currently using the free plan",
      });
      return;
    }

    // Simulate payment processing
    toast({
      title: "Processing Payment",
      description: "Redirecting to payment gateway...",
    });

    // In production, integrate with payment gateway like Stripe
    setTimeout(() => {
      toast({
        title: "Subscription Activated! 🎉",
        description: `You're now subscribed to the ${tierId} plan`,
      });
    }, 2000);
  };

  const getDiscountedPrice = (price: number) => {
    if (billingPeriod === "yearly") {
      return Math.round(price * 12 * 0.8); // 20% discount for yearly
    }
    return price;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
      {/* Navigation Buttons */}
      <div className="container mx-auto px-4 pt-6">
        <div className="flex items-center justify-between mb-4">
          <Button
            variant="ghost"
            onClick={() => navigate(-1)}
            className="gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            Back
          </Button>
          <div className="flex gap-2">
            <Button
              variant="outline"
              onClick={() => navigate("/")}
              className="gap-2"
            >
              <Home className="w-4 h-4" />
              <span className="hidden sm:inline">Landing Page</span>
            </Button>
            <Button
              variant="outline"
              onClick={() => navigate("/chat")}
              className="gap-2"
            >
              <MessageSquare className="w-4 h-4" />
              <span className="hidden sm:inline">Chatbot</span>
            </Button>
          </div>
        </div>
      </div>

      {/* Header */}
      <div className="container mx-auto px-4 py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <Badge className="mb-4 bg-gradient-to-r from-purple-500 to-pink-500 text-white border-0">
            Pricing Plans
          </Badge>
          <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 bg-clip-text text-transparent">
            Choose Your Perfect Plan
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Unlock the full potential of AI with our flexible pricing options.
            Start free and upgrade anytime.
          </p>
        </motion.div>

        {/* Billing Toggle */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="flex items-center justify-center gap-4 mb-12"
        >
          <span className={`text-sm font-medium ${billingPeriod === "monthly" ? "text-foreground" : "text-muted-foreground"}`}>
            Monthly
          </span>
          <button
            onClick={() => setBillingPeriod(billingPeriod === "monthly" ? "yearly" : "monthly")}
            className={`relative w-14 h-7 rounded-full transition-colors ${
              billingPeriod === "yearly" ? "bg-purple-500" : "bg-muted"
            }`}
          >
            <motion.div
              className="absolute top-1 left-1 w-5 h-5 bg-white rounded-full shadow-md"
              animate={{
                x: billingPeriod === "yearly" ? 28 : 0,
              }}
              transition={{ type: "spring", stiffness: 500, damping: 30 }}
            />
          </button>
          <span className={`text-sm font-medium ${billingPeriod === "yearly" ? "text-foreground" : "text-muted-foreground"}`}>
            Yearly
            <Badge className="ml-2 bg-green-500 text-white text-xs">Save 20%</Badge>
          </span>
        </motion.div>

        {/* Pricing Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
          {pricingTiers.map((tier, index) => (
            <motion.div
              key={tier.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="relative"
            >
              {tier.popular && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 z-10">
                  <Badge className="bg-gradient-to-r from-purple-500 to-pink-500 text-white border-0 shadow-lg">
                    Most Popular
                  </Badge>
                </div>
              )}
              
              <Card
                className={`relative h-full p-8 transition-all hover:shadow-2xl ${
                  tier.popular
                    ? "border-2 border-purple-500 shadow-xl"
                    : "border border-border"
                }`}
              >
                <div className={`absolute inset-0 bg-gradient-to-br ${tier.gradient} opacity-50 rounded-lg`} />
                
                <div className="relative z-10">
                  {/* Header */}
                  <div className="flex items-center gap-3 mb-4">
                    <div className={`${tier.color}`}>
                      {tier.icon}
                    </div>
                    <h3 className="text-2xl font-bold">{tier.name}</h3>
                  </div>
                  
                  <p className="text-muted-foreground mb-6">
                    {tier.description}
                  </p>

                  {/* Price */}
                  <div className="mb-6">
                    <div className="flex items-baseline gap-2">
                      <span className="text-4xl font-bold">
                        ${billingPeriod === "yearly" && tier.price > 0
                          ? getDiscountedPrice(tier.price)
                          : tier.price}
                      </span>
                      {tier.price > 0 && (
                        <span className="text-muted-foreground">
                          /{billingPeriod === "yearly" ? "year" : tier.period}
                        </span>
                      )}
                      {tier.price === 0 && (
                        <span className="text-muted-foreground">
                          /{tier.period}
                        </span>
                      )}
                    </div>
                    {billingPeriod === "yearly" && tier.price > 0 && (
                      <p className="text-sm text-green-500 mt-1">
                        Save ${Math.round(tier.price * 12 * 0.2)}/year
                      </p>
                    )}
                  </div>

                  {/* CTA Button */}
                  <Button
                    onClick={() => handleSubscribe(tier.id)}
                    className={`w-full mb-6 ${
                      tier.popular
                        ? "bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
                        : ""
                    }`}
                    variant={tier.popular ? "default" : "outline"}
                  >
                    {tier.id === "free" ? "Current Plan" : "Get Started"}
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>

                  {/* Features */}
                  <div className="space-y-3 mb-6">
                    <p className="text-sm font-semibold text-muted-foreground">
                      What's included:
                    </p>
                    {tier.features.included.map((feature, idx) => (
                      <div key={idx} className="flex items-start gap-2">
                        <Check className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                        <span className="text-sm">{feature}</span>
                      </div>
                    ))}
                    {tier.features.excluded.map((feature, idx) => (
                      <div key={idx} className="flex items-start gap-2 opacity-50">
                        <X className="w-5 h-5 text-muted-foreground flex-shrink-0 mt-0.5" />
                        <span className="text-sm text-muted-foreground">{feature}</span>
                      </div>
                    ))}
                  </div>

                  {/* Limits */}
                  <div className="pt-6 border-t border-border space-y-2">
                    <div className="flex items-center gap-2 text-sm">
                      <Clock className="w-4 h-4 text-muted-foreground" />
                      <span className="text-muted-foreground">Messages:</span>
                      <span className="font-medium ml-auto">{tier.limits.messages}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <Shield className="w-4 h-4 text-muted-foreground" />
                      <span className="text-muted-foreground">Storage:</span>
                      <span className="font-medium ml-auto">{tier.limits.storage}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <Users className="w-4 h-4 text-muted-foreground" />
                      <span className="text-muted-foreground">Support:</span>
                      <span className="font-medium ml-auto">{tier.limits.support}</span>
                    </div>
                  </div>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* FAQ Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="mt-20 max-w-4xl mx-auto"
        >
          <h2 className="text-3xl font-bold text-center mb-8">
            Frequently Asked Questions
          </h2>
          <div className="grid gap-6">
            <Card className="p-6">
              <h3 className="font-semibold text-lg mb-2">Can I change my plan anytime?</h3>
              <p className="text-muted-foreground">
                Yes! You can upgrade or downgrade your plan at any time. Changes will be reflected
                immediately, and we'll prorate the charges accordingly.
              </p>
            </Card>
            <Card className="p-6">
              <h3 className="font-semibold text-lg mb-2">What payment methods do you accept?</h3>
              <p className="text-muted-foreground">
                We accept all major credit cards (Visa, MasterCard, American Express), PayPal,
                and bank transfers for enterprise plans.
              </p>
            </Card>
            <Card className="p-6">
              <h3 className="font-semibold text-lg mb-2">Is there a free trial for paid plans?</h3>
              <p className="text-muted-foreground">
                Yes! All paid plans come with a 7-day free trial. No credit card required to start.
                You can cancel anytime during the trial period.
              </p>
            </Card>
            <Card className="p-6">
              <h3 className="font-semibold text-lg mb-2">What happens if I exceed my limits?</h3>
              <p className="text-muted-foreground">
                If you reach your monthly message limit, you'll be notified. You can either wait
                for the next billing cycle or upgrade to a higher plan for immediate access.
              </p>
            </Card>
          </div>
        </motion.div>

        {/* Contact CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="mt-16 text-center"
        >
          <Card className="p-8 max-w-2xl mx-auto bg-gradient-to-br from-purple-500/10 to-pink-500/10">
            <h3 className="text-2xl font-bold mb-4">Need a Custom Plan?</h3>
            <p className="text-muted-foreground mb-6">
              Contact our sales team for custom pricing tailored to your organization's needs.
            </p>
            <Button size="lg" className="bg-gradient-to-r from-purple-500 to-pink-500">
              Contact Sales
            </Button>
          </Card>
        </motion.div>
      </div>
    </div>
  );
};

export default Subscription;
