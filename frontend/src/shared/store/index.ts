import { configureStore } from "@reduxjs/toolkit"
import { persistStore, persistReducer } from "redux-persist"
import storage from "redux-persist/lib/storage"
import { combineReducers } from "@reduxjs/toolkit"
import roomsReducer from "~/features/hostel/rooms/store/roomsSlice"
import studentsReducer from "~/features/hostel/students/store/studentsSlice"

const persistConfig = {
  key: "root",
  storage,
  whitelist: ["theme", "auth"], // Only persist theme and auth
}

const rootReducer = combineReducers({
  rooms: roomsReducer,
  students: studentsReducer,
  // Future slices will be added here
})

const persistedReducer = persistReducer(persistConfig, rootReducer)

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ["persist/PERSIST", "persist/REHYDRATE"],
      },
    }),
  devTools: process.env.NODE_ENV !== "production",
})

export const persistor = persistStore(store)

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
