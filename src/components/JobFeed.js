import React, {Component} from "react";
import {withRouter} from "react-router-dom";
import "../styles/JobFeed.css";


function formatDate(date){
    const d = new Date(date);
    return d.toLocaleString();
}


const Jobs = ({jobs, notifs, jobClick, type, length}) => {
//check for special cases. Maybe I can use a switch with return.
return(
<div>
{jobs.length > 0 && <h3>{type}</h3>}
{jobs !== undefined && jobs.filter((n, i)=>{

    return length && jobs.length > 5 ? i !== jobs.length-1 : true;

}).map((job, iter)=>(
                                  <div className={job.active ? "jobItem" : "jobItem jobInactive"}  onClick={(e)=>{jobClick(job._id, e)}} key={job._id + iter}>
                    <h2 className="jobTitle">{job.title}</h2>
                    {!job.active && <h3 style={{backgroundColor: "red", color: "white"}}>job inactive {job.completed && <span>and completed</span>}</h3>}
                    <div>{formatDate(job.date)}</div>
                    <br/>
                    {job.verified && <div className="jobVeri">Job payment verified!</div>}
                    <div className="jobStack">specific stack: {job.configuration_required ? "no" : "yes"}</div>
                    <div className="jobFront"><h3 className="stackOptions">UI/front/client:</h3> {job.front_end}</div>
                    <div className="jobBack"><h3 className="stackOptions">Business Logic/backend:</h3> {job.back_end}</div>
                    <div className="numberBids">bids: {job.bids === null || job.bids ===undefined ?
                                                0 : job.bids.length}
                                            {notifs.notifs_id.indexOf(job._id) !== -1 && <div className="newBid" >New Bid!</div>}
                    </div>
                    </div>



                               ))
}</div>
)
}

class JobFeed extends Component {


    constructor(props){

        super(props);
        this.state={
            searchText: "",
            searchErr: false,
            search_active: false,
            user_view: false,
            curr: []
        }

        this.jobClick = this.jobClick.bind(this);
        this.handleJobForm = this.handleJobForm.bind(this);
        this.searchJobs = this.searchJobs.bind(this);
    }

    componentDidMount(){
        const d = new Date();
        this.props.getJobs(d);


    }
    handleJobForm(e){
        this.props.history.push("/account/add");
    }

    jobClick(item, e){

        this.props.selectJob(item);
        setTimeout(()=>{

            this.props.history.push("/account/job/" + item)
        },100);
    }
    searchJobs(e){
        e.preventDefault();

        if(this.state.searchText.length > 1){
            this.props.searchJobs(this.state.searchText);
            this.setState({search_active: true, user_view: false});
        }else{
        this.props.getJobs();
        this.setState({search_active: false});
        }
    }
    jobPages(e, jobs){
        const curr = jobs[jobs.length - 1].date;
        this.state.curr.length > 0 ? this.setState({curr: [...this.state.curr, jobs[0].date]})
                                   : this.setState({curr: [(new Date())]});//may want this to be a flag instead to get
                                                                            //from current time not prev current.
        this.props.getJobs(curr);
        window.scrollTo(0,0);

    }
    jobBack(e, jobs){
        const curr = this.state.curr.slice();
        this.props.getJobs(curr.pop());
        this.setState({curr});
    }

    render(){

        const {notifs} = !!this.props.data.notifs ? this.props.data : {notifs: {notifs_id: [], notifs_type: []}};
        const {jobs} = !!this.props.jobs && !!this.props.jobs.jobs ? this.props.jobs : {jobs: [], noload: true};
        const {user_jobs, bids, active_bids} = !!this.props.jobs && this.props.jobs.bids ? this.props.jobs : {active_bids: [], bids: [], user_jobs: []};
        const {search_active, user_view} = this.state;
        const noload = !!jobs.noload;
        return(
            <div>
            {noload ? <div>loading...</div> : <div id="jobListPageCont">

                {(jobs.length > 5 && !search_active) && <button onClick={(e)=>{this.jobPages(e, jobs)}}>next page ></button>}
                {(this.state.curr.length > 0 && !search_active) && <button onClick={(e)=>{this.jobBack(e)}}>&#60; prev page </button>}
                <form onSubmit={this.searchJobs} className="searchCont">
                   {!user_view && <button onClick={(e)=>{this.props.userContextJobs(); this.setState({user_view: true})}}>My Activity</button>}
                   {(this.state.search_active || this.state.user_view) &&
                   <button onClick={(e)=>{this.props.getJobs((new Date())); this.setState({user_view: false, search_active: false, searchText: ""});}}>clear results</button>}
                   <input type="text" placeholder="search jobs..." value={this.state.searchText}
                   onChange={(e)=>{this.setState({searchText: e.target.value})}}/>
                <button className="searchBtn">⚲</button>
                {this.state.searchErr && <div className="errorBox">Invalid Search!</div>}
                </form>
                <button onClick={this.handleJobForm}>Add a Job</button>

            {!this.state.user_view ?
                    <Jobs jobs={jobs} notifs={notifs} jobClick={this.jobClick} length={!this.state.search_active} />
                    :<div>
                    {active_bids.length > 0 ? <Jobs jobs={active_bids} notifs={notifs} jobClick={this.jobClick} type="Job's you are currently working on: " length={false} /> : <h3> no jobs being worked on...</h3>}
                    {user_jobs.length > 0 ? <Jobs jobs={user_jobs} notifs={notifs} jobClick={this.jobClick} type="Job's you've posted:" length={false} /> : <h3>no jobs have been created by you...</h3>}
                    {bids.length > 0 ? <Jobs jobs={bids} notifs={notifs} jobClick={this.jobClick} type="Job's you've bid on:" length={false} /> : <h3>You have not bid on any jobs...</h3>}

                     </div>
                     }
                 {(jobs.length > 5 && !search_active) && <button onClick={(e)=>{this.jobPages(e, jobs)}}>next page ></button>}

            </div>}
            </div>


        )
    }
}

export default withRouter(JobFeed);
