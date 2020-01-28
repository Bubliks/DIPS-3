import React from 'react';

import Table from 'react-bootstrap/Table';
import Form from 'react-bootstrap/Form';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
import Button from 'react-bootstrap/Button';

import './tasks.css';
import PropTypes from "prop-types";
import Cookie from "../../cookie/cookie";

export default class Tasks extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            name: '',
            data: [],
            validation: '',
            isLoading: false,
            isLoaded: false
        };

        this.cookie = new Cookie();

        // this.onSubmit = this.onSubmit.bind(this);
    }

    componentDidMount() {
        this.setState({
            isLoading: true
        });

        console.log('user:', this.cookie.get("user"), 'token: ', this.cookie.get("token"));

        fetch(`http://localhost:8000/api/user/${this.cookie.get("user")}/allTasks`,  {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                "Authorization": "Bearer <"+this.cookie.get("token")+">"
            },
            body: JSON.stringify({
            })
        })
        .then(resp => {
            console.log(resp);
            if (resp.status < 300) {
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

                    // this.props.onError(validation);
                });

            }
        });
    }
    //
    // onChangeValue(name) {
    //     return event => {
    //         const value = event.target.value;
    //         this.setState({
    //             [name]: value,
    //             validation: ''
    //         });
    //     }
    // }

    // onSubmit() {
    //     const {
    //         name
    //     } = this.state;
    //
    //     if (!name) {
    //         this.setState({
    //             validation: 'is empty!'
    //         })
    //     } else {
    //         this.setState({
    //             isLoading: true
    //         });
    //
    //         fetch('http://localhost:8000/api/allTasks',  {
    //             method: 'POST',
    //             headers: {
    //                 'Content-Type': 'application/json'
    //             },
    //             body: JSON.stringify({
    //                 name
    //             })
    //         })
    //             .then(resp => {
    //                 console.log(resp);
    //                 if (resp.status === 200) {
    //                     resp.json().then(data => {
    //                         this.setState({
    //                             isLoading: false,
    //                             isLoaded: true,
    //                             data
    //                         })
    //                     });
    //                 } else {
    //                     resp.json().then(error => (error.message)).then(validation => {
    //                         this.setState({
    //                             isLoading: false,
    //                             validation
    //                         });
    //
    //                         this.props.onError(validation);
    //                     });
    //
    //                 }
    //             });
    //     }
    // }

    renderRow(titles, item) {
        return titles.map(title => (
            <td>{item[title] || ''}</td>
        ))
    }

    render() {
        const titles = ['id', 'title', 'description', 'createdAt'];
        const {
            isLoading,
            isLoaded,
            data,
            name
        } = this.state;
        console.log(data);

        return (
            <div className='tasks-page'>
                <div className='form-task'>
                    {/*<Form noValidate>*/}
                    {/*    <Form.Group as={Row} controlId="formHorizontalSearch">*/}
                    {/*        <Col sm={10}>*/}
                    {/*            <Form.Control*/}
                    {/*                required*/}
                    {/*                type="text"*/}
                    {/*                placeholder="Write username..."*/}
                    {/*                value={name}*/}
                    {/*                onChange={this.onChangeValue('name')}/>*/}
                    {/*        </Col>*/}
                    {/*        <Button*/}
                    {/*            column*/}
                    {/*            sm={4}*/}
                    {/*            variant="dark"*/}
                    {/*            type="button"*/}
                    {/*            disabled={isLoading}*/}
                    {/*            onClick={!isLoading ? this.onSubmit : null}>*/}
                    {/*            {isLoading ? 'Searching...' : 'Search'}*/}
                    {/*        </Button>*/}
                    {/*    </Form.Group>*/}
                    {/*</Form>*/}
                    {isLoaded && data.length && (
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
                            {data.map(item => (
                                <tr>
                                    {this.renderRow(titles, item)}
                                </tr>
                            ))}
                            </tbody>}
                        </Table>
                    )}
                </div>
            </div>
        );
    }
}

Tasks.propTypes = {
    onError: PropTypes.func
};
