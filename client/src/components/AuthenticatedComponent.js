import React,{ Component } from 'react';
import { withRouter } from 'react-router-dom';
import axios from 'axios'

class AuthenticatedComponent extends Component{
    constructor(props){
        super(props);

        this.state ={
            //authUser: [ 
              //  {
                    name: '',
                    counter: ''
                //}
            //]
        }
    };
    
    componentDidMount(){
        //console.log('in ComponentDidMount1');
        const jwt = localStorage.getItem('cool-jwt')//getJwt();
        console.log('in ComponentDidMount2');
        console.log(jwt);
        if(!jwt)
            this.props.history.push('/user/Login');
        axios.get('/user/current/', { headers: { Authorization: `Bearer ${jwt}`} })
        .then( res => {
            console.log(res.data.counter);
            //const cnt =(res.data =>  { obj.couter});
            this.setState({
            name: res.data.name,
            counter: res.data.counter
            })
            console.log('after current request');
            
        }
        ).catch(err => {
            localStorage.removeItem('cool-jwt')
            console.log(err)
        })
    }
    render(){
        if (this.state === undefined){
            return(
                <div><h1>Loading...</h1></div>
            );
        }
        return(
            //const user1;
            <div>
              <label>User Name= {this.state.name} </label>
              <br></br>
              <label>Current Integer= {this.state.counter} </label>
            </div>
        );
    }
} 
export default AuthenticatedComponent;
//export default withRouter(AuthenticatedComponent);