import React, { Component } from 'react';
import Slider from 'material-ui/Slider';
import Checkbox from 'material-ui/Checkbox';

import {timeFormatter} from '../utils/formatters';


const power = 0.1;
class ProfitSideBar extends Component {

    constructor(props) {
        super(props);

        this.onCheckExchange = this.onCheckExchange.bind(this);
    }


    render() {

        const {profits, filter} = this.props;


        return (
            <div className="row sidebar-content">
                <div className="alert alert-success profit-count">
                    <span>{`${profits.filtered.length} / ${profits.data.length} Profits`}</span>
                    <div id="lastUpdate" className="alert alert-info">
                        <span>{`Last Update: ${timeFormatter(profits.data[0].datetime)}`}</span>
                    </div>
                </div>


                <div id="filterControls">

                    <div className="row">
                        <div className="col-md-12 filter-control ">
                            <div className="filter-control-header">{`Profit: ${filter.maxProfitSlider.value.toFixed(2)}%`}</div>
                            <Slider
                                min={0}
                                max={filter.maxProfitSlider.max}
                                value={(1 / power) * Math.log(((Math.exp(power) - 1) * filter.maxProfitSlider.value / filter.maxProfitSlider.max) + 1) * filter.maxProfitSlider.max}
                                onChange={this.handleChangeProfitSlider.bind(this)}
                                sliderStyle={{
                                    marginBottom: "5px",
                                    marginTop: "5px",
                                    marginLeft: "5px",
                                    marginRight: "5px"
                                }}
                            />

                            <span>0%</span>
                            <span className="pull-right">{filter.maxProfitSlider.max.toFixed(2)}%</span>
                        </div>
                    </div>

                    <div className="row">
                        <div className="col-md-12 filter-control">
                            <div className="filter-control-header">Exchanges</div>
                            {filter.exchanges.map(exchange => {
                                return (
                                    <Checkbox
                                        key={exchange.name}
                                        label={exchange.label}
                                        checked={exchange.enabled === true}
                                        onCheck={(event, checked) => this.onCheckExchange(exchange.name, checked)}
                                    />
                                );
                            })}
                        </div>
                    </div>

                </div>
            </div>
        );
    }

    onCheckExchange(exchangeName, checked) {

        const {filter} = this.props;

        const updatedExchangeIndex = filter.exchanges.findIndex(exchange => exchange.name === exchangeName);


        if (updatedExchangeIndex !== -1) {

            const exchanges = filter.exchanges;
            exchanges[updatedExchangeIndex].enabled = checked;

            this.props.updateFilter(Object.assign({}, filter, {
                exchanges: exchanges
            }));
        }
    }


    handleChangeProfitSlider(event, value) {

        const {filter} = this.props;

        this.props.updateFilter(Object.assign({}, filter, {
            maxProfitSlider: Object.assign({}, filter.maxProfitSlider, {
                value: (Math.exp(power * value / filter.maxProfitSlider.max) - 1) / (Math.exp(power) - 1) * filter.maxProfitSlider.max
            })
        }));
    }
}

export default ProfitSideBar;

