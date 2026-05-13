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
          background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #1a1a2e 100%)',
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
            background: 'linear-gradient(90deg, #D4AF37, #FFD700, #D4AF37)',
          }}
        />

        {/* Branding */}
        <p
          style={{
            color: '#D4AF37',
            fontSize: 16,
            fontWeight: 700,
            letterSpacing: 3,
            textTransform: 'uppercase',
            marginBottom: 8,
          }}
        >
          Human Calculatore
        </p>

        {/* User name */}
        <p style={{ color: '#aaa', fontSize: 14, marginBottom: 24 }}>
          {result.userName}
        </p>

        {/* Large emoji / title */}
        <p style={{ fontSize: 64, marginBottom: 16, lineHeight: 1 }}>
          {result.title.split(' ')[0]}
        </p>

        {/* Title */}
        <h2
          style={{
            color: '#fff',
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

        {/* Badge */}
        {result.achievement && (
          <div
            style={{
              background: 'rgba(212,175,55,0.15)',
              border: '1px solid rgba(212,175,55,0.3)',
              borderRadius: 20,
              padding: '6px 16px',
              color: '#D4AF37',
              fontSize: 14,
              fontWeight: 600,
              marginBottom: 20,
            }}
          >
            {result.achievement.badge} {result.achievement.label}
          </div>
        )}

        {/* Funny line */}
        <p
          style={{
            color: '#888',
            fontSize: 12,
            fontStyle: 'italic',
            textAlign: 'center',
            maxWidth: 400,
          }}
        >
          {result.funnyLine}
        </p>

        {/* Bottom decoration */}
        <div
          style={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            right: 0,
            height: 4,
            background: 'linear-gradient(90deg, #D4AF37, #FFD700, #D4AF37)',
          }}
        />
      </div>
    </div>
  );
}
