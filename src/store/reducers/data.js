// import jwtDecode from "jwt-decode";


export function dataReducer(state={user: [], userData: []}, action){
    switch (action.type) {
        case "STORE_PROFILE":

            return {...state, user: action.user};
        case "UPDATE_PROFILE":
            const {update} = action;
            const uu = state.user;
            const u = {...uu, ...update};
            return {...state, user: u};
        case "HIDE_CHANGE":
            const {hide} = action;
            const {user} = state;
            const newUser = {...user, ...hide};
            return {...state, user: newUser};
        case "ADD_OTHER_USERS":
            // const user_id = typeof localStorage.userTokenFSK === "string" && jwtDecode(localStorage.userTokenFSK)
            const unique = state.userData.find((item)=>{
                return action.userData.job_id && item.job_id ?
                 action.userData.job_id === item.job_id && action.userData._id === item._id :
                 action.userData.session_id === item.session_id && action.userData._id === item._id;
            });
            const userData = !unique ? [...state.userData, action.userData] : state.userData;
            // const userData = new Set([...state.userData, action.userData]);
            return {...state, userData};
        case "ADD_SEARCH_RESULTS":
            const {results} = action;
            return {...state, results};
        case "ADD_NOTIFS":
            const {notifs} = action;

            return {...state, notifs}
        default:
            return state;

    }
}
