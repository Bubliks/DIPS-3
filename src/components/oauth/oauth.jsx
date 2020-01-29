import React from 'react';

import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import Cookie from '../../cookie/cookie';

import './oauth.css';
import PropTypes from "prop-types";

export default class Oauth extends React.Component {
    constructor() {
        super();

        this.cookie = new Cookie();
        this.state = {
            validation: ''
        };

        this.onSubmit = this.onSubmit.bind(this);
    }

    getDataFromQuery() {
        return window.location.search
            .replace('?','')
            .split('&')
            .reduce((query, arg) => {
                const args = arg.split('=');
                query[args[0]] = args[1];

                return query;
        }, {})
    }

    onSubmit() {
        const {
            clientId,
            clientSecret,
            redirectUrl
        } = this.getDataFromQuery();
        console.log(clientId, clientSecret, redirectUrl);

        if (!(clientId && clientSecret && redirectUrl)) {
            this.setState({
                validation: 'some values in query is empty!'
            })
        } else {
            this.setState({
                isLoading: true
            });

            const userId = this.cookie.get('user');
            const token = this.cookie.get('token');

            if (!(userId && token)) {
                this.setState({
                    validation: 'you need verification!'
                })
            } else {
                fetch('http://localhost:8009/auth/oauth',  {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': 'Bearer <'+token+'>'
                    },
                    body: JSON.stringify({
                        userId,
                        clientId,
                        clientSecret
                    })
                })
                .then(resp => {
                    if (resp.status < 300) {
                        resp.json().then(body => {
                            this.setState({
                                isLoading: false
                            });
                            window.location.replace(redirectUrl + "/?code=" + body.code);
                        });
                    } else {
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
    }

    render() {
        const {
            validation,
            isLoading
        } = this.state;

        return (
           <div className='login-page'>
               <div className='login-form'>
                   <Form noValidate>
                       <Button
                           className='login-button'
                           variant="dark"
                           type="button"
                           disabled={isLoading}
                           onClick={!isLoading ? this.onSubmit : null}>
                           {isLoading ?'...loading' : 'Click ME'}
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

Oauth.propTypes = {
    checkCookie: PropTypes.func
};
