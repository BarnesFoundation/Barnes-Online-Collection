import { createStore, applyMiddleware, compose } from 'redux';
import thunk from 'redux-thunk';
import rootReducer from './reducers';
import { resetIndex } from './middleware/resetIndex';

export function configureStore(initialState = {}) {
  const enhancers = [
    applyMiddleware(thunk, resetIndex)
  ];

  // For redux devtools, via: https://github.com/zalmoxisus/redux-devtools-extension
  const composeEnhancers =
    typeof window === 'object' &&
    window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ ?   
      window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__({
        // Specify extension’s options like name, actionsBlacklist, actionsCreators, serialize...
      }) : compose;
      
  let store = createStore(
    rootReducer,
    initialState,
    composeEnhancers(...enhancers)
  );

  // if (module.hot) {
  //   module.hot.accept('./reducers', () => {
  //     const nextReducer = require('./reducers').default;
  //     store.replaceReducer(nextReducer);
  //   });
  // }

  return store;
}
