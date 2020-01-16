import React from 'react';
import PropTypes from "prop-types";

import Table from 'react-bootstrap/Table';
import Form from 'react-bootstrap/Form';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
import Button from 'react-bootstrap/Button';

import './tasks-events.css';

export default class TasksEvents extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            name: '',
            data: [],
            validation: '',
            isLoading: false,
            isLoaded: false
        };

        this.onSubmit = this.onSubmit.bind(this);
        this.onConvertToEvent = this.onConvertToEvent.bind(this);
        this.onConvertToTask = this.onConvertToTask.bind(this);
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
            name
        } = this.state;

        if (!name) {
            this.setState({
                validation: 'is empty!'
            })
        } else {
            this.setState({
                isLoading: true
            });

            fetch('http://localhost:8000/api/allEventsAndTasks',  {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    name
                })
            })
            .then(resp => {
                console.log(resp);
                if (resp.status === 200) {
                    resp.json().then(data => {
                        this.setState({
                            isLoading: false,
                            isLoaded: true,
                            data
                        })
                    });
                } else {
                    resp.json().then(error => (error.message)).then(validation => {
                        this.setState({
                            isLoading: false,
                            validation
                        });

                        this.props.onError(validation);
                    });

                }
            });
        }
    }

    onConvertToEvent(item) {
        return () => {
            this.setState({
                isLoading: true
            });

            fetch('http://localhost:8000/api/convertTaskToEvent',  {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    name: this.state.name,
                    id: item.id,
                    title: item.title,
                    description: item.description
                })
            })
            .then(resp => {
                console.log(resp);
                if (resp.status === 200) {
                    this.setState({
                        isLoading: false,
                        validation: ''
                    });
                    // eslint-disable-next-line no-restricted-globals
                    location.href = '/tasksevents';
                } else {
                    resp.json().then(error => (error.message)).then(validation => {
                        this.setState({
                            isLoading: false,
                            validation
                        });

                        this.props.onError(validation);
                    });

                }
            });
        };
    }

    onConvertToTask(item) {
        return () => {
            this.setState({
                isLoading: true
            });

            fetch('http://localhost:8000/api/convertEventToTask',  {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    name: this.state.name,
                    id: item.id,
                    title: item.title,
                    description: item.description
                })
            })
            .then(resp => {
                console.log(resp);
                if (resp.status === 200) {
                    this.setState({
                        isLoading: false,
                        validation: ''
                    });
                    // eslint-disable-next-line no-restricted-globals
                    location.href = '/tasksevents';
                } else {
                    resp.json().then(error => (error.message)).then(validation => {
                        this.setState({
                            isLoading: false,
                            validation
                        });

                        this.props.onError(validation);
                    });

                }
            });
        };
    }

    renderRow(titles, item) {
        return titles.map(title => {
            switch (title) {
                case 'toEvent':
                    return (
                        <td>
                            <Button
                                variant="dark"
                                type="button"
                                disabled={this.state.isLoading}
                                onClick={!this.state.isLoading ? this.onConvertToEvent(item) : null}>
                                {this.state.isLoading ? 'converting...' : 'convert'}
                            </Button>
                        </td>
                    );
                case 'toTask':
                    return (
                        <td>
                            <Button
                                variant="dark"
                                type="button"
                                disabled={this.state.isLoading}
                                onClick={!this.state.isLoading ? this.onConvertToTask(item) : null}>
                                {this.state.isLoading ? 'converting...' : 'convert'}
                            </Button>
                        </td>
                    );
                default:
                    return (<td>{item[title] || ''}</td>);
            }

        })
    }

    render() {
        const titles = ['id', 'title', 'description', 'createdAt', 'toEvent'];
        const titlesEvent = ['id', 'title', 'description', 'date', 'startTime', 'endTime', 'toTask'];
        const {
            isLoading,
            isLoaded,
            data,
            name
        } = this.state;

        return (
            <div className='tasks-events-page'>
                <div className='form-task-events'>
                    <Form noValidate>
                        <Form.Group as={Row} controlId="formHorizontalSearch">
                            <Col sm={10}>
                                <Form.Control
                                    required
                                    type="text"
                                    placeholder="Write username..."
                                    value={name}
                                    onChange={this.onChangeValue('name')}/>
                            </Col>
                            <Button
                                column
                                sm={4}
                                variant="dark"
                                type="button"
                                disabled={isLoading}
                                onClick={!isLoading ? this.onSubmit : null}>
                                {isLoading ? 'Searching...' : 'Search'}
                            </Button>
                        </Form.Group>
                    </Form>
                    {isLoaded && data.tasks.length && (
                        <div>
                            <div>
                                Tasks
                            </div>
                            <Table striped bordered hover variant="dark">
                                <thead>
                                <tr>
                                    {titles.map(title => (
                                        <th>{title}</th>
                                    ))}
                                </tr>
                                </thead>
                                {isLoaded &&
                                <tbody>
                                {data.tasks.map(item => (
                                    <tr>
                                        {this.renderRow(titles, item)}
                                    </tr>
                                ))}
                                </tbody>}
                            </Table>
                        </div>
                    )}
                    {isLoaded && data.events.length && (
                        <div>
                            <div>
                                Events
                            </div>
                            <Table striped bordered hover variant="dark">
                                <thead>
                                <tr>
                                    {titlesEvent.map(title => (
                                        <th>{title}</th>
                                    ))}
                                </tr>
                                </thead>
                                {isLoaded &&
                                <tbody>
                                {data.events.map(item => (
                                    <tr>
                                        {this.renderRow(titlesEvent, item)}
                                    </tr>
                                ))}
                                </tbody>}
                            </Table>
                        </div>
                    )}
                </div>
            </div>
        );
    }
}

TasksEvents.propTypes = {
    onError: PropTypes.func
};
