import React from 'react';
import ReactDOM from 'react-dom';
import registerServiceWorker from './registerServiceWorker';
import './index.css';
import '../node_modules/react-bootstrap-table/dist/react-bootstrap-table-all.min.css';

import Portfolio from './Portfolio';

ReactDOM.render(<Portfolio/>, document.getElementById('bankaccount-content'));
registerServiceWorker();
