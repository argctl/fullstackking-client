import React, {Component} from 'react';
import {withRouter} from 'react-router-dom';
import jwtDecode from 'jwt-decode';

import "../styles/Support.css";


class Support extends Component{

constructor(props){
    super(props);
    //add check and set from prop of select state.
    this.state = {
        select : "sug",
        title : "",
        description: "",
        error: "",
        success: false,
        email: ""
    }
}

componentDidMount(){
}

submitIt(e){
    e.preventDefault()
    const {logged} = this.props;


    if(logged){
        const {select, title, description} = this.state;
        const {email} = jwtDecode(localStorage.userTokenFSK);
        if(title.length > 4 && description.length > 50){
            fetch(`${process.env.REACT_APP_URL}/support`, {
                method: 'post',
                headers: {
                    'Accept' : 'application/json',
                    'Content-Type' : 'application/json',
                    'Authorization': `Bearer ${localStorage.userTokenFSK}`

                },
                body: JSON.stringify({select, title, description, email})
            }).then((res)=>{
                if(!res.ok){
                    this.setState({error: "A server error occured"});
                }else{
                    this.setState({success: true});
                }
            }).catch((err)=>{
                this.setState({error: "A server error occured"});
            })
        }else{
            this.setState({error: "title and/or description isn't long enough or from incomplete..."});
        }

    }else{
        const {select, title, description, email} = this.state;
        if(title.length > 4 && description.length > 50){
            fetch(`${process.env.REACT_APP_URL}/support`, {
                method: 'post',
                headers: {
                    'Accept' : 'application/json',
                    'Content-Type' : 'application/json'
                },
                body: JSON.stringify({select, title, description, email})
                // mode: "cors"
            }).then((result)=>{
                if(!result.ok){
                    this.setState({error: "A server error occured"});
                }else{
                    this.setState({success: true});
                }
            }).catch((err)=>{
                this.setState({error: "A server error occured"});
            })
        }else{
            this.setState({error: "title or description not long enough or form incomplete"})
        }
    }







}
changeValue(e){
    const {name, value} = e.target;
    this.setState({[name]: value});
    // console.log("name", name);
    // console.log("value", value);
}
render(){


//add a select menu for the selection of categories. This will help me organize it in the admin console.
//this should use a route that is available when not logged in.
//I can see why people would feel like this keyboard is very opinionated.
//It honestly isn't that bad if you hold your hands correctly. I'm having real trouble with c, v, b, and enter.
// I may try to  use dvorak, but that is out of my realm for now. I think I should finish me website before any other distractions.
    const {select, description, title, error, success, email} = this.state;
    const {logged} = this.props;
    return(
        <div className="supportForm">
        {success ?
            <div>Thank you for your input! We will reach out if neccesary...</div>
            :
            <div>

            <form onSubmit={(e)=>{this.submitIt(e)}}>
                <div>Thanks for using our site! What's on your mind?</div>
            {error.length > 0 && <div className="errorBox">{error}</div>}
            <select name="select" onChange={(e)=>{this.changeValue(e)}} value={select}>
                <option value="tech">technical support/issues</option>
                <option value="pay">issues with payment</option>
                <option value="sug">suggestions</option>
                <option value="comp">complaints</option>
            </select>
        {!logged && <input name="email" type="text" placeholder="email" onChange={(e)=>{this.changeValue(e)}} value={email} />}
        <input name="title" type="text" placeholder="Title" onChange={(e)=>{this.changeValue(e)}} value={title}/>
        <textarea name="description" placeholder="describe your issue here..."  onChange={(e)=>{this.changeValue(e)}} value={description}/>
        <button>send</button>
        </form>
        </div>}
        </div>
    )
}


}

export default withRouter(Support);
