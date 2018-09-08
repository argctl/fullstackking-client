import React, {Component} from "react";


import {withRouter} from "react-router-dom";
// import { Transition } from 'react-transition-group'
import { CSSTransition } from 'react-transition-group';
import jwtDecode from 'jwt-decode';



import "../styles/JobProfile.css";



const BidForm = ({change, title, description, check, clickM, messageR, submit, back, front, amount, err, toggleCheck}) => {

    return(
        (<form onSubmit={submit} className="overrideForm">
            {err && <div className="errorBox">Please fill out all fields and make sure the description is at least 50 characters!</div>}
            <button onClick={clickM}><div style={{textAlign: "right"}}>close X</div></button>
            <input autoFocus name="bidTitle" onChange={change} value={title}
                 placeholder="title" type="text"/>

                <label>
                    {messageR}

                    <input type="checkbox" onChange={toggleCheck}/>


                </label>

                <input name="bidFront" onChange={change} value={front}
                     placeholder="front end" type="text"/>
                <input name="bidBack" onChange={change} value={back}
                     placeholder="back end" type="text" />
                 <input name="bidAmount" type="number" step="100" placeholder="Bid amount.." onChange={change} value={amount} />
                    <textarea placeholder="description.."
                        name="bidDescription" onChange={change} value={description}/>
                    <button>submit bid</button>

                </form>)
    )
}


const Bids = ({bids, isOwner, selectBid, accepted_bid, user_id, deleteBid}) =>{
    const index = bids.findIndex((bid)=>{
        return bid._id === accepted_bid;
    });
    if(index !== -1){
    const bid = bids[index];
    bids.splice(index, 1);
    bids.splice(0, 0, bid);
    }
    //TODO - will need to check for "accepted_bid"'s exsistence to conditionally render bid button after testing of bid popup.

    return(
        <ul className="bidSection">
        {Array.isArray(bids) ? bids.map((bid)=>(
                <li className="uniqueBid" key={bid._id}>
                    {accepted_bid+"" === bid._id+"" && <div>ACCEPTED BID</div>}
                <div className="bidHeader">
                    <div>
                        {bid.user.username ? bid.user.username : "You, just now"}
                    </div>
                {(bid.user._id === user_id && accepted_bid+"" !== bid._id+"") && <button style={{cursor: "pointer", alignSelf: "center"}} onClick={()=>{
                    deleteBid(bid._id)
                }}>delete bid</button>}
                    <div>
                        front: {bid.front} <br/> back: {bid.back}
                    </div>
                    <div>
                        {bid.title}
                    </div>
                </div>
                    <div>
                        {bid.details}
                    </div>
                    <div className="bidAmount">
                        ${(parseFloat(bid.amount)).toFixed(2)}
                        {(isOwner && !accepted_bid) && <button onClick={(e)=>{
                        selectBid(bid._id);
                        }}>Accept Bid</button>}

                    </div>
                </li>
        )) : <li>no bids..</li>}
    </ul>
    )
}


class JobProfile extends Component{

    constructor(props){
        super(props);
        this.state={
            selectedJob: null,
            message: "loading...",
            reqCheck: false,
            requiredMessage: "Use the requested stack?",
            bidHit: false,
            bidTitle: "",
            bidDescription: "",
            bidFront: "",
            bidBack: "",
            bidAmount: "",
            user_id: null,
            edit: false,
            titleEdit: false,
            titleHolder: "",
            descriptionHolder: "",
            descriptionEdit: false,
            tableEdit: false,
            front_end: "",
            back_end: "",
            checked: false,
            title: "",
            description: "",
            amount: "",
            loaded: false,
            selectedBid: "",
            bidFormErr: false,
            job_not_settled: false,
            acceptAni: true

        }
        this.handleChange = this.handleChange.bind(this);
        this.toggleBidForm = this.toggleBidForm.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.selectedBid = this.selectedBid.bind(this);
        // this.deleteBid = this.deleteBid.bind(this);
    }
    componentDidMount(){


        setTimeout(()=>{
            this.setState({loaded: true});
        }, 500);
        const {id} = jwtDecode(localStorage.userTokenFSK);
        this.setState({user_id: id});
        this.props.getJob(this.props.location.pathname.split("/")[3]);

    }
    // deleteBid(_id){
    //     // this.setState({delete_bid: _id});
    //     this.props.deleteBid(_id);
    //
    // }
    selectedBid(_id){
            this.setState({selectedBid: _id});
            this.props.acceptBid(_id).then((session)=>{
            this.setState({acceptAni: false});
            setTimeout(()=>{
            this.props.history.push(`/account/message/session/${session.session}`); //this will change to the exact sent message.
            }, 1243)
            });
    }
    handleChange(e){
        this.setState({[e.target.name]:e.target.value});
    }
    toggleBidForm(e){
        e.preventDefault();
        this.setState({bidHit: !this.state.bidHit});
    }
    handleSubmit(e){
        e.preventDefault();
        const {bidTitle, bidFront, bidBack, bidDescription, bidAmount} = this.state;
        const job = this.props.location.pathname.split("/")[3];
        if(bidTitle.length > 0 && bidFront.length > 0 && bidBack.length > 0 && bidDescription.length > 49 && bidAmount > 25){
        this.props.addBid({title: bidTitle, front: bidFront, back: bidBack, details: bidDescription, amount: bidAmount, job});
        }else{
        this.setState({bidFormErr: true});
        return;
        }


        this.setState({
            selectedJob: null,
            message: "loading...",
            reqCheck: false,
            requiredMessage: "Use the requested stack?",
            bidHit: false,
            bidTitle: "",
            bidDescription: "",
            bidAmount: "",
            bidFormErr: false,
            bidFront: "",
            bidBack: ""
        });


    }
    editToggle(e, isOwner, itemName){


        if(isOwner){


            this.setState({[itemName + "Holder"]: e.target.innerHTML, [itemName + "Edit"]: true, edit: true})
        }
    }
    resetEdit(e){
        this.setState({
            titleEdit: false,
            edit: false,
            descriptionEdit: false,
            tableEdit: false,
            back_end: "",
            front_end: "",
            title: "",
            description: ""})
    }
    saveEdit(e){
            const {description, title, front_end, back_end} = this.state;
            let updater = {};
             updater = description.length > 0 ? {...updater, description} : updater;
             updater = title.length > 0 ? {...updater, title} : updater;
             updater = front_end.length > 0 ? {...updater, front_end} : updater;
             updater = back_end.length > 0 ? {...updater, back_end} : updater;




            const job_id = this.props.location.pathname.split("/")[3]
            this.props.updateJob(job_id, updater);
            this.resetEdit();
    }
    changeValue(e){

        this.setState({[e.target.name]:e.target.value});

    }
    removeJob(e){
        //probably should do some verification here.
        const jobId = this.props.location.pathname.split("/")[3];
        this.props.deactivateJob(jobId);
        setTimeout(()=>{
            if(!!this.props.jobInfo.error === false){
            this.props.history.push("/account");
            }else{
            if(jobId+"" === this.props.jobInfo.error.job_active_bid_exists+"")
            this.setState({job_not_settled: true});//still needs tested
            }
        },200)
    }
    closeJob(e, job){

        //needs to check if there was a payment already verified.
        //then, after showing loading and then getting an answer, either take the user to a confirmation page or to the charge page.

        if(job.verified){
            //send to confirmation page
            this.props.history.push("/account/confirmation/job/" + this.props.location.pathname.split("/")[3] );
        }else{
            //send to payment page with warning and explanation.
            this.props.jobPayment(job.amount, job._id);
            this.props.history.push("/account/payments/job/submit_attempt");
        }
    }
    fillStack(e){
        const {checked} = e.target; //will need to grey out boxes when checked (probably)
        const {front_end, back_end} = this.props.jobInfo.selectJob;
        checked ?  this.setState({bidFront: front_end, bidBack: back_end}) :
                  this.setState({bidFront: "", bidBack:""});
    }


    render(){
        //className={!this.state.bidHit ? "bidform hide" : "bidform show"}
        const l = "loading...";
        const {jobInfo} = !!this.props.jobInfo && !!this.props.jobInfo.selectJob ? //reformat this shit, but first figurout how. This is way too confusing in a way.
        this.props :{jobInfo:{selectJob: {user: {username: l, firstname: l}, completed: false, title: l, amount: 0, front_end: l, bids: [],
                                         back_end: l, configuration_required: false, description: l, accepted_bid: l, date: (new Date())}}};
        const {user, completed, title, amount, front_end, back_end, configuration_required, description, bids, accepted_bid, date} = jobInfo.selectJob;
        //there is still some refactoring that can be done starting with the last half of this render method.
        const {selectJob} = jobInfo !== null && jobInfo;
        const {_id} = user !== undefined && user;

        const isOwner = _id !== undefined && _id === this.state.user_id;




        const yes = "Yes";
        const no = "No";
        const profile =   <div  className={isOwner ? "JobProfile owner":"JobProfile"}>
            {isOwner && <div><div>click fields to edit</div>{!selectJob.verified
                && <button onClick={(e)=>{
                    //redux should have job info.
                    //change history.
                    this.props.jobPayment(selectJob.amount, selectJob._id);
                    this.props.history.push(`/account/payments/job/${this.props.location.pathname.split("/")[3]}`);
                }}>
                submit verification payment</button>}</div>}
            {
                this.state.job_not_settled && <div className="errorBox">You have previously accepted a bid or the job is not properly settled. Please contact support if you have any questions</div>
            }
            {this.state.edit ?

                 <div>
                     <button onClick={(e)=>{this.saveEdit(e)}}>save</button>
                     <button onClick={(e)=>{this.resetEdit(e)}}>discard</button>
                 </div> : <div></div>}



        { completed && <h2 className="errorBox">This job has been completed!</h2>}
             { !this.state.titleEdit ?
          <h2 className="jobTitle" onClick={isOwner ? (e)=>{this.editToggle(e, isOwner, "title")} : undefined}>
               {title}
           </h2> : <input type="text" name="title" onChange={(e)=>{this.changeValue(e)}} autoFocus placeholder={this.state.titleHolder}/>}
           <h3 style={{color: "green"}}>${amount}.00</h3>


             <p className="postedBy">Posted by: {user.username}</p>
             <p>When: {(new Date(date)).toLocaleString()}</p>

             <div className="jobDescription">
                 {!this.state.descriptionEdit ?
                     <p className="paraDesc" onClick={isOwner ? (e)=>{this.editToggle(e, isOwner, "description")} : undefined}>
                         {description}
                    </p>  : <textarea autoFocus  name="description" onChange={(e)=>{this.changeValue(e)}} className="textAreaPara" defaultValue={this.props.jobInfo.selectJob.description}/>}



             <table onClick={isOwner ? (e)=>{this.editToggle(e, isOwner, "table")} : undefined} className="techTable">
             <tbody>
             <tr>
             <th>Front end</th>
             <th>Back end</th>
             </tr>
             <tr>

                 <td>

                     {!this.state.tableEdit ?
                          front_end
                         : <input type="text" name="front_end" onChange={(e)=>{this.changeValue(e)}} placeholder={front_end}/>}
                </td>

                 <td>
                        {!this.state.tableEdit  ? back_end
                        : <input type="text" name="back_end" onChange={(e)=>{this.changeValue(e)}} placeholder={back_end}/>}
                </td>
                </tr>
                <tr>
                <td colSpan="2" style={{textAlign: "center", backgroundColor: "lightgreen"}}>
                Required Config: {!this.state.tableEdit ?
                     configuration_required ? yes : no :
                      <input type="checkbox" defaultChecked={configuration_required} />}
                </td>
                </tr>
            </tbody>
                </table>
            </div>{!!selectJob ?<div>
            {(!isOwner && !accepted_bid) && <button className="bidButton" onClick={this.toggleBidForm}>Open/Minimize Bid Form</button>}
            {(isOwner && !accepted_bid) && <button onClick={(e)=>{this.removeJob(e)}}>Click to remove Job</button>}
            {(isOwner && accepted_bid && !completed) && <button onClick={(e)=>{this.closeJob(e, selectJob)}}>Complete Job</button>}
            {isOwner && <div>Click "Accept Bid" next to the amount to accept a bid</div>}</div> : <div>loading...</div>}

                {(!!selectJob && bids.length > 0) && <Bids deleteBid={this.props.deleteBid} user_id={this.state.user_id} isOwner={isOwner} bids={bids} selectBid={this.selectedBid} accepted_bid={accepted_bid} />}


            </div>;

        return(
            <div className="outerJobProfileCont">

                <CSSTransition
                    in={!!this.state.selectedBid && this.state.acceptAni}
                    timeout={500}
                    classNames="accept"
                    unmountOnExit>
                <div className="bidAccepted">
                    Bid accepted!
                </div>
            </CSSTransition>
                <CSSTransition
                    in={this.state.loaded}
                    timeout={200}
                    classNames="init"
                    unmountOnExit>
            {profile}
        </CSSTransition>
            <CSSTransition
                in={this.state.bidHit}
                timeout={500}
                classNames="bid"
                unmountOnExit
                >
            <BidForm  change={this.handleChange} messageR={this.state.requiredMessage} err={this.state.bidFormErr}
                clickM={this.toggleBidForm} submit={this.handleSubmit} toggleCheck={(e)=>{this.fillStack(e);}}
                back={this.state.bidBack} front={this.state.bidFront} title={this.state.bidTitle} description={this.state.bidDescription} amount={this.state.bidAmount} />

            </CSSTransition>

            </div>
        )
    }

}



export default withRouter(JobProfile);
