import React, { Component } from 'react';

import Auxiliary from '../../hoc/Auxiliary/Auxiliary';
import Burger from '../../components/Burger/Burger';
import BuildControls from '../../components/Burger/BuildControls/BuildControls';
import Modal from '../../components/UI/Modal/Modal';
import OrderSummary from '../../components/Burger/OrderSummary/OrderSummary';
import axios from '../../axios-orders';
import Spinner from '../../components/UI/Spinner/Spinner';
import withErrorComponent from '../../hoc/withErrorHandler/withErrorHandler';

const INGREDIENT_PRICES = {
    salad: 0.5,
    bacon: 0.7,
    cheese: 0.4,
    meat: 1.3
}

class BurgerBuilder extends Component {
    state = {
        ingredients: null,
        totalPrice: 4,
        purchaseable: false,
        purchasing: false,
        loading: false,
        error: false
    }

    updatePurchaseState(ingredients) {
        const sum = Object.keys(ingredients)
            .map(igKey => {
                return ingredients[igKey];
            })
            .reduce((sum, el) => {
                return sum + el;
            }, 0);

        this.setState({ purchaseable: sum > 0 });
    }

    componentDidMount() {
        axios.get('https://react-burger-builder-4026b.firebaseio.com/ingredients.json')
            .then(response => {
                const ingredients = {
                    salad: null,
                    bacon: null,
                    cheese: null,
                    meat: null
                };
                let price = this.state.totalPrice;
                for (const ingredient in ingredients) {
                    ingredients[ingredient] = response.data[ingredient];
                    price += INGREDIENT_PRICES[ingredient] * ingredients[ingredient];
                }

                this.setState({
                    ingredients: ingredients,
                    totalPrice: price
                });
            })
            .catch(error => { this.setState({ error: true }) });
    }

    addIngredientHnadler = (type) => {
        const oldCount = this.state.ingredients[type];
        const updatetdCount = oldCount + 1;
        const updatedIngredients = {
            ...this.state.ingredients
        };
        updatedIngredients[type] = updatetdCount;
        const oldPrice = this.state.totalPrice;
        const newPrice = oldPrice + INGREDIENT_PRICES[type];

        this.setState({
            ingredients: updatedIngredients,
            totalPrice: newPrice
        });

        this.updatePurchaseState(updatedIngredients);
    };

    removeIngredientHadler = (type) => {
        const oldCount = this.state.ingredients[type];
        if (oldCount <= 0) {
            return;
        }
        const updatetdCount = oldCount - 1;
        const updatedIngredients = {
            ...this.state.ingredients
        };
        updatedIngredients[type] = updatetdCount;
        const oldPrice = this.state.totalPrice;
        const newPrice = oldPrice - INGREDIENT_PRICES[type];;

        this.setState({
            ingredients: updatedIngredients,
            totalPrice: newPrice
        });

        this.updatePurchaseState(updatedIngredients);
    };

    purchaseHandler = () => {
        this.setState({ purchasing: true });
    }

    purchaseCancelHandler = () => {
        this.setState({ purchasing: false });
    }

    purchaseContinueHandler = () => {
        const queryParams = [];
        queryParams.push('price=' + this.state.totalPrice);
        for (let ingredient in this.state.ingredients) {
            queryParams.push(encodeURIComponent(ingredient)
                + '=' + encodeURIComponent(this.state.ingredients[ingredient]));
        }
        const queryString = queryParams.join('&');

        this.props.history.push({
            pathname: '/checkout',
            search: '?' + queryString
        });
    }

    render() {
        const disabledInfo = {
            ...this.state.ingredients
        }
        for (let key in disabledInfo) {
            disabledInfo[key] = disabledInfo[key] <= 0;
        }

        let orderSummary = null;
        let burger = this.state.error ? <p style={{
            textAlign: 'center',
            color: 'red',
            fontWeight: 'bold'
        }}>Ingredients can't be loaded!</p> : <Spinner />;

        if (this.state.ingredients) {
            burger = (<Auxiliary>
                <Burger ingredients={this.state.ingredients} />
                <BuildControls
                    ingredientAdded={this.addIngredientHnadler}
                    ingredientRemoved={this.removeIngredientHadler}
                    disabled={disabledInfo}
                    purchasable={this.state.purchaseable}
                    ordered={this.purchaseHandler}
                    price={this.state.totalPrice} />
            </Auxiliary>);

            orderSummary = <OrderSummary
                ingredients={this.state.ingredients}
                purchaseCanceled={this.purchaseCancelHandler}
                purchaseContinued={this.purchaseContinueHandler}
                totalPrice={this.state.totalPrice} />;
        }

        if (this.state.loading) {
            orderSummary = <Spinner />;
        }

        return (
            <Auxiliary>
                <Modal
                    show={this.state.purchasing}
                    modalClosed={this.purchaseCancelHandler}>
                    {orderSummary}
                </Modal>
                {burger}
            </Auxiliary>
        );
    }
}

export default withErrorComponent(BurgerBuilder, axios);