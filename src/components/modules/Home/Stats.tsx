"use client";

import { AwardIcon, FilmIcon, GlobeIcon, UsersIcon } from "lucide-react";
import { motion } from "motion/react";

const stats = [
  { label: "Active Users", value: "2.5M+", icon: UsersIcon, color: "text-blue-400" },
  { label: "Media titles", value: "15K+", icon: FilmIcon, color: "text-primary" },
  { label: "Global Reach", value: "190+", icon: GlobeIcon, color: "text-emerald-400" },
  { label: "Awards Won", value: "850+", icon: AwardIcon, color: "text-yellow-400" },
];

const Stats = () => {
  return (
    <section className="w-full bg-slate-950 py-24 border-y border-white/5">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 md:gap-12">
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1, type: "spring", stiffness: 100 }}
                className="flex flex-col items-center text-center space-y-4 group"
              >
                <div className={`p-4 rounded-full bg-white/5 group-hover:bg-white/10 transition-colors duration-500`}>
                  <Icon className={`size-8 ${stat.color} transition-transform duration-500 group-hover:rotate-12`} />
                </div>
                <div className="space-y-1">
                  <h3 className="text-4xl font-black text-white font-outfit tracking-tighter">{stat.value}</h3>
                  <p className="text-sm font-bold uppercase tracking-[0.2em] text-slate-500">{stat.label}</p>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default Stats;
