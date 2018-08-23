import React, {Component} from "react";
import {withRouter} from "react-router-dom";


class ChangePass extends Component{
    constructor(props){
        super(props);

        this.state = {
            op: "",
            np: "",
            cp: "",
            error: false,
            complete: false
        }
        this.changePass = this.changePass.bind(this);
        this.submit = this.submit.bind(this);
    }
    changePass(e){
        this.setState({[e.target.name]: e.target.value});
    }
    submit(e){
        e.preventDefault();
        const {reset} = this.props;
        const {op, np, cp} = this.state;
        const valid = /\d/.test(this.state.password) && /[a-zA-Z]/.test(this.state.password) && this.state.password.length > 5;
        if(np !== cp && valid){
            this.setState({error: true});
            return
        }
        if(reset){
            const hash = this.props.location.pathname.split("/")[2];
            const token = localStorage.resetToken;
            fetch(`${process.env.REACT_APP_URL}/reset/submit`, {
                method: 'post',
                headers: {
                    'Authorization' : `Bearer: ${token}`,
                    'Accept' : 'application/json',
                    'Content-Type' : 'application/json'
                },
                body: JSON.stringify({hash, pass: op, np})
            }).then(res=>res.json()).then((res)=>{
                if(res.message ==="password reset success"){
                    this.setState({complete: true});
                    localStorage.removeItem("resetToken");
                    this.props.history.push("/onboarding/signin");
                    return;
                }else{
                    // console.log("res",res);
                    this.setState({error: true});
                    return;
                }
            }).catch((err)=>{
                this.setState({error: true});
            })
            return
        }else{
            //make a fetch request through auth.
            this.props.changePass(op, np).then((res)=>{
                // console.log(res);
                if(!!res && !!res.message){
                    this.setState({complete: true, error: false});
                    !!res && res.message === "password set" && setTimeout(()=>{this.props.history.push("/account/profile/my")}, 3000)
                    return;
                }else{
                    this.setState({error: true});
                }
            }).catch((err)=>{
                this.setState({error: true})
            });
            return
        }
        // this.setState({error: false});
    }


    render(){
        const {reset} = this.props;
        const type = reset ? "temp password..." : "old password";
        const {op, np, cp, error, complete} = this.state;
        return(
            <form style={{margin: "auto", marginTop: "20vh"}} onSubmit={this.submit}>
                {error && <div className="errorBox">An error occured. Make sure the passwords match and
                you are using the correct {type}</div>}
                {complete && <div style={{ borderRadius: "10px", padding: "30px", backgroundColor: "rgba(137, 255, 20, .45)", color: "green"}}>Password change complete!</div>}
            <input name="op" value={op} onChange={this.changePass} type="password" placeholder={type}  />
            <input name="np" value={np} onChange={this.changePass} type="password" placeholder="password..." />
            <input name="cp" value={cp} onChange={this.changePass} type="password" placeholder="confirm..."/>
            <button>change password </button>

            </form>
        )
    }
}


export default withRouter(ChangePass);
