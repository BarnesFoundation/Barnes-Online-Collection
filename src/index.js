import React from 'react';
import { render } from 'react-dom';
// import { AppContainer } from 'react-hot-loader';

import App from './App';
import { configureStore } from './store';
import { unregister as unregisterServiceWorker } from './registerServiceWorker';
// import registerServiceWorker from './registerServiceWorker';

const store = configureStore(window.__INITIAL_STATE__);
const mountApp = document.getElementById('root');


render(
  <App store={store} />,
  mountApp
);

// if (module.hot) {
//   module.hot.accept('./App', () => {
//     const NextApp = require('./App').default;
//     render(
//       <AppContainer>
//         <NextApp store={store} />
//       </AppContainer>
//     );
//   });
// }

// registerServiceWorker();

// disable this service and clear the 'cache' for users who registered with it before.
// this seems to be messing with the prerendering
// for details, see ./registerServiceWorker and the documentation link mentioned there.
unregisterServiceWorker();