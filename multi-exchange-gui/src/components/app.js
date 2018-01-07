import React, { Component } from 'react';
import {Route} from 'react-router-dom';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import AppBar from 'material-ui/AppBar';

import './app.css';

import CalculateProfits from './profits/index';


class App extends Component {

  render() {

    return (

        <MuiThemeProvider>
            <div>
                <header>
                    <AppBar
                        title="Multi Exchange Analyzer"
                        iconClassNameRight="muidocs-icon-navigation-expand-more"
                    />
                </header>

                <main className="container-fluid app-content">
                    <Route exact path={`/`} component={CalculateProfits} />
                </main>
            </div>
        </MuiThemeProvider>
    );

  }
}

export default App;
