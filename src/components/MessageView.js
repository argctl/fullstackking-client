import React, {Component} from "react";
import {connect} from "react-redux";
import {withRouter} from "react-router-dom";

import {getMessageSessions, getMessagesBySession, postNewMessageSession} from "../store/actions/messages";

import ProfPic from "./ProfPic";
import "../styles/MessageView.css"


class MessageView extends Component{

    constructor(props){
        super(props);

        this.state = {
            intervalSet : false,
            users: "",
            initMessage: ""
        }
        this.newMessageSubmit = this.newMessageSubmit.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.clickSession = this.clickSession.bind(this);
    }



    componentDidMount(){

        !this.props.recent && this.props.getMessageSessions();


    }
    newMessageSubmit(e){
        e.preventDefault();

        this.props.postSession(this.state.users, this.state.initMessage);
        setTimeout(()=>{
            this.props.getMessageSessions();
            this.props.history.push("/account/message")
        }, 100)
    }
    handleChange(e){
        this.setState({[e.target.name]: e.target.value})
    }
    clickSession(session_id, e){

        this.props.getSession(session_id);
        this.props.history.push(`/account/message/session/${session_id}`); //may add id to url for similar situation to job posting.
    }
    formateDateAndTime(date){
        const dt = new Date(date);

        return dt.toLocaleString();
    }

    render(){
        //possibly needs to check for the recent prop. could introduce other bugs is my worry..
        if(this.props.sessions === null){
            setTimeout(()=>{

                this.props.getMessageSessions();
            }, 5000);
        }


        const anyMessages = this.props.sessions ? !!this.props.sessions.length : true;

        const {notifs_id} = !!this.props.data.notifs ? this.props.data.notifs : {notifs_id: []};

        return(
            <div>

                <div>
                    {!!this.props.recent && <button onClick={()=>{this.props.getMessageSessions()}}>show all messages</button>}
            <ul className="MessageSessions">
                {!anyMessages && <div>no messages..</div>}
                    { this.props.sessions !== null ? this.props.sessions.map((item)=>(
                <li onClick={this.clickSession.bind(this, item.session)} className="messageSessionItem" key={item.session}>

                    <div className="userCont">
                        <br />
                    {//<img width="auto" height="50" src={defaultImage} className="imagePinMessageSesion" alt="profile"/>
                    }
                    <ProfPic className="imagePinMessageSesion" alt="profile" id={item.user._id} photo={item.user.photo} />

                    <div className="userMessageSession">{item.user.username}</div>
                    </div>
                <div className="textMessageSession">{item.text.substr(0, 20)} {item.text.length > 20 && "..."}</div>
                    <div className="dateMessageSession">{this.formateDateAndTime(item.date)}
                    {notifs_id.indexOf(item.session) !== -1 && <div style={{color: "white", backgroundColor: "red"}}>new messages!</div>}
                    </div>
                </li>
            )): <li>loading...</li>}
        </ul>
    </div>


</div>
        )
    }
}


const mapStateToProps = (state) =>{
    let sessions = state.messageReducer.sessions === undefined ? null : state.messageReducer.sessions;
    let {recent} = state.messageReducer;
    return{
        user: state.userReducer,
        sessions,
        errors: state.errorReducer,
        data: state.dataReducer,
        recent
    }
}
const mapDispatchToProps = (dispatch) =>{
    return{

        getMessageSessions: ()=>dispatch(getMessageSessions()),
        getSession: (id)=>dispatch(getMessagesBySession(id)),
        postSession: (users, initMessage)=>dispatch(postNewMessageSession(users, initMessage))
    }
}
export default withRouter(connect(mapStateToProps, mapDispatchToProps)(MessageView));
