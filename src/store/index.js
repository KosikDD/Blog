import { configureStore } from '@reduxjs/toolkit';

import dataReduser from './dataSlice';
import userReduser from './userSlice';

export default configureStore({
  reducer: {
    data: dataReduser,
    user: userReduser,
  },
});
