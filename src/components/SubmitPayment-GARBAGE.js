import React, {Component} from "react";
import BrainTreeWebDropIn from "braintree-web-drop-in"
import jwtDecode from "jwt-decode";

class SubmitPayment extends Component {

    otherMeth(func){
        this.inst = func;
    }
    componentDidMount(){



        BrainTreeWebDropIn.create({
                authorization: 'sandbox_4qhxkhf6_3dq5kpzf2jb4q3bp',
                container: '#dropin-container'
        }, (err, dropinInstance)=>{
            if(err){
                console.error(err);
                return;
            }
            const triggeredSubmit = () =>{
                dropinInstance.requestPaymentMethod((err, payload)=>{
                    if(err){
                        console.error("problem: ", err);
                        return;
                    }
                    //add id to url and header with token
                    const {id} = jwtDecode(localStorage.userTokenFSK)
                    fetch(`${process.env.REACT_APP_URL}/logged/${id}/payments/post`, {
                                   method: "post",
                                   headers: {
                                       'Accept' : 'application/json',
                                       'Content-Type': 'application/json',
                                       'Authorization' : `Bearer ${localStorage.userTokenFSK}`
                                   },
                                   body: JSON.stringify({paymentMethodNonce:payload.nonce}),
                                   'Authorization' : `Bearer ${localStorage.userTokenFSK}`
                                   // mode: "cors"
                               }).then((result)=>{

                                   dropinInstance.teardown((teardownErr)=>{
                                       if(teardownErr){

                                       }else{

                                       }
                                   })
                               })
                })
            }
            //may be able to refactor this.
            this.triggeredSubmit = triggeredSubmit.bind(this);
            this.otherMeth(this.triggeredSubmit);
        })
    }

    render=()=>(



            <div id="dropin-wrapper">
                <div id="checkout-message"></div>
                <div id="dropin-container"></div>
                <button id="submit-button" onClick={(e)=>{this.inst(e)}}>Submit payment</button>
            </div>

    )
}

export default SubmitPayment;
