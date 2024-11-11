import { configureStore } from "@reduxjs/toolkit";
import userReducer from "./slices/userSlice";

const reducer = {
  clientInfo: userReducer,
};

export default configureStore({
  reducer,
});
