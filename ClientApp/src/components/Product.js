import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { Pagination, Table, Dropdown } from 'semantic-ui-react';

import axios from 'axios';
import ModalCreate from '../Modals/ModalCreate';
import ModalDelete from '../Modals/ModalDelete';

class Product extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            ProductData: [],
            ProductDatas: [],
            activePage: 1,
            begin: 0,
            end: 5,
            itemsPerPage: 5,

        }
        this.handleUserAdded = this.handleUserAdded.bind(this);
        this.handleUserUpdated = this.handleUserUpdated.bind(this);
        this.handleUserDeleted = this.handleUserDeleted.bind(this);
        this.handlePageChange = this.handlePageChange.bind(this);

    }


    componentDidMount() {
        axios.get(`/api/Products/`)
            .then((response) => {
                console.log(response)
                this.setState({
                    ProductData: response.data,
                    ProductDatas: response.data.slice(0, 5)
                });
                
            })
            .catch((err) => { console.log(err); });


        }

    handleUserAdded(user) {
        let ProductData = this.state.ProductData.slice();
        this.setState({
            ProductData: ProductData.push(user)
        });
    }

    handleUserUpdated(userid, user) {
        let ProductData = this.state.ProductData.slice();
        
        for (let i = 0, n = ProductData.length; i <= n; i++) {
            if (ProductData[i].id === userid) {
                ProductData[i].name = user.name;
                ProductData[i].price = user.price;

                break; // Stop this loop, we found it!
            }
        }
        this.setState({ ProductData: ProductData });
    }


    handleUserDeleted(id) {
        let ProductData = this.state.ProductData.slice();
        ProductData = ProductData.filter(u => { return u.id != id; });
        let url = '/api/Products/' + id
        console.log(url);
        fetch(url, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(ProductData),
        }).then((response) => console.log(response.json()))
            .then((data) => {
                console.log(data)
                this.setState({
                    ProductData: ProductData
                });
                window.location.reload()

            }).catch((err) => console.log(err))
    }


    handlePageChange(e, { activePage }) {
        const totalPages = Math.ceil(this.state.ProductData.length / this.state.itemsPerPage);
        const begin = (activePage - 1) * this.state.itemsPerPage;
        const end = activePage * this.state.itemsPerPage;
        const ProductDatas = this.state.ProductData.slice(begin, end);
        this.setState({
            activePage: activePage,
            ProductDatas: ProductDatas,
            totalPages: totalPages,
        });
    }


    render() {
        return(
        <div className="ui container">

                <h1>Products List</h1>

                <ModalCreate
                    headerTitle='Create Product'
                    buttonTriggerTitle='Create New'
                    buttonSubmitTitle='Save'
                    pathname='Product'
                    buttonColor='blue'
                    onUserAdded={this.handleUserAdded}
                    label='Price'
                    type='number'
                    PH='20.00'
                    ML='100' />

                <Table className="ui celled table">

                    
                <Table.Header>
                    <tr>
                        <th>Product Name</th>
                        <th>Product Price</th>
                        <th>Actions</th>
                        <th>Actions</th>
                    </tr>
                </Table.Header>
                <Table.Body>
                    {
                            this.state.ProductDatas?.map((p, index) => {
                            return <tr key={index}>
                                <td>{p.name}</td>
                                <td>{p.price}</td>
                                <td>
                                    <ModalCreate
                                    headerTitle='Edit Product'
                                    buttonTriggerTitle='Edit'
                                    buttonIcon="edit outline icon"
                                    buttonSubmitTitle='Save'
                                    pathname='Product'
                                    buttonColor='yellow'
                                    label='Price'
                                    type='number'
                                    PH='20.00'
                                    ML='100'
                                    userID={p.id}
                                    onUserUpdated={this.handleUserUpdated} />
                                </td>

                                <td>
                                    <ModalDelete
                                        headerTitle='Delete Product'
                                        userID={p.id}
                                        pathname='Product'
                                        buttonTriggerTitle='Delete'
                                        buttonIcon="trash alternate outline icon"
                                        buttonColor='red'
                                        onUserDeleted={this.handleUserDeleted} />
                                </td>
                              </tr>
                        })
                    }
                </Table.Body>
                </Table>
                <Pagination
                    activePage={this.state.activePage}
                    onPageChange={this.handlePageChange}
                    totalPages={Math.ceil(this.state.ProductData.length / this.state.itemsPerPage)}
                    ellipsisItem={null}
                    siblingRange={1}
                />
                <br />
                <br />
                <div >Current Page {this.state.activePage}</div>
         </div>
   ) }
}

export default Product