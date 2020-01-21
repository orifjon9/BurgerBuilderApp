import React from 'react';

import Modal from '../Modal/Modal';
import Aux from '../../../hoc/Auxiliary/Auxiliary';
import httpErrorHandler from '../../../hooks/http-error-handler';

const withErrorHandler = (WrappedComponent, axios) => {
    return props => {
        const [error, errorConfirmedHandler] = httpErrorHandler(axios);
        console.log(error);

        return (
            <Aux>
                <Modal show={error}
                    state="entered"
                    modalClosed={errorConfirmedHandler}>
                    {error ? error.message : null}
                </Modal>
                <WrappedComponent {...props} />
            </Aux>
        );
    }
};

export default withErrorHandler;