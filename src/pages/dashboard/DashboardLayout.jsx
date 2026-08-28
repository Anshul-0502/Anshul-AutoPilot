import React from 'react';

const DashboardLayout = ({ children }) => {
  return (
    <div style={{
      display: 'grid',
      gridTemplateColumns: 'repeat(12, 1fr)',
      gap: '20px',
      width: '100%',
      boxSizing: 'border-box'
    }}>
      {children}
      <style>{`
        /* Responsive Grid adjustments */
        @media (max-width: 1200px) {
          .col-span-desktop-4 { grid-column: span 6 !important; }
          .col-span-desktop-8 { grid-column: span 12 !important; }
        }
        @media (max-width: 768px) {
          .col-span-desktop-4, .col-span-desktop-8, .col-span-desktop-6 {
            grid-column: span 12 !important;
          }
        }
      `}</style>
    </div>
  );
};

export default DashboardLayout;
