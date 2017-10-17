import React from 'react'
import { render } from 'react-dom'
// import { AppContainer } from 'react-hot-loader';

import App from './App'
import { configureStore } from './store'
import { unregister as unregisterServiceWorker } from './registerServiceWorker'

const store = configureStore(window.__INITIAL_STATE__)
const mountApp = document.getElementById('root')

render(
  <App store={store} />,
  mountApp
)

// disable this service and clear the 'cache' for users who registered with it before.
// this seems to be messing with the prerendering
// for details, see ./registerServiceWorker and the documentation link mentioned there.
unregisterServiceWorker()
