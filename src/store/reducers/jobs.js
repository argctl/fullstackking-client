

export function jobReducer(state=null, action){
    switch(action.type){
        case "GET_JOBS":
        console.log("action::", action.jobs);
            return {...state, jobs: action.jobs};
        case "GET_SINGLE_JOB":
            let {jobInfo} = action;

            if(jobInfo === null){
                return {...state, jobInfo: null};
            }

            const selectJob = state && typeof action.jobInfo.user !== "object" ? {...jobInfo, user: {...state.selectJob.user}} : jobInfo;
            return {...state, selectJob};
        case "ADD_JOB":

            return {...state, jobs:[...state.jobs, action.job]};
        case "JOB_PAYMENT":
            const {job, amount} = action;
            return{...state, payment: {job, amount}};
        case 'ADD_BID':
            let addBidJob = state.selectJob;
            addBidJob.bids.push(action.bid);

            return {...state, selectJob: addBidJob};
        case 'DELETE_BID':
            const {bid_id} = action;

            let removeBidJob = state.selectJob.bids.slice();
            const index = removeBidJob.indexOf(bid_id);
            removeBidJob.splice(index, 1);

            return {...state, selectJob:{...state.selectJob, bids: removeBidJob}};
        case 'REMOVE_JOB':

            const jobs = state.jobs ? state.jobs.slice() : [];

            const jobList = jobs.filter((job)=>{
                return job._id+"" !== action.message+""
            });


            return {...state, jobs: jobList};
        case 'JOB_ERROR':
            return {...state, error: action.error};
        case 'CONFIRMATION_JOB':
            return{...state, confirm: true};
        case 'CONFIRMATION_JOB_FAILURE':
            return{...state, confirm: false};
        case 'USER_VIEW':
            const {active_bids, bids, user_jobs} = action;
            return{...state, active_bids, bids, user_jobs};
        default:
            return state;
    }
}
