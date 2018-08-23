import React, { Component } from 'react';
import "../styles/Payout.css";



class Payout extends Component {
    constructor(props){
        super(props);
        this.state={
            type: "eth", //change back to bank
            routing: "",
            prevLength: 0,
            bad_routing: false,
            confirm: "",
            account: "",
            crypto_only: false,
            error: false,
            accepted: false
        }
    }
    componentDidMount(){
        this.setState({crypto_only : !!this.props.crypto_only}); //this may be unneccary and I might want to do this in the render method instead of setting it once here.
    }//what I mean is that the prop it self could proprbably be used directly.
    handleType(e){
        this.setState({type: e.target.value, account: "", confirm: ""});
    }
    checkNum(n){
        const array = Array.from(n).filter((c)=>('0123456789'.indexOf(c) !== -1));
        return array.join("");
    }
    checkHex(s){
        const S = s.toUpperCase();

        const array = Array.from(S).filter((C, i)=>('0123456789ABCDEF'.indexOf(C) !== -1 || ( C === 'X' && i === 1)));
        array[0] = "0";
        array[1] = "x";

        return array.join("");
    }
    checkSum(s){
        if(s.length === 9){
        const d = Array.from(s).map((n)=>(Number(n)));
        const bad_routing = (3* (d[0] + d[3] + d[6]) + 7* (d[1] + d[4] + d[7]) + (d[2] + d[5] + d[8])) % 10 !== 0;
        this.setState({bad_routing});
        }else{
        this.setState({bad_routing:false});
        return;
        }
    }
    verifyAccount(e, conf=false){
        if(e.target.value.length < 18){
            const value = this.checkNum(e.target.value);
            conf ? this.setState({confirm: value}) : this.setState({account: value});
        }
    }
    //If this is broken it is these two commented out pieces of code.
    // typeToLength(){
    //     const {type} = this.state;
    //     switch(type){
    //         case 'eth':
    //         return 43;
    //         case 'btc':
    //         return 36;
    //         default:
    //         return 0;
    //     }
    // }
    verifyWallet(e, conf=false){
        const {type} = this.state;
        // const length = this.typeToLength();
        if(e.target.value.length < 43 && type === "eth"){
        const account = this.checkHex(e.target.value);
        conf ? this.setState({confirm: account}) : this.setState({account});
        }else if(e.target.value.length < 35 && type === 'btc'){
            conf ? this.setState({confirm: e.target.value}) : this.setState({account: e.target.value});
        }
    }
    verifyRouting(e){
        if(e.target.value.length < 10){
            const value = this.checkNum(e.target.value);
            this.setState({routing: value});
            this.checkSum(e.target.value);
        }
    }
    focusEth(e, conf=false){
        const {confirm, account} = this.state;
        conf ? confirm.length === 0 && this.setState({confirm: "0x"}) : account.length === 0 && this.setState({account: "0x"});
    }
    submitPayment(e){
        e.preventDefault();
        const {confirm, account, routing, type} = this.state;
        if(confirm === account){
            //success
            const answer = this.props.payoutBalance(type, account, routing);
            answer.then((message)=>{
                if(message.message === "processing started"){
                    this.setState({accepted: true});
                    this.setState({error: false});
                }
            }).catch((err)=>{
                this.setState({error: true});
            })
        }else{
            //fail
            this.setState({error: true});
        }
    }

    //I will process all payouts manually for now but will automate on my own system in the future (with alerts.) It is legal and reasonable to
    //start this way. I need to verify that what ever method I use to payout won't cause additional fees.
    render(){
        const isBank = this.state.type === "bank";
        const font_change = isBank ? null : {fontSize: ".9rem"};

        return(
        <div className="paymentCont">
            {!this.state.accepted && <h2>Make sure you enter correct addresses! We are not responsible for lost payments because of incorrectly input addresses</h2>}
        {!this.state.accepted ?
           <form className="payoutForm" onSubmit={(e)=>{this.submitPayment(e)}}>
            {this.state.error && <div className="errorBox">There was an error! Make sure your both fields match and verify that everything is correct.</div>}
                <label> select transaction type: </label>
                <select onChange={(e)=>{this.handleType(e)}} value={this.state.type}>
                    {!!this.props.crypto_only === false && <option value="bank">Checking/Saving Account (ACH)</option>}
                    <option value="eth">Ethereum</option>
                    <option value="btc">Bitcoin</option>
                </select>
               {this.state.type === "bank" &&
               <input onChange={(e)=>{this.verifyRouting(e)}} value={this.state.routing} type="text" name="routing" placeholder="routing number" />}
                   {this.state.type === "btc" && <label>Base58 encoding required.</label>}
                <input onFocus={this.state.type === "eth" ? (e)=>{this.focusEth(e)}:null} spellCheck="false"
                style={font_change} type={isBank ? "password" : "text" } name="account" value={this.state.account}
                onChange={isBank ? (e)=>{this.verifyAccount(e)} : (e)=>{this.verifyWallet(e)}}
                placeholder = {isBank ? "account number" : "wallet number"} />
                <input onFocus={this.state.type === "eth" ? (e)=>{this.focusEth(e, true)}:null} spellCheck="false"
                style={font_change} type={isBank ? "password" : "text" } name="confirm" value={this.state.confirm}
                onChange={isBank ? (e)=>{this.verifyAccount(e, true)} : (e)=>{this.verifyWallet(e, true)}}
                placeholder = {isBank ? "confirm account" : "confirm wallet"} />
            <button type="submit">submit payment</button>
        </form> :
        <div>
            <h3>Your payment is processing.</h3>
            <p>Please expect up to 5 days for processing. You will be contacted with any issues. If you feel that you have made an error, please contact support immediately</p>
        </div>}
        </div>
        )
    }


}

export default Payout;
