import React, { useState } from 'react';
import axios from '../../../axios-orders';
import { connect } from 'react-redux';

import Button from '../../UI/Button/Button';
import Spinner from '../../UI/Spinner/Spinner';
import Input from '../../UI/Input/Input';
import classes from './ContactData.css';
import withErrorHandler from '../../UI/withErrorHandler/withErrorHandler';
import * as actions from '../../../store/actions/index';
import { checkValidity } from '../../../shared/utility';


const ContactData = props => {
    const [orderForm, setOrderForm] = useState({
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
    });

    const [formIsValid, setFormIsValid] = useState(false);

    const orderHandler = (event) => {
        event.preventDefault();

        let formData = {
            email: props.email
        };
        for (let formElmIdentifier in orderForm) {
            formData[formElmIdentifier] = orderForm[formElmIdentifier].value;
        }

        const order = {
            ingredients: props.ings,
            price: props.price,
            orderData: formData,
            createdOn: new Date().toLocaleDateString(),
            userId: props.userId
        };

        props.onOrderBurger(order, props.token);
    }

    const inputChangedHandler = (event, inputIdentifier) => {
        const updatedOrderForm = {
            ...orderForm
        };

        const updatedFormElement = {
            ...updatedOrderForm[inputIdentifier]
        };

        updatedFormElement.value = event.target.value;
        updatedFormElement.valid = checkValidity(updatedFormElement.value, updatedFormElement.elementConfig.validation);
        updatedOrderForm[inputIdentifier] = updatedFormElement;
        let formIsValid = true;

        for (let formElementKey in updatedOrderForm) {
            if (updatedOrderForm[formElementKey].valid === false) {
                formIsValid = false;
                break;
            }
        }

        setOrderForm(updatedOrderForm);
        setFormIsValid(formIsValid);
    }


    let formElementsArray = [];
    for (let key in orderForm) {
        formElementsArray.push({
            id: key,
            config: orderForm[key],
        });
    }

    let form = (
        <form onSubmit={orderHandler}>
            {
                formElementsArray.map(elm => <Input
                    key={elm.id}
                    name={elm.id}
                    elementType={elm.config.elementType}
                    elementConfig={elm.config.elementConfig}
                    value={elm.config.value}
                    invalid={!elm.config.valid}
                    changed={(event) => inputChangedHandler(event, elm.id)} />)
            }
            <Button
                btnType="Success"
                disabled={!formIsValid}
                clicked={orderHandler}>Order</Button>
        </form>);

    if (props.loading) {
        form = <Spinner />
    }

    return (
        <div className={classes.ContactData}>
            <h4>Enter your contact data</h4>
            {form}
        </div>
    );
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
        onOrderBurger: (orderData, token) => dispatch(actions.purchaseBurger(orderData, token))
    }
};

export default connect(mapStateToProps, mapDispatchToProps)(withErrorHandler(ContactData, axios));