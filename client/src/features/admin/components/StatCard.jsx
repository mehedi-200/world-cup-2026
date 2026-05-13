export default function StatCard({ label, value, icon, color = 'primary' }) {
  const colors = {
    primary: 'from-primary-600/20 to-primary-900/20 border-primary-500/30',
    green: 'from-green-600/20 to-green-900/20 border-green-500/30',
    purple: 'from-purple-600/20 to-purple-900/20 border-purple-500/30',
    red: 'from-red-600/20 to-red-900/20 border-red-500/30',
    gold: 'from-yellow-600/20 to-yellow-900/20 border-fifa-gold/30',
  };

  return (
    <div className={`bg-gradient-to-br ${colors[color] || colors.primary} border rounded-xl p-4 lg:p-5`}>
      <div className="flex items-center justify-between mb-2">
        <span className="text-xs text-gray-400 uppercase tracking-wide font-medium">{label}</span>
        {icon && (
          <svg className="w-5 h-5 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d={icon} />
          </svg>
        )}
      </div>
      <p className="text-2xl lg:text-3xl font-bold text-white">{value ?? '-'}</p>
    </div>
  );
}
