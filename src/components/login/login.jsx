import React from 'react';

import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import Cookie from '../../cookie/cookie';

import './login.css';
import PropTypes from "prop-types";
import Tasks from "../tasks/tasks";

export default class Login extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            name: '',
            password: '',
            validation: '',
            isLoading: false,

        };

        this.cookie = new Cookie();

        this.onSubmit = this.onSubmit.bind(this);
        this.onChangeValue = this.onChangeValue.bind(this);
    }

    onChangeValue(name) {
        return event => {
            const value = event.target.value;
            this.setState({
                [name]: value,
                validation: ''
            });
        }
    }

    onSubmit() {
        const {
            name,
            password
        } = this.state;

        if (!name || !password) {
            this.setState({
                validation: 'Oauth or password is empty!'
            })
        } else {
            this.setState({
                isLoading: true
            });

            fetch('http://localhost:8009/auth/auth',  {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    name,
                    password
                })
            })
            .then(resp => {
                if (resp.status < 300) {
                    // eslint-disable-next-line no-restricted-globals
                    resp.json().then(data => {
                        this.cookie.set('user', data.userId);
                        this.cookie.set('token', data.session.token);
                        this.props.checkCookie();
                    });
                } else {
                    console.log(resp);
                    resp.json().then(error => (error.message)).then(validation => {
                        this.setState({
                            isLoading: false,
                            validation
                        })
                    });
                }
            });
        }
    }

    render() {
        const {
            validation,
            name,
            password,
            isLoading
        } = this.state;

        return (
           <div className='login-page'>
               <div className='login-form'>
                   <Form noValidate>
                       <Form.Group controlId="formBasicEmail">
                           <Form.Label>Name</Form.Label>
                           <Form.Control
                               required
                               type="text"
                               placeholder="Enter usernane"
                               value={name}
                               onChange={this.onChangeValue('name')}/>
                       </Form.Group>
                       <Form.Group controlId="formBasicPassword">
                           <Form.Label>Password</Form.Label>
                           <Form.Control
                               required
                               type="password"
                               placeholder="Password"
                               onChange={this.onChangeValue('password')}
                               value={password}/>
                       </Form.Group>
                       <Button
                           className='login-button'
                           variant="dark"
                           type="button"
                           disabled={isLoading}
                           onClick={!isLoading ? this.onSubmit : null}>
                           {isLoading ? 'Loading...' : 'Login'}
                       </Button>
                       {validation && (
                           <Form.Text className="login-error">
                               {validation}
                           </Form.Text>
                       )}
                   </Form>
               </div>
           </div>
        );
    }
}

Login.propTypes = {
    checkCookie: PropTypes.func
};
