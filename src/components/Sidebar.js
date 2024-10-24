import { Link } from 'react-router-dom';
import React, { useState, useRef, useEffect } from 'react';
import '../styles/Sidebar.css';

const Sidebar = () => {
  const [isDropdownVisible, setDropdownVisible] = useState(false);
  const dropdownRef = useRef(null);

  const showDropdown = () => setDropdownVisible(true);
  const hideDropdown = () => setDropdownVisible(false);

  // Close dropdown if clicking outside the component
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        hideDropdown();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div 
      className="dropdown-container"
      onMouseEnter={showDropdown}
      onMouseLeave={hideDropdown}
      ref={dropdownRef}
    >
      <button className="dropdown-button">haX</button>
      {isDropdownVisible && (
        <div className="dropdown">
          <Link to="/">
            <img src="/icons/home.svg" alt="Home Icon" className="icon" />
          </Link>
          <Link to="/community">
            <img src="/icons/global.svg" alt="Community Icon" className="icon" />
          </Link>
          <Link to="/saved">
            <img src="/icons/save.svg" alt="Saved Icon" className="icon" />
          </Link>
          <Link to="/reward">
            <img src="/icons/coin.svg" alt="Reward Icon" className="icon" />
          </Link>

          {/* Profile Section */}
          {/* <div className="profile-section">
            <img src="/icons/ellipse.svg" alt="Profile Icon" />
            <div className="descriptions">
              <h3>William Pan</h3>
              <p>20 Days at Do.ai</p>
            </div>
          </div> */}
        </div>
      )}
    </div>
  );
};

export default Sidebar;
