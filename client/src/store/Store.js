import { combineReducers } from "redux";
import AuthSlice from '../slice/AuthSlice'

const reducer = combineReducers({
  app: AuthSlice,
});

export default reducer;
