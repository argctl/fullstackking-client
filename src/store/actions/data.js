import {postAuthInfo} from "./user";
import {jobList} from "./jobs";


export function storeUserProfileData(user){
    return{
        type: "STORE_PROFILE",
        user
    }
}
export function updateUserProfileData(update){
    return{
        type: "UPDATE_PROFILE",
        update
    }
}
export function addOtherUser(userData){
    //this is where user info for messages is dispatched.
    return{
        type: "ADD_OTHER_USERS",
        userData
    }
}

export function addSearchData(results){

    return{
        type: "ADD_SEARCH_RESULTS",
        results
    }
}
export function addNotifs(notifs){
    return{
        type: "ADD_NOTIFS",
        notifs
    };
}
export function userView(active_bids, bids, user_jobs){
    return{
        type: "USER_VIEW",
        active_bids,
        bids,
        user_jobs
    };
}
export function hideChange(hide){
    return{
        type: "HIDE_CHANGE",
        hide
    }
}
export function payoutBalance(type, account, routing){
    return (dispatch)=>{
        return dispatch(postAuthInfo("/payout", {type, account, routing}, "post"));

    }
}
export function clearNotifs(){
    return (dispatch)=>{
        const result = dispatch(postAuthInfo("/notifs/clear", false, "get"));
        result.then((message)=>{
            !!message && dispatch(addNotifs(null));
        }).catch(err=>err)
    }
}
export function getNotifs(){
    return (dispatch)=>{
        const result = dispatch(postAuthInfo("/notifs", false, "get"));
        result.then((notifs)=>{

            dispatch(addNotifs(notifs));
        })
    }
}
export function userJobs(){
    return (dispatch)=>{
        const result = dispatch(postAuthInfo("/user/jobs", false, "get"));
        result.then((jobs)=>{
            console.log(jobs);
            dispatch(jobList(jobs));
        })
    }
}
export function searchJobs(search){
    return (dispatch)=>{
    const result = dispatch(postAuthInfo("/search/jobs", {search}, "post"))
    result.then((jobs)=>{

        dispatch(jobList(jobs.searchResult));
    }).catch(err=>err);
}
}
export function userContextJobs(){
    return (dispatch)=>{
        console.log("here");
        const result = dispatch(postAuthInfo("/search/jobs/my", false, "get"));
        result.then((info)=>{
            console.log(info);//will store
            const {active_bids, bids, jobs} = info;
            dispatch(userView(active_bids, bids, jobs));
            }).catch(err=>{console.log(err)});
    }
}
export function generalSearch(partial){
    return (dispatch)=>{
        const answer = dispatch(postAuthInfo('/search/all', {partial}, "post"));

        answer.then((results)=>{
            const {searchResult} = results;

            dispatch(addSearchData(searchResult));
        }).catch(err=>err);
    }
}
export function flushResults(){
    return (dispatch)=>{
        dispatch(addSearchData({}))
    }
}


export function getProfile(id){
    return (dispatch)=>{

        let answer = id ? dispatch(postAuthInfo("/get/profile/data", id, "post")) : dispatch(postAuthInfo("/get/user", false, "get"));

        answer.then((userinfo)=>{

            dispatch(storeUserProfileData(userinfo));
        }).catch(err=>err);
    }


}

export function updateUserProfile(items){
    return (dispatch)=>{
        let answer = dispatch(postAuthInfo("/update/user", items, "post"));
        console.log(answer);
        answer.then((userinfo)=>{
            console.log(userinfo);
            dispatch(updateUserProfileData(userinfo));
            // !!userinfo.newStuff && dispatch(addNotifs(userinfo.newStuff));
        }).catch(err=>err);
    }
}
export function changeHiddenItems(boolString){
    return (dispatch)=>{
        const answer = dispatch(postAuthInfo("/change/permission", {boolString}, "post"));

        answer.then((result)=>{
            console.log("result", result);
            dispatch(hideChange(result));
        }).catch((err)=>{
            dispatch(hideChange(err));
        })
    }
}
