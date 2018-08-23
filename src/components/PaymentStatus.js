import React, {Component} from "react";
import {withRouter} from "react-router-dom"
import { CSSTransition } from "react-transition-group";


import "../styles/PaymentStatus.css";

class PaymentStatus extends Component {

    constructor(props){
        super(props);

        this.state = {
            loading : true,
            pop_up : false
        }
    }

    componentDidMount(){

        setTimeout(()=>{
            this.job_id = this.props.location.pathname.split("/")[4];
            this.props.getJob(this.job_id);
            setTimeout(()=>{
                this.setState({loading: false})
            }, 498)
        }, 1501)



    }
    navigate(option){
        if(option){
            this.props.history.push(`/account/confirmation/job/${this.job_id}`);
        }else{
            this.props.history.push(`/account/job/${this.job_id}`)
        }
        return;
    }


    render(){


        const {selectJob} = this.props.jobInfo !== null && this.props.jobInfo;

        const {verified} = selectJob ? selectJob : {verified: false};
        return(
            <div className="Status">
            {this.state.loading ?
            <div>loading...</div>
            :
            <div> {verified ? <div style={{color: "green"}}>job is verified</div> : <div style={{color: "red"}}>job is not verified</div>}

            {(verified && !!selectJob.accepted_bid) && <button onClick={(e)=>{
                        this.setState({pop_up: true});
                    }}>Job is finished</button>}
                <button onClick={(e)=>{
                        this.navigate(false)
                }}>Return to job profile</button>
            </div>}
            <CSSTransition
                in={this.state.pop_up}
                timeout={300}
                classNames="accept"
                unmountOnExit>
                <div className="pop_up"><button className="x" style={{color: "red"}}
                    onClick={(e)=>{this.setState({pop_up: false})}}>x</button>Are you sure you want to close out the job? <button
                    onClick={(e)=>{this.navigate(true)}}>yes</button></div>
            </CSSTransition>
            </div>
        )
    }
}


export default withRouter(PaymentStatus);
