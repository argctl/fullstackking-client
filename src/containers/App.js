import React, { Component } from 'react';
import {Provider} from "react-redux";
import {BrowserRouter as Router} from "react-router-dom";
import {configureStore} from "../store"
import Content from "./Content";
import Navigation from "./Navigation";
import jwtDecode from "jwt-decode";

import {addUser, removeUser} from "../store/actions/user";
const store = configureStore();


if(localStorage.userTokenFSK){

try{    let {id} = typeof localStorage.userTokenFSK === "string" && jwtDecode(localStorage.userTokenFSK);
    store.dispatch(addUser(localStorage.userTokenFSK, id));

}catch(e){
    store.dispatch(removeUser());
}
}



class App extends Component {

    componentDidMount(){
        document.title = "fullstacKKing.com";
    }


    render() {
        return (
            <Provider store={store}>
                <Router>
                    <div>
                        <Navigation/>
                    <Content />
                    </div>
                </Router>
            </Provider>
        );
      }
}

export default App;
