import React, {Component} from 'react';
import "../styles/GCF.css";

const ToggleItem = ({checked, changeEvent, name, text}) =>{
    return(
        <span>
            <label className="toggle">
            <input type="checkbox" name={name} checked={checked} value={checked} onChange={changeEvent}/>
            <span className="slide" />
            </label>
              <br />{text}
            </span>
    )
}


class GoodCheapFast extends Component{

    constructor(props){
        super(props)
        this.state = {
            list: [false, false, false],
            lastCheck: null,
            text: ["good", "fast", "cheap"]
        }
    }
    componentDidMount(){
        this.props.final && this.setState({text: ["good -> skill -> quality", "fast -> skill -> effeciency", "cheap -> skill -> value"]})
        this.name = 0;
        if(!this.props.final) this.interval = setInterval(()=>{
            this.syntheticNotAll(this.name);
            this.name < this.state.list.length -1 ? this.name++ : this.name = 0;

        }, 666);
        this.props.final && this.state.list.forEach((item, i)=>{
            setTimeout(()=>{
                this.real({target:{name: i, checked: true}})
            }, 666)
        });
    }
    componentWillUnmount(){
        clearInterval(this.interval);
    }
    syntheticNotAll(name){
        const e = {target: {checked: true, name}}
        this.notAll(e);
    }
    realNotAll(e){
        clearInterval(this.interval);
        this.notAll(e);
    }
    real(e){
        const {name, checked} = e.target;
        let newList = this.state.list.slice();
        newList[name] = checked;

        this.setState({list: newList})
    }
    notAll(e){
        const {list, lastCheck} = this.state;
        const {name, checked} = e.target;
        let newList = list.slice();
        newList[name] = checked;
        const too = newList.filter((i)=>(i)).length > 2;
        if(too){
            newList[lastCheck] = false
        }
        this.setState({list: newList, lastCheck: name});
    }

    render(){
        const {list, text} = this.state;
        return(
            <div className="gfc">
                {
                    list.map((item, i)=>(
                        <ToggleItem key={text[i]} checked={item} name={i} text={text[i]} changeEvent={(e)=>{

                                this.props.final ? this.real(e) : this.realNotAll(e);

                            }} />
                    ))
                }
            </div>
        )
    }
}



export default GoodCheapFast;
