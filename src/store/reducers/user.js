export function userReducer(state={token: null, id:null, username: null}, action){
    switch(action.type){
        case "USER_LOGIN":
        const {token, id, username} = action;
        

            return {...state, token, id, username};
        case "USER_LOGOUT":
//may be causing issues.
            return null;
        default:
            return state;
    }
}
export function idConcat(state=null, action){
    switch(action.type){
        case "ID_SET":
            let id = action.id;
            return {...state, id};
        default:
            return state;
    }
}
export function errorReducer(state=null, action){
    switch(action.type){
        case "SET_ERR":

            let err = action.err;

            return {...state, err}
        default:
            return state;

    }
}
