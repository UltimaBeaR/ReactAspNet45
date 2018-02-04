// './react-app/App' must be module which exports root component for whole react application as DEFAULT (export default ...)
// Root component module and all of it's dependencies will be under HMR control (hot module replacement feature)

import React from 'react';
import ReactDOM from 'react-dom';
import { AppContainer } from 'react-hot-loader';

import ReactApp from './react-app/App';

const startReactApp = (App) => {
    ReactDOM.render(
        <AppContainer>
            <App />
        </AppContainer>,
        document.getElementById('react-app')
    );
};

// start rendering react app
startReactApp(ReactApp);

if (module.hot) {
    // allow hot module replacement (HMR)
    module.hot.accept('./react-app/App', () => startReactApp(require('./react-app/App').default));
}