import { GeneratedContentItem, Language } from '../types';
import { translations } from '../translations';
import { Sparkles, Bookmark, BarChart2, TrendingUp } from 'lucide-react';
import { motion } from 'motion/react';

interface StatsGridProps {
  items: GeneratedContentItem[];
  lang: Language;
}

export function StatsGrid({ items, lang }: StatsGridProps) {
  const t = translations[lang];

  const total = items.length;
  const favorites = items.filter(i => i.isFavorite).length;

  // Find most popular platform
  const platformCounts: Record<string, number> = {};
  items.forEach(item => {
    platformCounts[item.platform] = (platformCounts[item.platform] || 0) + 1;
  });

  let topPlatform = '-';
  let maxCount = 0;
  Object.entries(platformCounts).forEach(([plat, count]) => {
    if (count > maxCount) {
      maxCount = count;
      topPlatform = t.platforms[plat as keyof typeof t.platforms] || plat;
    }
  });

  const cards = [
    {
      id: 'stats-total',
      title: t.statsTotal,
      value: total,
      icon: Sparkles,
      color: "from-violet-500 to-fuchsia-500",
      bg: "bg-violet-500/10"
    },
    {
      id: 'stats-favorites',
      title: t.statsFavorites,
      value: favorites,
      icon: Bookmark,
      color: "from-rose-500 to-pink-500",
      bg: "bg-rose-500/10"
    },
    {
      id: 'stats-peak',
      title: t.statsPlatformPeak,
      value: topPlatform,
      sub: maxCount > 0 ? `${maxCount} posts` : '',
      icon: TrendingUp,
      color: "from-cyan-500 to-blue-500",
      bg: "bg-cyan-500/10"
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4" id="stats-dashboard-grid">
      {cards.map((card, i) => {
        const Icon = card.icon;
        return (
          <motion.div
            key={card.id}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1, duration: 0.4 }}
            className="relative overflow-hidden rounded-2xl border border-slate-800 bg-slate-900/40 p-5 backdrop-blur-md"
            id={`m-stat-card-${card.id}`}
          >
            {/* Ambient Background Glow */}
            <div className={`absolute -right-10 -top-10 h-32 w-32 rounded-full bg-gradient-to-br ${card.color} opacity-10 blur-xl`} />

            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-400">{card.title}</p>
                <h4 className="mt-2 text-2xl font-bold text-white tracking-tight">
                  {card.value}
                </h4>
                {'sub' in card && card.sub && (
                  <p className="mt-1 text-xs text-slate-400 font-mono">{card.sub}</p>
                )}
              </div>
              <div className={`rounded-xl p-3 ${card.bg}`}>
                <Icon className="h-6 w-6 text-white" />
              </div>
            </div>
          </motion.div>
        );
      })}
    </div>
  );
}
