// frontend/src/app/store/index.ts
import { configureStore } from '@reduxjs/toolkit';
import { persistStore, persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import { combineReducers } from '@reduxjs/toolkit';
import authReducer from '~/features/auth/store/authSlice';
import roomsReducer from '~/features/hostel/rooms/store/roomsSlice';
import studentsReducer from '~/features/hostel/students/store/studentsSlice';
import teacherReducer from '~/features/education/teachers/store/teacherSlice';
import staffReducer from '~/features/education/staff/store/staffSlice';
import geographyReducer from '~/features/core/store/geographySlice';
import generalReducer from '~/features/core/store/generalSlice';
import academicReducer from '~/features/core/store/academicSlice';
import studentReducer from '~/features/education/students/store/studentSlice';
import admissionReducer from '~/features/education/students/store/admissionSlice';
import boardingReducer from '~/features/boarding/store/boardingSlice';
import boardingAssignmentReducer from '~/features/boarding/store/boardingAssignmentSlice';
import masterBoardingReducer from '~/features/boarding/core/store/masterBoardingSlice'
import PersonReducer from '~/features/education/person/store/personSlice'


/**
 * Redux persist configuration
 * Only persists auth slice for session management
 */
const persistConfig = {
  key: 'root',
  storage,
  whitelist: ['auth'], // Only persist auth state
};

/**
 * Root reducer combining all feature reducers
 */
const rootReducer = combineReducers({
  auth: authReducer,
  rooms: roomsReducer,
  persons: PersonReducer,
  students: studentsReducer,
  teacher: teacherReducer,
  staff: staffReducer,
  geography: geographyReducer,
  general: generalReducer,
  academic: academicReducer,
  student: studentReducer,
  admission: admissionReducer,
  boarding: boardingReducer,
  boardingAssignment: boardingAssignmentReducer,
  masterBoarding: masterBoardingReducer,

});

const persistedReducer = persistReducer(persistConfig, rootReducer);

/**
 * Configure Redux store with middleware and dev tools
 */
export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['persist/PERSIST', 'persist/REHYDRATE'],
      },
    }),
  devTools: process.env.NODE_ENV !== 'production',
});

export const persistor = persistStore(store);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;