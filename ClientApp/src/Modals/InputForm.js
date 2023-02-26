import React, { Component } from 'react';
import { Message, Button, Form, Select } from 'semantic-ui-react';
import axios from 'axios';
import { withRouter } from 'react-router-dom'


class InputForm extends Component {
    constructor(props) {
        super(props);

        this.state = {
            Name: '',
            Price : '',
            Address: '',
            formClassName: '',
            formSuccessMessage: '',
            formErrorMessage: ''

        }

        this.handleInputChange = this.handleInputChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);

    }

    componentDidMount() {
        //Fill in the form with appropriate data if user id is provided
        console.log( this.props.userID);
        const path = this.props.pathname;
        let url = `/api/${this.props.pathname}s/${this.props.userID}`
        console.log(url);
        if (path === 'Product') {

            if (!this.props.userID) {
                return null;
            }
          else if (this.props.userID) {
                console.log(url)
                axios.get(url).then((response) => {
                    console.log(response);
                    this.setState({
                        Name: response.data.name,
                        Price: response.data.price
                    });
                }).catch((err) => {
                    console.log('error');
                })
            }

            
        }

        if (path === 'Customer' || path === 'Store') {
            if (!this.props.userID) {
                return null;
            }
          else if (this.props.userID) {
                //fetch /api/Customers/${this.props.userID}(Id//1)
                console.log(url)
                axios.get(url).then((response) => {
                    console.log(response);
                    this.setState({
                        Name: response.data.name,
                        Address: response.data.address 

                    });
                })
                    .catch((err) => {
                        console.log('error');
                    });
            //    const fillForm = async () => {
            //        let response = await fetch(`/api/Customers/${this.props.userID}`);

            //        if (response.ok) {

            //            let data = await response.json();
            //            console.log(data);
            //            let checkData = data.map((result) =>)

            //            this.setState({
            //                Name: data,
            //                Address: data.address
            //            });

            //            console.log("Name and Address : ",  this.state.Name)
            //        }
            //        else {
            //            return Promise.reject("its not working");
            //        }
            //    }

            //    fillForm();

            }
            
        }
    }

    handleInputChange(e) {
        const target = e.target;
        const Value =  target.value;
        const Name = target.name;

        this.setState({ [Name]: Value });
    }

    handleSubmit(e) {
        //Prevent the default behavior of form (browser refresh)
        e.preventDefault();

        let user = {
            id: this.props.userID,
            name: this.state.Name,
            price: this.state.Price
        }

        let cust = {
            id: this.props.userID,
            name: this.state.Name,
            address: this.state.Address
        }


        //Acknowledge that if the user id is provided, we're updating via PUT
        //Otherwise , we're creating a new data via POST

        const params = this.props.userID ? this.props.userID : '';
        console.log(params);

        if (!this.props.userID) {
            let posturl = '/api' + '/' + this.props.pathname + 's'

            if (this.props.pathname === 'Product') {
                axios({
                    method: 'POST',
                    url: posturl,
                    data: user,
                })
                    .then((response) => {
                        console.log(response)
                        this.setState({
                            Name: '',
                            Price: '',
                            formClassName: 'success',
                            formSuccessMessage: 'Successfully Done!'
                        });
                        this.props.onUserAdded(user);
                        window.location.reload();
                    })
                    .catch((err) => {
                        if (err.response) {
                            if (err.response.data) {
                                this.setState({
                                    formClassName: 'warning',
                                    formErrorMessage: err.response.body.msg
                                });
                            }
                        }
                        else {
                            this.setState({
                                formClassName: 'warning',
                                formErrorMessage: 'Something went wrong. ' + err
                            });
                        }
                    });
            }


             else if (this.props.pathname === 'Customer' || this.props.pathname === 'Store') {

                    const data = cust;

                    console.log(posturl);

                    fetch(posturl, {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',

                        },
                        body: JSON.stringify(data),
                    })
                        .then((response) =>
                            this.props.onUserAdded(data),
                            window.location.reload(),
                            this.setState({
                                Name: '',
                                Address: '',
                                formClassName: 'Success',
                                formSuccessMessage: "Data added Succesfully!"
                            })
                        )
                        .catch((error) => {
                            console.log('Error', error);
                        });

                    //if (this.props.pathname === 'Customer' ) {
                    //    const posturl = this.props.userID ? '/' + 'api/Customers/' + `${params}`
                    //        : '/api/Customers'
                    //    console.log(posturl)
                    //    fetch(posturl,{
                    //        method: 'POST',
                    //       body: JSON.stringify({ cust })
                    //    })
                    //    console.log(posturl)
                    //        .then((response) => {
                    //            this.setState({
                    //                formClassName: 'success',
                    //                formSuccessMessage: response.json()

                    //            });
                    //            console.log(this.state.formSuccessMessage);

                    //            if (!this.props.userID) {
                    //                this.setState({
                    //                    Name: '',
                    //                    Address: ''
                    //                });
                    //                console.log(cust);
                    //                this.props.onUserAdded(cust);
                    //            }
                    //            else {
                    //                this.props.onUserUpdated(params, cust);
                    //            }
                    //        })
                    //        .catch((err) => {
                    //            if (err.response) {
                    //                if (err.response.body) {
                    //                    this.setState({
                    //                        formClassName: 'warning',
                    //                        formErrorMessage: err.response.json()
                    //                    });

                    //                }
                    //            }
                    //            else {
                    //                this.setState({
                    //                    formClassName: 'warning',
                    //                    formErrorMessage: 'Something went wrong.' + err
                    //                });
                    //            }
                    //        });
                    //}
                    //console.log("cust" + cust );
                }
            


        }


        else if (this.props.userID) {

            console.log(params);

            if (this.props.pathname === 'Customer' || this.props.pathname === 'Store') {
                const puturl = '/api' + '/' + this.props.pathname + 's' + '/' + this.props.userID

                console.log(puturl)

                const data = {
                    id: this.props.userID,
                    name: this.state.Name,
                    address: this.state.Address
                };

                fetch(puturl, {

                    method: 'PUT',
                    headers: {
                        'content-type': 'application/json'
                    },
                    body: JSON.stringify(data
                    )
                }).then((response) => console.log(response.body.Message),
                    this.props.onUserUpdated(params, data)
                ).catch((err) => console.log(err))

            }
            else if (this.props.pathname === 'Product') {
                const data = user

                fetch(`/api/Products/${this.props.userID}`, {
                    method: 'PUT',
                    headers: {
                        'content-type': 'application/json'
                    },
                    body: JSON.stringify(data
                    )
                }).then((response) => console.log(response.body.Message),
                    this.props.onUserUpdated(params, data)
                ).catch((err) => console.log(err))
            }
        }
    }

    render() {
        console.log(this.props.userID)
       
        let formClassName = this.state.formClassName;
        let formSuccessMessage = this.state.formSuccessMessage;
        let formErrorMessage = this.state.formErrorMessage;

        return (
            <Form className={formClassName} onSubmit={this.handleSubmit} >
                <Form.Input
                    label='Name'
                    type='text'
                    placeholder='Elon Musk'
                    name='Name'
                    maxLength='40'
                    required
                    value={this.state.Name}
                    onChange={this.handleInputChange}
                />
                <Form.Input
                    label={this.props.label}
                    type={this.props.type}
                    placeholder={this.props.PH}
                    name={this.props.label}
                    maxLength={this.props.ML}
                    required
                    value={this.state.Address || this.state.Price}
                    onChange={this.handleInputChange}
                />

                <Message
                    success
                    color='green'
                    header='Updated!'
                    content={formSuccessMessage}
                />
                <Message
                    warning
                    color='yellow'
                    header='Woah!'
                    content={formErrorMessage}
                />
                <Button color={this.props.buttonColor}
                    pathname={this.props.pathname}
                    floated='right'>{this.props.buttonSubmitTitle} </Button>
                <br />
                <br /> 
            </Form>
        );
    }

 
}

export default InputForm;