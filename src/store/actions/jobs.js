import {postAuthInfo} from "./user";
import {addOtherUser} from "./data";

export function jobList(jobs){
    return{
        type: "GET_JOBS",
        jobs
    }
}
export function jobPage(jobInfo){
    return{
        type: "GET_SINGLE_JOB",
        jobInfo
    };
};
export function jobPayment(amount, job){
    return{
        type: "JOB_PAYMENT",
        amount,
        job
    }
}
export function addBid(bid){
    return{
        type: "ADD_BID",
        bid
    }
}
export function removeBid(bid_id){
    return{
        type: "DELETE_BID",
        bid_id
    }
}
export function removeJob(message){
    return{
        type: "REMOVE_JOB",
        message
    }
}
export function jobError(error){
    return{
        type: "JOB_ERROR",
        error
    }
}
export function confirmationSuccess(){
    return{
        type: "CONFIRMATION_JOB"
    }
}
export function confirmationFailure(){
    return{
        type: "CONFIRMATION_JOB_FAILURE"
    }
}
export function completeJob(info){
    return (dispatch)=>{
        let result = dispatch(postAuthInfo("/confirm/complete/job", info, "post"));

        result.then((message)=>{
            if(!!message){

            if(message.message === "job completed"){
                dispatch(confirmationSuccess());
            }else{
                dispatch(confirmationFailure());
            }
            }else{
            dispatch(confirmationFailure());
            }
        })
    }
}
export function deactivateJob(job_id){

    return (dispatch)=>{
        let result = dispatch(postAuthInfo("/deactivate/job", {job_id}, "post"));
        result.then((message)=>{
            if(message.job_deactivated)
            dispatch(removeJob(message));
            if(message.job_active_bid_exists)
            dispatch(jobError("job_active"));
        }).catch((err)=>{
            dispatch(jobError("deactivate"));
        })
    }
}
export function deleteBid(bid_id){
    return (dispatch) =>{
        let result = dispatch(postAuthInfo("/delete/bid", {bid_id}, "delete"));

        result.then((item)=>{
            dispatch(removeBid(item.removed_bid));
        }).catch((err)=>{
            dispatch(jobError("delete"))
        })
    }
}

export function getJobList(last_item){
    return (dispatch)=>{


        let result = dispatch(postAuthInfo("/job", {before: last_item}, "post"));

        result.then((jobs)=>{

            dispatch(jobList(jobs));
        }).catch((err)=>{

            dispatch(jobError("joblist"));
        })
    }
}
export function getSingleJobInfo(id){
    return(dispatch)=>{
        let singleJob = dispatch(postAuthInfo(`/job/${id}`, false, "get"));

        singleJob.then((jobInfo)=>{

            let {user, _id} = jobInfo;
            const userObject = {...user, job_id: _id};
            dispatch(addOtherUser(userObject));

            dispatch(jobPage(jobInfo));
        }).catch(err=>{
        dispatch(jobError("singleJobInfo"))});
    }
}
export function postJobUpdate(job_id, updates){
    return (dispatch)=>{
        const jobUpdated = dispatch(postAuthInfo(`/job/update`, {job_id, ...updates}, "post"));


        jobUpdated.then((jobInfo)=>{

            dispatch(jobPage(jobInfo));
        }).catch(err=>{
        dispatch(jobError("update"))});
    }
}
export function postJob(info){
    return (dispatch)=>
    {

        return dispatch(postAuthInfo("add/job", info, "post"));



    }
}
export function postBid(info){
    return (dispatch) => {
    let answer = dispatch(postAuthInfo("add/bid", info, "post"));
    answer.then((bid)=>{
        dispatch(addBid(bid));
    }).catch(err=>{
        dispatch(jobError("bid"))});
    }
}
export function acceptBid(info){
    return (dispatch) => {
        return dispatch(postAuthInfo("accept/bid", info, "post"));
    }
}
