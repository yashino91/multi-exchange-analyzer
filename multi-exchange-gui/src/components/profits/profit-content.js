import React, { Component } from 'react';
import CircularProgress from 'material-ui/CircularProgress';

import ProfitTable from './profit-table';
import SingleProfitTracking from './single-profit-tracking';



class ProfitContent extends Component {


    constructor(props) {
        super(props);

        const {profits} = props;

        this.state = {
            trackedProfit: {
                currencyPair:  profits.data[0].currencyPair,
                buyExchange: profits.data[0].buyExchange,
                sellExchange: profits.data[0].sellExchange
            }
        };

        this.getTrackedProfit = this.getTrackedProfit.bind(this);
    }

    componentDidUpdate(prevProps, prevState) {
        if (this.state.transition)
            setTimeout(() => {
                this.setState({transition: false});
                window.scrollTo(0, 0);
            }, 500);
    }


    render() {

        const {profits} = this.props;

        return (
            <div>

                {/*Details about selected profit*/}
                <div className="row">
                    <div  id="singleProfitTracking">
                        {this.renderSingleProfitTracking()}
                    </div>
                </div>

                {/*Table of all available profits*/}
                <div  className="row">
                    <div className="panel panel-default">
                        <div className="panel-heading">All Profits</div>
                        <div className="panel-body">
                            <ProfitTable
                                profits={profits}
                                setTrackedProfit={this.setTrackedProfit.bind(this)}
                            />
                        </div>
                    </div>
                </div>

            </div>
        );
    }

    renderSingleProfitTracking() {


        if (this.state.transition)
            return (
                <div className="panel panel-default">
                    <div className="panel-heading">Loading</div>
                    <div className="panel-body">
                        <CircularProgress style={{left: "50%"}} size={40} thickness={3} />
                    </div>
                </div>
            );


        if (this.state.trackedProfit) {

            const foundProfit = this.getTrackedProfit();

            if (foundProfit)
                return (
                    <SingleProfitTracking
                        profit={foundProfit}
                    />
                );

            // selected profit no longer available
            return (
                <div className="panel panel-default">
                    <div className="panel-heading">Profit no longer available</div>
                    <div className="panel-body">
                        Your selected currency pair is no longer yielding any profit. Select another currency pair in the following table to display a life profit chart.
                    </div>
                </div>
            );
        }

        // no profit selected
        return (
            <div className="panel panel-default">
                <div className="panel-heading">No Profit selected</div>
                <div className="panel-body">
                    Select a currency pair in the following table to display a life profit chart.
                </div>
            </div>
        );
    }

    setTrackedProfit(profit) {
        this.setState({
            trackedProfit: {
                currencyPair: profit.currencyPair,
                buyExchange: profit.buyExchange,
                sellExchange: profit.sellExchange,
                containsErc20Token: profit.containsErc20Token
            },
            transition: true
        });
    }

    getTrackedProfit() {

        const {profits} = this.props;

        if (this.state.trackedProfit === undefined)
            return undefined;

        const trackedProfit = profits.data.find(profit => profit.currencyPair === this.state.trackedProfit.currencyPair &&
                                           profit.buyExchange === this.state.trackedProfit.buyExchange   &&
                                           profit.sellExchange === this.state.trackedProfit.sellExchange);

        if(trackedProfit)
            trackedProfit.containsErc20Token = this.state.trackedProfit.containsErc20Token;

        return trackedProfit;
    }

}

export default ProfitContent;


