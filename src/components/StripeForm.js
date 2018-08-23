import React from 'react';
import {connect} from 'react-redux';
import {withRouter} from 'react-router-dom';
// import {ReactStripeElements} from 'react-stripe-elements';
import {postAuthInfo} from '../store/actions/user';

import "../styles/StripeForm.css";

import {
	CardElement,
  // CardNumberElement,
  // CardExpiryElement,
  // CardCVCElement,
  // PostalCodeElement,
  // PaymentRequestButtonElement,
  StripeProvider,
  Elements,
  injectStripe
} from "react-stripe-elements";

class _CardForm extends React.Component {

  handleSubmit(payload, amount, job, callback, submitContext){
	  const {token} = payload;
	  let answer = callback(token.id, amount, job);

	  answer.then((ans)=>{

		  if(submitContext){
			  this.props.history.push(`/account/confirmation/job/${job}`)
		  }else{
			  this.props.history.push(`/account/payment/status/${job}`);
		  }
	  }).catch((bad)=>{

	  })
	  // fetch(`${process.env.REACT_APP_URL}/test/payment`, {
		//   method: "post",
		//   headers:{
		// 	  'Accept' : 'application/json',
		// 	  'Content-Type' : 'application/json',
		// 	  'Authorization' : `Bearer ${localStorage.userTokenFSK}`
	  //
		//   },
		//   body: JSON.stringify({token, amount, job}),
		//   mode: "cors"
	  // }).then((result)=>{
		//   if(!result.ok){
		// 	  console.log("error")
		//   }
		//   console.log(result);
	  // })
  }

  render() {

    return (
      <form onSubmit={(e) => {

				  e.preventDefault();
				  // console.log("job", this.props.job)
				  this.props.stripe.createToken().then(payload => this.handleSubmit(payload, this.props.amount, this.props.job, this.props.pay, this.props.submitContext))
				  .catch((err)=>{})
			  }}>
        <CardElement />


        <button>Pay</button>
      </form>
    )
  }
}
const CardForm = withRouter(injectStripe(_CardForm));

class Checkout extends React.Component {
  render() {
    return (
      <div className="Checkout">
		  <div>secure credit card processing:</div>
        <Elements>
          <CardForm  amount={this.props.amount} job={this.props.job} pay={this.props.pay} submitContext={this.props.submitContext}/>
        </Elements>
      </div>
    )
  }
}

const StripeForm = ({amount, job, pay, submitContext}) => {
	//TODO the apiKey may need to be placed in a .env file.
	console.log(process.env.REACT_APP_STRIPE_API);
  return (
    <StripeProvider apiKey={process.env.REACT_APP_STRIPE_API}>
      <Checkout amount={amount} job={job} pay={pay} submitContext={submitContext}/>
    </StripeProvider>
  )
}

const mapDispatchToProps = (dispatch) =>{
	return{
		pay: (source, amount, job) =>dispatch(postAuthInfo("/payment", {source, amount, job}, "post"))
	}
}

export default withRouter(connect(null, mapDispatchToProps)(StripeForm))
