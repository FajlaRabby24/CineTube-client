"use client";

import {
  getUserDashboardStats,
  IUserDashboardStats,
} from "@/services/Dashboard/userDashboard.service";
import { useQuery } from "@tanstack/react-query";
import { motion } from "motion/react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  Cell,
} from "recharts";
import {
  Zap,
  Film,
  Bookmark,
  Calendar,
  History,
  TrendingUp,
  PieChart as PieChartIcon,
  ThumbsUp,
  MessageSquare,
  AlertCircle,
} from "lucide-react";

const GENRE_COLORS = [
  "#e50914",
  "#b20710",
  "#0070f3",
  "#a855f7",
  "#eab308",
];

const UserDashboardContent = () => {
  const { data: dashData, isLoading } = useQuery<IUserDashboardStats | null>({
    queryKey: ["user-dashboard-stats"],
    queryFn: getUserDashboardStats,
  });

  if (isLoading) {
    return (
      <div className="flex h-[600px] items-center justify-center">
        <div className="relative flex h-24 w-24 items-center justify-center rounded-full bg-red-600/10">
          <div className="absolute inset-0 animate-ping rounded-full bg-red-600/20" />
          <Film className="h-8 w-8 animate-pulse text-red-600" />
        </div>
      </div>
    );
  }

  if (!dashData) {
    return (
      <div className="flex h-[400px] items-center justify-center">
        <div className="text-center">
          <AlertCircle className="mx-auto mb-4 h-12 w-12 text-red-600" />
          <p className="text-lg font-bold text-white">Dashboard Offline</p>
          <p className="text-sm text-neutral-500">
            Could not load your dashboard data
          </p>
        </div>
      </div>
    );
  }

  const { stats, activityData, genreData, recentActivity } = dashData;

  const statCards = [
    {
      label: "Interactions",
      value: stats.totalInteractions.toString(),
      sub: "Reviews, votes & comments",
      icon: Zap,
      color: "from-blue-600 to-blue-900",
    },
    {
      label: "Reviewed Titles",
      value: stats.reviewedTitles.toString(),
      sub: "Unique media reviewed",
      icon: MessageSquare,
      color: "from-red-600 to-red-900",
    },
    {
      label: "Watchlist",
      value: stats.watchlistCount.toString(),
      sub: "Saved items",
      icon: Bookmark,
      color: "from-purple-600 to-purple-900",
    },
    {
      label: stats.planName === "FREE" ? "Free Plan" : "Premium",
      value:
        stats.planName === "FREE"
          ? "Free"
          : `${stats.premiumDaysLeft} Days`,
      sub:
        stats.planName === "FREE"
          ? "Upgrade for full access"
          : "Subscription remaining",
      icon: Calendar,
      color: "from-amber-600 to-amber-900",
    },
  ];

  const formatTimeAgo = (dateStr: string) => {
    const now = new Date();
    const date = new Date(dateStr);
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
  };

  const getActionColor = (action: string) => {
    switch (action) {
      case "Liked":
        return "text-green-500";
      case "Disliked":
        return "text-red-500";
      case "Reviewed":
        return "text-blue-500";
      case "Added to Watchlist":
        return "text-purple-500";
      default:
        return "text-neutral-400";
    }
  };

  const getActionIcon = (action: string) => {
    switch (action) {
      case "Liked":
      case "Disliked":
        return <ThumbsUp className="h-3.5 w-3.5" />;
      case "Reviewed":
        return <MessageSquare className="h-3.5 w-3.5" />;
      case "Added to Watchlist":
        return <Bookmark className="h-3.5 w-3.5" />;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen space-y-8 p-6 lg:p-10">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between"
      >
        <div>
          <h1 className="text-3xl font-black italic tracking-tighter text-white uppercase sm:text-4xl">
            Streamer Dashboard
          </h1>
          <p className="text-neutral-500">
            Welcome back! Ready for another cinematic journey?
          </p>
        </div>
        <div className="flex items-center gap-2 rounded-xl border border-white/5 bg-white/5 px-4 py-2 text-sm text-neutral-400">
          <Calendar className="h-4 w-4" />
          <span>
            {new Date().toLocaleDateString("en-US", {
              month: "long",
              day: "numeric",
              year: "numeric",
            })}
          </span>
        </div>
      </motion.div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {statCards.map((stat, idx) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.1 }}
            className="group relative overflow-hidden rounded-2xl border border-white/5 bg-black/40 p-6 backdrop-blur-xl transition-all hover:border-white/10"
          >
            <div
              className={`absolute -right-4 -top-4 -z-10 h-24 w-24 rounded-full bg-gradient-to-br ${stat.color} opacity-10 blur-2xl transition-all group-hover:opacity-20`}
            />
            <div className="flex items-start justify-between">
              <div>
                <p className="text-xs font-bold tracking-wider text-neutral-500 uppercase">
                  {stat.label}
                </p>
                <h3 className="mt-2 text-3xl font-black tracking-tighter text-white">
                  {stat.value}
                </h3>
                <p className="mt-1 text-xs text-neutral-600">{stat.sub}</p>
              </div>
              <div className="rounded-xl bg-white/5 p-3">
                <stat.icon className="h-6 w-6 text-white" />
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Activity Area Chart */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="rounded-3xl border border-white/5 bg-black/40 p-6 backdrop-blur-xl"
        >
          <div className="mb-8 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="rounded-lg bg-red-600/10 p-2">
                <TrendingUp className="h-5 w-5 text-red-600" />
              </div>
              <div>
                <h3 className="font-bold text-white">Engagement Pulse</h3>
                <p className="text-xs text-neutral-500">
                  Last 7 days activity
                </p>
              </div>
            </div>
          </div>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={activityData}>
                <defs>
                  <linearGradient id="colorCount" x1="0" y1="0" x2="0" y2="1">
                    <stop
                      offset="5%"
                      stopColor="#e50914"
                      stopOpacity={0.3}
                    />
                    <stop
                      offset="95%"
                      stopColor="#e50914"
                      stopOpacity={0}
                    />
                  </linearGradient>
                </defs>
                <XAxis
                  dataKey="day"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: "#666", fontSize: 12 }}
                />
                <YAxis hide />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#000",
                    border: "1px solid #333",
                    borderRadius: "12px",
                    color: "#fff",
                  }}
                  itemStyle={{ color: "#e50914" }}
                />
                <Area
                  type="monotone"
                  dataKey="count"
                  stroke="#e50914"
                  strokeWidth={3}
                  fillOpacity={1}
                  fill="url(#colorCount)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        {/* Genre Bar Chart */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="rounded-3xl border border-white/5 bg-black/40 p-6 backdrop-blur-xl"
        >
          <div className="mb-8 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="rounded-lg bg-blue-600/10 p-2">
                <PieChartIcon className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <h3 className="font-bold text-white">Genre Analysis</h3>
                <p className="text-xs text-neutral-500">
                  Based on your watchlist & reviews
                </p>
              </div>
            </div>
          </div>
          <div className="h-[300px] w-full">
            {genreData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={genreData}
                  layout="vertical"
                  margin={{ left: -20 }}
                >
                  <XAxis type="number" hide />
                  <YAxis
                    dataKey="genre"
                    type="category"
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: "#ccc", fontSize: 13 }}
                  />
                  <Tooltip
                    cursor={{ fill: "transparent" }}
                    contentStyle={{
                      backgroundColor: "#000",
                      border: "1px solid #333",
                      borderRadius: "12px",
                    }}
                  />
                  <Bar dataKey="count" radius={[0, 4, 4, 0]} barSize={20}>
                    {genreData.map((_entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={GENRE_COLORS[index % GENRE_COLORS.length]}
                      />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex h-full items-center justify-center">
                <p className="text-sm text-neutral-600">
                  Add media to your watchlist or write reviews to see genre
                  insights
                </p>
              </div>
            )}
          </div>
        </motion.div>
      </div>

      {/* Recent Activity Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="rounded-3xl border border-white/5 bg-black/40 p-6 backdrop-blur-xl"
      >
        <div className="mb-6 flex items-center gap-3">
          <div className="rounded-lg bg-white/5 p-2">
            <History className="h-5 w-5 text-white" />
          </div>
          <h3 className="font-bold text-white">Recent Activity</h3>
        </div>
        {recentActivity.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-white/5 text-xs font-bold tracking-widest text-neutral-500 uppercase">
                  <th className="pb-4 pl-2">Title</th>
                  <th className="pb-4">Type</th>
                  <th className="pb-4">When</th>
                  <th className="pb-4 pr-2 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {recentActivity.map((item, idx) => (
                  <tr
                    key={idx}
                    className="group transition-colors hover:bg-white/5"
                  >
                    <td className="py-4 pl-2">
                      <span className="font-bold text-white">
                        {item.title}
                      </span>
                    </td>
                    <td className="py-4">
                      <span className="rounded-full bg-white/5 px-3 py-1 text-xs text-neutral-400">
                        {item.type}
                      </span>
                    </td>
                    <td className="py-4">
                      <span className="text-sm text-neutral-500">
                        {formatTimeAgo(item.date)}
                      </span>
                    </td>
                    <td className="py-4 pr-2 text-right">
                      <span
                        className={`inline-flex items-center gap-1.5 text-xs font-bold ${getActionColor(item.action)}`}
                      >
                        {getActionIcon(item.action)}
                        {item.action}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="flex h-32 items-center justify-center">
            <p className="text-sm text-neutral-600">
              No recent activity yet. Start exploring media!
            </p>
          </div>
        )}
      </motion.div>
    </div>
  );
};

export default UserDashboardContent;
