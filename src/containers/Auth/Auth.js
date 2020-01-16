import React, { useState } from 'react';
import { connect } from 'react-redux';

import Input from '../../components/UI/Input/Input';
import Button from '../../components/UI/Button/Button';
import classes from './Auth.css';
import * as actions from '../../store/actions/index';
import Spinner from '../../components/UI/Spinner/Spinner';
import { Redirect } from 'react-router';
import { checkValidity } from '../../shared/utility';

const Auth = props => {
    const [authForm, setAuthForm] = useState({
        email: {
            elementType: 'input',
            elementConfig: {
                type: 'email',
                placeholder: 'Email address',
                validation: {
                    required: true
                }
            },
            value: '',
            valid: false,
            touched: false
        },
        password: {
            elementType: 'input',
            elementConfig: {
                type: 'password',
                placeholder: 'Password',
                validation: {
                    required: true,
                    minLength: 7
                }
            },
            value: '',
            valid: false,
            touched: false
        }
    });

    const [formIsValid, setFormIsValid] = useState(false);
    const [isSignInMode, setIsSignInMode] = useState(true);


    const inputChangedHandler = (event, inputIdentifier) => {
        const updatedControlsForm = {
            ...authForm
        };

        const updatedFormElement = {
            ...updatedControlsForm[inputIdentifier]
        };

        updatedFormElement.value = event.target.value;
        updatedFormElement.valid = checkValidity(updatedFormElement.value, updatedFormElement.elementConfig.validation);
        updatedFormElement.touched = true;
        updatedControlsForm[inputIdentifier] = updatedFormElement;
        let formIsValid = true;

        for (let formElementKey in updatedControlsForm) {
            if (updatedControlsForm[formElementKey].valid === false) {
                formIsValid = false;
                break;
            }
        }

        setAuthForm(updatedControlsForm);
        setFormIsValid(formIsValid);
    }

    const submitHandler = (event) => {
        event.preventDefault();
        if (isSignInMode) {
            props.onSignIn(authForm.email.value, authForm.password.value);
        } else {
            props.onSignUp(authForm.email.value, authForm.password.value);
        }
    };

    const switchSignMode = (event) => {
        event.preventDefault();
        setIsSignInMode(!isSignInMode);
    }

    const formControlsArray = [];
    for (let key in authForm) {
        formControlsArray.push({
            id: key,
            config: authForm[key]
        });
    }

    let form = (
        <form onSubmit={submitHandler}>
            {
                formControlsArray.map(formElement => <Input
                    key={formElement.id}
                    name={formElement.id}
                    elementType={formElement.config.elementType}
                    elementConfig={formElement.config.elementConfig}
                    value={formElement.config.value}
                    invalid={!formElement.config.valid && formElement.config.touched}
                    changed={(event) => inputChangedHandler(event, formElement.id)} />)
            }
            <Button
                btnType="Success"
                disabled={!formIsValid}>Sign {isSignInMode ? 'In' : 'Up'}</Button>
            <Button btnType="Default" clicked={switchSignMode}>Switch to Sign {!isSignInMode ? 'In' : 'Up'}</Button>
        </form>
    );

    if (props.loading) {
        form = <Spinner />;
    }

    let errorMessage = null;
    if (props.error) {
        errorMessage = <p>{props.error}</p>
    }

    if (props.isAuthenticated) {
        form = <Redirect to={props.building ? "/checkout" : "/"} />;
    }

    return (
        <div className={classes.Auth}>
            {errorMessage}
            {form}
        </div>
    );
}

const mapStateToProps = state => {
    return {
        loading: state.auth.loading,
        error: state.auth.error,
        isAuthenticated: state.auth.token !== null,
        building: state.burgerBuilder.building
    };
};

const mapDispatchToProps = dispatch => {
    return {
        onSignUp: (email, password) => dispatch(actions.singUpAsync(email, password)),
        onSignIn: (email, password) => dispatch(actions.singInAsync(email, password))
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(Auth);