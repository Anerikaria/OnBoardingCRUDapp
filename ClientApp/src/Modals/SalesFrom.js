import React from 'react'
import { Message, Button, Form, Dropdown } from 'semantic-ui-react';
import axios from 'axios'
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

import SemanticDatepicker from 'react-semantic-ui-datepickers';
import 'react-semantic-ui-datepickers/dist/react-semantic-ui-datepickers.css';



class SalesForm extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            name : '',
            startDate: new Date(),
            products: [],
            customers: [],
            stores: [],
            startdate: '', pvalue: 'select', cvalue: 'select', svalue: 'select',
            Product: '', Customer: '', Store: '', DateSold: '',
            formClassName: '',
            formSuccessMessage: '',
            formErrorMessage: '',

        }
        this.handleSubmit = this.handleSubmit.bind(this);  
        this.handleInputChange = this.handleInputChange.bind(this);
        this.handleChange = this.handleChange.bind(this);
    }

    componentDidMount() {
        axios.get("/api/Customers")
            .then((response) => {
                this.setState({
                    customers: response.data
                });
            })
        axios.get("/api/Products")
            .then((response) => {
                this.setState({
                    products: response.data
                });
            })
        axios.get("/api/Stores")
            .then((response) => {
                this.setState({
                    stores: response.data
                });
            })

        //get the Id
        const path = this.props.pathname;
        if (this.props.userID) {
            console.log(this.props.userID)
            axios.get(`/api/Sales/${this.props.userID}`)
                .then((response) => {
                    console.log(response)
                    console.log(response.data.id)
                    this.setState({
                        pvalue: response.data.productId,
                        cvalue: response.data.customerId,
                        svalue: response.data.storeId,
                        date: response.data.dateSold.toLocaleString(),

                    });
                })
                .catch((err) => { console.log(err); });
        }

    }

    handleInputChange(e) {
        const target = e.target;
        const val =  target.value;
        const name = target.name;
        console.log(name, val);

        this.setState({ [name]: val });       
      if (name == 'Customer') {
          this.setState({ cvalue: val });
      }
        if (name == 'Product') {
            this.setState({ pvalue: val });
        }
          if (name == 'Store') {
              this.setState({ svalue: val });

          }

          }

    handleChange(e) {
        
        var target = e;
        this.setState({ startDate: target });
    }


    handleSubmit(e) {

        e.preventDefault();

        const sale = {

            customerId: this.state.Customer,
            productId: this.state.Product ,
            storeId: this.state.Store,
            dateSold: this.state.startDate

        }
        console.log(sale)
        const params = this.props.userID ? this.props.userID : '';
        console.log(params)
        const posturl = '/api/Sales'

        if (!this.props.userID) {
            fetch(posturl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(sale)
            })
                .then((response) =>

                    this.props.onUserAdded(sale),
                    this.setState({
                        formClassName: 'Success',
                        formSuccessMessage: "Data added Succesfully!"
                    }),
                      window.location.reload()

                )
                .catch((error) => {
                    console.log('Error', error);
                });

            //    axios({
            //        method: 'POST',
            //        url: posturl,
            //        data: sale,
            //    })
            //        .then((response) => {
            //            this.setState({
            //                Product: '',
            //                Customer: '',
            //                Store: '',
            //                formClassName: 'success',
            //                formSuccessMessage: response.data.msg
            //            });
            //            this.props.onUserAdded(response.data);
            //        })
            //        .catch((err) => {
            //            if (err.response) {
            //                if (err.response.data) {
            //                    this.setState({
            //                        formClassName: 'warning',
            //                        formErrorMessage: err.response.data.msg
            //                    });
            //                }
            //            }
            //            else {
            //                this.setState({
            //                    formClassName: 'warning',
            //                    formErrorMessage: 'Something went wrong. ' + err
            //                });
            //            }
            //        });
        }

        else if (this.props.userID) {
            const data = {
                customerId: this.state.Customer ? this.state.Customer : this.state.cvalue,
                productId: this.state.Product ? this.state.Product : this.state.pvalue,
                storeId: this.state.Store ? this.state.store : this.state.svalue,
                dateSold: this.state.startDate

            }
            console.log(data);

            fetch(`/api/Sales/${this.props.userID}`, {
                method: 'PUT',
                headers: {
                    'content-type': 'application/json'
                },
                body: JSON.stringify(data)
            })
                .then((response) =>
                    this.props.onUserUpdated(params, data)
                        .catch((err) => console.log(err)
                        ))

        }

    }
    render() {
        const formClassName = this.state.formClassName;
        const formSuccessMessage = this.state.formSuccessMessage;
        const formErrorMessage = this.state.formErrorMessage;

        return (
            <Form className={formClassName} onSubmit={this.handleSubmit} >

                <DatePicker selected={this.state.startDate} onChange={this.handleChange} value={this.state.startDate} />
                <br />
                <br />

                <div>
                    
                    <label><b>Customer</b></label><br />
                    <select name='Customer' value={this.state.cvalue} onChange={this.handleInputChange}>
                        <option value='Select' key='1'>--Select--</option>
                      
                        {
                            this.state.customers?.map((item) => <option value={item.id}>{item.name} </option>)
                        }
                    </select>
                    <br/>
                </div>

                <div>
                    <label><b>Product</b></label><br />
                    <select name='Product' value={this.state.pvalue} onChange={this.handleInputChange}>
                        <option value='Select' key='1'>--select--</option>
                        {
                            this.state.products?.map((item) => <option value={item.id}>{item.name} </option>)
                        }
                    </select>
                    <br/>
                </div>

                <div>
                    <label><b>Store</b></label><br />
                    <select name='Store' value={this.state.svalue} onChange={this.handleInputChange}>
                        <option value='Select' key='1'>--select--</option>
                        {
                            this.state.stores?.map((item) => <option value={item.id}>{item.name} </option>)
                        }
                    </select>
                    <br/>
                </div>

                <br/><br/>
                <Message success color='green' header='Updated!' content={formSuccessMessage} />
                <Message warning color='yellow' header='Woah!' content={formErrorMessage} />
                <Button color={this.props.buttonColor} pathname={this.props.pathname} floated='right'>{this.props.buttonSubmitTitle}</Button>
                <br/><br/>
            </Form>
        );
    }
}

export default SalesForm;