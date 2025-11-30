export const getConfig = () => {
 
  return {
    API_URL: import.meta.env.VITE_API_URL || 'http://localhost:5001',
    APP_NAME: import.meta.env.VITE_APP_NAME || 'My App',
    IS_DEV: import.meta.env.MODE === 'development',
    IS_PROD: import.meta.env.MODE === 'production'
  };
};


const config = getConfig();
export default config;