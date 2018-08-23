import React, {Component} from 'react';
import {withRouter} from 'react-router-dom';
import {CSSTransition} from 'react-transition-group';

import StripeForm from "./StripeForm";

import "../styles/JobPayments.css"

class JobPayments extends Component{

constructor(props){
    super(props);
    this.state = {
        attempt: false,
        pay_the_rent: false
    }
}
componentDidMount(){
    //I can avoid this sometimes by testing for it first if I use the redux store directly when I push history here from jobform.
    this.props.getJob(this.props.location.pathname.split("/")[4]);
}

render(){
    //well fucking see if this still works tomorrow considering it everything only works for a day then breaks. fuck all of you.
    const {amount} = (this.props.jobViewInfo && this.props.jobViewInfo.selectJob) ? this.props.jobViewInfo.selectJob : {amount: null, job: null};
    const job = this.props.location.pathname.split("/")[4];
    const displayAmount = amount ? parseFloat(amount).toFixed(2): "0.00";

    return(
        <div className="paymentsCont">
            {this.state.attempt && <div className="fauxLink"><h2>Payment needed!</h2><a  onMouseEnter={(e)=>{this.setState({pay_the_rent: true})}} onMouseLeave={(e)=>{this.setState({pay_the_rent: false})}}>Why is it required?</a></div>}

            <CSSTransition
                in={this.state.pay_the_rent}
                timeout={200}
                classNames="info"
                unmountOnExit>
                <div className="pop_up">We need to pay our rent... It's as simple as that. Our competetors are really good at nickling and diming, we just ask you to help make our transactions and market place more reliable by ceding payments to us. Thank you!</div>
            </CSSTransition>
            <div>Payment for <div className="amountCont">$ {displayAmount}</div></div>
            <h2>Things to note:</h2>
            <ol>
            <li>
        We guarentee both you and our freelancers.
            </li>
            <li>
                Refunds for unfished work are available.
            </li>
            <li>
        Why don't we process payments immediantly? Each transaction is personally reviewed for fraud.
            </li>
            <li>
        All transactions are reviewed. If you feel you were not satisfied by the work given to you, we will fully refund (pending transaction fees from our financial processing firm. There are usually none)
        or directly contract the work to the group that built this site, also pending your approval of the product provided.
            </li>
            </ol>
    <StripeForm submitContext={this.state.attempt} amount={amount} job={job} />

        </div>
    )

}

}




export default withRouter(JobPayments);
