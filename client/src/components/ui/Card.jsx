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
        bg-white/5 backdrop-blur-md rounded-xl
        ${bordered ? 'border border-white/10' : ''}
        ${paddingClasses[padding] || paddingClasses.md}
        ${hoverable ? 'hover:bg-white/10 hover:border-white/20 transition-all cursor-pointer' : ''}
        ${className}
      `.trim()}
      onClick={onClick}
      {...rest}
    >
      {children}
    </div>
  );
};

const Header = ({ children, className = '', ...rest }) => (
  <div
    className={`pb-3 border-b border-white/10 font-semibold text-lg text-gray-100 ${className}`.trim()}
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
    className={`pt-3 border-t border-white/10 ${className}`.trim()}
    {...rest}
  >
    {children}
  </div>
);

Card.Header = Header;
Card.Body = Body;
Card.Footer = Footer;

export default Card;
