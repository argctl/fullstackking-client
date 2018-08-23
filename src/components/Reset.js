import React, {Component} from 'react';


class Reset extends Component{
    constructor(props){
        super(props);

        this.state = {
            fn: "",
            ln: "",
            email: "",
            err: false,
            complete: false
        };
        this.change = this.change.bind(this);
        this.submitReq = this.submitReq.bind(this);
    }
    change(e){
        this.setState({[e.target.name] : e.target.value});
    }
    submitReq(e){
        e.preventDefault();
        const {email, fn, ln} = this.state;
        fetch(`${process.env.REACT_APP_URL}/reset`, {
            method: 'post',
            headers: {
                'Accept' : 'application/json',
                'Content-Type' : 'application/json'
            },
            body: JSON.stringify({email, fn, ln})
            // mode: 'cors'

        }).then((res)=>{
            if(!res.ok){
                this.setState({err: true});
                return
            }else{
                return res.json()
            }
        }).then((json)=>{
            localStorage.resetToken = json.jwtId;
            this.setState({complete: true, err: false});
        });
    }
    render(){
        const {err, fn, ln, email, complete} = this.state;

        return(
            complete ?
            <div>Check your email.</div>
            :
            <form onSubmit={this.submitReq}>
                {err && <div className="errorBox">There was an error with your request</div>}
                <input name="email" value={email} onChange={this.change} placeholder="email" />
                <input name="fn" value={fn} onChange={this.change} placeholder="first name" />
                <input name="ln" value={ln} onChange={this.change} placeholder="last name" />
                <button>submit request</button>
            </form>
        );
    };
}


export default Reset;
