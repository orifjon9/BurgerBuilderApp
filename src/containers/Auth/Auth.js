import React, { Component } from 'react';
import { connect } from 'react-redux';

import Input from '../../components/UI/Input/Input';
import Button from '../../components/UI/Button/Button';
import classes from './Auth.css';
import * as actions from '../../store/actions/index';
import Spinner from '../../components/UI/Spinner/Spinner';

class Auth extends Component {
    state = {
        controlsForm: {
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
        },
        formIsValid: false,
        isSignInMode: true
    }


    inputChangedHandler = (event, inputIdentifier) => {
        const updatedControlsForm = {
            ...this.state.controlsForm
        };

        const updatedFormElement = {
            ...updatedControlsForm[inputIdentifier]
        };

        updatedFormElement.value = event.target.value;
        updatedFormElement.valid = this.checkValidity(updatedFormElement.value, updatedFormElement.elementConfig.validation);
        updatedFormElement.touched = true;
        updatedControlsForm[inputIdentifier] = updatedFormElement;
        let formIsValid = true;

        for (let formElementKey in updatedControlsForm) {
            if (updatedControlsForm[formElementKey].valid === false) {
                formIsValid = false;
                break;
            }
        }

        this.setState({ controlsForm: updatedControlsForm, formIsValid: formIsValid });
    }

    checkValidity(value, rules) {
        let isValid = true;
        if (rules.required) {
            isValid = value.trim() !== '' && isValid;
        }

        if (rules.minLength) {
            isValid = value.length >= rules.minLength && isValid;
        }

        if (rules.maxLength) {
            isValid = value.length <= rules.maxLength && isValid;
        }

        return isValid;
    }

    submitHandler = (event) => {
        event.preventDefault();
        if (this.state.isSignInMode) {
            this.props.onSignIn(this.state.controlsForm.email.value, this.state.controlsForm.password.value);
        } else {
            this.props.onSignUp(this.state.controlsForm.email.value, this.state.controlsForm.password.value);
        }
    };

    switchSignMode = (event) => {
        event.preventDefault();
        this.setState(prevState => {
            return { isSignInMode: !prevState.isSignInMode };
        });
    }

    render() {
        const formControlsArray = [];
        for (let key in this.state.controlsForm) {
            formControlsArray.push({
                id: key,
                config: this.state.controlsForm[key]
            });
        }

        let form = (
            <form onSubmit={this.submitHandler}>
                {
                    formControlsArray.map(formElement => <Input
                        key={formElement.id}
                        name={formElement.id}
                        elementType={formElement.config.elementType}
                        elementConfig={formElement.config.elementConfig}
                        value={formElement.config.value}
                        invalid={!formElement.config.valid && formElement.config.touched}
                        changed={(event) => this.inputChangedHandler(event, formElement.id)} />)
                }
                <Button
                    btnType="Success"
                    disabled={!this.state.formIsValid}>Sign {this.state.isSignInMode ? 'In' : 'Up'}</Button>
                <Button btnType="Default" clicked={this.switchSignMode}>Switch to Sign {!this.state.isSignInMode ? 'In' : 'Up'}</Button>
            </form>
        );

        if (this.props.loading) {
            form = <Spinner />;
        }

        let errorMessage = null;
        if (this.props.error) {
            errorMessage = <p>{this.props.error}</p>
        }

        return (
            <div className={classes.Auth}>
                {errorMessage}
                {form}
            </div>
        );
    }
}

const mapStateToProps = state => {
    return {
        loading: state.auth.loading,
        error: state.auth.error
    };
};

const mapDispatchToProps = dispatch => {
    return {
        onSignUp: (email, password) => dispatch(actions.singUpAsync(email, password)),
        onSignIn: (email, password) => dispatch(actions.singInAsync(email, password))
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(Auth);