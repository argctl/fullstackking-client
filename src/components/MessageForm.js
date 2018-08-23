import React, {Component} from "react";
import {connect} from 'react-redux';
import {withRouter} from 'react-router-dom';
import {postNewMessageSession, userExists} from "../store/actions/messages";
import jwtDecode from "jwt-decode";

const UserInteractionList = ({users, addU}) => {

    const {id} = jwtDecode(localStorage.userTokenFSK);

    const userList = users.filter((item)=>{
        return item._id !== id;
    })
return(

    <ul>
        { users.length > 0 && <div>

            Recent interactions:

        </div>}
        {userList.map((user)=>{
            const secondVal = user.job_id ? user.job_id : user.session_id;
            const key = `${user._id}-${secondVal}`

            return(<li key={key}><a onClick={(e)=>{addU(e, user.username)}}>{user.username}</a> {!!user.job_id ?<div>from: job</div> : <div>from: message</div> }</li>)
        })}
    </ul>
)

}


class MessageForm extends Component {
    constructor(props){
        super(props);

        this.state={
            users: [],
            user: "",
            initMessage: "",
            errMess: ""
        }
        this.handleChange = this.handleChange.bind(this);
        this.newMessageSubmit = this.newMessageSubmit.bind(this);
    }
    newMessageSubmit(e){
        e.preventDefault();
        const {users, user, initMessage} = this.state;
        if(initMessage.length > 0){
            if(users.length > 0){
                this.props.postSession(users, initMessage);
            }else if(user.length > 0){
                this.setState({errMess: "click add button to add user to session..."});

                return;
            }else{
                this.setState({errMess: "Please specify at least one recepient..."})
                return;
            }
        }else{
            this.setState({errMess: "please fill out message..."});
            return;
        }

        setTimeout(()=>{
            this.props.history.push("/account/message")
        }, 100)
    }
    handleChange(e){
        this.setState({[e.target.name]: e.target.value})
    }
    checkUser(e = false){
        //change to min size if min size is set.
        const {user, users} = this.state;
        !!e && e.preventDefault();
        if(user.length < 1){
            this.setState({errMess: "No Username Was Entered"})

        }
        this.props.userExists(user).then((res)=>{
            if(res.real){
                users.indexOf(user) === -1 && this.props.username !== user
                ? this.setState({users: [...users, user], user: "", errMess: ""})
                : this.setState({errMess: "User already added."});

            }else{
                this.setState({errMess: "User not found..."});

            }
        })


    }
        render(){
        const interactedUsers = this.props.data && this.props.data.userData;
        const {users, errMess} = this.state;
        return(

            <form className="newMessageFormEle" onSubmit={this.newMessageSubmit}>

            {users.map((user)=>{
                return(
                    <div key={user}>{user}</div>
                )
            })}
            {errMess.length > 0 && <div className="errorBox" style={{padding: "0px"}}>{errMess}</div>}
        <input placeholder="recepient" type="text"
            onChange={this.handleChange} value={this.state.user} name="user" /><button onClick={(e)=>{this.checkUser(e)}}>add</button>



            <textarea className="messageTA" placeholder="message"
            onChange={this.handleChange} name="initMessage" value={this.state.initMessage} >
            </textarea>

                    <button className="messageSendBtn">send</button>

                    {   this.props.data.userData &&

                    <UserInteractionList users={interactedUsers} addU={(e, u)=>{this.setState({user: u}); }} />
                    }
                </form>
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
const mapDispatchToProps = (dispatch) => {
    return{
        postSession: (users, initMessage)=>dispatch(postNewMessageSession(users, initMessage)),
        userExists: (username) => dispatch(userExists(username))
    }
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(MessageForm));
