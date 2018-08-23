import React, {Component} from "react";
import {Switch, Route, withRouter} from "react-router-dom";
import {connect} from "react-redux";

import MessageView from "../components/MessageView";
import MessageForm from "../components/MessageForm";
import MessageSession from "../components/MessageSession";
import Form from "../components/Form";
import JobFeed from "../components/JobFeed";
import JobProfile from "../components/JobProfile";
import JobForm from "../components/JobForm";
import JobPayments from "../components/JobPayments";
import UserProfile from "../components/UserProfile";

import {getProfile, updateUserProfile, updateUserProfileData,
        changeHiddenItems, searchJobs, userContextJobs} from "../store/actions/data";

import {jobPayment, jobPage, getJobList, getSingleJobInfo, postBid, postJob,
        postJobUpdate, deactivateJob, acceptBid, deleteBid, completeJob} from "../store/actions/jobs";
import {changePass, resendVerification} from "../store/actions/user";

import Confirmation from "../components/Confirmation";
import PaymentStatus from "../components/PaymentStatus";
import PayForm from "../components/PayForm";
import Support from "../components/Support";
import ChangePass from "../components/ChangePass";

class UserView extends Component {
    constructor(props){
        super(props);
        this.state = {
            emailSent: false,
            emailFail: false
        }
    }
    componentDidMount(){
        if(!localStorage.userTokenFSK){
            this.props.history.push("/onboarding");
        }

    }
    render(){
        const {getJobs, selectJob, searchJobs, userContextJobs,
               jobViewInfo, user, users, jobPayment, data, changeHiddenItems,
                messages, jobPage, updateProfile, getProfile, addBid, updateJob,
                completeJob, createJob, updateUserProfileData, deactivateJob} = this.props;

        return(
            <Switch>
            <Route exact path="/account" render={()=>(
                    <JobFeed jobs={jobViewInfo} user={user} data={data}
                             getJobs={getJobs} selectJob={selectJob} searchJobs={searchJobs}
                             userContextJobs={userContextJobs}/>
                )}/>
            <Route exact path="/account/job/*" render={()=>(

                        <JobProfile jobPayment={jobPayment} user={user} jobInfo = {jobViewInfo}
                                    getJob={selectJob} addBid={addBid} updateJob={updateJob}
                                    acceptBid={acceptBid} deleteBid={deleteBid} deactivateJob={deactivateJob}/>

                    )}/>
                <Route exact path="/account/confirmation/job/*" render={()=>(
                        <Confirmation jobInfo = {jobViewInfo} getJob={selectJob} completeJob={completeJob} />
                    )} />
                <Route exact path="/account/payment/status/*" render={()=>(
                    <PaymentStatus jobInfo = {jobViewInfo} getJob={selectJob} />
                )} />
                <Route exact path="/account/payments/job/*" render={()=>{
                            //should change getJob's selectJob to a more specific query.
                            //I originally wanted to return it from the job post too, but that may not be good to do.
                            return(<JobPayments jobViewInfo={jobViewInfo} getJob={selectJob}/>)

                       }} />
                <Route exact path="/account/payout" render={()=>{

                    return(<div><div style={{textAlign: "center", paddingTop: "30px"}}>Enter details for selected payment type</div><PayForm crypto_only={false} /></div>)
                }} />


                <Route exact path="/account/add" render={()=>(
                        <JobForm err={this.props.err} jobs = {jobViewInfo} jobPayment={jobPayment}
                                 createJob={createJob}/>
                    )} />
            <Route exact path="/account/logout" render={
                    ()=>(
                        <Form logOut />
                    )
                } />
            <Route exact path="/account/profile/*" render={
                    ()=>(
                        <UserProfile changeHiddenItems={changeHiddenItems} jobPage={jobPage}
                            updateProfile={updateProfile} updateUserProfileData={updateUserProfileData}
                            getProfile={getProfile} data={data} />
                    )
                } />
            <Route exact path="/account/message" component={MessageView}/>
                <Route exact path="/account/message/new" render={()=>(
                        <MessageForm  username={user.username}/>
                                        )} />
            <Route exact path="/account/message/session/*"
                render={()=>(<MessageSession data={data} users={users} messages={messages}/>)} />
            <Route exact path="/account/support" render={()=>(
                    <Support logged={true} />
                )} />
            <Route exact path="/account/password" render={()=>(
                    <ChangePass changePass={this.props.changePass}/>
                )} />
            <Route exact path="/account/resend" render={()=>(
                    <div>
                        {(this.state.emailFail && !this.state.emailSent) && <div className="errorBox">Error, email wasn't sent.</div>}
                        {this.state.emailSent ?
                    <div>Check your email!</div>
                    :
                    <div>Do you want to resend verification email
                        <br />
                    <button onClick={()=>{
                            const a = this.props.resendVerification();
                            a.then((res)=>{
                                if(res.message !== "success"){
                                    this.setState({emailFail: true})
                                    return;
                                }
                                this.setState({emailSent: true, emailFail: false});
                                setTimeout(()=>{
                                    this.props.history.push("/account/profile/my");
                                }, 2000);
                            }).catch((err)=>{
                                this.setState({emailFail: true})
                            })
                        }}>resend</button>
                        </div>

                    }
                    </div>
                )} />

                </Switch>
        )
    }
}

const mapStateToProps = (state) =>{
    let messageUsers = state.messageReducer.users;

    let users = [];
    messageUsers && users.push(messageUsers);
    return{
        jobViewInfo: state.jobReducer,
        user: state.userReducer,
        users,
        messages: state.messageReducer.messages,
        err: state.errorReducer,
        data: state.dataReducer
    };
}
const mapDispatchToProps = (dispatch) => {
    return{
        getProfile: (id)=>dispatch(getProfile(id)),
        updateProfile: (items)=>dispatch(updateUserProfile(items)),
        jobPayment: (amount, job)=>dispatch(jobPayment(amount, job)),
        jobPage: (info)=>dispatch(jobPage(info)), //here solely to allow a reset of this info from the profile route.
        changeHiddenItems: (boolString)=>dispatch(changeHiddenItems(boolString)),
        getJobs: (d)=> dispatch(getJobList(d)),
        selectJob: (id)=> dispatch(getSingleJobInfo(id)),
        searchJobs: (search)=>dispatch(searchJobs(search)),
        userContextJobs: ()=>dispatch(userContextJobs()),
        addBid: (info)=>dispatch(postBid(info)),
        updateJob: (id, updates)=>dispatch(postJobUpdate(id, updates)),
        acceptBid: (_id)=>dispatch(acceptBid({_id})),
        deleteBid: (bid_id)=>dispatch(deleteBid(bid_id)),
        deactivateJob: (job_id)=>dispatch(deactivateJob(job_id)),
        completeJob: (info)=>dispatch(completeJob(info)),
        createJob: (info)=>dispatch(postJob(info)),
        updateUserProfileData: (photo)=>dispatch(updateUserProfileData({...photo})),
        changePass: (pass, np)=>dispatch(changePass(pass, np)),
        resendVerification: ()=>dispatch(resendVerification())

    }
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(UserView));
