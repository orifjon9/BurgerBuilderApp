import React, { Component } from 'react';

import Order from '../../components/Order/Order';
import axios from '../../axios-orders';
import Spinner from '../../components/UI/Spinner/Spinner';
import withErrorHandler from '../../components/UI/withErrorHandler/withErrorHandler';

class Orders extends Component {
    state = {
        orders: null,
        loading: false
    }

    componentDidMount() {
        this.setState({ loading: true });

        axios.get('/orders.json')
            .then(res => {
                let orders = [];
                for (let key in res.data) {
                    orders.push({
                        ...res.data[key],
                        id: key
                    });
                }
                this.setState({ orders: orders, loading: false });
            }).catch(err => {
                console.log(err);
                this.setState({ loading: false });
            });
    }

    render() {
        let orders = <Spinner />;

        if (this.state.orders && !this.state.loading) {
            orders = this.state.orders.map(x => {
                return <Order key={x.id} order={x} />
            });
        }

        return (
            <div>
                {orders}
            </div>
        );
    }
}

export default withErrorHandler(Orders, axios);