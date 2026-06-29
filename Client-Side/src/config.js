
export const getConfig = () => {
  // production and development environment check
  const isProduction = import.meta.env.MODE === 'production';
  const isDevelopment = import.meta.env.MODE === 'development';
  
  //env variable check
  const envUrl = import.meta.env.VITE_API_URL;
  
  // fallback url;
  let apiUrl;
  if (envUrl) {
    // if env variable is set, use it
    apiUrl = envUrl;
  } else if (isProduction) {
    // production railway url
    apiUrl = 'https://pacific-web-main-production.up.railway.app/api';
  } else {
    // development localhost URL
    apiUrl = 'http://localhost:5001/api';
  }
  
  console.log('🔧 Config loaded:', {
    mode: import.meta.env.MODE,
    envUrl: envUrl,
    finalApiUrl: apiUrl,
    isProduction,
    isDevelopment
  });

  return {
    API_URL: apiUrl,
    APP_NAME: import.meta.env.VITE_APP_NAME || 'My App',
    IS_DEV: isDevelopment,
    IS_PROD: isProduction,
    //debugging info
    ENV: import.meta.env.MODE,
    ENV_URL: envUrl
  };
};

const config = getConfig();
export default config;