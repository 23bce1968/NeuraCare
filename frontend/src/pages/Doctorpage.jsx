import { useState, useEffect } from "react";
import { 
    Heart, Bell, Settings, LogOut, Activity, Shield, Calendar, 
    Clock, MapPin, CheckCircle, AlertTriangle, Stethoscope, 
    User, ChevronRight, TrendingUp, Lock, Unlock, Search,
    FileText, Phone, Mail, Star, Plus, ArrowRight, X, Pill,
    Thermometer, Droplet, Wind, Zap, BarChart3, Download,
    Share2, MessageSquare, Video, BookOpen, Target, Award,
    TrendingDown, AlertCircle, Info, CheckCircle2, XCircle,
    HeartPulse, Syringe, TestTube, ClipboardList, Eye,
    Filter, ChevronDown, ChevronUp, ExternalLink, Ambulance
} from "lucide-react";

export default function Doctorpage() {
    const [activeSection, setActiveSection] = useState("home");
    const [showConsentModal, setShowConsentModal] = useState(false);
    const [showDoctorModal, setShowDoctorModal] = useState(null);
    const [showMedicationModal, setShowMedicationModal] = useState(false);
    const [showVitalsModal, setShowVitalsModal] = useState(false);
    const [isAnimating, setIsAnimating] = useState(false);
    const [expandedRecord, setExpandedRecord] = useState(null);
    const [selectedTab, setSelectedTab] = useState("overview");
    const [consent, setConsent] = useState({
        healthcareProviders: true,
        publicHealthAuthority: false
    });

    // Mock user data - ENHANCED
    const userData = {
        name: "John Doe",
        workerId: "WK12345",
        location: "Ernakulam, Kerala",
        age: 28,
        gender: "Male",
        bloodGroup: "O+",
        memberSince: "Jan 2026",
        emergencyContact: "+91 98765 43210",
        email: "john.doe@example.com"
    };

    // Mock health stats - ENHANCED
    const healthStats = {
        totalRecords: 5,
        nextCheckup: "15 days",
        activeAlerts: 2,
        healthScore: 85,
        lastVisit: "5 days ago",
        totalVisits: 12,
        activeMedications: 2,
        upcomingAppointments: 1
    };

    // Mock vital signs - NEW
    const vitalSigns = {
        temperature: { value: 98.6, unit: "°F", status: "normal", lastUpdated: "2 hours ago" },
        bloodPressure: { systolic: 120, diastolic: 80, status: "normal", lastUpdated: "1 day ago" },
        heartRate: { value: 72, unit: "bpm", status: "normal", lastUpdated: "2 hours ago" },
        oxygenLevel: { value: 98, unit: "%", status: "normal", lastUpdated: "2 hours ago" },
        weight: { value: 70, unit: "kg", lastUpdated: "1 week ago" },
        height: { value: 175, unit: "cm" }
    };

    // Mock medications - NEW
    const medications = [
        {
            id: 1,
            name: "Paracetamol",
            dosage: "500mg",
            frequency: "3 times daily",
            startDate: "Jan 15, 2026",
            endDate: "Jan 20, 2026",
            remainingDays: 2,
            prescribedBy: "Dr. Rajesh Kumar",
            purpose: "Fever & Pain Relief",
            instructions: "Take after meals",
            status: "active"
        },
        {
            id: 2,
            name: "Vitamin D3",
            dosage: "60,000 IU",
            frequency: "Once weekly",
            startDate: "Jan 1, 2026",
            endDate: "Mar 1, 2026",
            remainingDays: 30,
            prescribedBy: "Dr. Priya Sharma",
            purpose: "Vitamin Deficiency",
            instructions: "Take on Sunday morning",
            status: "active"
        }
    ];

    // Mock lab results - NEW
    const labResults = [
        {
            id: 1,
            testName: "Complete Blood Count (CBC)",
            date: "Jan 15, 2026",
            status: "completed",
            parameters: [
                { name: "Hemoglobin", value: 14.5, unit: "g/dL", range: "13-17", status: "normal" },
                { name: "WBC Count", value: 7800, unit: "/μL", range: "4000-11000", status: "normal" },
                { name: "Platelet Count", value: 250000, unit: "/μL", range: "150000-400000", status: "normal" }
            ]
        },
        {
            id: 2,
            testName: "Blood Sugar (Fasting)",
            date: "Jan 10, 2026",
            status: "completed",
            parameters: [
                { name: "Glucose", value: 95, unit: "mg/dL", range: "70-100", status: "normal" }
            ]
        }
    ];

    // Mock upcoming appointments - NEW
    const upcomingAppointments = [
        {
            id: 1,
            doctor: "Dr. Rajesh Kumar",
            specialization: "General Physician",
            hospital: "City General Hospital",
            date: "Jan 25, 2026",
            time: "10:00 AM",
            type: "Follow-up",
            status: "confirmed"
        }
    ];

    // Mock health timeline - NEW
    const healthTimeline = [
        {
            id: 1,
            date: "Jan 15, 2026",
            type: "visit",
            title: "Hospital Visit",
            description: "Viral Fever Treatment",
            doctor: "Dr. Rajesh Kumar",
            icon: Stethoscope,
            color: "emerald"
        },
        {
            id: 2,
            date: "Jan 10, 2026",
            type: "test",
            title: "Lab Test",
            description: "Complete Blood Count",
            hospital: "Health Camp",
            icon: TestTube,
            color: "blue"
        },
        {
            id: 3,
            date: "Jan 5, 2026",
            type: "medication",
            title: "Medication Started",
            description: "Vitamin D3 Supplement",
            doctor: "Dr. Priya Sharma",
            icon: Pill,
            color: "purple"
        },
        {
            id: 4,
            date: "Dec 20, 2025",
            type: "visit",
            title: "Emergency Visit",
            description: "Minor Injury Treatment",
            doctor: "Dr. Mohammed Ali",
            icon: Ambulance,
            color: "red"
        }
    ];

    // Mock health records - ENHANCED
    const healthRecords = [
        {
            id: 1,
            date: "Jan 15, 2026",
            time: "10:30 AM",
            doctor: "Dr. Rajesh Kumar",
            hospital: "City General Hospital",
            diagnosis: "Viral Fever",
            symptoms: ["High fever", "Headache", "Body pain"],
            vitals: {
                temperature: 102.5,
                bp: "120/80",
                pulse: 98,
                spo2: 97
            },
            medications: ["Paracetamol 500mg", "Cetirizine 10mg"],
            labTests: ["CBC", "Dengue NS1"],
            notes: "Rest for 3 days. Follow up if fever persists.",
            status: "Recovered",
            color: "emerald",
            followUpDate: "Jan 20, 2026"
        },
        {
            id: 2,
            date: "Jan 10, 2026",
            time: "2:00 PM",
            doctor: "Dr. Priya Sharma",
            hospital: "Health Camp - Ernakulam",
            diagnosis: "General Checkup - Annual Health Screening",
            symptoms: [],
            vitals: {
                temperature: 98.6,
                bp: "118/78",
                pulse: 72,
                spo2: 99,
                weight: 70,
                height: 175
            },
            medications: ["Vitamin D3 60000 IU"],
            labTests: ["Blood Sugar", "Lipid Profile"],
            notes: "All parameters normal. Continue healthy lifestyle.",
            status: "Normal",
            color: "blue",
            followUpDate: null
        },
        {
            id: 3,
            date: "Dec 20, 2025",
            time: "5:45 PM",
            doctor: "Dr. Mohammed Ali",
            hospital: "Community Health Center",
            diagnosis: "Minor Cut - Left Hand",
            symptoms: ["Bleeding", "Pain"],
            vitals: {
                temperature: 98.4,
                bp: "122/82",
                pulse: 76
            },
            medications: ["Antibiotic Ointment", "Tetanus Shot"],
            labTests: [],
            notes: "Wound cleaned and bandaged. Keep dry for 3 days.",
            status: "Healed",
            color: "emerald",
            followUpDate: "Dec 25, 2025"
        }
    ];

    // Mock alerts - ENHANCED
    const alerts = [
        {
            id: 1,
            type: "warning",
            title: "Dengue Alert in Your Area",
            message: "23 cases reported in Ernakulam district. Use mosquito repellent and drain stagnant water.",
            time: "2 hours ago",
            icon: AlertTriangle,
            color: "amber",
            action: "View Prevention Tips",
            severity: "high"
        },
        {
            id: 2,
            type: "info",
            title: "Health Checkup Reminder",
            message: "Your annual health checkup is due in 15 days. Book appointment now.",
            time: "1 day ago",
            icon: Calendar,
            color: "blue",
            action: "Book Now",
            severity: "medium"
        },
        {
            id: 3,
            type: "success",
            title: "Medication Reminder",
            message: "Don't forget to take Vitamin D3 tomorrow morning.",
            time: "Yesterday",
            icon: Pill,
            color: "emerald",
            action: "Set Reminder",
            severity: "low"
        }
    ];

    // Mock available doctors - ENHANCED
    const doctors = [
        {
            id: 1,
            name: "Dr. Rajesh Kumar",
            specialization: "General Physician",
            hospital: "City General Hospital",
            experience: "15 years",
            rating: 4.8,
            reviews: 234,
            availability: "Available Today",
            nextSlot: "2:00 PM",
            image: "👨‍⚕️",
            consultationFee: "₹500",
            languages: ["English", "Hindi", "Malayalam"],
            education: "MBBS, MD",
            distance: "2.5 km"
        },
        {
            id: 2,
            name: "Dr. Priya Sharma",
            specialization: "Internal Medicine",
            hospital: "Medicare Center",
            experience: "12 years",
            rating: 4.9,
            reviews: 189,
            availability: "Available Tomorrow",
            nextSlot: "10:00 AM",
            image: "👩‍⚕️",
            consultationFee: "₹600",
            languages: ["English", "Hindi", "Tamil"],
            education: "MBBS, MD (Internal Medicine)",
            distance: "3.8 km"
        },
        {
            id: 3,
            name: "Dr. Mohammed Ali",
            specialization: "Infectious Disease",
            hospital: "Community Health Center",
            experience: "10 years",
            rating: 4.7,
            reviews: 156,
            availability: "Available Today",
            nextSlot: "4:30 PM",
            image: "👨‍⚕️",
            consultationFee: "₹550",
            languages: ["English", "Malayalam", "Urdu"],
            education: "MBBS, MD (Medicine), DM (ID)",
            distance: "1.2 km"
        },
        {
            id: 4,
            name: "Dr. Anjali Menon",
            specialization: "Family Medicine",
            hospital: "HealthCare Plus",
            experience: "8 years",
            rating: 4.9,
            reviews: 201,
            availability: "Available Today",
            nextSlot: "6:00 PM",
            image: "👩‍⚕️",
            consultationFee: "₹450",
            languages: ["English", "Malayalam", "Hindi"],
            education: "MBBS, DNB (Family Medicine)",
            distance: "4.1 km"
        }
    ];

    useEffect(() => {
        setTimeout(() => setIsAnimating(true), 100);
    }, []);

    const toggleConsent = (type) => {
        setConsent({ ...consent, [type]: !consent[type] });
    };

    const getVitalStatus = (status) => {
        const statusConfig = {
            normal: { color: "emerald", icon: CheckCircle2 },
            warning: { color: "amber", icon: AlertCircle },
            critical: { color: "red", icon: XCircle }
        };
        return statusConfig[status] || statusConfig.normal;
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-emerald-50/20 to-slate-50">
            {/* Decorative background elements */}
            <div className="fixed inset-0 overflow-hidden pointer-events-none">
                <div className="absolute -top-40 -right-40 w-96 h-96 bg-emerald-200/30 rounded-full blur-3xl animate-pulse" />
                <div className="absolute top-1/2 -left-40 w-96 h-96 bg-blue-200/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: "1s" }} />
                <div className="absolute bottom-20 right-1/3 w-72 h-72 bg-purple-200/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: "2s" }} />
            </div>

            <div className="relative">
                {/* Header - ENHANCED */}
                <header className="bg-white/80 backdrop-blur-xl border-b border-gray-200/50 sticky top-0 z-40 shadow-sm">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="flex items-center justify-between h-16 md:h-20">
                            {/* Logo */}
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-xl flex items-center justify-center shadow-lg shadow-emerald-500/30">
                                    <Heart className="w-6 h-6 text-white fill-white" />
                                </div>
                                <div>
                                    <h1 className="text-xl font-bold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
                                        MigraHealth
                                    </h1>
                                    <p className="text-xs text-gray-500">Worker Portal</p>
                                </div>
                            </div>

                            {/* Navigation Tabs - NEW */}
                            <nav className="hidden md:flex items-center gap-1 bg-gray-100 rounded-xl p-1">
                                {[
                                    { id: "overview", label: "Overview", icon: Activity },
                                    { id: "records", label: "Records", icon: FileText },
                                    { id: "doctors", label: "Doctors", icon: Stethoscope },
                                    { id: "reports", label: "Reports", icon: BarChart3 }
                                ].map((tab) => (
                                    <button
                                        key={tab.id}
                                        onClick={() => setSelectedTab(tab.id)}
                                        className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium text-sm transition-all ${
                                            selectedTab === tab.id
                                                ? "bg-white text-emerald-600 shadow-sm"
                                                : "text-gray-600 hover:text-gray-900"
                                        }`}
                                    >
                                        <tab.icon className="w-4 h-4" />
                                        {tab.label}
                                    </button>
                                ))}
                            </nav>

                            {/* User Menu */}
                            <div className="flex items-center gap-3">
                                <button className="relative p-2 hover:bg-gray-100 rounded-xl transition-all">
                                    <Bell className="w-5 h-5 text-gray-600" />
                                    <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full animate-pulse" />
                                </button>
                                <div className="hidden sm:flex items-center gap-3 pl-3 border-l border-gray-200">
                                    <div className="text-right">
                                        <p className="text-sm font-semibold text-gray-900">{userData.name}</p>
                                        <p className="text-xs text-gray-500">{userData.workerId}</p>
                                    </div>
                                    <div className="w-10 h-10 bg-gradient-to-br from-emerald-400 to-teal-500 rounded-xl flex items-center justify-center text-white font-bold shadow-lg">
                                        {userData.name.charAt(0)}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </header>

                {/* Main Content */}
                <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                    {/* Welcome Section - ENHANCED */}
                    <div
                        className={`mb-8 transform transition-all duration-700 ${
                            isAnimating ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"
                        }`}
                    >
                        <div className="flex items-start justify-between">
                            <div>
                                <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
                                    Welcome back, <span className="bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">{userData.name.split(" ")[0]}!</span> 👋
                                </h2>
                                <p className="text-gray-600 mb-4">Here's your health summary for today</p>
                                <div className="flex flex-wrap items-center gap-3">
                                    <span className="px-3 py-1 bg-emerald-100 text-emerald-700 rounded-full text-sm font-medium flex items-center gap-1">
                                        <Droplet className="w-4 h-4" />
                                        {userData.bloodGroup}
                                    </span>
                                    <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-medium">
                                        {userData.age} years
                                    </span>
                                    <span className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-sm font-medium flex items-center gap-1">
                                        <MapPin className="w-4 h-4" />
                                        {userData.location}
                                    </span>
                                </div>
                            </div>
                            <button className="px-4 py-2 bg-white border border-gray-200 rounded-xl hover:border-emerald-500 hover:bg-emerald-50 transition-all flex items-center gap-2 text-sm font-medium">
                                <Download className="w-4 h-4" />
                                Export Health Data
                            </button>
                        </div>
                    </div>

                    {/* Enhanced Stats Grid - 8 CARDS */}
                    <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-8">
                        {[
                            { icon: FileText, label: "Health Records", value: healthStats.totalRecords, color: "emerald", delay: "100", subtext: "Total visits" },
                            { icon: Calendar, label: "Next Checkup", value: healthStats.nextCheckup, color: "blue", delay: "150", subtext: "Upcoming" },
                            { icon: Bell, label: "Active Alerts", value: healthStats.activeAlerts, color: "amber", delay: "200", subtext: "Notifications" },
                            { icon: TrendingUp, label: "Health Score", value: `${healthStats.healthScore}%`, color: "teal", delay: "250", subtext: "Excellent" },
                            { icon: Pill, label: "Medications", value: healthStats.activeMedications, color: "purple", delay: "300", subtext: "Active" },
                            { icon: Activity, label: "Last Visit", value: healthStats.lastVisit, color: "cyan", delay: "350", subtext: "Recent" },
                            { icon: Stethoscope, label: "Total Visits", value: healthStats.totalVisits, color: "indigo", delay: "400", subtext: "All time" },
                            { icon: Clock, label: "Appointments", value: healthStats.upcomingAppointments, color: "rose", delay: "450", subtext: "Scheduled" }
                        ].map((stat, idx) => (
                            <div
                                key={idx}
                                className={`group relative bg-white rounded-2xl p-5 shadow-lg shadow-${stat.color}-500/10 border border-${stat.color}-100 hover:shadow-xl hover:shadow-${stat.color}-500/20 transition-all duration-500 hover:-translate-y-1 ${
                                    isAnimating ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0"
                                }`}
                                style={{ transitionDelay: `${stat.delay}ms` }}
                            >
                                <div className={`absolute inset-0 bg-gradient-to-br from-${stat.color}-500/5 to-transparent rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />
                                <div className="relative">
                                    <div className={`w-10 h-10 bg-gradient-to-br from-${stat.color}-500 to-${stat.color}-600 rounded-lg flex items-center justify-center text-white mb-3 group-hover:scale-110 transition-transform duration-500 shadow-lg shadow-${stat.color}-500/30`}>
                                        <stat.icon className="w-5 h-5" />
                                    </div>
                                    <p className="text-gray-600 text-xs mb-1">{stat.label}</p>
                                    <p className="text-2xl font-bold text-gray-900 mb-1">{stat.value}</p>
                                    <p className="text-xs text-gray-500">{stat.subtext}</p>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* NEW: Current Vitals Section */}
                    <section
                        className={`bg-white rounded-2xl p-6 shadow-lg border border-gray-100 mb-8 transform transition-all duration-700 delay-500 ${
                            isAnimating ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0"
                        }`}
                    >
                        <div className="flex items-center justify-between mb-6">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 bg-gradient-to-br from-red-500 to-pink-600 rounded-xl flex items-center justify-center shadow-lg shadow-red-500/30">
                                    <HeartPulse className="w-5 h-5 text-white" />
                                </div>
                                <div>
                                    <h3 className="text-xl font-bold text-gray-900">Current Vital Signs</h3>
                                    <p className="text-sm text-gray-500">Real-time health metrics</p>
                                </div>
                            </div>
                            <button
                                onClick={() => setShowVitalsModal(true)}
                                className="px-4 py-2 bg-emerald-500 text-white rounded-xl hover:bg-emerald-600 transition-all font-medium text-sm flex items-center gap-2"
                            >
                                <Plus className="w-4 h-4" />
                                Update Vitals
                            </button>
                        </div>

                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            {[
                                { 
                                    label: "Temperature", 
                                    value: vitalSigns.temperature.value, 
                                    unit: vitalSigns.temperature.unit, 
                                    icon: Thermometer, 
                                    color: "red",
                                    status: vitalSigns.temperature.status
                                },
                                { 
                                    label: "Blood Pressure", 
                                    value: `${vitalSigns.bloodPressure.systolic}/${vitalSigns.bloodPressure.diastolic}`, 
                                    unit: "mmHg", 
                                    icon: Activity, 
                                    color: "blue",
                                    status: vitalSigns.bloodPressure.status
                                },
                                { 
                                    label: "Heart Rate", 
                                    value: vitalSigns.heartRate.value, 
                                    unit: vitalSigns.heartRate.unit, 
                                    icon: HeartPulse, 
                                    color: "pink",
                                    status: vitalSigns.heartRate.status
                                },
                                { 
                                    label: "Oxygen Level", 
                                    value: vitalSigns.oxygenLevel.value, 
                                    unit: vitalSigns.oxygenLevel.unit, 
                                    icon: Wind, 
                                    color: "cyan",
                                    status: vitalSigns.oxygenLevel.status
                                }
                            ].map((vital, idx) => {
                                const statusConfig = getVitalStatus(vital.status);
                                return (
                                    <div key={idx} className={`bg-gradient-to-br from-${vital.color}-50 to-white rounded-xl p-4 border border-${vital.color}-200 hover:shadow-md transition-all`}>
                                        <div className="flex items-start justify-between mb-3">
                                            <div className={`w-10 h-10 bg-${vital.color}-500 rounded-lg flex items-center justify-center text-white shadow-md`}>
                                                <vital.icon className="w-5 h-5" />
                                            </div>
                                            <statusConfig.icon className={`w-5 h-5 text-${statusConfig.color}-500`} />
                                        </div>
                                        <p className="text-gray-600 text-xs mb-1">{vital.label}</p>
                                        <p className="text-2xl font-bold text-gray-900">
                                            {vital.value}
                                            <span className="text-sm font-normal text-gray-500 ml-1">{vital.unit}</span>
                                        </p>
                                        <p className={`text-xs text-${statusConfig.color}-600 font-medium mt-1 capitalize`}>{vital.status}</p>
                                    </div>
                                );
                            })}
                        </div>
                    </section>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
                        {/* Main Content Area - ENHANCED */}
                        <div className="lg:col-span-2 space-y-6">
                            {/* Health Records Section - ENHANCED WITH EXPAND */}
                            <section
                                className={`bg-white rounded-2xl p-6 shadow-lg border border-gray-100 transform transition-all duration-700 delay-600 ${
                                    isAnimating ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0"
                                }`}
                            >
                                <div className="flex items-center justify-between mb-6">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-xl flex items-center justify-center shadow-lg shadow-emerald-500/30">
                                            <Activity className="w-5 h-5 text-white" />
                                        </div>
                                        <div>
                                            <h3 className="text-xl font-bold text-gray-900">My Health Records</h3>
                                            <p className="text-sm text-gray-500">Detailed medical history</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <button className="p-2 hover:bg-gray-100 rounded-lg transition-all">
                                            <Filter className="w-5 h-5 text-gray-600" />
                                        </button>
                                        <button className="text-emerald-600 hover:text-emerald-700 font-semibold text-sm flex items-center gap-1 hover:gap-2 transition-all">
                                            View All <ChevronRight className="w-4 h-4" />
                                        </button>
                                    </div>
                                </div>

                                <div className="space-y-4">
                                    {healthRecords.map((record, idx) => (
                                        <div key={record.id} className="border border-gray-200 rounded-xl overflow-hidden hover:border-emerald-300 transition-all">
                                            <div
                                                className="group relative bg-gradient-to-br from-gray-50 to-white rounded-xl p-4 cursor-pointer"
                                                onClick={() => setExpandedRecord(expandedRecord === record.id ? null : record.id)}
                                            >
                                                <div className="flex items-start gap-4">
                                                    <div className={`w-12 h-12 bg-gradient-to-br from-${record.color}-500 to-${record.color}-600 rounded-xl flex items-center justify-center text-white flex-shrink-0 shadow-lg shadow-${record.color}-500/30`}>
                                                        <Stethoscope className="w-6 h-6" />
                                                    </div>
                                                    <div className="flex-1 min-w-0">
                                                        <div className="flex items-start justify-between gap-2 mb-2">
                                                            <div>
                                                                <h4 className="font-semibold text-gray-900 group-hover:text-emerald-600 transition-colors">
                                                                    {record.diagnosis}
                                                                </h4>
                                                                <p className="text-sm text-gray-600">{record.doctor}</p>
                                                            </div>
                                                            <div className="flex items-center gap-2">
                                                                <span className={`px-3 py-1 bg-${record.color}-100 text-${record.color}-700 text-xs font-semibold rounded-full`}>
                                                                    {record.status}
                                                                </span>
                                                                {expandedRecord === record.id ? (
                                                                    <ChevronUp className="w-5 h-5 text-gray-400" />
                                                                ) : (
                                                                    <ChevronDown className="w-5 h-5 text-gray-400" />
                                                                )}
                                                            </div>
                                                        </div>
                                                        <div className="flex flex-wrap items-center gap-3 text-sm text-gray-500">
                                                            <span className="flex items-center gap-1">
                                                                <Calendar className="w-4 h-4" />
                                                                {record.date} • {record.time}
                                                            </span>
                                                            <span className="flex items-center gap-1">
                                                                <MapPin className="w-4 h-4" />
                                                                {record.hospital}
                                                            </span>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Expanded Details */}
                                            {expandedRecord === record.id && (
                                                <div className="bg-gray-50 p-4 border-t border-gray-200 space-y-4 animate-slideDown">
                                                    {/* Symptoms */}
                                                    {record.symptoms.length > 0 && (
                                                        <div>
                                                            <h5 className="font-semibold text-gray-900 mb-2 flex items-center gap-2">
                                                                <AlertCircle className="w-4 h-4 text-amber-500" />
                                                                Symptoms
                                                            </h5>
                                                            <div className="flex flex-wrap gap-2">
                                                                {record.symptoms.map((symptom, i) => (
                                                                    <span key={i} className="px-3 py-1 bg-amber-100 text-amber-700 rounded-full text-xs">
                                                                        {symptom}
                                                                    </span>
                                                                ))}
                                                            </div>
                                                        </div>
                                                    )}

                                                    {/* Vitals */}
                                                    <div>
                                                        <h5 className="font-semibold text-gray-900 mb-2 flex items-center gap-2">
                                                            <HeartPulse className="w-4 h-4 text-red-500" />
                                                            Vital Signs
                                                        </h5>
                                                        <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                                                            {record.vitals.temperature && (
                                                                <div className="bg-white rounded-lg p-2 border border-gray-200">
                                                                    <p className="text-xs text-gray-500">Temp</p>
                                                                    <p className="font-semibold text-gray-900">{record.vitals.temperature}°F</p>
                                                                </div>
                                                            )}
                                                            {record.vitals.bp && (
                                                                <div className="bg-white rounded-lg p-2 border border-gray-200">
                                                                    <p className="text-xs text-gray-500">BP</p>
                                                                    <p className="font-semibold text-gray-900">{record.vitals.bp}</p>
                                                                </div>
                                                            )}
                                                            {record.vitals.pulse && (
                                                                <div className="bg-white rounded-lg p-2 border border-gray-200">
                                                                    <p className="text-xs text-gray-500">Pulse</p>
                                                                    <p className="font-semibold text-gray-900">{record.vitals.pulse} bpm</p>
                                                                </div>
                                                            )}
                                                            {record.vitals.spo2 && (
                                                                <div className="bg-white rounded-lg p-2 border border-gray-200">
                                                                    <p className="text-xs text-gray-500">SpO2</p>
                                                                    <p className="font-semibold text-gray-900">{record.vitals.spo2}%</p>
                                                                </div>
                                                            )}
                                                        </div>
                                                    </div>

                                                    {/* Medications */}
                                                    {record.medications.length > 0 && (
                                                        <div>
                                                            <h5 className="font-semibold text-gray-900 mb-2 flex items-center gap-2">
                                                                <Pill className="w-4 h-4 text-purple-500" />
                                                                Medications Prescribed
                                                            </h5>
                                                            <div className="flex flex-wrap gap-2">
                                                                {record.medications.map((med, i) => (
                                                                    <span key={i} className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-xs">
                                                                        {med}
                                                                    </span>
                                                                ))}
                                                            </div>
                                                        </div>
                                                    )}

                                                    {/* Lab Tests */}
                                                    {record.labTests.length > 0 && (
                                                        <div>
                                                            <h5 className="font-semibold text-gray-900 mb-2 flex items-center gap-2">
                                                                <TestTube className="w-4 h-4 text-blue-500" />
                                                                Lab Tests Ordered
                                                            </h5>
                                                            <div className="flex flex-wrap gap-2">
                                                                {record.labTests.map((test, i) => (
                                                                    <span key={i} className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-xs">
                                                                        {test}
                                                                    </span>
                                                                ))}
                                                            </div>
                                                        </div>
                                                    )}

                                                    {/* Doctor's Notes */}
                                                    <div>
                                                        <h5 className="font-semibold text-gray-900 mb-2 flex items-center gap-2">
                                                            <ClipboardList className="w-4 h-4 text-emerald-500" />
                                                            Doctor's Notes
                                                        </h5>
                                                        <p className="text-sm text-gray-700 bg-white rounded-lg p-3 border border-gray-200">
                                                            {record.notes}
                                                        </p>
                                                    </div>

                                                    {/* Actions */}
                                                    <div className="flex items-center gap-2 pt-2">
                                                        <button className="px-4 py-2 bg-emerald-500 text-white rounded-lg hover:bg-emerald-600 transition-all text-sm font-medium flex items-center gap-2">
                                                            <Download className="w-4 h-4" />
                                                            Download Report
                                                        </button>
                                                        <button className="px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-all text-sm font-medium flex items-center gap-2">
                                                            <Share2 className="w-4 h-4" />
                                                            Share
                                                        </button>
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            </section>

                            {/* NEW: Active Medications Section */}
                            <section
                                className={`bg-white rounded-2xl p-6 shadow-lg border border-gray-100 transform transition-all duration-700 delay-700 ${
                                    isAnimating ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0"
                                }`}
                            >
                                <div className="flex items-center justify-between mb-6">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-600 rounded-xl flex items-center justify-center shadow-lg shadow-purple-500/30">
                                            <Pill className="w-5 h-5 text-white" />
                                        </div>
                                        <div>
                                            <h3 className="text-xl font-bold text-gray-900">Active Medications</h3>
                                            <p className="text-sm text-gray-500">Current prescriptions</p>
                                        </div>
                                    </div>
                                    <button
                                        onClick={() => setShowMedicationModal(true)}
                                        className="text-purple-600 hover:text-purple-700 font-semibold text-sm flex items-center gap-1 hover:gap-2 transition-all"
                                    >
                                        View All <ChevronRight className="w-4 h-4" />
                                    </button>
                                </div>

                                <div className="space-y-4">
                                    {medications.map((med) => (
                                        <div key={med.id} className="bg-gradient-to-br from-purple-50 to-white rounded-xl p-4 border border-purple-200 hover:shadow-md transition-all">
                                            <div className="flex items-start justify-between mb-3">
                                                <div>
                                                    <h4 className="font-bold text-gray-900 mb-1">{med.name}</h4>
                                                    <p className="text-sm text-gray-600">{med.dosage} • {med.frequency}</p>
                                                    <p className="text-xs text-gray-500 mt-1">Prescribed by {med.prescribedBy}</p>
                                                </div>
                                                <span className="px-3 py-1 bg-purple-100 text-purple-700 text-xs font-semibold rounded-full">
                                                    {med.remainingDays} days left
                                                </span>
                                            </div>
                                            <div className="bg-white rounded-lg p-3 border border-purple-100 mb-3">
                                                <p className="text-xs text-gray-600 mb-1">Purpose</p>
                                                <p className="text-sm font-medium text-gray-900">{med.purpose}</p>
                                            </div>
                                            <div className="flex items-center justify-between text-xs text-gray-500">
                                                <span>Started: {med.startDate}</span>
                                                <span>Ends: {med.endDate}</span>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </section>

                            {/* Find Doctors Section - ENHANCED */}
                            <section
                                className={`bg-white rounded-2xl p-6 shadow-lg border border-gray-100 transform transition-all duration-700 delay-800 ${
                                    isAnimating ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0"
                                }`}
                            >
                                <div className="flex items-center justify-between mb-6">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-cyan-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/30">
                                            <Stethoscope className="w-5 h-5 text-white" />
                                        </div>
                                        <div>
                                            <h3 className="text-xl font-bold text-gray-900">Available Doctors</h3>
                                            <p className="text-sm text-gray-500">Book your appointment</p>
                                        </div>
                                    </div>
                                    <div className="relative">
                                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                                        <input
                                            type="text"
                                            placeholder="Search doctors..."
                                            className="pl-10 pr-4 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all w-48"
                                        />
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 gap-4">
                                    {doctors.map((doctor, idx) => (
                                        <div
                                            key={doctor.id}
                                            className="group relative bg-gradient-to-br from-gray-50 to-white rounded-xl p-5 border border-gray-200 hover:border-blue-300 transition-all duration-300 hover:shadow-lg"
                                        >
                                            <div className="flex items-start gap-4">
                                                <div className="w-16 h-16 bg-gradient-to-br from-blue-100 to-cyan-100 rounded-xl flex items-center justify-center text-4xl flex-shrink-0 shadow-md">
                                                    {doctor.image}
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <div className="flex items-start justify-between gap-2 mb-2">
                                                        <div>
                                                            <h4 className="font-bold text-gray-900 group-hover:text-blue-600 transition-colors">
                                                                {doctor.name}
                                                            </h4>
                                                            <p className="text-sm text-gray-600">{doctor.specialization}</p>
                                                            <p className="text-xs text-gray-500 mt-1">{doctor.hospital}</p>
                                                        </div>
                                                        <div className="text-right">
                                                            <div className="flex items-center gap-1 mb-1">
                                                                <Star className="w-4 h-4 text-amber-500 fill-amber-500" />
                                                                <span className="text-sm font-semibold text-gray-900">{doctor.rating}</span>
                                                                <span className="text-xs text-gray-500">({doctor.reviews})</span>
                                                            </div>
                                                            <p className="text-xs text-gray-500">{doctor.experience}</p>
                                                        </div>
                                                    </div>
                                                    <div className="flex flex-wrap items-center gap-2 mb-3">
                                                        <span className="px-2 py-1 bg-green-100 text-green-700 text-xs font-semibold rounded-full flex items-center gap-1">
                                                            <Clock className="w-3 h-3" />
                                                            {doctor.availability}
                                                        </span>
                                                        <span className="text-xs text-gray-600">Next: {doctor.nextSlot}</span>
                                                        <span className="text-xs text-gray-600 flex items-center gap-1">
                                                            <MapPin className="w-3 h-3" />
                                                            {doctor.distance}
                                                        </span>
                                                    </div>
                                                    <div className="flex items-center justify-between">
                                                        <div>
                                                            <span className="text-xl font-bold text-gray-900">{doctor.consultationFee}</span>
                                                            <p className="text-xs text-gray-500">
                                                                {doctor.languages.join(", ")}
                                                            </p>
                                                        </div>
                                                        <button
                                                            onClick={() => setShowDoctorModal(doctor)}
                                                            className="px-4 py-2 bg-gradient-to-r from-blue-500 to-cyan-600 text-white font-semibold rounded-xl hover:shadow-lg hover:shadow-blue-500/30 transition-all hover:scale-105 active:scale-95 flex items-center gap-2"
                                                        >
                                                            Book Now
                                                            <ArrowRight className="w-4 h-4" />
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </section>
                        </div>

                        {/* Sidebar - ENHANCED WITH MORE SECTIONS */}
                        <div className="space-y-6">
                            {/* Alerts Section - ENHANCED */}
                            <section
                                className={`bg-white rounded-2xl p-6 shadow-lg border border-gray-100 transform transition-all duration-700 delay-900 ${
                                    isAnimating ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0"
                                }`}
                            >
                                <div className="flex items-center gap-3 mb-6">
                                    <div className="w-10 h-10 bg-gradient-to-br from-amber-500 to-orange-600 rounded-xl flex items-center justify-center shadow-lg shadow-amber-500/30">
                                        <Bell className="w-5 h-5 text-white" />
                                    </div>
                                    <div>
                                        <h3 className="text-lg font-bold text-gray-900">Health Alerts</h3>
                                        <p className="text-xs text-gray-500">{alerts.length} active</p>
                                    </div>
                                </div>

                                <div className="space-y-4">
                                    {alerts.map((alert) => (
                                        <div
                                            key={alert.id}
                                            className={`bg-${alert.color}-50 border border-${alert.color}-200 rounded-xl p-4 hover:shadow-md transition-all cursor-pointer group`}
                                        >
                                            <div className="flex items-start gap-3">
                                                <div className={`w-8 h-8 bg-${alert.color}-500 rounded-lg flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform`}>
                                                    <alert.icon className="w-4 h-4 text-white" />
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <div className="flex items-start justify-between gap-2 mb-2">
                                                        <h4 className={`font-semibold text-${alert.color}-900 text-sm`}>
                                                            {alert.title}
                                                        </h4>
                                                        <span className={`px-2 py-0.5 bg-${alert.color}-200 text-${alert.color}-800 text-xs rounded-full font-medium`}>
                                                            {alert.severity}
                                                        </span>
                                                    </div>
                                                    <p className={`text-${alert.color}-700 text-xs mb-2 leading-relaxed`}>
                                                        {alert.message}
                                                    </p>
                                                    <div className="flex items-center justify-between">
                                                        <p className="text-xs text-gray-500">{alert.time}</p>
                                                        <button className={`text-xs font-semibold text-${alert.color}-600 hover:text-${alert.color}-700 flex items-center gap-1`}>
                                                            {alert.action}
                                                            <ExternalLink className="w-3 h-3" />
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </section>

                            {/* NEW: Upcoming Appointments */}
                            <section
                                className={`bg-gradient-to-br from-blue-50 to-cyan-50 rounded-2xl p-6 shadow-lg border border-blue-200 transform transition-all duration-700 delay-1000 ${
                                    isAnimating ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0"
                                }`}
                            >
                                <div className="flex items-center gap-3 mb-6">
                                    <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-cyan-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/30">
                                        <Calendar className="w-5 h-5 text-white" />
                                    </div>
                                    <div>
                                        <h3 className="text-lg font-bold text-gray-900">Upcoming</h3>
                                        <p className="text-xs text-gray-600">Your appointments</p>
                                    </div>
                                </div>

                                {upcomingAppointments.map((apt) => (
                                    <div key={apt.id} className="bg-white rounded-xl p-4 border border-blue-200 mb-4">
                                        <div className="flex items-start gap-3 mb-3">
                                            <div className="w-12 h-12 bg-gradient-to-br from-blue-100 to-cyan-100 rounded-lg flex items-center justify-center text-2xl">
                                                👨‍⚕️
                                            </div>
                                            <div className="flex-1">
                                                <h4 className="font-bold text-gray-900 text-sm">{apt.doctor}</h4>
                                                <p className="text-xs text-gray-600">{apt.specialization}</p>
                                                <p className="text-xs text-gray-500 mt-1">{apt.hospital}</p>
                                            </div>
                                        </div>
                                        <div className="bg-blue-50 rounded-lg p-3 mb-3">
                                            <div className="flex items-center justify-between mb-2">
                                                <span className="text-xs text-gray-600">Date & Time</span>
                                                <span className="text-xs font-semibold text-gray-900">{apt.date}</span>
                                            </div>
                                            <div className="flex items-center justify-between">
                                                <span className="text-xs text-gray-600">Time</span>
                                                <span className="text-xs font-semibold text-gray-900">{apt.time}</span>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <span className="px-2 py-1 bg-green-100 text-green-700 text-xs font-semibold rounded-full flex-1 text-center">
                                                ✓ {apt.status}
                                            </span>
                                            <button className="px-3 py-1 bg-blue-500 text-white text-xs font-medium rounded-lg hover:bg-blue-600 transition-all">
                                                View Details
                                            </button>
                                        </div>
                                    </div>
                                ))}

                                <button className="w-full py-2 bg-white text-blue-600 border border-blue-300 font-semibold rounded-xl hover:bg-blue-50 transition-all text-sm">
                                    Schedule New Appointment
                                </button>
                            </section>

                            {/* Consent Control Section - SAME AS BEFORE */}
                            <section
                                className={`bg-gradient-to-br from-emerald-50 to-teal-50 rounded-2xl p-6 shadow-lg border border-emerald-200 transform transition-all duration-700 delay-1100 ${
                                    isAnimating ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0"
                                }`}
                            >
                                <div className="flex items-center gap-3 mb-6">
                                    <div className="w-10 h-10 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-xl flex items-center justify-center shadow-lg shadow-emerald-500/30">
                                        <Shield className="w-5 h-5 text-white" />
                                    </div>
                                    <div>
                                        <h3 className="text-lg font-bold text-gray-900">Data Consent</h3>
                                        <p className="text-xs text-gray-600">You control your data</p>
                                    </div>
                                </div>

                                <div className="space-y-4">
                                    <div className="bg-white rounded-xl p-4 border border-emerald-200">
                                        <div className="flex items-center justify-between mb-2">
                                            <div className="flex items-center gap-2">
                                                <Stethoscope className="w-5 h-5 text-emerald-600" />
                                                <span className="font-semibold text-gray-900 text-sm">Healthcare Providers</span>
                                            </div>
                                            <button
                                                onClick={() => toggleConsent("healthcareProviders")}
                                                className={`relative w-12 h-6 rounded-full transition-all duration-300 ${
                                                    consent.healthcareProviders ? "bg-emerald-500" : "bg-gray-300"
                                                }`}
                                            >
                                                <div
                                                    className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow-md transition-transform duration-300 ${
                                                        consent.healthcareProviders ? "translate-x-6" : "translate-x-0"
                                                    }`}
                                                />
                                            </button>
                                        </div>
                                        <p className="text-xs text-gray-600">
                                            {consent.healthcareProviders ? "Doctors can access your records" : "Access denied to doctors"}
                                        </p>
                                    </div>

                                    <div className="bg-white rounded-xl p-4 border border-emerald-200">
                                        <div className="flex items-center justify-between mb-2">
                                            <div className="flex items-center gap-2">
                                                <Shield className="w-5 h-5 text-emerald-600" />
                                                <span className="font-semibold text-gray-900 text-sm">Public Health Authority</span>
                                            </div>
                                            <button
                                                onClick={() => toggleConsent("publicHealthAuthority")}
                                                className={`relative w-12 h-6 rounded-full transition-all duration-300 ${
                                                    consent.publicHealthAuthority ? "bg-emerald-500" : "bg-gray-300"
                                                }`}
                                            >
                                                <div
                                                    className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow-md transition-transform duration-300 ${
                                                        consent.publicHealthAuthority ? "translate-x-6" : "translate-x-0"
                                                    }`}
                                                />
                                            </button>
                                        </div>
                                        <p className="text-xs text-gray-600">
                                            {consent.publicHealthAuthority ? "Anonymized data for surveillance" : "No data sharing"}
                                        </p>
                                    </div>
                                </div>

                                <button
                                    onClick={() => setShowConsentModal(true)}
                                    className="w-full mt-4 px-4 py-2 bg-white text-emerald-600 border border-emerald-300 font-semibold rounded-xl hover:bg-emerald-50 transition-all"
                                >
                                    Advanced Settings
                                </button>
                            </section>

                            {/* NEW: Quick Actions */}
                            <section
                                className={`bg-white rounded-2xl p-6 shadow-lg border border-gray-100 transform transition-all duration-700 delay-1200 ${
                                    isAnimating ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0"
                                }`}
                            >
                                <h3 className="text-lg font-bold text-gray-900 mb-4">Quick Actions</h3>
                                <div className="grid grid-cols-2 gap-3">
                                    {[
                                        { icon: Download, label: "Download Records", color: "blue" },
                                        { icon: Share2, label: "Share Data", color: "emerald" },
                                        { icon: Video, label: "Telemedicine", color: "purple" },
                                        { icon: Phone, label: "Emergency", color: "red" }
                                    ].map((action, idx) => (
                                        <button
                                            key={idx}
                                            className={`flex flex-col items-center gap-2 p-4 bg-${action.color}-50 border border-${action.color}-200 rounded-xl hover:bg-${action.color}-100 transition-all hover:scale-105 active:scale-95`}
                                        >
                                            <action.icon className={`w-6 h-6 text-${action.color}-600`} />
                                            <span className="text-xs font-medium text-gray-700 text-center">{action.label}</span>
                                        </button>
                                    ))}
                                </div>
                            </section>
                        </div>
                    </div>

                    {/* NEW: Health Timeline Section */}
                    <section
                        className={`bg-white rounded-2xl p-6 shadow-lg border border-gray-100 mb-8 transform transition-all duration-700 delay-1300 ${
                            isAnimating ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0"
                        }`}
                    >
                        <div className="flex items-center justify-between mb-6">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-500/30">
                                    <Clock className="w-5 h-5 text-white" />
                                </div>
                                <div>
                                    <h3 className="text-xl font-bold text-gray-900">Health Timeline</h3>
                                    <p className="text-sm text-gray-500">Your health journey</p>
                                </div>
                            </div>
                        </div>

                        <div className="relative">
                            {/* Timeline Line */}
                            <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-gradient-to-b from-indigo-200 via-purple-200 to-pink-200" />

                            <div className="space-y-6">
                                {healthTimeline.map((event, idx) => (
                                    <div key={event.id} className="relative pl-16">
                                        {/* Timeline Dot */}
                                        <div className={`absolute left-3 w-6 h-6 bg-gradient-to-br from-${event.color}-500 to-${event.color}-600 rounded-full flex items-center justify-center shadow-lg border-4 border-white`}>
                                            <event.icon className="w-3 h-3 text-white" />
                                        </div>

                                        {/* Event Card */}
                                        <div className={`bg-gradient-to-br from-${event.color}-50 to-white rounded-xl p-4 border border-${event.color}-200 hover:shadow-md transition-all`}>
                                            <div className="flex items-start justify-between mb-2">
                                                <div>
                                                    <h4 className="font-bold text-gray-900 text-sm">{event.title}</h4>
                                                    <p className="text-xs text-gray-600">{event.description}</p>
                                                </div>
                                                <span className="text-xs text-gray-500 whitespace-nowrap">{event.date}</span>
                                            </div>
                                            {event.doctor && (
                                                <p className="text-xs text-gray-500 mt-2">👨‍⚕️ {event.doctor}</p>
                                            )}
                                            {event.hospital && (
                                                <p className="text-xs text-gray-500 mt-1">🏥 {event.hospital}</p>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </section>
                </main>
            </div>

            {/* Doctor Booking Modal - ENHANCED */}
            {showDoctorModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fadeIn">
                    <div className="bg-white rounded-3xl shadow-2xl max-w-md w-full p-8 transform animate-scaleIn max-h-[90vh] overflow-y-auto">
                        <button
                            onClick={() => setShowDoctorModal(null)}
                            className="absolute top-4 right-4 p-2 hover:bg-gray-100 rounded-xl transition-all"
                        >
                            <X className="w-6 h-6 text-gray-400" />
                        </button>

                        <div className="text-center mb-6">
                            <div className="w-24 h-24 bg-gradient-to-br from-blue-100 to-cyan-100 rounded-2xl flex items-center justify-center text-6xl mx-auto mb-4 shadow-lg">
                                {showDoctorModal.image}
                            </div>
                            <h3 className="text-2xl font-bold text-gray-900 mb-1">{showDoctorModal.name}</h3>
                            <p className="text-gray-600">{showDoctorModal.specialization}</p>
                            <p className="text-sm text-gray-500">{showDoctorModal.hospital}</p>
                            <div className="flex items-center justify-center gap-2 mt-2">
                                <Star className="w-5 h-5 text-amber-500 fill-amber-500" />
                                <span className="font-semibold text-gray-900">{showDoctorModal.rating}</span>
                                <span className="text-gray-500 text-sm">({showDoctorModal.reviews} reviews)</span>
                            </div>
                        </div>

                        {/* Available Slots Section */}
                        <div className="space-y-4 mt-6">
                            <h4 className="font-semibold text-gray-900">Available Slots Today</h4>
                            <div className="grid grid-cols-3 gap-3">
                                {["09:00 AM", "11:30 AM", "01:00 PM", "03:30 PM", "05:00 PM"].map((time, i) => (
                                    <button 
                                        key={i} 
                                        className="py-2 px-3 border border-blue-200 rounded-xl text-sm font-medium text-blue-700 hover:bg-blue-50 hover:border-blue-400 transition-all focus:ring-2 focus:ring-blue-500 focus:bg-blue-50"
                                    >
                                        {time}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="mt-8 pt-6 border-t border-gray-100 flex gap-3">
                            <button
                                onClick={() => setShowDoctorModal(null)}
                                className="flex-1 py-3 px-4 bg-gray-50 text-gray-700 font-semibold rounded-xl hover:bg-gray-100 transition-all"
                            >
                                Cancel
                            </button>
                            <button
                                className="flex-1 py-3 px-4 bg-gradient-to-r from-blue-500 to-cyan-600 text-white font-semibold rounded-xl hover:shadow-lg hover:shadow-blue-500/30 transition-all active:scale-95"
                                onClick={() => {
                                    // Add your booking logic here
                                    alert(`Appointment booked with ${showDoctorModal.name}!`);
                                    setShowDoctorModal(null);
                                }}
                            >
                                Confirm Booking
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};
