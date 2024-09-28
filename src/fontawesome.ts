import { config, library } from '@fortawesome/fontawesome-svg-core';
import { faDiscord, faGithub, faOsi } from '@fortawesome/free-brands-svg-icons';
import { faCalendar as farCalendar } from '@fortawesome/free-regular-svg-icons';
import {
  faBan,
  faCalendar as fasCalendar,
  faCaretDown,
  faCaretUp,
  faChevronLeft,
  faChevronRight,
  faClipboard,
  faClock,
  faClockRotateLeft,
  faCode,
  faCog,
  faExclamationTriangle,
  faEye,
  faGlobe,
  faInfo,
  faLanguage,
  faLifeRing,
  faLock,
  faTimes,
  faToggleOff,
  faToggleOn,
  faUnlock,
  faUser,
  faUserClock,
} from '@fortawesome/free-solid-svg-icons';

// Tell Font Awesome to skip adding the CSS automatically since it's being imported
config.autoAddCss = false;

const brandIcons = [faGithub, faDiscord];

// List of used icons - amend if new icons are needed
library.add(
  ...brandIcons,
  faClipboard,
  faClock,
  faClockRotateLeft,
  faCode,
  faEye,
  faGlobe,
  faLifeRing,
  faLock,
  faTimes,
  faToggleOff,
  faToggleOn,
  faUnlock,
  faUserClock,
  farCalendar,
  fasCalendar,
  faCaretDown,
  faCaretUp,
  faInfo,
  faExclamationTriangle,
  faCog,
  faBan,
  faChevronLeft,
  faChevronRight,
  faUser,
  faOsi,
  faLanguage,
);
