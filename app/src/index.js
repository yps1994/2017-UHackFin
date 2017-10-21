import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import BankAccountList from './BankAccountList';
import registerServiceWorker from './registerServiceWorker';

ReactDOM.render(<BankAccountList/>, document.getElementById('bankaccount-list'));
registerServiceWorker();
