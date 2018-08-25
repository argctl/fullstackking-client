import React, {Component} from "react";
import {withRouter} from "react-router-dom";


class Redirecter extends Component{
    componentDidMount(){
        !!localStorage.userTokenFSK ?
        this.loggedIn():
        this.loggedOut();
    }
    loggedIn(){
        this.props.history.push("/account");
    }
    loggedOut(){    //needs to be fixed to look at from pathname.
        this.props.history.push("/onboarding");
    }
    render(){
        return(
            <div>Redirecting you to the correct page...</div>
        )
    }
}

export default withRouter(Redirecter);
