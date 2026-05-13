const typeIcons = {
  prediction: { color: 'text-blue-400', bg: 'bg-blue-500/20' },
  quiz: { color: 'text-purple-400', bg: 'bg-purple-500/20' },
  vote: { color: 'text-green-400', bg: 'bg-green-500/20' },
};

function timeAgo(date) {
  const seconds = Math.floor((Date.now() - new Date(date).getTime()) / 1000);
  if (seconds < 60) return 'just now';
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  return `${days}d ago`;
}

export default function ActivityFeed({ activities = [] }) {
  if (!activities.length) {
    return <p className="text-gray-500 text-sm text-center py-4">No recent activity</p>;
  }

  return (
    <div className="space-y-2">
      {activities.map((item, i) => {
        const style = typeIcons[item.type] || typeIcons.prediction;
        return (
          <div key={i} className="flex items-start gap-3 p-2 rounded-lg hover:bg-white/5 transition-colors">
            <div className={`w-8 h-8 rounded-full ${style.bg} flex items-center justify-center shrink-0 mt-0.5`}>
              <span className={`text-xs font-bold ${style.color}`}>
                {item.type[0].toUpperCase()}
              </span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm text-gray-200 leading-snug">{item.message}</p>
              <p className="text-xs text-gray-500 mt-0.5">{timeAgo(item.timestamp)}</p>
            </div>
          </div>
        );
      })}
    </div>
  );
}
