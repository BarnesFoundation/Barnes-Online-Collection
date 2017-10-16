import React from 'react';
import { render } from 'react-dom';
// import { AppContainer } from 'react-hot-loader';

import App from './App';
import { configureStore } from './store';
import { unregister as unregisterServiceWorker } from './registerServiceWorker';

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
unregisterServiceWorker();
