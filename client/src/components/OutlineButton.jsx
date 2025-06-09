import React from 'react';

export default function OutlineButton({ label, icon = null, onClick, disabled = false, className = '' }) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={`border border-primary text-primary hover:bg-primary hover:text-white disabled:opacity-50 disabled:cursor-not-allowed transition rounded-none px-6 py-2 flex items-center justify-center gap-2 ${className}`}
    >
      {icon}
      <span>{label}</span>
    </button>
  );
}
