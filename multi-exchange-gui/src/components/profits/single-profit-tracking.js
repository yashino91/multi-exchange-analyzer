import React, { Component } from 'react';
import _ from 'underscore';
import ReactHighcharts from 'react-highcharts';
import moment from 'moment';

import {percentageFormatter, priceFormatter} from '../utils/formatters';


class SingleProfitTracking extends Component {


    constructor(props) {
        super(props);

        this.state = {
            current: props.profit
        };

        // initial profit data for real time chart
        this.data = [
            {
                x: moment(props.profit.datetime).toDate(),
                y: props.profit.profit
            }
        ];

        this.renderHeading       = this.renderHeading.bind(this);
        this.getPanelClassName   = this.getPanelClassName.bind(this);
        this.addNewProfitToChart = this.addNewProfitToChart.bind(this);
    }

    componentWillReceiveProps(nextProps) {
        const {profit} = nextProps;

        if (!_.isEqual(profit, this.props.profit))
            this.addNewProfitToChart(profit);
    }


    render() {

        return (
            <div className={this.getPanelClassName()}>
                {this.renderHeading()}
                <div className="panel-body">

                    <div className="row">
                        <div id="trackingDetails">
                            <div className="col-md-3">
                                <strong>Buy Exchange: </strong>
                                <span>{this.state.current.buyExchange}</span>
                            </div>
                            <div className="col-md-3">
                                <strong>Buy Price: </strong>
                                <span>{priceFormatter(this.state.current.buyPrice)}</span>
                            </div>
                            <div className="col-md-3">
                                <strong>Sell Exchange: </strong>
                                <span>{this.state.current.sellExchange}</span>
                            </div>
                            <div className="col-md-3">
                                <strong>Sell Price: </strong>
                                <span>{priceFormatter(this.state.current.sellPrice)}</span>
                            </div>
                        </div>
                    </div>

                    <div className="row">
                        <div className="col-md-12">
                            <div>
                                <ReactHighcharts
                                    ref="chart"
                                    isPureConfig={true}
                                    neverReflow={true}
                                    config = {{
                                        chart: {
                                            type: 'spline',
                                            height: 240
                                        },
                                        title: {
                                            text: 'Live Profit Chart'
                                        },
                                        xAxis: {
                                            type: 'datetime',
                                            dateTimeLabelFormats: {
                                                second: '%H:%M:%S'
                                            },
                                            labels: {
                                                formatter: function() {
                                                    return moment(this.value).format("HH:mm:ss")
                                                }
                                            }
                                        },
                                        yAxis: {
                                            title: {
                                                text: 'Profit (%)'
                                            },
                                            labels: {
                                                formatter: function() {
                                                    return percentageFormatter(this.value)
                                                }
                                            }
                                        },
                                        legend: {
                                            enabled: false
                                        },
                                        tooltip: {
                                            pointFormatter: function() {

                                                const formattedProfit = percentageFormatter(this.y);

                                                return '<span style="color:' + this.series.color + '">\u25CF</span> ' + this.series.name + ': <b>' + formattedProfit + '</b><br/>.';

                                            }
                                        },
                                        series: [{
                                            name: "Profit",
                                            data: this.data

                                        }],
                                    }}
                                />
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        );
    }


    renderHeading() {

        const current = this.state.current;

        return (
            <div className="panel-heading">
                {`${current.currencyPair} (${percentageFormatter(current.profit)})`}
                {this.state.current.containsErc20Token &&
                    <span title="Erc20 Token" className="pull-right label label-warning tokenBadge">Erc20</span>
                }
            </div>
        );
    }

    getPanelClassName() {

        switch (this.state.current.isPositive) {
            case true:
                return "panel panel-success";
            case false:
                return "panel panel-danger";
            default:
                return "panel panel-default";
        }
    }

    addNewProfitToChart(profit) {

        const chart  = this.refs.chart.getChart();

        // add the point
        chart.series[0].addPoint(
            {
                x: moment(profit.datetime).toDate(),
                y: profit.profit
            },
            true,
            chart.series[0].data.length > 40
        );

        this.setState({
            current: profit,
        });
    }

}

export default SingleProfitTracking;


