import React from 'react';
import StockSimilarityTable from './Stock/SimilarityTable';


export default class StockSimilaritySection extends React.Component {

  // Rendering section
  render = () => {
    // get data from state, not from props
    const stockList = this.props.stockList;
    const user_id = this.props.user_id;

    return (
      <div id="similarity-wrapper">
        <div id="section-text">
          3. Compare your portfolio with winners' portfolio <hr/>
        </div>
        <div id="similarity-content">
          <div className="stock-table">
            <StockSimilarityTable user_id={user_id} stockList={stockList} />
          </div>
        </div>
      </div>
    );
  }
}
