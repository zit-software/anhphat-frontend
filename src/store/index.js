import { configureStore } from '@reduxjs/toolkit';

import reducer from './reducer';

// ==============================|| REDUX - MAIN STORE ||============================== //

const store = configureStore({ reducer });
const persister = 'Free';

export { store, persister };
