import React, { Component } from 'react';
import { Button, Modal } from 'semantic-ui-react';

import SaleForm from '../Modals/SalesFrom';

class SaleModal extends Component {

    render() {
        return (
            <div className="ui-center" >
            <Modal 
                trigger={<Button color={this.props.buttonColor}><i className={this.props.buttonIcon}></i>{this.props.buttonTriggerTitle}</Button>}
                size='large'
                closeIcon='close'>
                <Modal.Header>{this.props.headerTitle}</Modal.Header>
                <Modal.Content>
                    <SaleForm
                        buttonSubmitTitle={this.props.buttonSubmitTitle}
                        buttonColor={this.props.buttonColor}
                        userID={this.props.userID}
                        pathname={this.props.pathname}
                        onUserAdded={this.props.onUserAdded}
                        onUserUpdated={this.props.onUserUpdated}
                    />
                </Modal.Content>
                </Modal>
            </div>
        );
    }
}

export default SaleModal;
