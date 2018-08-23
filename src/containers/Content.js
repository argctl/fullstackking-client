import React, {Component} from "react";
import {connect} from "react-redux";
import {Switch, Route, withRouter} from "react-router-dom";

import {removeUser} from "../store/actions/user";
import UserView from "./UserView";
import ProspectView from "./ProspectView";
import Redirecter from "./Redirecter";

import Activate from "../components/Activate";

class Content extends Component {

    render(){

        return(
            <Switch>
                <Route path="/onboarding" component={ProspectView}/>
                <Route exact path= "/" component={Redirecter}/>
                <Route path="/account" component={UserView} />
                <Route exact path="/activate/*" component={Activate} />
            </Switch>
        );
    }
}
const mapStateToProps = (state)=>{
    return{
        token: state.userReducer,
        error: state.errorReducer
    }
}
const mapDispatchToProps = (dispatch) =>{
    return{
        logout: ()=> dispatch(removeUser())
    }
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Content));
