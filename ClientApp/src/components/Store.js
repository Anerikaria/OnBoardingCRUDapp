import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { Pagination } from 'semantic-ui-react';
import ModalCreate from '../Modals/ModalCreate';
import ModalDelete from '../Modals/ModalDelete';
import axios from 'axios';
import Pager from '../Modals/Pager';

class Store extends React.Component {
    constructor() {
        super();
        this.state = {
            StoreData: [],
            StoreDatas: [],
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

    //this is the life cycle method, call when inital render
    componentDidMount() {
        axios.get(`/api/Stores/`)
            .then((response) => {
                console.log(response)
                this.setState({
                    StoreData: response.data,
                    StoreDatas: response.data.slice(0, 5)
                });

            })
            .catch((err) => { console.log(err); });


    }


    onCloseModal() {
        this.setState({
            active: false
        });
    }

    handleUserAdded(cust) {
        debugger
        let StoreData = this.state.StoreData.slice();
        this.setState({ StoreData: StoreData.push(cust) });
        
    }

    handleUserUpdated(userid, cust) {
        let StoreData = this.state.StoreData.slice();
        for (let i = 0, n = StoreData.length; i <= n; i++) {
            if (StoreData[i].id === userid) {
                StoreData[i].name = cust.name;
                StoreData[i].address = cust.address;

                break; // Stop this loop, we found it!
            }
        }
        this.setState({ StoreData: StoreData });
            }


    handleUserDeleted(id) {

        let StoreData = this.state.StoreData.slice();
        StoreData = StoreData.filter(u => { return u.id != id; });
        let url = '/api/Stores/' + id
        console.log(url);
        fetch(url, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(StoreData),
        }).then((response) => console.log(response.json()))
            .then((data) => {
                this.setState({
                    StoreData: StoreData
                });
                window.location.reload()

            }).catch((err) => console.log(err))
    }


    handlePageChange(e, { activePage }) {
        const totalPages = Math.ceil(this.state.StoreData.length / this.state.itemsPerPage);
        const begin = (activePage - 1) * this.state.itemsPerPage;
        const end = activePage * this.state.itemsPerPage;
        const StoreDatas = this.state.StoreData.slice(begin, end);
        this.setState({
            activePage: activePage,
            StoreDatas: StoreDatas,
            totalPages: totalPages,
        });
    }

    //another life cycle method
    render() {

        return (

            <div className="ui container">

                <h1>Stores List</h1>
                <div>
                    <ModalCreate
                        headerTitle='Create Store'
                        buttonTriggerTitle='Create New'
                        buttonSubmitTitle='Save'
                        pathname='Store'
                        buttonColor='blue'
                        onUserAdded={this.handleUserAdded}
                        label='Address'
                        type='text'
                        PH='Sydney'
                        ML='100' />

                    <table className="ui celled table">
                        <thead>
                            <tr>
                                <th>Store Name</th>
                                <th>Store Address</th>
                                <th>Actions</th>
                                <th>Actions</th>

                            </tr>
                        </thead>
                        <tbody>
                            {

                                //checking here if StoreData is not empty then only map it.
                                this.state.StoreDatas && this.state.StoreDatas.map((s, index) => {
                                    return <tr key={index}>
                                        <td>{s.name}</td>
                                        <td>{s.address}</td>
                                        <td><ModalCreate
                                            headerTitle='Edit Store'
                                            buttonTriggerTitle='Edit'
                                            buttonIcon="edit outline icon"
                                            buttonSubmitTitle='Save'
                                            pathname='Store'
                                            buttonColor='yellow'
                                            label='Address'
                                            type='text'
                                            PH='Sydney'
                                            ML='100'
                                            userID={s.id}
                                            onUserUpdated={this.handleUserUpdated} />
                                        </td>

                                        <td>
                                            <ModalDelete
                                                headerTitle='Delete Store'
                                                userID={s.id}
                                                pathname='Store'
                                                buttonTriggerTitle='Delete'
                                                buttonIcon="trash alternate outline icon"
                                                buttonColor='red'
                                                onUserDeleted={this.handleUserDeleted} />

                                        </td>

                                    </tr>

                                })

                            }
                        </tbody>
                    </table>
                    <Pagination
                        activePage={this.state.activePage}
                        onPageChange={this.handlePageChange}
                        totalPages={Math.ceil(this.state.StoreData.length / this.state.itemsPerPage)}
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

export default Store
