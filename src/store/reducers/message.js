export function messageReducer(state={sessions: null, users:null, recent:false}, action){

    switch(action.type){
        case 'ADD_MESSAGE':
            return {...state, messages: [...state.messages, action.message]};
        case "STORE_MESSAGES":
        //console.log([...state.sessions, action.session]);


            return {...state, sessions: action.sessions};
        case "MESSAGE_INFO":

            let users = state.users !== null
             ? [...state.users, ...action.messages.filteredUsers.filter((item)=>(
                 !state.users.find((unique)=>(unique._id === item._id && unique.session_id === item.session_id))
             ))]
            : action.messages.filteredUsers;
            let messages = action.messages.messages.reverse().concat(action.curr);

            return {...state, messages, users};
        case "SHOW_RECENT": //this should probably be moved to the data reducer. or even a new reducer added.
            const {show} = action;
            return {...state, recent: show};
        default:
            return state;
    }
}
