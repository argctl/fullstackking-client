import React, {Component} from 'react';

class SubmitPayment extends Component{

    constructor(props){
        super(props);
        this.state = {
            ok: true,
            timeSet: false,
            timeDone: false,
            date: "",
            lengthTest: 0,
            cvv: "",
            card: ""
        }
        this.testBackspace = this.testBackspace.bind(this);
    }

    validate_card_num(e){

        this.timeout && clearTimeout(this.timeout)

        this.timeout = setTimeout(()=>{
            this.setState({timeDone: true})
        }, 2000);

        let nCheck = 0, nDigit = 0, bEven = false;
        if(/[^0-9-\s]+/.test(e.target.value)){
            this.setState({ok: false});
            return this.state.ok;
        }else{
            this.setState({card: e.target.value})
        }
        const value = Array.from(e.target.value.replace(/\D/g, ""));

        value.forEach((c)=>{
            nDigit = parseInt(c, 10);
            if(bEven){
                if((nDigit *= 2) > 9) nDigit -=9;
            }
            nCheck += nDigit;
            bEven = !bEven;

        })

        this.setState({ok: ((nCheck % 10)===0)});
        return this.state.ok
    }
    validate_date(e){
        if(e.target.value.length <6 && !/[^0-9-\s]+/.test(e.target.value[e.target.value.length -1])){
        this.setState({date: e.target.value, lengthTest: e.target.value.length});
        e.target.value.length === 2 && this.setState({date: e.target.value + "/"});
    }


    }
    testBackspace(e){
        if (e.keyCode === 8) {
            e.preventDefault();
            this.setState({date: ""});
        }else if(e.keyCode === 191){
            e.preventDefault();
        }
    }
    handleSubmit(e){

    }
    validate_cvv(e){
        if(e.target.value.length < 5 && !/[^0-9-\s]+/.test(e.target.value)){
            this.setState({cvv: e.target.value});
        }else if(/[^0-9-\s]+/.test(e.target.value)){
            this.setState({cvv: ""})
        }
    }
    render(){

        let dateErr = false;
        const dateStrings = this.state.date.length === 5 && this.state.date.split("/");
        const dateValues = dateStrings && dateStrings.map((value)=>(parseInt(value, 10)));
        if(dateValues){
            const d = new Date();
            const month = d.getMonth() + 1;
            const year = d.getFullYear() - 2000;
            dateErr = dateValues[0] > month && dateValues[1] >= year && (dateValues[0] > 0 && dateValues[0] < 13) ? false : true;
        }


        return(
            <form onSubmit={(e)=>{this.handleSubmit(e)}} className="creditCardForm">
            {(this.state.timeDone && !this.state.ok) && <div className="errorBox">Invalid credit card number</div>}
            {dateErr && <div className="errorBox"> Ivalid date </div>}
            <input onChange={(e)=>{this.validate_card_num(e)}} value={this.state.card} placeholder="card number..." type="text" />
            <input placeholder="cvv" value={this.state.cvv} onChange={(e)=>{this.validate_cvv(e)}}  type="text" />
            <input placeholder="exp...MM/YY" value={this.state.date} onKeyDown={this.testBackspace} onChange={(e)=>{this.validate_date(e)}}/>
            <div><button>skip</button><button>submit</button></div>
            </form>
        )
    }
    }

export default SubmitPayment;
