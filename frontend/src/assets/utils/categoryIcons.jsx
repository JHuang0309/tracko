import { Utensils, Car, HeartPulse, BookOpen, Smile,  Dumbbell, ShoppingBag } from "lucide-react";

const categoryIcons = {
  "food & dining": {
    icon: Utensils,
    color: "text-[#f97315]",
    highlight: "bg-[#fff3c0]",
    darkColor: "text-[#fbbf24]",
    darkHighlight: "bg-[#92400e]",
    description: "Restuarants, groceries"
  },
  "transportation": {
    icon: Car,
    color: "text-[#3b82f6]",
    highlight: "bg-[#dbeafe]",
    darkColor: "text-[#60a5fa]",
    darkHighlight: "bg-[#1e3a8a]",
    description: "Fuel, public transit"
  },
  "leisure & exercise": {
    icon: Dumbbell,
    color: "text-[#ec4799]",
    highlight: "bg-[#fce7f4]",
    darkColor: "text-[#f87171]", // closest to pink in this palette
    darkHighlight: "bg-[#991b1b]",
    description: "Tennis, bookings"
  },
  "university (beem)": {
    icon: Smile,
    color: "text-[#9333ea]",
    highlight: "bg-[#ede9fe]",
    darkColor: "text-[#a855f7]",
    darkHighlight: "bg-[#581c87]",
    description: "Roadtrips, outings"
  },
  "personal health": {
    icon: HeartPulse,
    color: "text-[#10b981]",
    highlight: "bg-[#d1fae5]",
    darkColor: "text-[#34d399]",
    darkHighlight: "bg-[#064e3b]",
    description: "Medical, haircuts"
  },
  "miscellaneous": {
    icon: ShoppingBag,
    color: "text-gray-500",
    highlight: "bg-gray-100",
    darkColor: "text-gray-100",
    darkHighlight: "bg-[#1e3a8a]",
    description: "All other expenses"
  },
};

export { categoryIcons };