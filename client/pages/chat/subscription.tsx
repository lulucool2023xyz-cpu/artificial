import { memo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { 
    Crown, 
    Zap, 
    Check, 
    X, 
    Sparkles, 
    Brain, 
    Image, 
    Video, 
    Mic, 
    Globe,
    ArrowLeft,
    Star,
    Shield,
    Clock,
    Users,
    Rocket
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useTheme } from "next-themes";

interface PlanFeature {
    text: string;
    included: boolean;
    highlight?: boolean;
}

interface Plan {
    id: string;
    name: string;
    price: string;
    period: string;
    description: string;
    icon: React.ReactNode;
    features: PlanFeature[];
    popular?: boolean;
    buttonText: string;
    gradient: string;
}

const plans: Plan[] = [
    {
        id: "free",
        name: "Free",
        price: "Rp 0",
        period: "selamanya",
        description: "Untuk memulai eksplorasi AI",
        icon: <Zap className="w-6 h-6" />,
        buttonText: "Paket Aktif",
        gradient: "from-gray-600 to-gray-700",
        features: [
            { text: "50 pesan/hari", included: true },
            { text: "Gemini 2.0 Flash", included: true },
            { text: "3 gambar/hari", included: true },
            { text: "Voice chat basic", included: true },
            { text: "Riwayat 7 hari", included: true },
            { text: "Gemini 2.5 Pro", included: false },
            { text: "Video generation", included: false },
            { text: "Priority support", included: false },
        ]
    },
    {
        id: "pro",
        name: "Pro",
        price: "Rp 99.000",
        period: "/bulan",
        description: "Untuk kreator dan profesional",
        icon: <Crown className="w-6 h-6" />,
        buttonText: "Upgrade ke Pro",
        popular: true,
        gradient: "from-[#FFD700] to-[#FFA500]",
        features: [
            { text: "Unlimited pesan", included: true, highlight: true },
            { text: "Semua model AI", included: true, highlight: true },
            { text: "50 gambar/hari", included: true },
            { text: "10 video/hari", included: true },
            { text: "Voice chat unlimited", included: true },
            { text: "Deep thinking mode", included: true, highlight: true },
            { text: "Riwayat unlimited", included: true },
            { text: "Priority support", included: true },
        ]
    },
    {
        id: "enterprise",
        name: "Enterprise",
        price: "Custom",
        period: "",
        description: "Untuk tim dan organisasi",
        icon: <Rocket className="w-6 h-6" />,
        buttonText: "Hubungi Sales",
        gradient: "from-purple-600 to-indigo-600",
        features: [
            { text: "Semua fitur Pro", included: true },
            { text: "API access", included: true, highlight: true },
            { text: "Custom model training", included: true },
            { text: "Dedicated support", included: true },
            { text: "SLA guarantee", included: true },
            { text: "On-premise option", included: true },
            { text: "Team management", included: true },
            { text: "Analytics dashboard", included: true },
        ]
    }
];

const featureHighlights = [
    { icon: <Brain className="w-5 h-5" />, title: "AI Terdepan", desc: "Gemini 2.5 Pro & Flash" },
    { icon: <Image className="w-5 h-5" />, title: "Image Generation", desc: "Imagen 4.0" },
    { icon: <Video className="w-5 h-5" />, title: "Video Generation", desc: "Veo 3.1" },
    { icon: <Mic className="w-5 h-5" />, title: "Voice Chat", desc: "Realtime conversation" },
    { icon: <Globe className="w-5 h-5" />, title: "Web Search", desc: "Google Search integration" },
    { icon: <Sparkles className="w-5 h-5" />, title: "Deep Thinking", desc: "Extended reasoning" },
];

const Subscription = memo(function Subscription() {
    const navigate = useNavigate();
    const { theme } = useTheme();
    const [selectedPlan, setSelectedPlan] = useState<string | null>(null);
    const [billingCycle, setBillingCycle] = useState<"monthly" | "yearly">("monthly");

    const handleSubscribe = (planId: string) => {
        setSelectedPlan(planId);
        // TODO: Implement payment flow
    };

    return (
        <div className={cn(
            "min-h-screen",
            theme === "dark" 
                ? "bg-gradient-to-b from-[#0A0A0A] via-[#0A0A0A] to-[#111111]" 
                : "bg-gradient-to-b from-[#FAFAF9] via-white to-[#F5F5F4]"
        )}>
            {/* Header */}
            <header className="sticky top-0 z-50 backdrop-blur-xl bg-background/80 border-b border-border/50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between h-16">
                        <button
                            onClick={() => navigate(-1)}
                            className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
                        >
                            <ArrowLeft className="w-5 h-5" />
                            <span className="hidden sm:inline">Kembali</span>
                        </button>
                        <h1 className="text-xl font-bold text-[#FFD700]">Subscription</h1>
                        <div className="w-20" />
                    </div>
                </div>
            </header>

            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                {/* Hero Section */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-center mb-16"
                >
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#FFD700]/10 border border-[#FFD700]/20 mb-6">
                        <Crown className="w-4 h-4 text-[#FFD700]" />
                        <span className="text-sm text-[#FFD700] font-medium">Upgrade Experience Anda</span>
                    </div>
                    <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground mb-4">
                        Pilih Paket yang <span className="text-[#FFD700]">Tepat</span>
                    </h2>
                    <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
                        Akses penuh ke AI paling canggih untuk kreativitas dan produktivitas tanpa batas
                    </p>

                    {/* Billing Toggle */}
                    <div className="flex items-center justify-center gap-4 mt-8">
                        <button
                            onClick={() => setBillingCycle("monthly")}
                            className={cn(
                                "px-4 py-2 rounded-lg text-sm font-medium transition-all",
                                billingCycle === "monthly"
                                    ? "bg-[#FFD700] text-black"
                                    : "text-muted-foreground hover:text-foreground"
                            )}
                        >
                            Bulanan
                        </button>
                        <button
                            onClick={() => setBillingCycle("yearly")}
                            className={cn(
                                "px-4 py-2 rounded-lg text-sm font-medium transition-all flex items-center gap-2",
                                billingCycle === "yearly"
                                    ? "bg-[#FFD700] text-black"
                                    : "text-muted-foreground hover:text-foreground"
                            )}
                        >
                            Tahunan
                            <span className="text-xs bg-green-500 text-white px-2 py-0.5 rounded-full">
                                -20%
                            </span>
                        </button>
                    </div>
                </motion.div>

                {/* Plans Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8 mb-16">
                    {plans.map((plan, index) => (
                        <motion.div
                            key={plan.id}
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.1 }}
                            className={cn(
                                "relative rounded-2xl border transition-all duration-300",
                                plan.popular
                                    ? "border-[#FFD700]/50 shadow-xl shadow-[#FFD700]/10 scale-105 z-10"
                                    : "border-border hover:border-[#FFD700]/30",
                                theme === "dark" ? "bg-card" : "bg-white"
                            )}
                        >
                            {/* Popular Badge */}
                            {plan.popular && (
                                <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                                    <div className="flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-gradient-to-r from-[#FFD700] to-[#FFA500] text-black text-sm font-semibold shadow-lg">
                                        <Star className="w-4 h-4 fill-current" />
                                        Paling Populer
                                    </div>
                                </div>
                            )}

                            <div className="p-6 lg:p-8">
                                {/* Plan Header */}
                                <div className="flex items-center gap-3 mb-4">
                                    <div className={cn(
                                        "w-12 h-12 rounded-xl flex items-center justify-center bg-gradient-to-br",
                                        plan.gradient,
                                        plan.id === "free" ? "text-white" : "text-black"
                                    )}>
                                        {plan.icon}
                                    </div>
                                    <div>
                                        <h3 className="text-xl font-bold text-foreground">{plan.name}</h3>
                                        <p className="text-sm text-muted-foreground">{plan.description}</p>
                                    </div>
                                </div>

                                {/* Price */}
                                <div className="mb-6">
                                    <span className="text-4xl font-bold text-foreground">
                                        {billingCycle === "yearly" && plan.price !== "Custom" && plan.price !== "Rp 0"
                                            ? `Rp ${Math.round(parseInt(plan.price.replace(/\D/g, '')) * 0.8 * 12).toLocaleString()}`
                                            : plan.price
                                        }
                                    </span>
                                    <span className="text-muted-foreground">
                                        {billingCycle === "yearly" && plan.period === "/bulan" ? "/tahun" : plan.period}
                                    </span>
                                </div>

                                {/* CTA Button */}
                                <button
                                    onClick={() => handleSubscribe(plan.id)}
                                    className={cn(
                                        "w-full py-3 rounded-xl font-semibold transition-all duration-300",
                                        plan.popular
                                            ? "bg-gradient-to-r from-[#FFD700] to-[#FFA500] text-black hover:shadow-lg hover:shadow-[#FFD700]/30"
                                            : plan.id === "free"
                                                ? "bg-secondary text-foreground cursor-default"
                                                : "border border-[#FFD700] text-[#FFD700] hover:bg-[#FFD700]/10"
                                    )}
                                    disabled={plan.id === "free"}
                                >
                                    {plan.buttonText}
                                </button>

                                {/* Features List */}
                                <div className="mt-8 space-y-3">
                                    {plan.features.map((feature, i) => (
                                        <div
                                            key={i}
                                            className={cn(
                                                "flex items-center gap-3",
                                                !feature.included && "opacity-50"
                                            )}
                                        >
                                            {feature.included ? (
                                                <div className={cn(
                                                    "w-5 h-5 rounded-full flex items-center justify-center",
                                                    feature.highlight 
                                                        ? "bg-[#FFD700] text-black" 
                                                        : "bg-green-500/20 text-green-500"
                                                )}>
                                                    <Check className="w-3 h-3" />
                                                </div>
                                            ) : (
                                                <div className="w-5 h-5 rounded-full flex items-center justify-center bg-secondary">
                                                    <X className="w-3 h-3 text-muted-foreground" />
                                                </div>
                                            )}
                                            <span className={cn(
                                                "text-sm",
                                                feature.highlight ? "text-[#FFD700] font-medium" : "text-muted-foreground"
                                            )}>
                                                {feature.text}
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>

                {/* Feature Highlights */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                    className="mb-16"
                >
                    <h3 className="text-2xl font-bold text-center text-foreground mb-8">
                        Fitur <span className="text-[#FFD700]">Unggulan</span>
                    </h3>
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                        {featureHighlights.map((feature, i) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ delay: 0.5 + i * 0.05 }}
                                className={cn(
                                    "p-4 rounded-xl border text-center group hover:border-[#FFD700]/50 transition-all",
                                    theme === "dark" ? "bg-card border-border" : "bg-white border-gray-200"
                                )}
                            >
                                <div className="w-10 h-10 rounded-lg bg-[#FFD700]/10 flex items-center justify-center mx-auto mb-3 text-[#FFD700] group-hover:bg-[#FFD700] group-hover:text-black transition-colors">
                                    {feature.icon}
                                </div>
                                <h4 className="text-sm font-semibold text-foreground mb-1">{feature.title}</h4>
                                <p className="text-xs text-muted-foreground">{feature.desc}</p>
                            </motion.div>
                        ))}
                    </div>
                </motion.div>

                {/* Trust Section */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.6 }}
                    className={cn(
                        "rounded-2xl p-8 border",
                        theme === "dark" ? "bg-card border-border" : "bg-white border-gray-200"
                    )}
                >
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 rounded-xl bg-green-500/10 flex items-center justify-center text-green-500">
                                <Shield className="w-6 h-6" />
                            </div>
                            <div>
                                <h4 className="font-semibold text-foreground">Pembayaran Aman</h4>
                                <p className="text-sm text-muted-foreground">SSL encrypted & secure</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 rounded-xl bg-blue-500/10 flex items-center justify-center text-blue-500">
                                <Clock className="w-6 h-6" />
                            </div>
                            <div>
                                <h4 className="font-semibold text-foreground">Batal Kapan Saja</h4>
                                <p className="text-sm text-muted-foreground">Tanpa biaya pembatalan</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 rounded-xl bg-purple-500/10 flex items-center justify-center text-purple-500">
                                <Users className="w-6 h-6" />
                            </div>
                            <div>
                                <h4 className="font-semibold text-foreground">Support 24/7</h4>
                                <p className="text-sm text-muted-foreground">Tim siap membantu</p>
                            </div>
                        </div>
                    </div>
                </motion.div>

                {/* FAQ Section */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.7 }}
                    className="mt-16 text-center"
                >
                    <h3 className="text-xl font-bold text-foreground mb-4">Ada Pertanyaan?</h3>
                    <p className="text-muted-foreground mb-6">
                        Hubungi tim kami untuk informasi lebih lanjut tentang paket Enterprise
                    </p>
                    <button className="px-6 py-3 rounded-xl border border-[#FFD700] text-[#FFD700] font-semibold hover:bg-[#FFD700]/10 transition-colors">
                        Hubungi Kami
                    </button>
                </motion.div>
            </main>
        </div>
    );
});

export default Subscription;

