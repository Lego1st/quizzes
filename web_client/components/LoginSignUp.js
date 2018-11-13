import React from 'react';
import {Link,Redirect} from 'react-router-dom';


class LoginSignUp extends React.Component {
    constructor(props){
		super(props);
    }
    state = {
        username: "",
        password: "",
        email: "",
    }
    onSubmit = e => {
        e.preventDefault();
        this.props.history.push('/home');
    }
    render() {

        return (

            <div>
                <div id='registration'>
                    <h3>REGISTRATION</h3>
                    <br></br>
                    <form onSubmit={this.onSubmit} >
                        <div className='inputs'>
                            <input id='reusername' placeholder="Type username here.."  
                                   onChange={e => this.setState({username: e.target.value})}></input>
                        </div>

                        <div className='inputs'>
                            <input id='reemail' placeholder="Type email here.."
                                   onChange={e => this.setState({email: e.target.value})}></input>
                        </div>

                        <div className='inputs'>
                            <input id='repassword' placeholder="Type password" type='password'
                                   onChange={e => this.setState({password: e.target.value})}></input>
                        </div>

                        <div className='inputs'>
                            <input id='retypepass' placeholder="Retype password"></input>
                        </div>

                        <div className='inputs'>
                            <button className='btn-submit' id='registerbt'> Register</button>
                        </div>
                    </form>

                </div>

                <div id='split'>
                    <h3 id="middle-or"> OR </h3>
                </div>

                <div id='login'>
                    <h3>LOGIN</h3>
                    <br></br>

                    <form onSubmit={this.onSubmit} >
         
                        <div className='inputs'>
                            <input id='username' placeholder="Type username.."
                                   onChange={e => this.setState({username: e.target.value})}></input>
                        </div>
                        <div className='inputs'>
                            <input id='email' placeholder="Type password.." type='password'
                                 onChange={e => this.setState({password: e.target.value})}></input>
                        </div>

                        <div className='inputs'>
                            <button className='btn-submit' id='loginbt'> 
                            
                            Login</button>
                        </div>
                    </form>
                </div>

            </div>
        );

    }
}


export default LoginSignUp;