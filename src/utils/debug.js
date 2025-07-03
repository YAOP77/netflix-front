console.log("DEBUG TEST");
// Script de debug pour vérifier les variables d'environnement du frontend
console.log('=== Debug Frontend Variables ===');
console.log('REACT_APP_API_URL:', process.env.REACT_APP_API_URL ? 'Définie' : 'Non définie');
console.log('NODE_ENV:', process.env.NODE_ENV);

if (process.env.REACT_APP_API_URL) {
  console.log('API URL:', process.env.REACT_APP_API_URL);
} else {
  console.log('⚠️  REACT_APP_API_URL n\'est pas définie, utilisation de l\'URL par défaut');
}

// Import et affichage de l'URL utilisée
import { API_BASE_URL } from './constants';
console.log('API_BASE_URL utilisée:', API_BASE_URL);
console.log('================================');