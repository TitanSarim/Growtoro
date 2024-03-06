/* eslint-disable react/button-has-type */
import { Opacity } from '@mui/icons-material';
import CloseIcon from '@mui/icons-material/Close';
import SortIcon from '@mui/icons-material/Sort';
import { Button } from '@mui/material';
import { useState } from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';

export const StyleButton = styled(Button)`
  font-family: 'Inter';
  font-style: normal;
  font-weight: 700;
  font-size: 14px;
  line-height: 1.6875em;
  padding: '0px 0px !important';
  text-align: 'left';
  color: '#7c828d';
`;

const Header = () => {
  // const navigate = useNavigate();
  const [sideBar, setSideBar] = useState(false);

  return (
    <div className="nav-wrapper before w-nav">
      <div className="nav-container">
        <div className="flex-wrapper-copy">
          <Link to="/login" className="branding w-nav-brand">
            <img src="/assets/images/auth-logo.png" loading="lazy" alt="GrowToro" width="200px" />
          </Link>
          <nav role="navigation" className="nav-menu-3 w-nav-menu">
            <div className="menu-list">
              <div className="dropdown-2 w-dropdown">
                <div className="dropdown-toggle-2 w-dropdown-toggle">
                  <div className="dropdown-toggle-text">Product</div>
                  <img src="/assets/images/down-arrow.png" alt="down" loading="lazy" className="image" />
                </div>
              </div>
              <div className="dropdown-2 w-dropdown">
                <div className="dropdown-toggle-2 w-dropdown-toggle">
                  <div className="dropdown-toggle-text">Solutions</div>
                  <img src="/assets/images/down-arrow.png" alt="down" loading="lazy" className="image" />
                </div>
              </div>
              <div className="dropdown-2 w-dropdown">
                <div className="dropdown-toggle-2 w-dropdown-toggle">
                  <div className="dropdown-toggle-text">Resources</div>
                  <img src="/assets/images/down-arrow.png" alt="down" loading="lazy" className="image" />
                </div>
              </div>
              <Link to="#" className="link-nav w-nav-link" style={{ maxWidth: '1250px', fontSize: '13px' }}>
                Pricing
              </Link>
            </div>
            <div className="relative-block">
              <div className="cta-navbar before" style={{ willChange: Opacity, opacity: 1 }}>
                <Link to="#" className="nav-link-2 w-nav-link" style={{ color: 'rgb(255, 255, 255)' }}>
                  Contact Sales
                </Link>
                <Link
                  to="/login"
                  className="sign-up-cta _02 w-nav-link w--current"
                  style={{
                    color: 'rgb(255, 255, 255)',
                    willChange: 'background',
                    backgroundColor: 'rgb(177, 59, 237)',
                  }}
                >
                  Log In
                </Link>
              </div>
            </div>
          </nav>
          <div className="menu-button-2 w-nav-button">
            <div className="humberger">
              <button
                className="lottie-animation"
                id="click"
                onClick={() => setSideBar(!sideBar)}
                style={{ background: 'transparent', border: 'none' }}
              >
                {sideBar ? (
                  <CloseIcon
                    style={{
                      width: '100%',
                      height: '100%',
                      transform: 'translate3d(0px, 0px, 0px) scaleX(-1)',
                      background: 'transparent',
                    }}
                  />
                ) : (
                  <SortIcon
                    style={{
                      width: '100%',
                      height: '100%',
                      transform: 'translate3d(0px, 0px, 0px) scaleX(-1)',
                      background: 'transparent',
                    }}
                  />
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
      {sideBar ? (
        <div className="w-nav-overlay">
          <nav
            className="nav-menu-3 w-nav-menu"
            style={{
              transform: 'translateX(0px)',
              transition: 'transform 400ms ease 0s',
            }}
            data-nav-menu-open
          >
            <div className="mobile-logo">
              <Link to="/login" className="link-block-10 w-inline-block">
                <img src="/assets/images/auth-logo.png" loading="lazy" alt="GrowToro" width="200px" />
              </Link>
            </div>
            <div className="menu-list">
              <div className="dropdown-2 w-dropdown w--nav-dropdown-open">
                <div className="dropdown-toggle-2 w-dropdown-toggle w--nav-dropdown-toggle-open">
                  <div className="dropdown-toggle-text">Product</div>
                  <img src="/assets/images/down-arrow.png" alt="down" loading="lazy" className="image" />
                </div>
              </div>
              <div className="dropdown-2 w-dropdown w--nav-dropdown-open">
                <div className="dropdown-toggle-2 w-dropdown-toggle w--nav-dropdown-toggle-open">
                  <div className="dropdown-toggle-text">Solutions</div>
                  <img src="/assets/images/down-arrow.png" alt="down" loading="lazy" className="image" />
                </div>
              </div>
              <div className="dropdown-2 w-dropdown w--nav-dropdown-open">
                <div className="dropdown-toggle-2 w-dropdown-toggle w--nav-dropdown-toggle-open">
                  <div className="dropdown-toggle-text">Resources</div>
                  <img src="/assets/images/down-arrow.png" alt="down" loading="lazy" className="image" />
                </div>
              </div>
              <Link
                to="#"
                className="link-nav w-nav-link w--nav-link-open"
                style={{ maxWidth: '1250px', fontSize: '16px' }}
              >
                Pricing
              </Link>
            </div>
            <div className="relative-block">
              <div className="cta-navbar before" style={{ willChange: Opacity, opacity: 1 }}>
                <Link to="#" className="nav-link-2 w-nav-link" style={{ color: 'rgb(255, 255, 255)' }}>
                  Contact Sales
                </Link>
                <Link
                  to="/login"
                  className="sign-up-cta _02 w-nav-link w--current w--nav-link-open"
                  style={{
                    color: 'rgb(255, 255, 255)',
                    willChange: 'background',
                    backgroundColor: 'rgb(177, 59, 237)',
                  }}
                >
                  Log In
                </Link>
              </div>
            </div>
          </nav>
        </div>
      ) : (
        ''
      )}
    </div>
  );
};

export default Header;
