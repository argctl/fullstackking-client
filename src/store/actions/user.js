import jwtDecode from "jwt-decode";

export function addUser(token,id,username){
    return{
        type: "USER_LOGIN",
        token,
        id,
        username
    }
}


export function setErr(err){

    return{
        type: "SET_ERR",
        err
    }
}

export function removeUser(){
    return{
        type: "USER_LOGOUT"
    }
}
//function to get active jobs related to user. needs update on backend method to get hosted jobs too with seperate arrays for hosted and accepted bid and bid but not accepted.
export function resendVerification(){

    return (dispatch)=>{

        return dispatch(postAuthInfo("/resend/verify", false, 'get'));

    }
}
export function postAuthInfo(url, info, method){
    let {id, token} = jwtHandler();
    return (dispatch)=>{
        dispatch(setErr(undefined));
    return fetch(`${process.env.REACT_APP_URL}/logged/${id}/${url}`,{
        method,
        headers: {
            'Accept' : 'application/json',
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
        body: info ? JSON.stringify(info) : null
        // mode: "cors"
    }).then((result)=>{

        if(!result.ok){
            //this may be a problem. I changed from == to ===
            if(result.status === "401"){
                dispatch(removeUser());
                localStorage.removeItem("userTokenFSK");
            }
            dispatch(setErr(Error(result.statusText)));
            return;
        }else{
            dispatch(setErr(null));
            return result.json();
        }
    }).then((item)=>{

        return item;
    }).catch((err)=>{
        // return err;
        return undefined;
    })
}
}
export function changePass(pass, np){
    return postAuthInfo("/update/pass", {pass, np}, "post");
}
export function jwtHandler(){
    try{
        let token = localStorage.userTokenFSK;
        let {id} = typeof localStorage.userTokenFSK === "string" && jwtDecode(token);
        return {id, token};
    }catch(err){

        return err;
    }
}

export function getUser(data, sign = "signin"){
    let body = JSON.stringify(data);
    return (dispatch)=>{
        fetch(`${process.env.REACT_APP_URL}/${sign}`,
        {
            method: "post",
            headers: {
                'Accept' : 'application/json',
                'Content-Type': 'application/json'
            },
            body
            // mode: "cors"
        })
        .then((result)=>{
            if(!result.ok){

                dispatch(setErr(Error(result.statusText)));
                return "error?";
            }else{
                dispatch(setErr(null));
                return result.json();
            }
        }).then((user)=>{
            if(user !== "error?"){
            localStorage.setItem('userTokenFSK', user.token);

            dispatch(addUser(user.token, user.id, user.username));
        }
        })
        .catch(err=>{


            dispatch(setErr(err));
        })
    }
}
export function setUserFromToken(){

    return (dispatch)=>{
        try{
        const decoded = typeof localStorage.userTokenFSK === "string" && jwtDecode(localStorage.userTokenFSK);

        const {id, username} = decoded;
        dispatch(addUser(localStorage.userTokenFSK, id, username));
    }catch(err){
        console.log(err);
    }
    }
}
