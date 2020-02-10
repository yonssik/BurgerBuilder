import React, { Component } from 'react';

import Order from '../../components/Order/Order';
import axios from '../../axios-orders';
import withErrorHandler from '../../hoc/withErrorHandler/withErrorHandler';
import Spinner from '../../components/UI/Spinner/Spinner';

class Orders extends Component {
    state = {
        orders: [],
        loading: true
    }

    componentDidMount() {
        axios.get('/orders.json')
            .then(response => {
                const fetchedOrders = [];
                for (let key in response.data) {
                    fetchedOrders.push({
                        ...response.data[key],
                        id: key
                    });
                }
                this.setState({
                    loading: false,
                    orders: fetchedOrders
                });
            })
            .catch(error => {
                this.setState({ loading: false });
            })
    }

    render() {
        let orders = <Spinner />;

        if (!this.state.loading) {
            orders = this.state.orders.map(order => (
                <Order
                    key={order.id}
                    ingredients={order.ingredients}
                    totalPrice={order.totalPrice} />
            ));
        }

        return (
            <React.Fragment>
                {orders}
            </React.Fragment>
        );
    }
}

export default withErrorHandler(Orders, axios);