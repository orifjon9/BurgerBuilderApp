import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import axios from '../../../axios-orders';

import Button from '../../UI/Button/Button';
import Spinner from '../../UI/Spinner/Spinner';
import classes from './ContactData.css';

class ContactData extends Component {
    state = {
        name: null,
        email: null,
        address: {
            street: null,
            zipCode: null
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
        let form = (
            <form>
                <input className={classes.Input} type="text" name="name" placeholder="Your Name" />
                <input className={classes.Input} type="text" name="email" placeholder="Your Email" />
                <input className={classes.Input} type="text" name="street" placeholder="Street" />
                <input className={classes.Input} type="text" name="zipCode" placeholder="Zip code" />

                <Button
                    btnType="Success"
                    clicked={this.orderHandler}>Order</Button>
            </form>);

        if(this.state.loading){
            form = <Spinner />
        }

        return (
            <div className={classes.ContactData}>
                <h4>Enter your contact data</h4>
                { form }
            </div>
        );
    }
}

export default withRouter(ContactData);