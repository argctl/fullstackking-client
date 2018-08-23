import React, {Component} from "react";
import {withRouter} from 'react-router-dom';


class Activate extends Component{
    constructor(props){
        super(props);
        this.verify = this.verify.bind(this)
        this.state = {
            email: "",
            error: ""
        }
    }
    verify(e){
        e.preventDefault();
        const {email} = this.state;
        fetch(`${process.env.REACT_APP_URL}/verify`, {
            method: 'post',
            headers: {
                'Accept' : 'application/json',
                'Content-Type' : 'application/json'
            },
            body: JSON.stringify({activateStr: this.props.location.pathname.split("/")[2], email})
            // mode: 'cors'
        }).then((result)=>{
            // console.log(result);
            if(!result.ok){
                this.setState({error: "A server error occured"});
            }else{
                this.setState({verified: true, error: ""})
                setTimeout(()=>{

                    this.props.history.push("/onboarding/signin");

                }, 4000)
            }
        }).catch((error)=>{
            // console.log(error);
            this.setState({error: "A server error occured"})
        })

    }

    render(){
        const {email, error, verified} = this.state;
        return(
            <form onSubmit={this.verify}>
                {error.length > 0 && <div className="errorbox">{error}</div>}
                {verified && <div>Account verified! redirecting...</div>}
                <input type="text" placeholder="email" onChange={(e)=>{this.setState({email: e.target.value});}} value={email}/>
                <button>verify this email address </button>
            </form>
        )
    }
}

export default withRouter(Activate);
