import React from 'react';
import ReactDOM from 'react-dom';
import {BrowserRouter as Router} from 'react-router-dom';

import 'bootstrap/dist/css/bootstrap.css';
import 'bootstrap/dist/css/bootstrap-theme.css';
import './index.css';

import registerServiceWorker from './registerServiceWorker';

import App from './components/app';



ReactDOM.render(
    <Router basename={'/me-analyzer/'}>
        <App />
    </Router>
    , document.getElementById('root'));
registerServiceWorker();
