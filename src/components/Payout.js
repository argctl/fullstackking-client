import React, { Component } from 'react';
import "../styles/Payout.css";


//fix the bitcoin form


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
            wallet: "",
            cwallet: "",
            crypto_only: false
        }
    }
    componentDidMount(){
        this.setState({crypto_only : !!this.props.crypto_only}); //this may be unneccary and I might want to do this in the render method instead of setting it once here.
    }//what I mean is that the prop it self could proprbably be used directly.
    handleType(e){
        const {wallet, cwallet} = e.target.value === "btc" ? {wallet: "", cwallet: ""} : {wallet: "0x", cwallet: "0x"};
        this.setState({type: e.target.value, wallet, cwallet});
    }
    checkNum(n){
        const array = Array.from(n).filter((c)=>('0123456789'.indexOf(c) !== -1));
        return array.join("");
    }
    checkHex(s){
        const S = s.toUpperCase();

        const array = Array.from(S).filter((C)=>('0123456789ABCDEF'.indexOf(C) !== -1));
        // array.forEach((c)=>{console.log('0123456789ABCDEF'.indexOf(c)!== -1)})
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
    verifyAccount(e, confirm=false){
        if(e.target.value.length < 18){
            const value = this.checkNum(e.target.value);
            confirm ? this.setState({confirm: value}) : this.setState({account: value});
        }
    }
    typeToLength(){
        const {type} = this.state;
        switch(type){
            case 'eth':
            return 43;
            case 'btc':
            return 36;
        }
    }
    verifyWallet(e, confirm=false){
        const {type} = this.state;
        const length = this.typeToLength();
        if(e.target.value.length < 43){
        const wallet = this.checkHex(e.target.value);
        confirm ? this.setState({cwallet: wallet}) : this.setState({wallet});
        }
    }
    verifyRouting(e){
        if(e.target.value.length < 10){
            const value = this.checkNum(e.target.value);
            this.setState({routing: value});
            this.checkSum(e.target.value);
        }
    }
    focusEth(e, confirm=false){
        confirm ? this.setState({cwallet: "0x"}) : this.setState({wallet: "0x"});
    }

    //I will process all payouts manually for now but will automate on my own system in the future (with alerts.) It is legal and reasonable to
    //start this way. I need to verify that what ever method I use to payout won't cause additional fees.
    render(){
        const isBank = this.state.type === "bank";
        const font_change = isBank ? null : {fontSize: ".9rem"};

        return(
        <div className="paymentCont">
            <form className="payoutForm">
                <label> select transaction type: </label>
                <select onChange={(e)=>{this.handleType(e)}} value={this.state.type}>
                    {!!this.props.crypto_only === false && <option value="bank">Checking/Saving Account (ACH)</option>}
                    <option value="eth">Ethereum</option>
                    <option value="btc">Bitcoin</option>
                </select>
               {this.state.type === "bank" &&
               <input onChange={(e)=>{this.verifyRouting(e)}} value={this.state.routing} type="text" name="routing" placeholder="routing number" />}
                <input onFocus={this.state.type === "eth" ? (e)=>{this.focusEth(e)}:null} spellCheck="false"
                style={font_change} type={isBank ? "password" : "text" } name="account" value={isBank ? this.state.account : this.state.wallet}
                onChange={isBank ? (e)=>{this.verifyAccount(e)} : (e)=>{this.verifyWallet(e)}}
                placeholder = {isBank ? "account number" : "wallet number"} />
                <input onFocus={this.state.type === "eth" ? (e)=>{this.focusEth(e, true)}:null} spellCheck="false"
                style={font_change} type={isBank ? "password" : "text" } name="confirm" value={isBank ? this.state.confirm : this.state.cwallet}
                onChange={isBank ? (e)=>{this.verifyAccount(e, true)} : (e)=>{this.verifyWallet(e, true)}}
                placeholder = {isBank ? "confirm account" : "confirm wallet"} />
            </form>
        </div>
        )
    }


}

export default Payout;
