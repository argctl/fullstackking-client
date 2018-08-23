import React, {Component} from "react";
import {withRouter, Link} from "react-router-dom";
import {connect} from "react-redux";
import {getMessagesBySession, sendMessage, addSingleMessage, addUserToSession, deactivateMessageSess, fixMessage} from "../store/actions/messages";
import {postAuthInfo} from "../store/actions/user";
import socketIOClient from 'socket.io-client';
import jwtDecode from "jwt-decode";

import "../styles/MessageSession.css";
class MessageSession extends Component{
    constructor(props){
        super(props);
        this.state={
            status: "loading...",
            message: "",
            session_id: "",
            endpoint: process.env.REACT_APP_URL,
            socket: null,
            message_ids: [],
            searchBox: "",
            searchUsers: [],
            oldies: false
        }
        this.mapUserToMessage = this.mapUserToMessage.bind(this);
        // this.handleNewMessage = this.handleNewMessage.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.sendRoom = this.sendRoom.bind(this);
    }
    componentWillUnmount(){
        this.socket.close(true);
    }

    scrollToBottom = () => {
        this.messageEnd.scrollIntoView({behavior: "smooth"});
    }

    componentDidMount(){
        let array = this.props.location.pathname.split("/");
        let session_id = array[array.length-1];
        this.props.getSession(session_id, new Date());

        this.socket = socketIOClient(this.state.endpoint);
        this.socket.on("news", function(news){


        })
        this.socket.emit("session", {token: localStorage.userTokenFSK,
        session_id});

        this.setState({session_id});

        this.socket.on('socket_message_broadcast', (data)=>{

            if(!this.state.message_ids.includes(data._id)){
            this.setState({message_ids: [...this.state.message_ids, data._id]});
            this.props.addMessage(data);
            }


        });
        this.socket.on('refresh_base_info', (data)=>{
            this.props.getSession(this.state.session_id);
        })
        this.scrollToBottom();
    }
    componentDidUpdate(){
        !this.state.oldies && this.scrollToBottom();
    }

    mapUserToMessage(uid){

        let user = this.props.users && this.props.users[0].find((u)=>(uid === u._id));
        if(user === undefined){
            // this.props.fixMessage(uid).then((info)=>{
            //     console.log(info)
            //
            // })
            user = "none"
        }

        return user;
    }

    handleChange(e){

        this.setState({[e.target.name]:e.target.value})
    }

    sendRoom(e){
        e.preventDefault();

        const {message, session_id} = this.state;
        if(message.length > 0){
        const body = {text: message}
        const head = {token: localStorage.userTokenFSK,
                      session: session_id};
        const data = {head, body};

        this.socket.emit('send', data);
        let {id} = jwtDecode(localStorage.userTokenFSK);
        let userMessage = {text: message,
                        user: id,
                        session: session_id};
        this.props.addMessage(userMessage);
        this.setState({message: ""})
        }

    }
    addUser(e, uid){
        const answer = this.props.addUser(uid, this.state.session_id);
        answer.then((info)=>{
            const head = {token: localStorage.userTokenFSK,
            session: this.state.session_id};
            this.socket.emit('refresh_base_info', {head});
            this.props.getSession(this.state.session_id);
            this.setState({searchBox: "", searchUsers: []});
        })
    }
    searchUser(e){
        e.preventDefault();
        this.setState({searchBox: e.target.value});
        const answer = this.props.searchForUser(e.target.value);
        answer.then((item)=>{
            if(item !== undefined){
            item.err === undefined &&
            this.setState({searchUsers: item});
        }
        })

    }
    formatDate(date){
        const d = new Date(date);

        return d + "" !== "Invalid Date" ? d.toLocaleString() : (new Date()).toLocaleString();
    }
    oldMessages(){
        const { messages } = this.props;
        const { date } = messages[1];
        //this will probably change the view to only show the old messages now... I can somehow
        //use the add message functionality? or maybe create a new reducer that appends the messages.
        //It would be better to use the same method but that could cause duplicate display of messages if
        //I'm not careful.
        this.setState({oldies: true});
        setTimeout(()=>{
            this.setState({oldies: false});
        }, 20000);
        this.props.getSession(this.state.session_id, date, true, messages);

    }
    render(){

        // const users = this.props.users && this.props.users[0] && this.props.users[0].filter((user)=>(user.session_id === this.state.session_id));
        const users = this.props.data && this.props.data.userData && this.props.data.userData.filter((user)=>(user.session_id === this.state.session_id));
        const suggestedUsers = users && this.props.data.userData.filter((user)=>(!users.find((item)=>(item._id === user._id))));

        const {messages} = !!this.props.messages ? this.props : {messages: []};
        const also_old =  messages.length > 19 && messages.length % 20 === 0 ? true : false; //will still have issue with exactly 20 on last one...
        const participants = users && users.map((user)=>(
            <div className="userParticipant" key={user._id}>{user.username}</div>
                    )
        );
        return(
            <div className="messageCont">
                <div className="participantCont">
                    participants: {participants}
                </div>
                <div className="messagePane">

            {!messages && this.state.status}
            {(also_old && messages.length > 0) && <button onClick={(e)=>{this.oldMessages(e)}}>load older items...</button>}
            {messages && messages.map((message, i)=>{
                const isSpecial = message.text.split("-")[0] === "Your bid has been accepted!!!🎉🎉🎉 (this message was automatically sent by the system)";
                return(
                <div className="messageItem" key={"message" + i}>
                {this.formatDate(message.date)}
                <div className="messageUser">
                    {
                        this.mapUserToMessage(message.user).username
                    }
                </div>
                <div className="messageText">{isSpecial ? <a href={"/account/job/" + message.text.split("-")[1]}>{message.text.split("-")[0]}</a> : message.text} </div>
                </div>
               )
        })}
        <div style={{float:"left", clear: "both"}} ref={(el)=>{this.messageEnd = el;}}></div>
        </div>
        <button onClick={(e)=>{

                    this.props.deactivateSess(this.state.session_id).then(()=>{
                        this.props.history.push("/account/message")
                    });


                                       }}>Leave Session</button>
            <form className="messageForm" onSubmit={this.sendRoom}>
                <div>
                    {suggestedUsers.map((user, i)=>(
                        <div key={user._id + i}><button onClick={(e)=>{
                                this.addUser(e, user._id)


                            }}>add user</button><Link to={"/account/profile/" + user._id}>{user.username}</Link> from {!!user.job_id ? " viewed job" : "viewed message"}</div>
                    ))}
                    <label>Search to add user</label>
                    <input className="userSearch" type="text"
                        onKeyPress={(e)=>{e.target.keyCode === 13 && e.preventDefault();}}
                        onChange={(e)=>{this.searchUser(e)}} placeholder="search..." value={this.state.searchBox}/>
                </div>
                <textarea name="message" onChange={this.handleChange} value={this.state.message}>
                </textarea>
                <button type="submit">send</button>
            </form>
            <ul>
            {this.state.searchUsers.map((user)=>(<li key={user._id}><button style={{fontSize: "1.5rem"}} onClick={(e)=>{
                    this.addUser(e, user._id)


                }}>+</button><Link to={"/account/profile/"+user._id}>{user.username}</Link>
        </li>))}
            </ul>

            </div>
        )
    }
}

const mapDispatchToProps = (dispatch) =>{
    return{
        getSession: (id, date, add, curr)=>dispatch(getMessagesBySession(id, date, add, curr)),
        sendMessage: (text, session)=>dispatch(sendMessage(text,session)),
        addMessage: (message)=>dispatch(addSingleMessage(message)),
        searchForUser: (partial)=>dispatch(postAuthInfo("search/user", {partial}, "post")),
        addUser: (user, session)=>dispatch(addUserToSession(user, session)),
        deactivateSess: (session)=>dispatch(deactivateMessageSess(session)),
        fixMessage: (uid)=>dispatch(fixMessage(uid))
    }
}

export default withRouter(connect(null, mapDispatchToProps)(MessageSession));
