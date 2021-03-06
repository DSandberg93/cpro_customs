import React, {Component} from 'react';
import update from 'immutability-helper';

import {MuiThemeProvider} from '@material-ui/core/styles';

import theme from '../material-theme'
import {GlobalState} from "./context/GlobalState";
import Header from './header/Header'
import Router from './Router'
import './App.css';

/**
 * The entry point to the SPA
 */
class App extends Component {
    constructor(props) {
        super(props);
        this.state = {
            products: [],
            amount_to_pay: 0,
            productIdCounter: 0,
            overADay: false,
            QRUrl: {},
            number_of_people: 1,
            hasPaid: false,
            JSON: {},
        };
    }

    /*
     * bind functions to be able to change the App.js state
     */
    totalAmount = this.totalAmount.bind(this);
    findProductIndexById = this.findProductIndexById.bind(this);
    removeAllElementsOfType = this.removeAllElementsOfType.bind(this);
    removeAllElementsWithName = this.removeAllElementsWithName.bind(this);
    removeAllElementsWithKind = this.removeAllElementsWithKind.bind(this);
    addProduct = this.addProduct.bind(this);
    updateProduct = this.updateProduct.bind(this);
    getProduct = this.getProduct.bind(this);
    removeProduct = this.removeProduct.bind(this);
    addGood = this.addGood.bind(this);
    getGoods = this.getGoods.bind(this);
    addBoughtAnimal = this.addBoughtAnimal.bind(this);
    getBoughtAnimals = this.getBoughtAnimals.bind(this);
    addAlcoholOrTobacco = this.addAlcoholOrTobacco.bind(this);
    getAlcoholOrTobacco = this.getAlcoholOrTobacco.bind(this);
    setAmountToPay = this.setAmountToPay.bind(this);
    setQRUrl = this.setQRUrl.bind(this);
    setHasPaid = this.setHasPaid.bind(this);
    setProducts = this.setProducts.bind(this);
    resetState = this.resetState.bind(this);
    setter = this.setter.bind(this);
    setJSON = this.setJSON.bind(this);
    isAlcoholOrTobacco = this.isAlcoholOrTobacco.bind(this);

    /**
     * Resets the global state to the initial state
     */
    resetState() {
        this.setState({
            products: [],
            amount_to_pay: 0,
            productIdCounter: 0,
            overADay: false,
            QRUrl: {},
            number_of_people: 0,
            hasPaid: false,
            JSON: {}
        });
    }


    /**
     * Counts the total amount of items
     * @return {number}
     */
    totalAmount() {
        const {products} = this.state;
        let amount = 0;
        for (let i = 0; i < products.length; ++i) {
            amount += products[i].amount;
        }
        return amount;
    }

    /**
     * Adds a product to products
     * @param product - the product to be added
     * @return the id of the product
     */
    addProduct(product) {
        product['id'] = this.state.productIdCounter;
        this.setState({
            productIdCounter: product['id'] + 1,
            products: [...this.state.products, product]
        });
        return product['id'];
    }

    /**
     * Updates a specific field of a product
     * @param id - the id of the product
     * @param field - the field to be updated, e.g. "amount"
     * @param value - the new value
     */
    updateProduct(id, field, value) {
        if (id === undefined || id === null) throw ( "id undefined or null", undefined);
        let index = this.findProductIndexById(id);
        if (index === -1) return;
        const products = update(this.state.products, {
            [index]: {[field]: {$set: value}},
        });
        this.setState({
            products: products,
        });
    }

    /**
     * Returns a product
     * @param id - the id of the product
     * @returns the product object, if id is found, else null
     */
    getProduct(id) {
        let index = this.findProductIndexById(id);
        if (index === -1) return null;
        return this.state.products[index];
    }

    findProductIndexById(id) {
        const {products} = this.state;
        for (let i = 0; i < products.length; ++i) {
            if (products[i].id === id) {
                return i;
            }
        }
        return -1;
    }

    /**
     * Searches for product with id and removes it from products
     * @param id - the id of the product
     */
    removeProduct(id) {
        let {products} = this.state;
        for (let i = 0; i < products.length; ++i) {
            if (products[i].id === id) {
                products.splice(i, 1);
                break;
            }
        }
        this.setState({
            items: products,
        });
    }

    /**
     * Adds a Good to products
     * @param name - the name of the Good, e.g. "kitchen"
     * @param value - the value of the Good, e.g. 30000
     * @param currency - the currency of the value, e.g. "NOK"
     * @param amount - amount of items, e.g. 1
     */
    addGood(name, value, currency, amount) {
        let good = {
            "type": "Goods",
            "name": name,
            "value": value,
            "currency": currency,
            "amount": amount,
            "icon": "good",
        };
        return this.addProduct(good);
    }

    /**
     * Returns all goods
     */
    getGoods() {
        const {products} = this.state;
        let goods = [];
        for (let i = 0; i < products.length; ++i) {
            if (products[i].type.localeCompare('Goods') === 0) {
                goods.push(products[i]);
            }
        }
        return goods;
    }

    /**
     * TODO add docu
     * @param kind
     * @param value
     * @param currency
     * @param amount
     * @param contactedNFSA
     * @param registeredAtNFSA
     * @param horseHasOriginInEU
     * @return {*|the}
     */
    addBoughtAnimal(kind, value, currency, amount, contactedNFSA, registeredAtNFSA, horseHasOriginInEU) {
        let animal = {
            "type": "Bought Animal",
            "kind": kind,
            "value": value,
            "currency": currency,
            "amount": amount,
            "contactedNFSA": contactedNFSA,
            "registeredAtNFSA": registeredAtNFSA,
            "horseHasOriginInEU": horseHasOriginInEU,
            "icon": kind.localeCompare("other") === 0 ? "animal" : kind,
        };
        return this.addProduct(animal);
    }

    /**
     * Returns all bought animals
     */
    getBoughtAnimals() {
        const {products} = this.state;
        let boughtAnimals = [];
        for (let i = 0; i < products.length; ++i) {
            if (products[i].type.localeCompare('Bought Animal') === 0) {
                boughtAnimals.push(products[i]);
            }
        }
        return boughtAnimals;
    }

    /**
     * Adds alcohol/tobacco of specific type to products
     * @param unit - either "litres" or "pieces"
     * @param type - type of alcohol/tobacco, e.g. "Beer" or "Cigarettes"
     * @param value - how many pieces/litres per item, e.g. 20 or 0.5
     * @param amount - amount of items, e.g. 3
     * @param isOtherAmount - true, if user can choose the value himself
     * @param icon - the icon name
     * @return the id of the product
     */
    addAlcoholOrTobacco(unit, type, value, amount, isOtherAmount, icon) {
        let item = {
            "unit": unit,
            "type": type,
            "value": value,
            "amount": amount,
            "isOtherAmount": isOtherAmount,
            "icon": icon,
        };
        return this.addProduct(item);
    }

    /**
     * Searches for an alcohol item in the global state
     * @param type - type of alcohol/tobacco, e.g. "Beer" or "Cigarettes"
     * @param value - how many litres, e.g. 0.5 or 20
     * @param isOtherAmount - boolean, true if its a other amount item
     */
    getAlcoholOrTobacco(type, value, isOtherAmount) {
        const {products} = this.state;
        if (isOtherAmount) {
            for (let i = 0; i < products.length; ++i) {
                if (products[i].type.localeCompare(type) === 0 && products[i].isOtherAmount) {
                    return products[i];
                }
            }
        } else {
            for (let i = 0; i < products.length; ++i) {
                if (products[i].type.localeCompare(type) === 0 && products[i].value === value) {
                    return products[i];
                }
            }
        }
        return null;
    }

    /**
     * Removes all products of a certain type
     * @param type - the product type, e.g. "Beer"
     */
    removeAllElementsOfType(type) {
        let products = [...this.state.products];
        let indices = [];
        for (let i = 0; i < products.length; i++) {
            if (products[i].type === type) {
                indices.push(i)
            }
        }

        for (let i = indices.length - 1; i >= 0; i--) {
            products.splice(indices[i], 1);
        }

        this.setState({
            products: products,
        });
    }

    /**
     * Removes all products with a certain name (This is needed for goods)
     * @param name - the product name, e.g. "Kitchen" etc.
     */
    removeAllElementsWithName(name) {
        let products = [...this.state.products];
        let indices = [];
        for (let i = 0; i < products.length; i++) {
            if (products[i].name === name) {
                indices.push(i)
            }
        }

        for (let i = indices.length - 1; i >= 0; i--) {
            products.splice(indices[i], 1);
        }

        this.setState({
            products: products,
        });
    }

    /**
     * Removes all products with a certain kind (This is needed for animals)
     * @param kind - the product kind, e.g. "dog" etc.
     */
    removeAllElementsWithKind(kind) {
        let products = [...this.state.products];
        let indices = [];
        for (let i = 0; i < products.length; i++) {
            if (products[i].kind === kind) {
                indices.push(i)
            }
        }

        for (let i = indices.length - 1; i >= 0; i--) {
            products.splice(indices[i], 1);
        }

        this.setState({
            products: products,
        });
    }

    setAmountToPay(toPay){
        this.setState({
            amount_to_pay: toPay
        })
    }

    setQRUrl(url) {
        this.setState({
            QRUrl: url,
        });
    }

    /**
     * Setter for setting hasPaid property
     * @param value - a boolean
     */
    setHasPaid(value) {
        this.setState({
            hasPaid: value,
        })
    }

    /**
     * Setter to set products
     * @param value - the new array
     */
    setProducts(value) {
        this.setState({
            products: value,
        })
    }

    /**
     * Setter to set any key of the global state
     * @param key - name of the state property
     * @param value
     */
    setter(key, value) {
        this.setState({
           [key]: value,
        });
    }

    setJSON(json){
        this.setState({
            JSON: json
        })
    }

    isAlcoholOrTobacco(type){
        switch (type) {
            case "Beer":
            case "Alcopop and others":
            case "Wine":
            case "Fortified wine":
            case "Spirits":
            case "Cigarettes":
            case "Snuff and chewing tobacco":
            case "Smoking tobacco":
            case "Cigars and Cigarillos":
            case "Cigarette paper and sheets":
                return true;
            default:
                return false;
        }
    }

    render() {
        return (
            <GlobalState.Provider
                /*
                    provide state and functions
                 */
                value={{
                    products: this.state.products,
                    amount_to_pay: this.state.amount_to_pay,
                    overADay: this.state.overADay,
                    JSON: this.state.JSON,
                    number_of_people: this.state.number_of_people,
                    QRUrl: this.state.QRUrl,
                    totalAmount: this.totalAmount,
                    hasPaid: this.state.hasPaid,
                    findProductIndexById: this.findProductIndexById,
                    removeAllElementsOfType: this.removeAllElementsOfType,
                    removeAllElementsWithName: this.removeAllElementsWithName,
                    removeAllElementsWithKind: this.removeAllElementsWithKind,
                    addProduct: this.addProduct,
                    updateProduct: this.updateProduct,
                    getProduct: this.getProduct,
                    removeProduct: this.removeProduct,
                    addGood: this.addGood,
                    getGoods: this.getGoods,
                    addBoughtAnimal: this.addBoughtAnimal,
                    getBoughtAnimals: this.getBoughtAnimals,
                    addAlcoholOrTobacco: this.addAlcoholOrTobacco,
                    getAlcoholOrTobacco: this.getAlcoholOrTobacco,
                    setAmountToPay: this.setAmountToPay,
                    setQRUrl: this.setQRUrl,
                    setHasPaid: this.setHasPaid,
                    setProducts: this.setProducts,
                    resetState: this.resetState,
                    setter: this.setter,
                    setJSON: this.setJSON,
                    isAlcoholOrTobacco: this.isAlcoholOrTobacco,
                }}
            >
                <div>
                    <MuiThemeProvider theme={theme}>
                        {/* put components that shall be displayed on every page here */}
                        <Header/>
                        {/* handles dynamic component loading */}
                        <Router/>
                    </MuiThemeProvider>
                </div>
            </GlobalState.Provider>
        );
    }
}

export default (App);