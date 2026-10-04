import React from 'react';

/** Pinterest brand mark (Simple Icons, CC0). */
export function BrandMark({ size = 24, color = '#E60023', ...rest }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill={color} aria-hidden="true" focusable="false" {...rest}>
      <path d="M12.017 0C5.396 0 .029 5.367.029 11.987c0 5.079 3.158 9.417 7.618 11.162-.105-.949-.199-2.403.041-3.439.219-.937 1.406-5.957 1.406-5.957s-.359-.72-.359-1.781c0-1.663.967-2.911 2.168-2.911 1.024 0 1.518.769 1.518 1.688 0 1.029-.653 2.567-.992 3.992-.285 1.193.6 2.165 1.775 2.165 2.128 0 3.768-2.245 3.768-5.487 0-2.861-2.063-4.869-5.008-4.869-3.41 0-5.409 2.562-5.409 5.199 0 1.033.394 2.143.889 2.741.099.12.112.225.085.345-.09.375-.293 1.199-.334 1.363-.053.225-.172.271-.401.165-1.495-.69-2.433-2.878-2.433-4.646 0-3.776 2.748-7.252 7.92-7.252 4.158 0 7.392 2.967 7.392 6.923 0 4.135-2.607 7.462-6.233 7.462-1.214 0-2.354-.629-2.758-1.379l-.749 2.848c-.269 1.045-1.004 2.352-1.498 3.146 1.123.345 2.306.535 3.55.535 6.607 0 11.985-5.365 11.985-11.987C23.97 5.39 18.592.026 11.985.026L12.017 0z" />
    </svg>
  );
}

/** Solid house, used for the selected Home state. */
export function HomeFilled({ size = 24, ...rest }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" focusable="false" {...rest}>
      <path d="M12 2.6a1.5 1.5 0 0 0-.96.35l-8.5 7.06A1.5 1.5 0 0 0 2 11.16V20.5A1.5 1.5 0 0 0 3.5 22H9.2v-6.3a.7.7 0 0 1 .7-.7h4.2a.7.7 0 0 1 .7.7V22h5.7a1.5 1.5 0 0 0 1.5-1.5v-9.34c0-.45-.2-.87-.54-1.15l-8.5-7.06A1.5 1.5 0 0 0 12 2.6Z" />
    </svg>
  );
}

export function AvatarSilhouette({ size = 30 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 30 30" aria-hidden="true" focusable="false">
      <rect width="30" height="30" fill="#E1E1DC" />
      <circle cx="15" cy="11.5" r="5" fill="#8E8E88" />
      <path d="M4.5 30c0-6 4.7-10 10.5-10s10.5 4 10.5 10Z" fill="#8E8E88" />
    </svg>
  );
}
