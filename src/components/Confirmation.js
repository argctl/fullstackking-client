import React, {Component} from 'react';
import {withRouter, Link} from 'react-router-dom';
import {CSSTransition} from 'react-transition-group';


import "../styles/Confirmation.css"

class Confirmation extends Component{

    constructor(props){
        super(props);
        this.state = {
            job: "",
            rate_user: true,
            better_rating: false,
            good_job: null,
            review: "",
            error: false
        }
    }

    componentDidMount(){
        let job = this.props.jobInfo;
        if(!job){
            job = this.props.location.pathname.split("/")[4]
            this.props.getJob(job);
        }
        this.setState({job}) //may be able to use something like this to simplify/refactor my code.
        //actually needs to use a prop that I'll set to make an api request and then props should work as default without involving state.
    }
    submitConfirmation(e){
        const {rate_user, review, good_job} = this.state;

        const job = this.props.location.pathname.split("/")[4];
        if(good_job !== null || rate_user === false){
        review.length > 1 ? this.props.completeJob({isRated: rate_user, job, review, is_good: good_job})
        : this.props.completeJob({isRated: rate_user, job, review: "no review...", is_good: good_job});
        //this is soobad....
        const interval = setInterval(()=>{

            this.props.jobInfo.confirm && clearInterval(interval);
            this.props.jobInfo.confirm && this.props.history.push("/account")
            this.props.jobInfo.error && this.setState({error: true});
        },243);



        }else{this.setState({error: true});}
    }

    render(){


        const {jobInfo} = this.props;
        const {selectJob} = !!jobInfo ? jobInfo : {selectJob: {}};
        //wow the below code may be completely useless and crazy.
        if(!selectJob.accepted_bid && !!selectJob && !selectJob.verified){
            this.props.history.push("/account/job/" + this.props.location.pathname.split("/")[4]);
        }

        const accepted = (!!selectJob && !!selectJob.bids) && selectJob.bids.find((bid)=>(bid._id === selectJob.accepted_bid));

        const yes = this.state.rate_user ? {color: "green", borderColor: "green"} : {color: "red"};
        const no = !this.state.rate_user ? {color: "green", borderColor: "green"} : {color: "red"};

        return(
            <div className="JobProfile">
                {this.state.error && <h3 style={{color: "red"}}>Please fill out rating from or select no. Rating helps everyone!</h3>}
                <h2>Are you sure?</h2>
                <h3>Ready to complete job titled: {selectJob.title}</h3>
                {accepted && <div>Accepted bid from {accepted.user.username} for <span className="amountCont">${accepted.amount}.00</span>? Do you care to rate the user?
                <button style={yes} onClick={(e)=>{this.setState({rate_user: true})}}>yes</button><button style={no} onClick={(e)=>{this.setState({rate_user: false})}}>no</button></div>}

                    <CSSTransition
                        in={this.state.rate_user}
                        timeout={500}
                        classNames="accept"
                        unmountOnExit>
                    <form onSubmit={(e)=>{e.preventDefault()}}>
                        <textarea placeholder="review..." onChange={(e)=>{
                                this.setState({review: e.target.value});
                            }} value={this.state.review}></textarea>
                        <label>Overall, good or bad?</label>
                        <div className="upDownCont">
                        <button className="goodJob" style={this.state.good_job ? {backgroundColor: "rgba(137, 255, 20, .45)"} : {}} onClick={(e)=>{
                                    e.preventDefault();
                                    this.setState({good_job: true})}}>
                                    <span role="img" aria-label="thumbs up">👍</span>
                                    </button>
                                <button className="badJob" style={this.state.good_job === false ? {backgroundColor: "rgba(253, 6, 43, .45)"} : {}} onClick={(e)=>{
                                    e.preventDefault();
                                    this.setState({good_job: false})}}>
                                    <span role="img" aria-label="thumbs down">👎</span>
                                </button>
                        </div>
                        <label><a className="fakeLink" onMouseEnter={()=>{this.setState({better_rating: true})}} onMouseLeave={()=>{this.setState({better_rating: false})}}>Why do we only give two options?</a></label>
                    </form>
                </CSSTransition>
                <CSSTransition
                    in={this.state.better_rating}
                    timeout={500}
                    classNames="bid"
                    unmountOnExit>
                    <div className="whyMessage">At a glance, you'll be able to tell if our developers have had a single bad review. With a star system someone with one 4 star rating might look the same as someone with one 1 star rating. Not here.</div>
                </CSSTransition>
                <p>By confirming, you are agreeing that the job was done at a level of satisfaction to warrant payout. There are no refunds after a payout is performed.
                    Please <Link to={"/support/dealbreaker/" + this.state.job}>contact support/administration</Link> if you are unhappy and unable to settle the issue with your developer</p>
                <button style={{alignSelf: "center"}} onClick={(e)=>{this.submitConfirmation(e)}}>Confirm job is complete and allow payout</button>
                </div>
        )
    }
}




export default withRouter(Confirmation);
