import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import axios from '../../../axios-orders';
import { connect } from 'react-redux';

import Button from '../../UI/Button/Button';
import Spinner from '../../UI/Spinner/Spinner';
import Input from '../../UI/Input/Input';
import classes from './ContactData.css';
import withErrorHandler from '../../UI/withErrorHandler/withErrorHandler';
import * as actions from '../../../store/actions/index';


class ContactData extends Component {
    state = {
        orderForm: {
            name: {
                elementType: 'input',
                elementConfig: {
                    type: 'text',
                    placeholder: 'Your Name',
                    validation: {
                        required: true
                    }
                },
                value: '',
                valid: false
            },
            street: {
                elementType: 'input',
                elementConfig: {
                    type: 'text',
                    placeholder: 'Street',
                    validation: {
                        required: true
                    }
                },
                value: '',
                valid: false
            },
            house: {
                elementType: 'input',
                elementConfig: {
                    type: 'text',
                    placeholder: 'House',
                    validation: {
                        required: true
                    }
                },
                value: '',
                valid: false
            },
            state: {
                elementType: 'input',
                elementConfig: {
                    type: 'text',
                    placeholder: 'State',
                    validation: {
                        required: true
                    }
                },
                value: '',
                valid: false
            },
            zipCode: {
                elementType: 'input',
                elementConfig: {
                    type: 'text',
                    placeholder: 'Zip code',
                    validation: {
                        required: true,
                        minLength: 5,
                        maxLength: 5
                    }
                },
                value: '',
                valid: false
            },
            country: {
                elementType: 'input',
                elementConfig: {
                    type: 'text',
                    placeholder: 'Country',
                    validation: {
                        required: true
                    }
                },
                value: '',
                valid: false
            },
            deliveryMethod: {
                elementType: 'select',
                elementConfig: {
                    options: [
                        { value: 'fastest', displayValue: 'Fastest' },
                        { value: 'cheapest', displayValue: 'Cheapest' }
                    ],
                    validation: {}
                },
                value: 'cheapest',
                valid: true
            },
        },
        formIsValid: false
    }

    orderHandler = (event) => {
        event.preventDefault();

        let formData = {
            email: this.props.email
        };
        for (let formElmIdentifier in this.state.orderForm) {
            formData[formElmIdentifier] = this.state.orderForm[formElmIdentifier].value;
        }

        const order = {
            ingredients: this.props.ings,
            price: this.props.price,
            orderData: formData,
            createdOn: new Date().toLocaleDateString(),
            userId: this.props.userId
        };

        this.props.onOrderBurger(order, this.props.token);
    }

    inputChangedHandler = (event, inputIdentifier) => {
        const updatedOrderForm = {
            ...this.state.orderForm
        };

        const updatedFormElement = {
            ...updatedOrderForm[inputIdentifier]
        };

        updatedFormElement.value = event.target.value;
        updatedFormElement.valid = this.checkValidity(updatedFormElement.value, updatedFormElement.elementConfig.validation);
        updatedOrderForm[inputIdentifier] = updatedFormElement;
        let formIsValid = true;

        for(let formElementKey in updatedOrderForm){
            if(updatedOrderForm[formElementKey].valid === false) {
                formIsValid = false;
                break;
            }
        }

        this.setState({ orderForm: updatedOrderForm, formIsValid: formIsValid });
    }

    checkValidity(value, rules) {
        let isValid = true;
        if (rules.required) {
            isValid = value.trim() !== '' && isValid;
        }

        if(rules.minLength){
            isValid = value.length >= rules.minLength  && isValid;
        }

        if(rules.maxLength){
            isValid = value.length <= rules.maxLength  && isValid;
        }

        return isValid;
    }

    render() {
        let formElementsArray = [];
        for (let key in this.state.orderForm) {
            formElementsArray.push({
                id: key,
                config: this.state.orderForm[key],
            });
        }

        let form = (
            <form onSubmit={this.orderHandler}>
                {
                    formElementsArray.map(elm => <Input
                        key={elm.id}
                        name={elm.id}
                        elementType={elm.config.elementType}
                        elementConfig={elm.config.elementConfig}
                        value={elm.config.value}
                        invalid={!elm.config.valid}
                        changed={(event) => this.inputChangedHandler(event, elm.id)} />)
                }
                <Button
                    btnType="Success"
                    disabled={!this.state.formIsValid}
                    clicked={this.orderHandler}>Order</Button>
            </form>);

        if (this.props.loading) {
            form = <Spinner />
        }

        return (
            <div className={classes.ContactData}>
                <h4>Enter your contact data</h4>
                {form}
            </div>
        );
    }
}

const mapStateToProps = state => {
    return {
        ings: state.burgerBuilder.ingredients,
        price: state.burgerBuilder.totalPrice,
        loading: state.order.loading,
        token: state.auth.token,
        userId: state.auth.userId,
        email: state.auth.email
    };
};

const mapDispatchToProps = dispatch => {
    return {
        onOrderBurger: (orderData, token) => dispatch(actions.purchaseBurgerAsync(orderData, token))
    }
};

export default connect(mapStateToProps, mapDispatchToProps)(withErrorHandler(ContactData, axios));