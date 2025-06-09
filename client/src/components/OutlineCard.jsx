import React from 'react';

export default function OutlineCard({ children, className = '' }) {
  return (
    <div
      className={`border border-primary/80 bg-primary/5 rounded-lg shadow-md hover:shadow-[0_0_8px_theme(colors.primary.DEFAULT)/0.8] transition px-6 py-4 md:px-8 md:py-5 ${className}`}
    >
      {children}
    </div>
  );
}
