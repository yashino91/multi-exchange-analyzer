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
            }
        };

        this.selectRowProp = {
            mode: 'radio',
            hideSelectColumn: true,
            bgColor: '#BDDFF0',
            clickToSelect: true,
            onSelect: this.onRowSelect.bind(this),
            className: 'custom-select-class',
            selected: [props.profits.data[0].currencyPair]
        }
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
                            index: index + 1
                        })
                    })}
                    options={this.state.options}
                    headerStyle={{marginTop: '20px'}}>
                    <TableHeaderColumn
                        width='100px'
                        dataField='index'
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
}

export default ProfitTable;