// lib/i18nConfigure.js
import { I18n } from 'i18n';
import path from 'node:path';

import { __dirname } from './utils.js';

const i18n = new I18n({
  locales: ['en', 'es', 'pt'], 
  directory: path.join(__dirname, '..', 'locales'),
  defaultLocale: 'es', // Español predeterminado
  cookie: 'idealCars-lang', // Nombre de la cookie
  queryParameter: 'lang', // Permite cambio de idioma por URL
  autoReload: true,
  syncFiles: true,
  objectNotation: true 
});

export default i18n;
