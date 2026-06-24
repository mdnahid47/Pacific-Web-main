import React from 'react';
import { Provider } from 'react-redux';
import store from './Store'; // Import your Redux store
import App from './App'; // Your main app component
import CheckoutPage from './pages/CheckoutPage/CheckoutPage';

const Root = () => {
  return (
    <Provider store={store}>
     <App/>
    </Provider>
  );
};

export default Root;
