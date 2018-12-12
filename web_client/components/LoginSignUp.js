import React from 'react';
import { Link, Redirect, withRouter } from 'react-router-dom';

var Config = require('Config');

class LoginSignUp extends React.Component {
    constructor(props) {
        super(props);
    }
    state = {
        username: "",
        password: "",
        repassword: "",
        email: "",
        errors: {}
    }

    handleValidation() {
        let fields = this.state;
        let errors = {};
        let formIsValid = true;
        console.log(fields['username']);
        if (!fields["username"]) {
            formIsValid = false;
            errors["username"] = "Name field cannot be empty";
        }


        if (!fields["email"]) {
            formIsValid = false;
            errors["email"] = "Email field cannot be empty";
        }

        if (typeof fields["email"] !== "undefined" && !fields["email"] === false) {
            let lastAtPos = fields["email"].lastIndexOf('@');
            let lastDotPos = fields["email"].lastIndexOf('.');

            if (!(lastAtPos < lastDotPos && lastAtPos > 0 && fields["email"].indexOf('@@') === -1 && lastDotPos > 2 && (fields["email"].length - lastDotPos) > 2)) {
                formIsValid = false;
                errors["email"] = "Email is not valid";
            }
        }
        if( fields['password'] != fields['repassword']){
            errors["repassword"] = "Retype password doesn't match!";
            formIsValid = false;
        }
        this.setState({ errors: errors });
        console.log(formIsValid)
        return formIsValid;
    }

    handleSaveLogin(token, username, is_staff) {
        localStorage.setItem('token', token);
        localStorage.setItem('username', username);
        localStorage.setItem('is_staff', is_staff);
        this.props.setLoginState(true, username, is_staff.toString());
        this.props.history.push("/");
        window.location.reload();
    }

    handle_login = (e, data) => {
        e.preventDefault();

        fetch(Config.serverUrl + '/token-auth/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        })
            .then(res => res.json())
            .then(
                (result) => {
                    if (!('non_field_errors' in result)) {
                        this.handleSaveLogin(result.token, result.user.username, result.user.is_staff);
                    }
                    else {
                        this.setState({
                            errors: { login: "Wrong username or password" }
                        });
                    }
                },
                (error) => {
                    this.setState({
                        errors: { login: "Wrong username or password" }
                    });
                }

            );

    };

    handle_signup = (e, data) => {
        e.preventDefault();
        if (this.handleValidation()) {
            fetch(Config.serverUrl + '/profile/api/register/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(data)
            })
                .then(res => res.json())
                .then(json => {
                    console.log(json);
                    if ('username' in json) {
                        this.setState({
                            errors: { signup: json['username'][0] }
                        });
                    }
                    else {
                        this.handleSaveLogin(json['user']['token'], json['user']['username'], 
                                             json['user']['is_staff']);
                    }
                });
        }
    };

    render() {

        return (

            <div>
                <div id='registration'>
                    <h3>REGISTRATION</h3>
                    <br></br>
                    <form onSubmit={e => this.handle_signup(e, this.state)} >
                        <span style={{ color: "red" }}>{this.state.errors["signup"]}</span>

                        <div className='inputs'>
                            <input id='reusername' placeholder="Type username here.."
                                onChange={e => this.setState({ username: e.target.value })} />
                            <br></br>
                            <span style={{ color: "red" }}>{this.state.errors["username"]}</span>
                        </div>

                        <div className='inputs'>
                            <input id='reemail' placeholder="Type email here.."
                                onChange={e => this.setState({ email: e.target.value })} />
                            <br></br>
                            <span style={{ color: "red" }}>{this.state.errors["email"]}</span>
                        </div>

                        <div className='inputs'>
                            <input id='repassword' placeholder="Type password" type='password'
                                onChange={e => this.setState({ password: e.target.value })} />
                                <br></br>
                            <span style={{ color: "red" }}>{this.state.errors["password"]}</span>
                        </div>

                        <div className='inputs'>
                            <input id='retypepass' placeholder="Retype password" type='password'
                            onChange={e => this.setState({ repassword: e.target.value })}  />
                            <br></br>
                            <span style={{ color: "red" }}>{this.state.errors["repassword"]}</span>

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

                    <form onSubmit={e => this.handle_login(e, this.state)} >
                        <span style={{ color: "red" }}>{this.state.errors["login"]}</span>

                        <div className='inputs'>
                            <input id='username' placeholder="Type username.."
                                onChange={e => this.setState({ username: e.target.value })} />
                        </div>
                        <div className='inputs'>
                            <input id='email' placeholder="Type password.." type='password'
                                onChange={e => this.setState({ password: e.target.value })} />
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


export default withRouter(LoginSignUp);