import React, {Component} from 'react';

import "../styles/Blog.css";

class Blog extends Component{
    constructor(props){
        super(props);
        this.state={
            error: "",
            blogs: []
        }
    }
    componentDidMount(){
        fetch(process.env.REACT_APP_URL + "/blogs", {
            method: "get",
            headers: {
                'Accept' : 'application/json',
                'Content-Type' : 'application/json'
            },
            mode: "cors"
        }).then((result)=>{
            if(!result.ok){
                this.setState({error: "server error..."});
            }
            return result.json()
        }).then((blogs)=>{
            this.setState({...blogs, error: ""});
        }).catch((err)=>{
            this.setState({error: "server error..."})
        })
    }
    render(){
        const {blogs, error} = this.state;

        const nolo = error.length > 0 ? error : "loading...";
        return(
            <div className="blogCont">
            <h1>The Fullstackking Blog</h1>
            { blogs.length > 0 ?
                blogs.map((blog, index)=>{
                    const {title, date, content} = blog;
                    console.log("here", title);
                    return(
                        <div className="blogPost" key={index}>
                        <h3> {title} </h3>
                        <p> {date} </p>
                        <div> {content.map((para,index)=>(<p key={index}>{para}</p>))} </div>
                        </div>
                    )
                }) : nolo
            }
            </div>
        )
    }
}

export default Blog;
