const CODESPACE = window.location.hostname.replace(/-\d+\.app\.github\.dev$/, '');
const IS_CODESPACE = window.location.hostname.includes('app.github.dev');

const CONFIG = IS_CODESPACE ? {
  API_USUARIOS:    `https://${CODESPACE}-3001.app.github.dev`,
  API_ESTUDIANTES: `https://${CODESPACE}-3002.app.github.dev`,
  API_ANALITICA:   `https://${CODESPACE}-3003.app.github.dev`
} : {
  API_USUARIOS:    'http://localhost:3001',
  API_ESTUDIANTES: 'http://localhost:3002',
  API_ANALITICA:   'http://localhost:3003'
};
