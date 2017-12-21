import React from 'react';
import { BootstrapTable, TableHeaderColumn } from 'react-bootstrap-table';

export default class StockSimilarityTable extends React.Component {

  // Rendering section
  render = () => {
    // Obtain stock data from parent component
    const listStock = this.props.stockList;

    // Hooking the operation of dropping rows
    const options = {

      page: 1,
      sizePerPageList: [ {
        text: '5', value: 5
      } ],
      sizePerPage: 5, // which size per page you want to locate as default
      pageStartIndex: 1, // where to start counting the pages
      paginationSize: 3, // the pagination bar size.
      prePage: 'Prev', // Previous page button text
      nextPage: 'Next', // Next page button text
      firstPage: 'First', // First page button text
      lastPage: 'Last', // Last page button text
      paginationShowsTotal: this.renderShowsTotal, // Accept bool or function
      paginationPosition: 'top', // default is bottom, top and both is all available
      afterDeleteRow: this.onAfterDeleteRow
    };

    return (

      <BootstrapTable data={listStock} options={options} pagination striped hover condensed>
        <TableHeaderColumn isKey={true} dataField='id' width='50' dataSort> ID </TableHeaderColumn>
        <TableHeaderColumn dataField='name' width='200' dataSort> Stock Name</TableHeaderColumn>
        <TableHeaderColumn dataField='average_per' dataSort> Percentage of winner's portfolio holding </TableHeaderColumn>
        <TableHeaderColumn dataField='mean_ratio' dataSort> Proportion of winner's portfolio holding </TableHeaderColumn>
        <TableHeaderColumn dataField='hotness' dataSort > Proportion of all portfolios' holding </TableHeaderColumn>
      </BootstrapTable>
      
    );
  }
}