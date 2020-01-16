import React from 'react';
import { Router, Route } from 'react-router-dom';
import { history } from './history/history';

import Navbar from 'react-bootstrap/Navbar'
import Nav from 'react-bootstrap/Nav'
import Alert from 'react-bootstrap/Alert'

import Login from './components/login/login';
import Register from './components/register/register';
import Users from './components/users/users';
import Tasks from './components/tasks/tasks';
import TasksEvents from './components/tasks-events/tasks-events';

import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';

// function Alert() {
//
//     return <Button onClick={() => setShow(true)}>Show Alert</Button>;
// }

class App extends React.Component {
    constructor() {
        super();

        this.state = {
            errorMsg: ''
        };

        this.onError = this.onError.bind(this);
        this.closeError = this.closeError.bind(this);
    }

    onError(errorMsg) {
        if (errorMsg !== this.state.errorMsg) {
            this.setState({
                errorMsg
            })
        }
    }

    closeError() {
        this.setState({
            errorMsg: ''
        })
    }

    renderError() {
        const {
            errorMsg
        } = this.state;

        if (errorMsg) {
            return (
                <Alert variant="danger" onClose={this.closeError} dismissible>
                    <Alert.Heading>Oh, Something went wrong!</Alert.Heading>
                    <p>{errorMsg}</p>
                </Alert>
            );
        }
    }

    render() {
        return (
            <div className="App">
                {this.renderError()}
                <Navbar bg="dark" variant="dark">
                    <Navbar.Brand href="/home">DIPS</Navbar.Brand>
                    <Nav className="mr-auto">
                        <Nav.Link href="/home">Home</Nav.Link>
                        <Nav.Link href="/login">Login</Nav.Link>
                        <Nav.Link href="/register">Register</Nav.Link>
                        <Nav.Link href="/tasks">Tasks</Nav.Link>
                        <Nav.Link href="/tasksevents">All</Nav.Link>
                    </Nav>
                </Navbar>
                <Router history={history}>
                    <Route exact path="/login" component={Login} />
                    <Route exact path="/register" component={Register} />
                    <Route
                        exact
                        path="/home"
                        component={() => <Users onError={this.onError} />} />
                    <Route
                        exact
                        path="/tasks"
                        component={() => <Tasks onError={this.onError} />} />
                    <Route
                        exact
                        path="/tasksevents"
                        component={() => <TasksEvents onError={this.onError} />} />
                </Router>
                <div className="footer-copyright text-center py-3" />
            </div>
        )

    }
}

export default App;
