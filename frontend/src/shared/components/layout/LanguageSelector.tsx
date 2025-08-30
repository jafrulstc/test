import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { IconButton, Menu, MenuItem, ListItemIcon, ListItemText } from '@mui/material';
import { Language } from '@mui/icons-material';
import { LANGUAGE_CONSTANTS } from '~/app/constants';

/**
 * Language selector component
 * Allows users to switch between supported languages
 */
export const LanguageSelector = () => {
  const { i18n } = useTranslation();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  /**
   * Open language selection menu
   */
  const handleClick = (event: React.MouseEvent<HTMLElement>): void => {
    setAnchorEl(event.currentTarget);
  };

  /**
   * Close language selection menu
   */
  const handleClose = (): void => {
    setAnchorEl(null);
  };

  /**
   * Change application language
   */
  const handleLanguageChange = (languageCode: string): void => {
    console.log("change language code : ", languageCode);
    i18n.changeLanguage(languageCode);
    localStorage.setItem(LANGUAGE_CONSTANTS.STORAGE_KEY, languageCode);
    handleClose();
  };

  return (
    <>
      <IconButton color="inherit" onClick={handleClick} aria-label="select language">
        <Language />
      </IconButton>
      
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleClose}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'right',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
      >
        {LANGUAGE_CONSTANTS.SUPPORTED_LANGUAGES.map((language) => (
          <MenuItem
            key={language.code}
            onClick={() => handleLanguageChange(language.code)}
            selected={i18n.language === language.code}
          >
            <ListItemIcon>
              <span style={{ fontSize: '1.2rem' }}>{language.flag}</span>
            </ListItemIcon>
            <ListItemText primary={language.name} />
          </MenuItem>
        ))}
      </Menu>
    </>
  );
};