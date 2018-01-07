import React, {Component} from "react";
import {BootstrapTable, TableHeaderColumn} from 'react-bootstrap-table';

import {percentageFormatter, priceFormatter} from '../utils/formatters';



class ProfitTable extends Component {


    constructor(props) {
        super(props);

        this.state = {
            options: {
                noDataText: "No profits available",
                clearSearch: true
            },
            erc20Tokens: []
        };

        this.selectRowProp = {
            mode: 'radio',
            hideSelectColumn: true,
            clickToSelect: true,
            onSelect: this.onRowSelect.bind(this),
            className: 'custom-select-class',
            selected: [props.profits.data[0].currencyPair]
        };

    }

    componentDidMount() {

        fetch(`https://raw.githubusercontent.com/kvhnuke/etherwallet/mercury/app/scripts/tokens/ethTokens.json`)
            .then(res => {
                if(res.status === 200)
                    return res.json();

                throw (res.status);
            })
            .then(erc20Tokens => {
                this.setState({erc20Tokens: erc20Tokens})
            }).catch(err => {
                console.error("error fetching tokens: ", err);
        })
    }


    render() {

        const {profits} = this.props;

        return (
            <div className="col-md-12">
                <BootstrapTable
                    trClassName={this.trClassFormat.bind(this)}
                    selectRow={this.selectRowProp}
                    search
                    data={profits.filtered.map((profit, index) => {
                        return Object.assign({}, profit, {
                            index: index + 1,
                            containsErc20Token: this.containsErc20Token(profit.currencyPair)
                        })
                    })}
                    options={this.state.options}
                    headerStyle={{marginTop: '20px'}}>
                    <TableHeaderColumn
                        width='100px'
                        dataField='index'
                        dataFormat={this.rankFormatter}
                        dataSort={ true }>
                        Rank
                    </TableHeaderColumn>
                    <TableHeaderColumn
                        width='130px'
                        isKey
                        dataField='currencyPair'
                        dataSort={ true }>
                        Currency Pair
                    </TableHeaderColumn>
                    <TableHeaderColumn
                        width='150px'
                        dataField='buyExchange'
                        dataSort={ true }>
                        Buy Exchange
                    </TableHeaderColumn>
                    <TableHeaderColumn
                        width='180px'
                        dataField='buyPrice'
                        dataAlign='right'
                        dataFormat={priceFormatter}
                        dataSort={ true }>
                        Buy Price
                    </TableHeaderColumn>
                    <TableHeaderColumn
                        width='150px'
                        dataField='sellExchange'
                        dataSort={ true }>
                        Sell Exchange
                    </TableHeaderColumn>
                    <TableHeaderColumn
                        width='180px'
                        dataField='sellPrice'
                        dataAlign='right'
                        dataFormat={priceFormatter}
                        dataSort={ true }>
                        Sell Price
                    </TableHeaderColumn>
                    <TableHeaderColumn
                        width='150px'
                        dataFormat={percentageFormatter}
                        dataAlign='right'
                        dataField='profit'
                        dataSort={ true }>
                        Profit
                    </TableHeaderColumn>
                </BootstrapTable>
            </div>
        );
    }

    trClassFormat(rowData) {
        if(rowData.isPositive === undefined)
            return null;

        if(rowData.isPositive === true)
            return "greenRow";

        if(rowData.isPositive === false)
            return "redRow";
    }

    onRowSelect(row) {
        this.props.setTrackedProfit(row);

        this.selectRowProp.selected[0] = row.currencyPair;
    }

    rankFormatter(rank, row) {

        if (row.containsErc20Token)
            return (
                <span>
                    <span>{rank}</span>
                    <span title="Erc20 Token" className="pull-right label label-warning tokenBadge">Erc20</span>
                </span>
            );

        return <span>{rank}</span>;
    }

    containsErc20Token(currencyPair) {

        const firstCurrency = currencyPair.substring(0, currencyPair.indexOf('/'));
        const secondCurrency = currencyPair.substring(currencyPair.indexOf('/') + 1);


        if (this.state.erc20Tokens.find(token => token.symbol === firstCurrency || token.symbol === secondCurrency))
            return true;

        return false;
    };
}

export default ProfitTable;