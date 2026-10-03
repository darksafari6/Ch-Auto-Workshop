import React from 'react';
import {createRoot} from 'react-dom/client';
import {SiteRouter} from './site-pages.jsx';
import './styles.css';
import './experience.css';
import './visual-polish.css';
import './light-theme.css';

createRoot(document.getElementById('root')).render(<SiteRouter/>);
window.addEventListener('error',e=>console.warn('CH Auto client error:',e.error||e.message));
window.addEventListener('unhandledrejection',e=>console.warn('CH Auto async error:',e.reason));
