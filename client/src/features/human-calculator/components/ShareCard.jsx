export default function ShareCard({ result }) {
  return (
    <div
      id="share-card"
      className="absolute -left-[9999px]"
      style={{ width: 600, height: 600 }}
    >
      <div
        style={{
          width: 600,
          height: 600,
          background: result.isSpecial
            ? 'linear-gradient(135deg, #2d1010 0%, #1a1a2e 50%, #2d1010 100%)'
            : 'linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #1a1a2e 100%)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          padding: 40,
          fontFamily: 'sans-serif',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        {/* Top decoration */}
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            height: 4,
            background: result.isSpecial
              ? 'linear-gradient(90deg, #ef4444, #dc2626, #ef4444)'
              : 'linear-gradient(90deg, #D4AF37, #FFD700, #D4AF37)',
          }}
        />

        {/* Branding */}
        <p
          style={{
            color: result.isSpecial ? '#ef4444' : '#D4AF37',
            fontSize: 16,
            fontWeight: 700,
            letterSpacing: 3,
            textTransform: 'uppercase',
            marginBottom: 8,
          }}
        >
          Human Calculator AI
        </p>

        {/* User name */}
        <p style={{ color: '#aaa', fontSize: 14, marginBottom: 24 }}>
          {result.userName}
        </p>

        {/* Title */}
        <h2
          style={{
            color: result.isSpecial ? '#fca5a5' : '#fff',
            fontSize: 28,
            fontWeight: 900,
            textAlign: 'center',
            marginBottom: 12,
          }}
        >
          {result.title}
        </h2>

        {/* Subtitle */}
        <p
          style={{
            color: '#ccc',
            fontSize: 16,
            textAlign: 'center',
            marginBottom: 20,
            maxWidth: 460,
            lineHeight: 1.5,
          }}
        >
          {result.subtitle}
        </p>

        {/* Roast text */}
        <p
          style={{
            color: result.isSpecial ? '#fecaca' : '#e5e7eb',
            fontSize: 14,
            textAlign: 'center',
            maxWidth: 480,
            lineHeight: 1.6,
          }}
        >
          {result.voiceText}
        </p>

        {/* Bottom decoration */}
        <div
          style={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            right: 0,
            height: 4,
            background: result.isSpecial
              ? 'linear-gradient(90deg, #ef4444, #dc2626, #ef4444)'
              : 'linear-gradient(90deg, #D4AF37, #FFD700, #D4AF37)',
          }}
        />
      </div>
    </div>
  );
}
