import React, {Component} from "react";
import {connect} from "react-redux";
import {withRouter, Link} from "react-router-dom";
import "../styles/Form.css"
import {getUser, setErr} from "../store/actions/user";
import {testUser, testEmail} from "../services/api";

class Form extends Component {

    constructor(props){
        super(props);
        this.state = {
            email : "",
            password : "",
            password2: "",
            firstname: "",
            lastname: "",
            username: "",
            complete: false,
            signupInit: true,
            passErr: false,
            emailErr: false,
            passQualErr: false,
            takenEmail: false,
            takenUsername: false,
            nameErr: false,
            usernameErr: false,
            loadingLogin: false,
            check: false,
            notChecked: ""

        };
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.handleSignin = this.handleSignin.bind(this);
        this.handleSignup = this.handleSignup.bind(this);
    };
    redirectAfterAuth(data, sign){
        this.props.loginUser(data, sign);
            this.props.err === null &&
            this.setState({complete: true});


            if(this.state.complete || (this.props.err === null && !!localStorage.length)){
                this.setState({loadingLogin: true});
                setTimeout(()=>{
                    if(this.props.err !== null){
                        this.props.history.push(`/onboarding/${sign}/error`);
                        return;
                    }
                    this.props.history.push("/account");
                }, 1000);
            }else{
                let promise = new Promise((res, rej)=>{
                    let count = 10;
                    setInterval(()=>{
                        if(!!localStorage){
                            res("login successful");
                        }else{
                            count--;
                        }
                        if(count >= 0){
                            rej("the server took too long to respond");
                        }
                    }, 300);
                });
                promise.then(()=>{
                    if(localStorage.userTokenFSK === undefined){
                        this.props.history.push(`/onboarding/${sign}/error`);
                    }
                }).catch((err)=>{
                    if(!localStorage.userTokenFSK === undefined){
                        this.props.history.push(`/onboarding/${sign}/error`);
                    }
                })

            }
    }

    handleSignin(){

        const {email, password} = this.state;

        this.redirectAfterAuth({email, password}, "signin");


    }

    handleSubmit(e){
        const {isOnboarding, reset} = this.props;
        e.preventDefault();
        if(!isOnboarding){
            this.handleSignin();
            return;
        }else if(reset){
            //make request to server. I might want to not tell user if info is incorrect. not sure yet.
        }else{
            const match = this.state.password === this.state.password2;
            const validEmail = this.state.email.indexOf('@') > 0 && this.state.email.indexOf('.') > 2;
            const validPass = /\d/.test(this.state.password) && /[a-zA-Z]/.test(this.state.password) && this.state.password.length > 5;
            const takenEmail = testEmail({email: this.state.email});

            this.setState({emailErr: !validEmail});
             this.setState({passErr: !match});
             this.setState({passQualErr: !validPass});
             takenEmail.then((item)=>{

                 this.setState({takenEmail: item.taken});
                 validEmail && match && validPass && !item.taken && this.setState({signupInit: false});
             }).catch(err=>err)






        }


    }
    handleSignup(e){
        e.preventDefault();
        const reg = /^[a-zA-Z._-\s{1}\u00C6\u00D0\u018E\u018F\u0190\u0194\u0132\u014A\u0152\u1E9E\u00DE\u01F7\u021C\u00E6\u00F0\u01DD\u0259\u025B\u0263\u0133\u014B\u0153\u0138\u017F\u00DF\u00FE\u01BF\u021D\u0104\u0181\u00C7\u0110\u018A\u0118\u0126\u012E\u0198\u0141\u00D8\u01A0\u015E\u0218\u0162\u021A\u0166\u0172\u01AFY\u0328\u01B3\u0105\u0253\u00E7\u0111\u0257\u0119\u0127\u012F\u0199\u0142\u00F8\u01A1\u015F\u0219\u0163\u021B\u0167\u0173\u01B0y\u0328\u01B4\u00C1\u00C0\u00C2\u00C4\u01CD\u0102\u0100\u00C3\u00C5\u01FA\u0104\u00C6\u01FC\u01E2\u0181\u0106\u010A\u0108\u010C\u00C7\u010E\u1E0C\u0110\u018A\u00D0\u00C9\u00C8\u0116\u00CA\u00CB\u011A\u0114\u0112\u0118\u1EB8\u018E\u018F\u0190\u0120\u011C\u01E6\u011E\u0122\u0194\u00E1\u00E0\u00E2\u00E4\u01CE\u0103\u0101\u00E3\u00E5\u01FB\u0105\u00E6\u01FD\u01E3\u0253\u0107\u010B\u0109\u010D\u00E7\u010F\u1E0D\u0111\u0257\u00F0\u00E9\u00E8\u0117\u00EA\u00EB\u011B\u0115\u0113\u0119\u1EB9\u01DD\u0259\u025B\u0121\u011D\u01E7\u011F\u0123\u0263\u0124\u1E24\u0126I\u00CD\u00CC\u0130\u00CE\u00CF\u01CF\u012C\u012A\u0128\u012E\u1ECA\u0132\u0134\u0136\u0198\u0139\u013B\u0141\u013D\u013F\u02BCN\u0143N\u0308\u0147\u00D1\u0145\u014A\u00D3\u00D2\u00D4\u00D6\u01D1\u014E\u014C\u00D5\u0150\u1ECC\u00D8\u01FE\u01A0\u0152\u0125\u1E25\u0127\u0131\u00ED\u00ECi\u00EE\u00EF\u01D0\u012D\u012B\u0129\u012F\u1ECB\u0133\u0135\u0137\u0199\u0138\u013A\u013C\u0142\u013E\u0140\u0149\u0144n\u0308\u0148\u00F1\u0146\u014B\u00F3\u00F2\u00F4\u00F6\u01D2\u014F\u014D\u00F5\u0151\u1ECD\u00F8\u01FF\u01A1\u0153\u0154\u0158\u0156\u015A\u015C\u0160\u015E\u0218\u1E62\u1E9E\u0164\u0162\u1E6C\u0166\u00DE\u00DA\u00D9\u00DB\u00DC\u01D3\u016C\u016A\u0168\u0170\u016E\u0172\u1EE4\u01AF\u1E82\u1E80\u0174\u1E84\u01F7\u00DD\u1EF2\u0176\u0178\u0232\u1EF8\u01B3\u0179\u017B\u017D\u1E92\u0155\u0159\u0157\u017F\u015B\u015D\u0161\u015F\u0219\u1E63\u00DF\u0165\u0163\u1E6D\u0167\u00FE\u00FA\u00F9\u00FB\u00FC\u01D4\u016D\u016B\u0169\u0171\u016F\u0173\u1EE5\u01B0\u1E83\u1E81\u0175\u1E85\u01BF\u00FD\u1EF3\u0177\u00FF\u0233\u1EF9\u01B4\u017A\u017C\u017E\u1E93]+$/;

        const userTaken = testUser({username: this.state.username});
        userTaken.then((result)=>{
            const takenUsername = result.taken;


            const nameErr = !(this.state.firstname.length > 1 && this.state.lastname.length > 1 &&
                reg.test(this.state.firstname) && reg.test(this.state.lastname));


            const usernameErr =
            !(this.state.username.length > 2 && reg.test(this.state.username) && this.state.username.length < 12);



            if(!nameErr && !usernameErr && !takenUsername){
                const {username, password, firstname, lastname, email, check} = this.state;
                if(check){
                    this.redirectAfterAuth({username, password, firstname,lastname, email}, "signup");
                }else{
                    this.setState({notChecked: "You must agree to the terms of service."})
                }

                this.setState({takenUsername, nameErr, usernameErr});

            }
        }).catch(err=>err);
}
    handleChange(e){
        this.setState({[e.target.name]:e.target.value});
        this.props.setError(null);

    }



    render(){
        const {signupInit, check, notChecked} = this.state;
        const {reset} = this.props;
        const error = this.props.location.pathname.split("/").indexOf("error") > -1;
        return(
            <div>
                {error && <div className="errorBox">A server error occured.</div>}
                {notChecked.length > 0 && <div className="errorBox">{notChecked}</div>}
                {signupInit &&
                    <form onSubmit={this.handleSubmit}>

                {
                    this.state.takenEmail && <div className="errorBox">Email has already been used..</div>
                }
                {
                    this.props.error && <div className="errorBox">Email or password incorrect!</div>

                }
                {
                    this.state.passErr && <div className="errorBox">Passwords don't match. Please try again</div>
                }
                {
                    this.state.emailErr && <div className="errorBox">You're email address isn't valid... please try again.. </div>
                }
                {
                    this.state.passQualErr && <div className="errorBox">Passwords must be atleast 6 charaters long and contain one letter and one number...</div>
                }
             <input type="text" placeholder="email" name="email" onChange={this.handleChange} value={this.state.email} />
             {reset &&  <input placeholder="First name" name="firstname" onChange={this.handleChange} value={this.state.firstname} /> }
             {reset && <input placeholder="Last name" name="lastname" onChange={this.handleChange} value={this.state.lastname} /> }

             {!reset && <input placeholder="password" type="password" name="password" onChange={this.handleChange} value={this.state.password}/>}

            {
                this.props.isOnboarding &&



                <input placeholder="retype password" type="password" name="password2" onChange={this.handleChange} value={this.state.password2} />}

                {this.props.isOnboarding || reset ? <button className="signBtn">next</button>
                                         : <button className="signBtn">signin</button>}

            </form>

        }
        {!signupInit && <form onSubmit={this.handleSignup}>
        {
            this.state.takenUsername && <div className="errorBox">Username is taken, please select another..</div>
        }
        {
            this.state.nameErr && <div className="errorBox">Name isn't valid</div>
        }
        {
            this.state.usernameErr && <div className="errorBox">Username must be atleast 3 characters and contain only letters..</div>
        }

                <input type="text" name="firstname" placeholder="First name" onChange={this.handleChange} value={this.state.firstname}/>


                <input placeholder="surname" type="text" name="lastname" onChange={this.handleChange} value={this.state.lastname}/>


                <input placeholder="username" type="text" name="username" onChange={this.handleChange} value={this.state.username}/>
                <p>
                <input type="checkbox" value={check} name="check" onChange={(e)=>{this.setState({check: e.target.checked})}} />
                <Link to="/onboarding/tos"> I agree to the terms of service. (click to review the terms)</Link>
                </p>
            <button className="signBtn">signup</button>
        </form>}
        {this.state.loadingLogin && <div>loading...</div>}

        {!this.props.isOnboarding && <Link style={{fontSize: ".8rem",float: "right"}}  to="/onboarding/reset">forgot password</Link>}
        </div>

        )
    }
}

const mapStateToProps = (state) =>{
    const err = state.errorReducer === null ? state.errorReducer : state.errorReducer.err;
    return{
        user: state.userReducer,
        err
    };
};
const mapDispatchToProps = (dispatch) =>{
    return {


        loginUser: (data, sign) => dispatch(getUser(data, sign)),
        setError: (err) => dispatch(setErr(err))

    };
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Form));
