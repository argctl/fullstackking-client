import {postAuthInfo} from "./user.js";
import {addOtherUser} from "./data";

export function messageSessions(sessions){
    return{
        type: "STORE_MESSAGES",
        sessions
    }
}

export function sessionInfo(messages, curr=[]){
    return{
        type: "MESSAGE_INFO",
        messages,
        curr
    }
}
export function addSingleMessage(message){
    return{
        type: "ADD_MESSAGE",
        message
    }
}
export function addMessages(messages){
    return{
        type: "ADD_MESSAGES",
        messages
    }
}
export function showingRecent(show){
    return{
        type: "SHOW_RECENT",
        show
    }
}
export function userExists(username){
    return (dispatch)=>{
        return dispatch(postAuthInfo(`/user/exists/${username}`, false, "get"));
    }
}
export function fixMessage(uid){
    return (dispatch) =>{
        return dispatch(postAuthInfo("/fix/user", {uid}, "post"))
    }
}
export function deactivateMessageSess(session){
    return (dispatch)=>{
        return dispatch(postAuthInfo("/deactivate/message/session", {session}, "post"));
    }
}
export function addUserToSession(user, session){
    return (dispatch)=>{
        return dispatch(postAuthInfo("/add/message/user", {user, session}, "post"));

        // result.then((info)=>{
        //     console.log(info);//should make this direct instead of making another api call.
        //     dispatch(getMessagesBySession(session));
        // })
    }
}
export function getRecentMessages(){
    return (dispatch)=>{
        let result = dispatch(postAuthInfo("/get/message/sessions/recent", false, "get"));
        result.then((sessions)=>{
            dispatch(messageSessions(sessions))
        }).catch(err=>err);
    }
}

export function getMessageSessions(){

    return (dispatch)=>{
        let test =  dispatch(postAuthInfo("/get/message/sessions", false, "get"));

        test.then((sessions)=>{
            dispatch(messageSessions(sessions));
            dispatch(showingRecent(false));
        }).catch(err=>err);
    }
}

export function getMessagesBySession(session_id, load_date, add=false, curr=[]){
    return (dispatch)=>{
        let session = dispatch(postAuthInfo(`/get/message/session`, {session_id, load_date}, "post"));

        session.then((messages)=>{
            //this is what I need to replicate.

            messages.filteredUsers.forEach((user)=>{
                dispatch(addOtherUser(user));
            })

            console.log(messages);
            add ? dispatch(sessionInfo(messages, curr)) : dispatch(sessionInfo(messages));
        }).catch(err=>err);
    }
}

export function postNewMessageSession(users, initMessage){
    return (dispatch)=>{
        let messageResponse = dispatch(postAuthInfo("/add/message/new",{users, initMessage}, "post"));

            return messageResponse

    }
}
export function sendMessage(text, session){
    return (dispatch)=>{
        let response = dispatch(postAuthInfo("/send/message", {text, session}, "post"));
        return response;
    }
}
