import { useEffect, useState } from 'react';
import { Badge, Box, List, Tooltip } from '@mui/material';
import { NavLink as RouterLink, useHref } from 'react-router-dom';

import { useUser } from 'context/UserContext';
import { StyledNavItem, StyledNavItemIcon } from './styles';

export default function NavSection({ data = [], ...other }) {
  const href = useHref();
  const [activeMenu, setActiveMenu] = useState(href);

  useEffect(() => {
    setActiveMenu(href);

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <Box {...other}>
      <List disablePadding sx={{ py: 1, pl: 1, pr: 1 }}>
        {data.map((item, index) => (
          <NavItem key={index} item={item} activeMenu={activeMenu} setActiveMenu={setActiveMenu} />
        ))}
      </List>
    </Box>
  );
}

function NavItem({ item, activeMenu, setActiveMenu }) {
  const { title, path, icon, subNav } = item;
  const { unread } = useUser();
  const [showSubMenu, setShowSubMenu] = useState(() => {
    let found = false;
    if (subNav) {
      subNav.forEach((nav) => {
        if (activeMenu.includes(nav.path)) {
          found = true;
        }
      });
    }
    if (activeMenu.includes(path)) {
      found = true;
    }
    return found;
  });

  return (
    <>
      <StyledNavItem
        sx={{
          fontSize: '16px',
          fontWeight: '400',
          fontFamily: 'Inter',
          color: activeMenu?.includes(path) ? '#7B68EE' : '#333333',
          bgcolor: activeMenu?.includes(path) && 'rgba(123, 104, 238, 0.1)',
        }}
        onClick={() => {
          setActiveMenu(path);
          setShowSubMenu((prev) => !prev);
        }}
        component={RouterLink}
        to={path}
        target={path?.includes('http') ? '_blank' : '_self'}
      >
        {title === 'Unibox' ? (
          <Tooltip title={title} arrow placement="right">
            <StyledNavItemIcon>
              {icon && icon}
              <Badge badgeContent={unread} color="primary" sx={{ right: '15px', top: '-10px' }}>
                {}
              </Badge>
            </StyledNavItemIcon>
          </Tooltip>
        ) : (
          <Tooltip title={title} arrow placement="right">
            <StyledNavItemIcon style={{ width: '10px' }}>{icon && icon}</StyledNavItemIcon>
          </Tooltip>
        )}
      </StyledNavItem>
      {subNav && showSubMenu && (
        <Box sx={{ pl: 2 }}>
          {subNav?.map((data, index) => (
            <StyledNavItem
              component={RouterLink}
              to={data.path}
              key={index}
              sx={{
                fontSize: '16px',
                fontWeight: '400',
                fontFamily: 'Inter',
                color: activeMenu?.includes(data.path) ? '#7B68EE' : '#333333',
                bgcolor: activeMenu?.includes(data.path) && 'rgba(123, 104, 238, 0.1)',
              }}
              onClick={() => setActiveMenu(data.path)}
            >
              {/* {shrinkDash ? ( */}
              <Tooltip title={data?.navTitle} arrow placement="right">
                <StyledNavItemIcon>{data?.navIcon && data.navIcon}</StyledNavItemIcon>
              </Tooltip>
            </StyledNavItem>
          ))}
        </Box>
      )}
    </>
  );
}
