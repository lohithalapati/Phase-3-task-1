import React from 'react';

interface AuthFooterProps {
  text: string;
  linkText: string;
  onLinkClick: () => void;
}

export const AuthFooter: React.FC<AuthFooterProps> = ({ text, linkText, onLinkClick }) => {
  return (
    <div className="mt-6 text-center text-xs text-slate-400">
      <span>{text} </span>
      <button
        onClick={onLinkClick}
        className="text-blue-400 hover:text-blue-300 font-semibold focus:outline-none focus:underline"
      >
        {linkText}
      </button>
    </div>
  );
};
