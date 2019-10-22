import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import axios from '../../../axios-orders';

import Button from '../../UI/Button/Button';
import Spinner from '../../UI/Spinner/Spinner';
import Input from '../../UI/Input/Input';
import classes from './ContactData.css';

class ContactData extends Component {
    state = {
        orderForm: {
            name: {
                elementType: 'input',
                elementConfig: {
                    type: 'text',
                    placeholder: 'Your Name'
                },
                value: ''
            },
            email: {
                elementType: 'input',
                elementConfig: {
                    type: 'email',
                    placeholder: 'Your E-mail'
                },
                value: ''
            },
            street: {
                elementType: 'input',
                elementConfig: {
                    type: 'text',
                    placeholder: 'Street'
                },
                value: ''
            },
            house: {
                elementType: 'input',
                elementConfig: {
                    type: 'text',
                    placeholder: 'House'
                },
                value: ''
            },
            state: {
                elementType: 'input',
                elementConfig: {
                    type: 'text',
                    placeholder: 'State'
                },
                value: ''
            },
            zipCode: {
                elementType: 'input',
                elementConfig: {
                    type: 'text',
                    placeholder: 'Zip code'
                },
                value: ''
            },
            country: {
                elementType: 'input',
                elementConfig: {
                    type: 'text',
                    placeholder: 'Country'
                },
                value: ''
            },
            deliveryMethod: {
                elementType: 'select',
                elementConfig: {
                    options: [
                        { value: 'fastest', displayValue: 'Fastest' },
                        { value: 'cheapest', displayValue: 'Cheapest' }
                    ]
                },
                value: ''
            },
        },
        loading: false
    }

    orderHandler = (event) => {
        event.preventDefault();

        this.setState({ loading: true });

        const order = {
            ingredients: this.props.ingredients,
            price: 10, // just for now. It will get actual a price soon
            customer: {
                name: 'Orifjon Narkulov',
                email: 'info@test.net',
                address: {
                    street: 'N Test street',
                    house: '123',
                    state: 'UT',
                    zipCode: '84848',
                    country: 'USA'
                }
            },
            deliveryMethod: 'Faster',
            createdOn: new Date().toLocaleDateString()
        };

        axios.post('/orders.json', order)
            .then(response => {
                console.log(response);
            })
            .catch(error => console.log(error))
            .finally(() => {
                this.setState({ loading: false });
                this.props.history.push('/thank-you');
            });
    }

    render() {
        let formElementsArray = [];
        for (let key in this.state.orderForm) {
            formElementsArray.push({
                id: key,
                config: this.state.orderForm[key]
            });
        }

        let form = (
            <form>
                {
                    formElementsArray.map(elm => <Input key={elm.id} name={elm.id} inputElement={elm.config.elementType} elementConfig={elm.config.elementConfig} value={elm.config.value} />)
                }
                <Button
                    btnType="Success"
                    clicked={this.orderHandler}>Order</Button>
            </form>);

        if (this.state.loading) {
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

export default withRouter(ContactData);