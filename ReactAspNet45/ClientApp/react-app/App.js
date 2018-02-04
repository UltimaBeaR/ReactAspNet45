import React, { Component } from 'react';

// global css rules (everything like *.global.scss or *.global.css is treated as global stylesheet. See webpack config)
import './App.global.scss';
// local css rules for current component (any other scss or css file is considered as local, css modules are used in this case)
import classes from './App.scss';

class App extends Component {
    render() {
        return (
            <div>
                <span className="colored-text">Hello </span> <span className={ classes['colored-text'] }>world</span>!
            </div>
        );
    }
}

export default App;