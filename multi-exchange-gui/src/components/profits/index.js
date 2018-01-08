import React, { Component } from 'react';
import Stomp from 'stompjs';
import CircularProgress from 'material-ui/CircularProgress';

import ProfitContent from './profit-content';
import ProfitSideBar from './profit-sidebar';

import {Exchanges} from "../utils/constants";



class CalculateProfits extends Component {


    constructor(props) {
        super(props);

        this.state = {
            profits: {
                isFetching: true,
                error: undefined,
                data: []
            },
            filter: {
                maxProfitSlider: undefined,
                exchanges: Object.keys(Exchanges).map(exchange => {
                    return {
                        name: exchange,
                        label: Exchanges[exchange],
                        enabled: true
                    }
                })
            }
        };

        this.receiveUpdatedProfit = this.receiveUpdatedProfit.bind(this);
        this.initialize = this.initialize.bind(this);
        this.updateFilter = this.updateFilter.bind(this);
        this.filterProfits = this.filterProfits.bind(this);
    }


    componentDidMount() {
        this.initialize();
    }


    render() {


        if (this.state.profits.isFetching)
            return  <CircularProgress style={{left: "50%"}} size={80} thickness={5} />;

        if (this.state.profits.error)
            return <div className="alert alert-danger">{`Error fetching profits. Service not available!`}</div>;

        if (this.state.profits.data.length === 0)
            return <div className="alert alert-warning">No profits found! This page will update automatically when new profits are available.</div>;


        return (
            <div >
                <div className="sidebar col-sm-3">
                    <ProfitSideBar
                        {...this.state}
                        updateFilter={this.updateFilter}
                    />
                </div>
                <div className="content col-sm-9">
                    <ProfitContent
                       profits={this.state.profits}
                    />
                </div>

                <div id="donation">
                    <div className="row">
                        <div className="col-sm-3">
                            <p>Donate ETH:&nbsp;
                                <a target="_blank" href="https://etherscan.io/address/0x00bC09660B16AA7614A77313a9D9d0643C47555c#">0x00bC09660B16AA7614A77313a9D9d0643C47555c</a></p>
                        </div>
                    </div>
                    <div className="row">
                        <div className="col-sm-3">
                            Donate BTC:&nbsp;
                            <a target="_blank" href="https://blockchain.info/address/1JFgCTawZDcar9qd6XAAqR9iEWAFRji9tT">1JFgCTawZDcar9qd6XAAqR9iEWAFRji9tT</a>
                        </div>
                    </div>
                </div>

            </div>
        );
    }


    initialize() {

        // initialize web socket
        this.client = Stomp.client(`${process.env.REACT_APP_SOCKET_URL}/currentProfits/websocket`);
        this.client.connect(undefined, undefined, this.connectSuccess.bind(this));


        // fetch available profits
        fetch(`${process.env.REACT_APP_API_URL}/profits/getCurrentProfits`)
            .then(res => {
                if(res.status === 200)
                    return res.json();

                throw (res.status);
            })
            .then(profits => {

                this.setState({
                    profits: {
                        isFetching: false,
                        error: undefined,
                        data: profits,
                        filtered: profits
                    },
                    filter: Object.assign({}, this.state.filter, {
                        maxProfitSlider: {
                            max: getMaxProfit(profits),
                            value: 0
                        }
                    })
                });
            }).catch(err => {
                this.setState({
                    profits: {
                        isFetching: false,
                        error: err,
                        data: []
                    }
                });

        })
    }


    connectSuccess() {
        this.client.subscribe("/topic/profits", this.receiveUpdatedProfit);
    }

    receiveUpdatedProfit(response) {

        let updatedProfit = JSON.parse(response.body);


        if (this.state.profits.data.length > 0) {
            updatedProfit = updatedProfit.map(profit => {

                const existingProfit = this.state.profits.data.find(p => p.currencyPair === profit.currencyPair);

                if (existingProfit) {
                    if (profit.profit > existingProfit.profit)
                        return Object.assign({}, profit, {
                            isPositive: true
                        });
                    else if (profit.profit < existingProfit.profit)
                        return Object.assign({}, profit, {
                            isPositive: false
                        });
                }

                return profit;
            });
        }

        this.setState({
            profits: Object.assign({}, this.state.profits, {
                data: updatedProfit,
                filtered: this.filterProfits(updatedProfit, this.state.filter)
            }),
            filter: Object.assign({}, this.state.filter, {
                maxProfitSlider: {
                    max: getMaxProfit(updatedProfit),
                    value: this.state.filter.maxProfitSlider.value ? this.state.filter.maxProfitSlider.value : 0
                }
            })
        });
    }

    updateFilter(filter) {

        this.setState({
            filter: filter,
            profits: Object.assign({}, this.state.profits, {
                filtered: this.filterProfits(this.state.profits.data, filter)
            })
        });
    }

    filterProfits(profits, filter) {

        return profits.filter(profit =>
            profit.profit >= filter.maxProfitSlider.value &&
            (filter.exchanges.find(exchange => (exchange.label === profit.buyExchange && exchange.enabled) || (filter.exchanges.find(exchange => exchange.label === profit.sellExchange && exchange.enabled)  ))));
    }


}

export default CalculateProfits;



export const getMaxProfit = (profits) => {

    if(profits.length === 0)
        return 0;

    return profits.reduce((max, p) => p.profit > max ? p.profit : max, profits[0].profit);
};
