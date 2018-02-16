import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import {App} from './App';
import {withRouter, BrowserRouter} from 'react-router-dom'
import registerServiceWorker from './registerServiceWorker';
const RouterApp = withRouter(props => <App {...props}/>);

ReactDOM.render(
    <BrowserRouter>
    <RouterApp/>
</BrowserRouter>, document.getElementById('root'))
registerServiceWorker()
