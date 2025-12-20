// src/data/businessData.js
import React from 'react';
import { Building2, Briefcase, Monitor, Home, ShieldCheck, Wrench } from 'lucide-react';

export const businessUnits = [
  {
    id: "U-101",
    name: "Interior Design Unit",
    category: "Home Interiors",
    description: "Premium interior solutions for modern homes, luxury villas, and commercial office spaces in Dubai.",
    coverImage: "https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=1200&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1616489953149-864c29928a07?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1616137466211-f939a420be84?auto=format&fit=crop&w=800&q=80"
    ],
    products: ["Modular Kitchen", "Living Room Decor", "Office Fit-outs", "Lighting Design"],
    icon: <Building2 size={20} />,
    color: "text-blue-600",
    bg: "bg-blue-50",
    location: "Business Bay, Dubai",
    address: "Office 402, Business Bay Tower, Dubai, UAE",
    creditsPerDeal: 50,
    status: "Active",
    username: "interior_admin",
    managerName: "Sarah Ahmed",
    primaryPhone: "+971 50 123 4567",
    whatsappNumber: "+971 50 123 4567",
    website: "https://vynx-interiors.com",
    date: "2025-10-15"
  },
  {
    id: "U-102",
    name: "Manpower Solutions",
    category: "Industrial Staffing",
    description: "Reliable skilled labor supply for construction, industrial projects, and facility management.",
    coverImage: "https://images.unsplash.com/photo-1504307651254-35680f356dfd?auto=format&fit=crop&w=1200&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1541888946425-d81bb19480c5?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1581094794329-c8112a89af12?auto=format&fit=crop&w=800&q=80"
    ],
    products: ["Construction Labor", "Safety Officers", "Electricians", "Plumbers"],
    icon: <Briefcase size={20} />,
    color: "text-emerald-600",
    bg: "bg-emerald-50",
    location: "Al Quoz, Dubai",
    address: "Warehouse 12, Al Quoz Ind. 3, Dubai, UAE",
    creditsPerDeal: 35,
    status: "Active",
    username: "manpower_ops",
    managerName: "Ahmed Al-Sayed",
    primaryPhone: "+971 52 998 8776",
    whatsappNumber: "+971 52 998 8776",
    website: "https://vynx-manpower.com",
    date: "2025-11-01"
  },
  {
    id: "U-103",
    name: "IT Solutions",
    category: "Technology",
    description: "End-to-end digital transformation, web development, and cloud infrastructure services.",
    coverImage: "https://images.unsplash.com/photo-1519389950473-47ba0277781c?auto=format&fit=crop&w=1200&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&w=800&q=80"
    ],
    products: ["Web Development", "Mobile Apps", "Cloud Hosting", "Cybersecurity"],
    icon: <Monitor size={20} />,
    color: "text-indigo-600",
    bg: "bg-indigo-50",
    location: "Dubai Internet City",
    address: "Building 3, Office 201, DIC, Dubai",
    creditsPerDeal: 100,
    status: "Active",
    username: "tech_lead",
    managerName: "John Doe",
    primaryPhone: "+971 55 443 2211",
    whatsappNumber: "+971 55 443 2211",
    website: "https://vynx-tech.com",
    date: "2025-11-20"
  },
  {
    id: "U-104",
    name: "Real Estate",
    category: "Property Sales",
    description: "Luxury property buying, selling, and leasing services across prime locations in the UAE.",
    coverImage: "https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&w=1200&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1600596542815-60c37c6525fa?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=800&q=80"
    ],
    products: ["Villa Sales", "Apartment Leasing", "Commercial Space", "Property Management"],
    icon: <Home size={20} />,
    color: "text-amber-600",
    bg: "bg-amber-50",
    location: "Downtown Dubai",
    address: "Emaar Square, Building 4, Dubai",
    creditsPerDeal: 500,
    status: "Active",
    username: "estate_agent",
    managerName: "Fatima Khan",
    primaryPhone: "+971 50 888 7777",
    whatsappNumber: "+971 50 888 7777",
    website: "https://vynx-properties.com",
    date: "2025-12-05"
  },
  {
    id: "U-105",
    name: "Security Services",
    category: "Facility Management",
    description: "Professional security guard services and surveillance system installation.",
    coverImage: "https://images.unsplash.com/photo-1555431189-0fabf2667795?auto=format&fit=crop&w=1200&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1582139329536-e7284fece509?auto=format&fit=crop&w=800&q=80"
    ],
    products: ["Manned Guarding", "CCTV Installation", "Event Security"],
    icon: <ShieldCheck size={20} />,
    color: "text-slate-600",
    bg: "bg-slate-100",
    location: "Deira, Dubai",
    address: "Al Maktoum Road, Deira, Dubai",
    creditsPerDeal: 40,
    status: "Inactive",
    username: "secure_ops",
    managerName: "Khalid Omer",
    primaryPhone: "+971 56 112 2334",
    whatsappNumber: "+971 56 112 2334",
    website: "https://vynx-security.com",
    date: "2025-12-10"
  },
  {
    id: "U-106",
    name: "Maintenance Unit",
    category: "Home Services",
    description: "24/7 Home maintenance, AC repair, and plumbing services.",
    coverImage: "https://images.unsplash.com/photo-1581578731117-10d52143b0e8?auto=format&fit=crop&w=1200&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1621905251189-08b45d6a269e?auto=format&fit=crop&w=800&q=80"
    ],
    products: ["AC Repair", "Plumbing", "Electrical Works", "Painting"],
    icon: <Wrench size={20} />,
    color: "text-orange-600",
    bg: "bg-orange-50",
    location: "Sharjah Ind. Area",
    address: "Industrial Area 13, Sharjah",
    creditsPerDeal: 25,
    status: "Active",
    username: "maint_team",
    managerName: "Raju Pillai",
    primaryPhone: "+971 50 555 4444",
    whatsappNumber: "+971 50 555 4444",
    website: "https://vynx-fix.com",
    date: "2025-12-12"
  }
];