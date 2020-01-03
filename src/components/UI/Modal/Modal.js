import React from 'react';

import classes from './Modal.css';
import Aux from '../../../hoc/Auxiliary/Auxiliary';
import Backdrop from '../Backdrop/Backdrop';

// read about transition
// https://reactcommunity.org/react-transition-group/
class Modal extends React.Component {

    shouldComponentUpdate(nextProps, nextState) {
        return nextProps.show !== this.props.show || nextProps.children !== this.props.children;
    }

    render() {
        const cssClasses = [classes.Modal, this.props.show ? classes.ModalOpen: classes.ModalClosed]
        return (
            <Aux>
                <Backdrop show={this.props.show} clicked={this.props.modalClosed} />
                <div
                    className={cssClasses.join(' ')}>
                    {this.props.children}
                </div>
            </Aux>
        );
    }
}

export default Modal;