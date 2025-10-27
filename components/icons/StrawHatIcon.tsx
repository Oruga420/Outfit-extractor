
import React from 'react';

export const StrawHatIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="currentColor"
    {...props}
  >
    <path
      d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z"
      fillOpacity="0"
    />
    <path
      d="M12 4c-4.41 0-8 1.79-8 4s3.59 4 8 4 8-1.79 8-4-3.59-4-8-4zm0 6c-3.31 0-6-1.34-6-3s2.69-3 6-3 6 1.34 6 3-2.69 3-6 3z"
      fill="#fde047"
    />
    <path d="M4 8h16v2H4z" fill="#ef4444" />
    <path
      d="M12 12c-4.97 0-9 1.57-9 3.5V17h18v-1.5c0-1.93-4.03-3.5-9-3.5zm0 3c-3.31 0-6-1.34-6-3h12c0 1.66-2.69 3-6 3z"
      fill="#fde047"
    />
  </svg>
);
