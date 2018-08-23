import {combineReducers} from "redux";
import {userReducer, idConcat, errorReducer} from "./user";
import {messageReducer} from "./message";
import {jobReducer} from "./jobs";
import {dataReducer} from "./data";

const rootReducer = combineReducers({
    userReducer, idConcat, errorReducer, messageReducer, jobReducer, dataReducer
});

export default rootReducer;
