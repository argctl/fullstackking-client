import React, {Component} from "react";
import {Route, Link} from "react-router-dom";
import Form from "../components/Form";
import Redirecter from "./Redirecter";
import Support from "../components/Support";
import GoodCheapFast from "../components/GoodCheapFast";
import ChangePass from "../components/ChangePass";
import Reset from "../components/Reset";
import {CSSTransition} from "react-transition-group"
import PrivAndTOS from "../components/PrivAndTOS"
import Blog from "../components/Blog";

import "../styles/ProspectView.css";

class ProspectView extends Component{
    constructor(props){
        super(props);
        this.state={
            better: false
        }
    }
    render(){
        return(
            <div className="prospectView">

                {!!localStorage.userTokenFSK && <Redirecter/>}

            <Route exact path="/onboarding" render={()=>(
                    <div className="welcomeView">
                    <h1 style={{opacity: "1.0"}}>Welcome to the best freelancing site made for developers!</h1>
                    <div className="infoBox">
                    <div>
                    <p>Fullstackking is built specifically for, well, fullstack developers.</p>
                    <p> We want to cultivate an environment friendly towards those who can "do it all".                    </p>
                    <p>Not only that, but we hope to provide tools that will help you find and build a team to accomplish any task.                    </p>
                    <h3>
                        Level up your freelancing and join us in building a coding conducive environment.                    </h3>
                </div>
                    <div className="MainPane">
                        <h1>
                        We don't offer upgrades and we don't plan to.
                        </h1>
                        <h2>Other sites want to be paid off. We only celebrate those who can do and do well. </h2>
                        <h3>We don't take bribes...</h3>
                        <Link to="/onboarding/fees">our fee schedule</Link>
                        <p>
                                Instead of offering upgrades, we offer an opportunity. Help with our project by contributing to our open source project. Show your skills by helping fullstackking.com or our sister site gitarg.com and we will help you by featuring you based on the skills you exhibited. You don't have to pay to take a test that may not truly show skill, and you can productively contribute to our community. We recognize those with skill.                        </p>
                        </div>
                        <div>
                            <h3>We know the reality...</h3>
                            <CSSTransition
                                in={!this.state.fire}
                                classNames="better"
                                timeout={400}
                                unmountOnExit>
                            <GoodCheapFast />
                            </CSSTransition>
                            <CSSTransition
                                in={this.state.better}
                                classNames='better'
                                timeout={400}
                                unmountOnExit>
                            <GoodCheapFast final/>
                            </CSSTransition>
                            {!this.state.better ? <button style={{color: "white", borderRadius: "10px", cursor: "pointer"}}
                                onClick={(e)=>{
                                    this.setState({fire: true});
                                    setTimeout(()=>{
                                        this.setState({better: true});
                                        setTimeout(()=>{
                                            this.setState(({better: false}));
                                            setTimeout(()=>{
                                                this.setState({fire: false})
                                            }, 400);
                                        }, 10000);
                                    }, 400)
                                                            }}>can we make it better?</button>
                                                        : <div>Anything -> Skill -> Better <p>Skill is valued here</p> </div>}
                        </div>
                </div>
                </div>
                    )} />
        <Route exact path="/onboarding/signin" render={()=>(
                        <Form />
                        )} />
        <Route exact path="/onboarding/signin/error" render={()=>(
                            <Form error="Unauthorized" />
                            )} />
                        <Route exact path="/onboarding/signup*" render={()=>(

                                <Form isOnboarding />
                             )} />
                         <Route exact path="/onboarding/fees" render={()=>(
                            <div><h2>10% on each job, one time.</h2>
                                 <p>(yep... only one page with one sentence. Keeping it simple is the best way to stand out of your way..)</p>
                                 <p>As a project that is open to the community, we're open to explain our fee. Every card transaction has a fee of 2 - 3 percent.
                                 We also have to manually review transactions for fraud and to verify payout which requires skilled labor. The site itself requires income for maintenance, and
                                we don't accept monetary donations to support the operation of our servers or staff. We are not non-profit, however the site was made primarly to serve the purpose of
                                supporting a community of freelancers. Any financial gain from the project is secondary to the development of this website or gitarg.com</p>
                                 <p>Also, cryptocurrency payouts are sent at dollar value at time of sending, not at time or request. We prioritize
                                 cryptocurrency payouts as much as possible.</p>
                    </div>
                         )} />
                     <Route exact path="/onboarding/support" render={()=>(
                             <Support logged={false}/>
                     )} />
                 <Route exact path="/onboarding/reset/*" render={()=>(
                         <ChangePass reset />
                     )} />
                 <Route exact path="/onboarding/reset" component={Reset} />
                 <Route exact path="/onboarding/tos" component={PrivAndTOS} />
                 <Route exact path="/onboarding/blog" component={Blog} />
                             </div>
        )
    }
}

export default ProspectView;
