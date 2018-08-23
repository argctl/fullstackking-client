import React, {Component} from 'react';
import {withRouter} from "react-router-dom";
import JobPayments from "./JobPayments";
import "../styles/JobForm.css";

class JobForm extends Component{

    constructor(props){
        super(props);
        this.state = {
            info: { title: "",
                    front: "",
                    back: "",
                    require: false,
                    description: "",
                    contract: "project",
                    amount: ""},
                    err: null,
                    payments: false
        }
    }
    componentDidMount(){

    }

    handleChange(e){
        this.setState({info: {...this.state.info, [e.target.name] : e.target.value}});
    }
    handleCheck(e){
        this.setState({info:{...this.state.info, require: e.target.checked}})
    }
    submitJob(e){
        e.preventDefault();

        try{
            const answer = this.props.createJob(this.state.info);
            answer.then((job)=>{

                this.props.history.push(`/account/payments/job/${job.id}`);


            }).catch((error)=>{
                this.setState({err: true});
            })
        }catch(err){
            return err;
        }
         //this is really bad and I have no idea why this is this way. I'm sure I made this differently. fuck you whoever changed this.




    }

    render(){
        let {title, front, back, require, description, contract, amount} = this.state.info;


        return(
            <div className="jobFormWrapper">
                {!this.state.payments ?
            <form className="jobForm" onSubmit={(e)=>{this.submitJob(e)}}>
            {this.state.err !== null && <div className="errorBox">
            Please Fill out the entire form... Job description needs 100-5000 characters and title 10-50. All fields are required..</div>}

            <input placeholder="Title" type="text" name="title" value={title} onChange={(e)=>{this.handleChange(e)}}/>


            <input placeholder="Front end" type="text" name="front" value={front} onChange={(e)=>{this.handleChange(e)}}/>


            <input placeholder="Back end" type="text" name="back" value={back} onChange={(e)=>{this.handleChange(e)}}/>

            <label>
            Is this configuration required?
            <input type="checkbox" name="required" value={require} onChange={(e)=>{this.handleCheck(e)}} />
            </label>
            <label>Contract type:
            <select className="selectBox" name="contract"  value={contract} onChange={(e)=>{this.handleChange(e)}}>

                <option value="hour">per hour</option>
                <option value="portion">per completed portion</option>
                <option value="project">entire project</option>
            </select>
            </label>
            <input type="number" placeholder="Payout Amount" step="100" name="amount" value={amount} onChange={(e)=>{this.handleChange(e)}}/>
            <textarea className="descriptionJobForm" placeholder="Description" type="text" name="description" value={description} onChange={(e)=>{this.handleChange(e)}} />

            <button>add job</button>
            </form>
            :
            <JobPayments/>

                }
            </div>
        )
    }
}


export default withRouter(JobForm);
