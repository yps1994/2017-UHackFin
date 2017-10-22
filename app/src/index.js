import React from 'react';
import ReactDOM from 'react-dom';
import registerServiceWorker from './registerServiceWorker';
import './index.css';
import '../node_modules/react-bootstrap-table/dist/react-bootstrap-table-all.min.css';

import BankAccountList from './BankAccountList';

ReactDOM.render(<BankAccountList/>, document.getElementById('bankaccount-list'));
registerServiceWorker();
