import React from 'react';
import ReactDOM from 'react-dom';
import { Pagination } from 'semantic-ui-react';
import axios from 'axios';
import 'semantic-ui-css/semantic.min.css';
import ModalCreate from '../Modals/ModalCreate';
import ModalDelete from '../Modals/ModalDelete';

class Customer extends React.Component {
    constructor() {
        super();
        this.state = {
            CustomerData: [],
            CustomerDatas:[],
            activePage: 1,
            begin: 0,
            end:5,
            itemsPerPage: 5,
            modalOpen:false,

        }
      this.handleUserAdded = this.handleUserAdded.bind(this);
      this.handleUserUpdated = this.handleUserUpdated.bind(this);
      this.handleUserDeleted = this.handleUserDeleted.bind(this);
      this.handleOpen = this.handleOpen.bind(this);
      this.handleClose = this.handleClose.bind(this);
      this.handlePageChange = this.handlePageChange.bind(this);

    }

    //this is the life cycle method, call when inital render
    componentDidMount() {
        axios.get(`/api/Customers/`)
            .then((response) => {
                console.log(response)
                this.setState({
                    CustomerData: response.data,
                    CustomerDatas: response.data.slice(0, 5)
                });
                
            })
            .catch((err) => { console.log(err); });


        }


    handleOpen(e) { this.setState({ modalOpen: true }) };
    handleClose(e) { this.setState({ modalOpen: false }) };

    handleUserAdded(cust) {
        let CustomerData = this.state.CustomerData.slice();
        CustomerData.push(cust);
        this.setState({ CustomerData: CustomerData });
        
    }

    handleUserUpdated(userid, cust) {
        let CustomerData = this.state.CustomerData.slice();
        for (let i = 0, n = CustomerData.length; i <= n; i++) {
            if (CustomerData[i].id === userid) {
                CustomerData[i].name = cust.name;
                CustomerData[i].address = cust.address;

                break; // Stop this loop, we found it!
            }
        }
        this.setState({ CustomerData: CustomerData });
    }


    handleUserDeleted(id) {
        let CustomerData = this.state.CustomerData.slice();
        CustomerData = CustomerData.filter(u => { return u.id != id; });
        let url = '/api/Customers/' + id
        console.log(url);
        fetch(url, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(CustomerData),
        })
            .then((response) => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                else {
                    this.setState({
                        CustomerData: CustomerData
                    });
                    window.location.reload()
                    return response.text();
                }
            })
            .catch((err) => console.log(err))
    }

    handlePageChange(e, { activePage }) {
        const totalPages = Math.ceil(this.state.CustomerData.length / this.state.itemsPerPage);
        const begin = (activePage - 1) * this.state.itemsPerPage;
        const end = activePage * this.state.itemsPerPage;
        const CustomerDatas = this.state.CustomerData.slice(begin, end);
        this.setState({
            activePage: activePage,
            CustomerDatas: CustomerDatas,
            totalPages: totalPages,
        });
    }

    //another life cycle method
    render() {
        return (
           
            <div className="ui container">

                <h1>Customers List</h1>
                <div>
                    <ModalCreate
                        headerTitle='Create Customer'
                        buttonTriggerTitle='Create New'
                        buttonSubmitTitle='Save'
                        pathname='Customer'
                        buttonColor='blue'
                        onUserAdded={this.handleUserAdded}
                        label='Address'
                        type='text'
                        PH='Sydney'
                        ML='100'
                    />

                    <table className="ui celled table">
                        <thead>
                            <tr>
                                <th>Customer Name</th>
                                <th>Customer Address</th>
                                <th>Actions</th>
                                <th>Actions</th>

                            </tr>
                        </thead>
                        <tbody>
                            {
                                
                                //checking here if CustomerData is not empty then only map it.
                                this.state.CustomerDatas && this.state.CustomerDatas.map((c) => {
                                    if (!c.id) {
                                        return null
                                    }
                                    else {
                                        return <tr key={c.id}>
                                            <td>{c.name}</td>
                                            <td>{c.address}</td>
                                            <td>
                                                <ModalCreate
                                                    headerTitle='Edit Customer'
                                                    buttonTriggerTitle='Edit'
                                                    buttonIcon="edit outline icon"
                                                    buttonSubmitTitle='Save'
                                                    pathname='Customer'
                                                    buttonColor='yellow'
                                                    label='Address'
                                                    type='text' PH='Sydney'
                                                    ML='100'
                                                    userID={c.id}
                                                    onUserUpdated={this.handleUserUpdated} />
                                            </td>

                                            <td>
                                                <ModalDelete
                                                    headerTitle='Delete Customer'
                                                    userID={c.id}
                                                    pathname='Customer'
                                                    buttonTriggerTitle='Delete'
                                                    buttonIcon="trash alternate outline icon"
                                                    buttonColor='red'
                                                    onUserDeleted={this.handleUserDeleted} />

                                            </td>

                                        </tr>
                                    }
                                })
                               
                            }
                        </tbody>
                        
                    </table>
                    <Pagination
                        activePage={this.state.activePage}
                        onPageChange={this.handlePageChange}
                        totalPages={Math.ceil(this.state.CustomerData.length / this.state.itemsPerPage)}
                        ellipsisItem={null}
                        siblingRange={1}
                    />
                    <br />
                    <br />
                    <div >Current Page  {this.state.activePage}</div>
                </div>


            </div>
        )
    }
}

export default Customer
