import { configureStore } from '@reduxjs/toolkit';
import rootReducer from './reducers';
import { Provider } from 'react-redux';

const store = configureStore({
  reducer: rootReducer,
});

// ... rest of your code


// ... rest of your code

