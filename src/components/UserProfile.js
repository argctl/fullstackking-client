import React, {Component} from "react";
import jwtDecode from "jwt-decode";
import { CSSTransition } from 'react-transition-group';
import { withRouter, Link } from "react-router-dom";

import ProfPic from "./ProfPic";
import "../styles/UserProfile.css";

const VisiButton = ({type, hide, onClick}) => (
    <button onClick={onClick} style={{fontStyle: "italic"}}>{type} is currently {hide === '1' ? "hidden.." : "showing.."}
    <br/> Click to change visibility</button>
)

const ImageForm = ({submit, change, cancel}) => {
    return (
        <form  className="imgForm"  onSubmit={submit} encType="multipart/form-data">
            <input type="file" name="file" onChange={change} />
            <button>upload file</button>
            <button onClick={cancel}>cancel</button>
        </form>
    )
}

const VisiText = ({submit, cancel, onChange}) => (
    <div>
        <input autoFocus className="visiText" type="text" placeholder="Type 'show' or 'hide' to verify"
                onChange={onChange} />
        <button onClick={submit}>submit</button><button onClick={cancel}>cancel</button>
    </div>
)
const ActivityFeed = ({jobs, bids, jobPage}) =>{
    const jobsExist = !!jobs;
    const bidsExist = !!bids;

    //TODO turn bids and jobs into one list and sort for date.

    const mappedJobs = jobsExist ? jobs.map((job, i)=>{
        return {title: job.title, id: job._id, date: job.date, bid: false};
    }) : [];
    const mappedBids = bidsExist ? bids.map((bid, i)=>{
        return {title: bid.title, id: bid.job._id, date: bid.date, bid: true};
    }) : [];
    const sortable = mappedBids.concat(mappedJobs);

     const sorted = sortable.sort();
    return(
        <ul className="ActivityFeed">
            {sorted.map((item, i)=>{
                return(
                    <li key={item.id + i}><Link className="aLink" onClick={()=>{jobPage(null)}} to={"/account/job/" + item.id}>{item.bid ? "Bid placed: " : "Job posted: "} {item.title}</Link>
                        <div style={{color: "rgba(28, 17, 104, .75)"}}>{(new Date(item.date)).toLocaleString()}</div>
                    </li>
                )
            })}
        </ul>
    )
}


class UserProfile extends Component{
    constructor(props){
        super(props);
        this.handleClick = this.handleClick.bind(this);
        this.state ={
            showUpload: false,
            file: "",
            editOpen: false,
            back: false,
            front: false,
            bio: false,
            backVal: "",
            bioVal: "",
            frontVal: "",
            hideErr: false,
            editLastVisi: false,
            last: "",
            editEmailVisi: false,
            email: ""


        }
        this.handleClick = this.handleClick.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleChange = this.handleChange.bind(this);

        //this.listen is a function that will stop the listener.
        this.listen = this.props.history.listen((location, action)=>{
            const pathAspect = location.pathname.split("/")[3];
            const profile = location.pathname.split("/")[2];
            if(profile === "profile")
            pathAspect === "my" ? this.props.getProfile() : this.props.getProfile({user_id: pathAspect});
            const token = localStorage.userTokenFSK;
            const {id} = typeof token === "string" && jwtDecode(token);
            this.id = id
        })

    }
    componentWillUnmount(){
        this.listen(); //this causes it do remove the listener by triggering the defined method that ends the listener.
    }

    componentDidMount(){

        const pathAspect = this.props.location.pathname.split("/")[3];

        pathAspect === "my" ? this.props.getProfile() : this.props.getProfile({user_id: pathAspect});
        const token = localStorage.userTokenFSK;
        const {id} = jwtDecode(token);
        this.id = id

    }

    handleClick(e){

        this.setState({showUpload: !this.state.showUpload});
    }
    handleSubmit(e){
        e.preventDefault();

        let formData = new FormData();
        formData.append('file', this.state.file);
        // const headers = {
        //     'content-type' : 'multipart/form-data'
        //
        // }
        const token = localStorage.userTokenFSK;
        const {id} = jwtDecode(token);


        fetch(`${process.env.REACT_APP_URL}/logged/${id}/upload`, {
            method: "post",
            headers: {
                // 'Accept' : 'application/json',

                'Authorization': `Bearer ${token}`
            },
            body: formData
            // mode: "cors"
        })
        .then(response => response.json())//make a change to the page or refresh page.
        .then(response => {

            this.props.updateUserProfileData(response);
            this.setState({showUpload: false});


        })
        .catch(err=>err);
    }
    handleChange(e){
        this.setState({file: e.target.files[0]})
    }
    toggleEdit(name){
        const test = this.state[name];
        this.setState({editOpen: true});
        this.setState({[name]: !test});

    }
    discardEdit(){
        this.setState({bio: false, back: false, front: false, editOpen: false, backVal:"", frontVal: "", bioVal: "", editLastVisi: false, last: ""});
    }
    saveEdit(){
        const {bioVal, frontVal, backVal} = this.state;
        let obj = {};
        obj = backVal.length > 0 ? {...obj, best_back: backVal} : obj;
        obj = frontVal.length > 0 ? {...obj, best_front: frontVal} : obj;
        obj = (bioVal.length > 0 && bioVal !== this.props.data.user.description) ? {...obj, description: bioVal} : obj;

        if(!!Object.keys(obj).length){
            this.props.updateProfile(obj);
        }
        this.discardEdit();
    }
    editChange(e){
        this.setState({[e.target.name]: e.target.value});
    }
    changePerm(type, e){
        this.setState({[type]: e.target.value});
    }
    submitPerm(type){
        const types = {last: 0, email: 1};
        const {hide} = this.props.data.user;
        const hideVal = Array.from(hide);
        if(this.state[type] === 'show'){
            hideVal[types[type]] = '0';
        }else if(this.state[type] === 'hide'){
            hideVal[types[type]] = '1';
        }else{
            this.setState({hideErr: true})
            return;
        }
        this.setState({hideErr: false,
            editLastVisi: false,
            last: "",
            editEmailVisi: false,
            email: ""});
        const boolString = hideVal.join('');
        this.props.changeHiddenItems(boolString);



    }
    formatDate(date){
        const d = new Date(date);
        //might move to server.
        return `${d.getUTCMonth()}-${d.getUTCDate()}-${d.getUTCFullYear()}`
    }
    render(){
        //I may be able to refactor every page to just check and use a "no loado message"
        const {id} = jwtDecode(localStorage.userTokenFSK);
        const {data} = !!this.props.data && !!this.props.data.user ? this.props : {data: {user: {email: "", hide: "111", username:"",
                lastname:"", firstname:"", total_amount: 0, created: (new Date()), best_back: "", best_front: "",
                description: "",photo: "no photo uploaded", reviews:[], jobs: [], bids: []}, noload: true}};
        const {email, hide, username, lastname, firstname, total_amount, created, best_back, best_front,
             description, photo, reviews, jobs, bids, verified} = data.user;
             const {noload} = !!data.noload ? data : {noload: false};
        const {user} = this.props.data;
        const pathAspect = this.props.location.pathname.split("/")[3];
        const editable = pathAspect === "my";
        const pic_id = !editable ? pathAspect: id;
            const positive = Array.isArray(reviews) ? reviews.reduce((acc, curr)=>{
                const val = curr.positive ? 1 : 0;
                return acc + val;
            }, 0) : null;
        return(
            <div>
            {!!noload ? <div>page not loaded...</div>:<div className="profileCont">

                <div className="basicInfo">
                    <div className="over">
                        {editable && <Link to="/account/password">change password</Link>}
                        {!verified && <div className="errorBox"><Link to="/account/resend" >User has not verified email!</Link> </div>}
                        {editable && <div>click a field to edit
                            {this.state.editOpen && <div><button onClick={()=>{this.saveEdit()}}>save</button><button onClick={()=>{this.discardEdit()}}>discard</button></div>}

                        </div>}
                        <ProfPic action={editable ? this.handleClick : undefined} className={editable ? "profilePic editable" : "profilePic"}
                            photo={photo} id={pic_id} alt="click to change" />
                        {editable && <div>click to change</div>}
                        <CSSTransition
                            in={this.state.showUpload}
                            timeout={800}
                            classNames="upload"
                            unmountOnExit
                            >
                            <ImageForm change={this.handleChange} submit={this.handleSubmit} cancel={(e)=>{this.setState({showUpload:false})}} />
                        </CSSTransition>
                    </div>

            {email && email.length > 0 && <div className="profileItem email">email: {email} <br/>
         {hide && <VisiButton onClick={(e)=>{this.setState({editEmailVisi: !this.state.editEmailVisi})}} type="email" hide={hide[1]}/>}</div>}
        {this.state.editEmailVisi && <VisiText onChange={this.changePerm.bind(this, "email")}
         submit={()=>{this.submitPerm("email")}} cancel={()=>{this.setState({editEmailVisi: false, email: ""})}}/>}

            <div className="profileItem username">username: {username}</div>
            <div className="profileItem name">Name: {firstname} {lastname} <br/>{hide &&
             <VisiButton onClick={(e)=>{this.setState({editLastVisi: !this.state.editLastVisi})}} hide={user.hide[0]} type="lastname"/> }</div>
             {this.state.editLastVisi && <VisiText onChange={this.changePerm.bind(this, "last")}
              submit={()=>{this.submitPerm('last')}} cancel={()=>{this.setState({editLastVisi: false, last: ""});}}/>}
            <div className="profileItem date" >Member since: <br/>{user && this.formatDate(created)}</div>

                </div>
                <div className="bioInfo">
		    {editable && <div style={{color: "green"}}>balance (from completed work): ${user.total_amount}.00</div>}
            {(editable && total_amount > 0) && <button onClick={()=>{this.props.history.push("/account/payout")}}>Withdraw</button>}
                    <div className="stack">
            {this.state.back ? <input name="backVal" onChange={(e)=>{this.editChange(e)}} autoFocus type="text" className="backend profileItem" placeholder={best_back}/>
        : <div className="profileItem backend" style={editable ? {cursor: "pointer"} : {cursor: "auto"}} onClick={editable ? (e)=>{ this.toggleEdit("back")} : undefined}>Backend speciality: {best_back}</div>}
            {this.state.front ? <input name="frontVal" onChange={(e)=>{this.editChange(e)}} autoFocus type="text" placeholder={best_front}/>
        : <div className="profileItem frontend" style={editable ? {cursor: "pointer"} : {cursor: "auto"}} onClick={editable ? (e)=>{ this.toggleEdit("front")} : undefined}>Frontend speciality: {best_front}</div>}
                    </div>
            {this.state.bio ? <textarea name="bioVal" onChange={(e)=>{this.editChange(e)}} autoFocus defaultValue={description} />
        : <div className="profileItem Bio" style={editable ? {cursor: "pointer"} : {cursor: "auto"}} onClick={editable ? (e)=>{this.toggleEdit("bio")} : undefined}><h3>Bio:</h3> {description}</div>}

                <div className="reviews">
                    <h2>User reviews: </h2>
                    {!!reviews && reviews.length > 0 && <div>Percentage positive:
                     <span>{!!positive ? (positive / reviews.length * 100) + "%" : "loading..."}</span></div>}
                    {(!!reviews && reviews.length > 0) ?
                        <ul>{reviews.map((review)=>(
                        <li className="review" style={review.positive ? {backgroundColor: "rgba(137, 255, 20, .45)"} : {backgroundColor: "rgba(253, 6, 43, .45)"}} key={review.job}><div><Link to={"/account/profile/" + review.user._id}>{review.user.username}</Link></div><div><Link to={"/account/job/" + review.job}>{review.review}</Link></div></li>
                        ))}</ul>
                    :
                    <div style={{fontStyle: "italic"}}>user currently has no reviews...</div>}
                </div>
                </div>
                <div>
                    <h3>Activity</h3>
                    <ActivityFeed jobPage={this.props.jobPage} jobs={jobs} bids={bids}/>
                </div>

        </div>}
        </div>
        )
    }
}
export default withRouter(UserProfile);
