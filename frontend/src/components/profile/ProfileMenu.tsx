import React, { useState, useRef, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import './ProfileMenu.css';

interface ProfileMenuProps {
  onProfileClick: () => void;
}

/**
 * Profile Menu Component
 * 
 * Dropdown menu with:
 * - Profile
 * - Logout
 */
const ProfileMenu: React.FC<ProfileMenuProps> = ({ onProfileClick }) => {
  const { t } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    window.location.href = '/login';
  };

  return (
    <div className="profile-menu" ref={menuRef}>
      <button
        className="profile-menu-button"
        onClick={() => setIsOpen(!isOpen)}
        aria-label={t('header.profile.menu.label')}
        aria-expanded={isOpen}
        aria-haspopup="true"
        type="button"
      >
        <svg
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          aria-hidden="true"
        >
          <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
          <circle cx="12" cy="7" r="4" />
        </svg>
      </button>

      {isOpen && (
        <ul
          className="profile-menu-dropdown"
          role="menu"
          aria-label={t('header.profile.menu.label')}
        >
          <li role="menuitem">
            <button
              className="profile-menu-option"
              onClick={() => {
                onProfileClick();
                setIsOpen(false);
              }}
              type="button"
            >
              {t('header.profile.menu.profile')}
            </button>
          </li>
          <li role="menuitem">
            <button
              className="profile-menu-option profile-menu-option--logout"
              onClick={handleLogout}
              type="button"
            >
              {t('header.profile.menu.logout')}
            </button>
          </li>
        </ul>
      )}
    </div>
  );
};

export default ProfileMenu;
