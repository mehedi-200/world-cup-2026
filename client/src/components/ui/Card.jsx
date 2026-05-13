import React from 'react';

const paddingClasses = {
  sm: 'p-3',
  md: 'p-5',
  lg: 'p-7',
};

const Card = ({
  children,
  padding = 'md',
  hoverable = false,
  bordered = true,
  className = '',
  onClick,
  ...rest
}) => {
  return (
    <div
      className={`
        relative bg-white/5 backdrop-blur-md rounded-xl overflow-hidden
        ${bordered ? 'border border-white/10' : ''}
        ${paddingClasses[padding] || paddingClasses.md}
        ${
          hoverable
            ? 'cursor-pointer transition-all duration-300 hover:bg-white/[0.08] hover:border-white/20 hover:shadow-lg hover:shadow-primary-500/5 hover:-translate-y-0.5 group'
            : 'transition-colors duration-200'
        }
        ${className}
      `.trim()}
      onClick={onClick}
      {...rest}
    >
      {/* Gradient border glow on hover */}
      {hoverable && (
        <div className="absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none bg-gradient-to-r from-fifa-gold/10 via-transparent to-fifa-blue/10" />
      )}
      <div className="relative z-10">{children}</div>
    </div>
  );
};

const Header = ({ children, className = '', ...rest }) => (
  <div
    className={`pb-4 mb-1 border-b border-white/10 font-semibold text-lg text-gray-100 ${className}`.trim()}
    {...rest}
  >
    {children}
  </div>
);

const Body = ({ children, className = '', ...rest }) => (
  <div className={`py-3 ${className}`.trim()} {...rest}>
    {children}
  </div>
);

const Footer = ({ children, className = '', ...rest }) => (
  <div
    className={`pt-4 mt-1 border-t border-white/10 ${className}`.trim()}
    {...rest}
  >
    {children}
  </div>
);

Card.Header = Header;
Card.Body = Body;
Card.Footer = Footer;

export default Card;
