import React, {Component} from "react";
import {Link, Route, withRouter} from "react-router-dom";
import {connect} from "react-redux";
import { CSSTransition } from "react-transition-group";

import {removeUser, setUserFromToken, postAuthInfo} from "../store/actions/user";
import { generalSearch, flushResults, getNotifs, clearNotifs, userJobs } from "../store/actions/data";
import {getRecentMessages, showingRecent} from "../store/actions/messages";
import {getProfile} from "../store/actions/data";
import "../styles/Navigation.css";
import logo from "../images/crown.png";

const regexes = ['bid', 'session', 'message'];


const AnimatedLink = ({text, condition, to, onClick, timeout=300}) => (
    <CSSTransition
        in={condition}
        classNames='search'
        timeout={timeout}
        unmountOnExit>
        <Link to={to} onClick={onClick}>{text}</Link>
    </CSSTransition>
)


class Navigation extends Component{

    constructor(props){
        super(props);
        this.state ={
            toggle: false,
            linkList: [],
            showSearch: false,
            override: false,
            searchUsers: [],
            searchBox: "",
            showNotifBar: false,
            notifCont: false,
            index: 0,
            time: "00:00:00 UTC"
        }


        this.testMobile = this.testMobile.bind(this);
        this.filterNotifs = this.filterNotifs.bind(this);
        this.sortNotifs = this.sortNotifs.bind(this);
        this.props.history.listen((location, action)=>{
            //should probably close menu here?
            this.hidePops();
            setTimeout(()=>{

                this.props.getNotifs();
            },300)
            if(location.pathname.split("/")[1] === "onboarding"){
                !!this.interval && clearInterval(this.interval);
            }
            //clearn interval if logged out.
        });
    }
    testMobile(){
        if(window.innerWidth !== this.width){
        setTimeout(()=>{
            window.innerWidth > 1850 ? this.setState({toggle: true, override: false}) : this.setState({toggle: false, override: true});

        }, 1000)
        this.width = window.innerWidth;
    }

    }
    hidePops(){
        this.setState({showSearch: false, showNotifBar: false});
        this.state.override && this.setState({toggle: false});
    }
    componentDidMount(){
        window.addEventListener('resize', this.testMobile);
        this.testMobile();
        this.interval = setInterval(()=>{
           this.props.location.pathname.split("/")[1] === "account" && this.props.getNotifs();
        }, 20000);
        this.clock = setInterval(()=>{
            this.setState({time: (new Date()).toUTCString().split(" ")[4] + " UTC" })
        }, 1000);
    }
    componentWillUnmount(){
        clearInterval(this.interval);
        clearInterval(this.clock);
    }
    searchUser(e){
        this.setState({searchBox: e.target.value});
        // const answer =
        e.target.value !== "" ? this.props.search(e.target.value) : this.props.flush();

            //if(this.state.searchBox == "") this.props.flush();


        // answer.then((item)=>{
        //     item.err === undefined &&
        //     this.setState({searchUsers: item});
        // })

    }
    filterNotifs(array, regex){
        return array.filter((notif)=>{
            return notif.type === regex;
        })
    }
    sortNotifs(joined_notifs){

        return regexes.map((regex, index)=>(
             this.filterNotifs(joined_notifs, regex)
        ))

    }
    jobClick(e){
        if(this.props.location.pathname !== "/account"){
            this.props.history.push("/account");
            setTimeout(()=>{
                this.props.getNotifsJobs();
            }, 100)
        }else{
            this.props.getNotifsJobs();
        }
    }
    recentMessage(e){
        this.props.showingRecent(true);
        if(this.props.location.pathname !== "/account/message"){
            this.props.history.push("/account/message")
            setTimeout(()=>{
                this.props.getRecentMessages();
            }, 243);
        }else{
            this.props.getRecentMessages();
        }
    }

    render(){

        this.props.user !== null && this.props.user.username === undefined && this.props.tokenUser();

        const {results} = this.props.data.results ? this.props.data : {results: null};


        const {pathname} = this.props.location;
        const importPathAspect = pathname.split("/")[1];

        const {notifs} = this.props.data;
        const {notifs_type, notifs_id, newNoEdit} = !!notifs && notifs.notifs_type ? notifs : {notifs_type: [], notifs_id: []};
        const joined_notifs = notifs_type.map((type, index)=>{
            return {type, id: notifs_id[index]};
        })

        const narray = this.sortNotifs(joined_notifs);
        const {toggle, override, time} = this.state;
        if(false || !!document.documentMode){
           (toggle && override) && document.body.classList.add('lockVert');
           !(toggle && override) && document.body.classList.remove('lockVert')
        }else{
            document.body.classList.toggle('lockVert', toggle && override);
        }
        const fs = override ? "1rem" : "1.4rem";

        return(
            <nav>
                <Link className="logoLink" to="/onboarding"><img className="logo" src={logo} alt="logo" /></Link>
                {(override || importPathAspect === "onboarding") && <div style={{fontSize: fs, position: "absolute", color: "rgba(28, 17, 104, 1)", alignSelf: "center"}}>{time}</div>}
                {newNoEdit && <Link className="welcomeMess" to="/account/profile/my"><span >
                {!override && "time to" } review your profile!</span></Link>}

                <div className="allNav" style={toggle ? {backgroundColor: "rgb(175, 182, 188)", zIndex: "1"} : {backgroundColor: "transparent", zIndex: "-1"}} >
                    { (!override && importPathAspect !== "onboarding") && <div className="clock">{time}</div>}

            <div>
            <div>
                {importPathAspect === "account" ?
                    <div>
            <Link to="/account/support" className="helpLink">
                need some assistance?
            </Link>
            <AnimatedLink text="Logout" condition={toggle} to='/onboarding'
                onClick={()=>{this.props.logout();localStorage.removeItem("userTokenFSK")}} />



            <AnimatedLink text="Profile/Settings" condition={toggle} to="/account/profile/my"/>



                </div>
                :

                <AnimatedLink condition={toggle && pathname !== "/onboarding"}
                    text="Home" to="/onboarding" timeout={200} />
                }
            </div>
            </div>
                <Route exact path="/account" render={()=>(

                    <AnimatedLink condition={toggle} text="Messages" to="/account/message" />

                    )
                } />
            <Route exact path="/account/*" render={()=>(

                    <div>
                        { pathname !== "/account/message"
                            &&
                             <AnimatedLink condition={toggle} text="Messages" to="/account/message"/>
                         }
                            { pathname !== "/account/message/new"
                                &&
                             <AnimatedLink text="New Messages" to="/account/message/new" condition={toggle} />
                             }
                    <AnimatedLink text="Job Feed" to="/account" condition={toggle} />
                    </div>
                    )
                } />


            <Route path="/onboarding" render={()=>(
            <div className="sign">
                <AnimatedLink condition={pathname !== "/onboarding/signin" && toggle}
                              to="/onboarding/signin" text="Sign in" />
                <AnimatedLink condition={pathname !== "/onboarding/signup" && toggle}
                              text="Sign up" to="/onboarding/signup" />
                <AnimatedLink condition={pathname !== "/onboarding/support" && toggle}
                              text="contact" to="/onboarding/support"/>
                 <AnimatedLink condition={pathname !== "/onboarding/blog" && toggle}
                              text="news" to="/onboarding/blog" />

                </div>
                    )} />
                <CSSTransition
                        in={importPathAspect !== "onboarding" && this.state.toggle}
                        classNames='search'
                        timeout={400}
                        unmountOnExit>
                <a  className="neuterCont" onClick={()=>{
                            this.setState({showSearch: !this.state.showSearch, showNotifBar: false});

                        }}>
                        <div className="neuter" >
                            <span role="img" aria-label="search">⚲</span>
                        </div>
                    </a>
                </CSSTransition>


                {importPathAspect !== "onboarding" && <CSSTransition
                    in={toggle}
                    classNames="search"
                    timeout={300}
                    unmountOnExit>
                    <a className="neuterCont" onClick={()=>{
                            this.setState({showNotifBar: !this.state.showNotifBar, showSearch: false})

                        }}>
                        <div style={{fontSize: "2rem"}}>
                            {joined_notifs.length > 0 && <div className="notifBubble">{joined_notifs.length}</div>}
                            <span role="img" aria-label="notifications">🔔</span>
                        </div>
                    </a>
                </CSSTransition>}

                </div>


                <div className="menuMobile" onClick={()=>{
                            const toggle = !this.state.toggle;
                            // document.body.classList.toggle('lockVert', toggle);
                            this.setState({toggle});
                        }}>
                    <div className="bar-1"></div>
                    {joined_notifs.length > 0 && <div className="notifBubble">{joined_notifs.length}</div>}
                    <div className="bar-2"></div>
                    <div className="bar-3"></div>
                </div>
                <CSSTransition
                    in={this.state.showSearch && toggle}
                    classNames='search'
                    timeout={300}
                    unmountOnExit>
                <div className="searchBar">
                    <input className="searchInput" autoFocus type="text" placeholder="search..." onChange={(e)=>{this.searchUser(e)}}/>
                    <button onClick={()=>{this.setState({showSearch: false})}}>^</button>
                    <div className="searchResultBox">
                        {this.state.searchUsers.map((u)=>(
                            <div key={u._id}>{u.username}</div>
                        ))}
                        <CSSTransition
                            in={this.state.searchBox !== ""}
                            classNames='search'
                            timeout={300}
                            unmountOnExit>
                        <div className="dropDown">
                            {(results  && results.usernameList ) && <div>username matches:</div>}
                            {(results  && results.usernameList ) ?
                                results.usernameList.map((user)=>(<Link className="searchLink"  onClick={pathname.split("/")[2] === "profile" ? ()=>{



                                    window.location.reload()

                            } : ()=>{this.setState({searchBox: "", showSearch: false})}} to={"/account/profile/" + user._id} key={user._id + "usernameList"}>{user.username}</Link>)) : ""}
                            {(results  && results.frontUserList ) && <div>front end matches:</div>}
                            {(results  && results.frontUserList ) ?
                                results.frontUserList.map((user)=>(<Link className="searchLink"  onClick={pathname.split("/")[2] === "profile" ? ()=>{

                                    //probably can remove this code

                                    window.location.reload()

                            } : ()=>{this.setState({searchBox: "", showSearch: false})}} to={"/account/profile/" + user._id} key={user._id + "frontUserList"}>{user.username} front end speciality: {user.best_front}</Link>)) : ""}
                        </div>
                    </CSSTransition>
                    </div>
                </div>

                </CSSTransition>
                <CSSTransition
                    in={this.state.showNotifBar}
                    classNames='search'
                    timeout={300}
                    unmountOnExit>
                    <ul className="notifBar">

                        {(!!narray && narray[0].length > 0) && <li><div className="notifBubble">{narray[0].length}</div><a className="notif" onClick={(e)=>{this.jobClick(e)}}>Bids</a></li>}
                        {(!!narray && narray[1].length > 0) && <li><div className="notifBubble">{narray[1].length}</div><Link className="notif" to="/account/message">New Messages</Link></li>}
                        {(!!narray && narray[2].length > 0) && <li><div className="notifBubble">{narray[2].length}</div><a className="notif" onClick={(e)=>{this.recentMessage()}}>Recent Messages</a></li>}
                        {(!!notifs && notifs.notifs_type.length > 0) && <li><a className="notif" onClick={()=>{this.props.clearNotifs()}}><span role="img" aria-label="clear notifications">🚫</span> clear</a></li>}
                        {(!!notifs && notifs.notifs_type.length > 0) && <li><a className="notif" onClick={()=>{this.setState({showNotifBar: false})}}>x close</a></li>}

                    </ul>
                </CSSTransition>

            </nav>
        )
    }
}
//TODO - above has two messages. replace one with other notifs. Add onclicks to send clearing event.
const mapStateToProps = (state) =>{
    return{
        user: state.userReducer,
        data: state.dataReducer
    }
}
const mapDispatchToProps = (dispatch) =>{
    return{
        logout: ()=> dispatch(removeUser()),
        tokenUser: ()=> dispatch(setUserFromToken()),
        getProfile: (id)=>dispatch(getProfile(id)),
        searchForUser: (partial)=>dispatch(postAuthInfo("search/user", {partial})),
        search: (partial)=>dispatch(generalSearch(partial)),
        flush: ()=>dispatch(flushResults()),
        getNotifs: ()=>dispatch(getNotifs()),
        clearNotifs: ()=>dispatch(clearNotifs()),
        getNotifsJobs: ()=>dispatch(userJobs()),
        getRecentMessages: ()=>dispatch(getRecentMessages()),
        showingRecent: (truthy)=>dispatch(showingRecent(truthy))
    }
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Navigation));
