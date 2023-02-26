import de from 'date-fns/locale/de/index.js';
import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { Pagination, Table, Dropdown } from 'semantic-ui-react';

import ModalDelete from '../Modals/ModalDelete';
import ModalCreate from '../Modals/SalesModal';

class Sales extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            SalesData: [],
            SalesDatas: [],
            activePage: 1,
            begin: 0,
            end: 5,
            itemsPerPage: 5,
            modalOpen: false,

        }

        this.handleUserAdded = this.handleUserAdded.bind(this);
        this.handleUserUpdated = this.handleUserUpdated.bind(this);
        this.handleUserDeleted = this.handleUserDeleted.bind(this);
        this.handlePageChange = this.handlePageChange.bind(this);

    }

    componentDidMount() {
        const check = async () => {
            const response = await fetch('/api/Sales');

            if (response.ok) {
                let jsonValue = await response.json();
                console.log(jsonValue);
                this.setState({
                    SalesData: jsonValue,
                    SalesDatas: jsonValue.slice(0,6)
                });
            }
            else {
                return Promise.reject("its not working!");
            }
        }

        check();
    }

    onCloseModal() {
        this.setState({
            active: false
        });
    }

    handleUserAdded(user) {
        let SalesData = this.state.SalesData.slice();
        this.setState({ SalesData: SalesData.push(user) });
    }

    handleUserUpdated(userid, user) {
        let SalesData = this.state.SalesData.slice();
        for (let i = 0, n = SalesData.length; i < n; i++) {
            if (SalesData[i].id === userid) {
                SalesData[i].productId = user.productId;
                SalesData[i].storeId = user.storeId;
                SalesData[i].customerId = user.customerId;
                SalesData[i].dateSold = user.dateSold;

                break; // Stop this loop, we found it
            }
        }
        this.setState({ SalesData: SalesData });
    }




    handleUserDeleted(id) {
        let SalesData = this.state.SalesData.slice();
        SalesData = SalesData.filter(u => { return u.id != id; });
        let url = '/api/Sales/' + id
        console.log(url);
        fetch(url, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(SalesData),
        }).then((response) => console.log(response.json()))
            .then((data) => {
                console.log(data)
                this.setState({
                    SalesData: SalesData
                });
                window.location.reload()

            }).catch((err) => console.log(err))
    }


    handlePageChange(e, { activePage }) {
        const totalPages = Math.ceil(this.state.SalesData.length / this.state.itemsPerPage);
        const begin = (activePage - 1) * this.state.itemsPerPage;
        const end = activePage * this.state.itemsPerPage;
        const SalesDatas = this.state.SalesData.slice(begin, end);
        this.setState({
            activePage: activePage,
            SalesDatas: SalesDatas,
            totalPages: totalPages,
        });
    }


    render() {
        return (
            <div className="ui container">

                <h1>Sales List</h1>

                <div>
                    
                    <ModalCreate
                        headerTitle='Create Sale'
                        buttonTriggerTitle='New Sale'
                        buttonSubmitTitle='Save'
                        buttonColor='blue'
                        pathname='Sales'
                        onUserAdded={this.handleUserAdded} 
                    />
                    <table className="ui celled table">
                        <thead>
                            <tr>
                                <th>Customer</th>
                                <th>Product</th>
                                <th>Store</th>
                                <th>DateSold</th>
                                <th>Actions</th>
                                <th>Actions</th>

                            </tr>
                        </thead>
                        <tbody>
                            {
                                this.state.SalesDatas &&  this.state.SalesDatas.map((se) => {

                                    return <tr key={se.id}>
                                        <td> {se.customerName}</td>
                                        <td>{se.productName}</td>
                                        <td>{se.storeName}</td>
                                        <td>{new Date(se.dateSold).toLocaleDateString()}</td>
                                        <td><ModalCreate
                                            headerTitle='Edit Sale'
                                            pathname='Sales'
                                            buttonTriggerTitle='Edit'
                                            buttonIcon="edit outline icon"
                                            buttonSubmitTitle='Save'
                                            buttonColor='yellow'
                                            userID={se.id}
                                            onUserUpdated={this.handleUserUpdated}
                                        /> </td>
                                        <td>
                                            <ModalDelete
                                                headerTitle='Delete Sale'
                                                userID={se.id}
                                                pathname='Sales'
                                                buttonTriggerTitle='Delete'
                                                buttonIcon="trash alternate outline icon"
                                                buttonColor='red' 
                                                onUserDeleted={this.handleUserDeleted}
                                            />
                                        </td>
                                    </tr>
                                })
                            }
                        </tbody>
                    </table>
                </div>
                <br/>
                    <Pagination
                        activePage={Number(this.state.activePage)}
                        onPageChange={this.handlePageChange}
                        totalPages={Math.ceil(this.state.SalesData.length / this.state.itemsPerPage)}
                        ellipsisItem={null}
                        siblingRange={1}
                    />
                    <br />
                    <br />
                    <div > Page  {this.state.activePage}</div>

            </div>

            )
    }
}

export default Sales