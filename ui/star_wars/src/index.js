/**
 * file: web/static/js/index.js
 */

import React from 'react';
import ReactDOM from 'react-dom';
import Relay from 'react-relay';
import useRelay from 'react-router-relay';
import {
  Router,
  Route,
  IndexRoute,
  browserHistory,
  applyRouterMiddleware
} from 'react-router'

// App components
import AppLayout from './AppLayout';
import Factions from './Factions';
import Queries from './RelayQueryConfig';

// Import some global CSS (some because not implemented in shared)
import 'material-design-lite/src/shadow/_shadow.scss';
import 'material-design-lite/src/radio/_radio.scss';
import 'material-design-lite/src/typography/_typography.scss';
import 'react-select/dist/react-select.css';

let store = new Relay.Environment();
store.injectNetworkLayer(
  new Relay.DefaultNetworkLayer('/star_wars/graphql')
);

const importError = (err) => {
  console.log(err);
}

ReactDOM.render(
  <Router history={browserHistory}
    render={applyRouterMiddleware(useRelay)}
    environment={store}>
    <Route path="/star_wars" component={AppLayout}>
      <IndexRoute component={Factions} queries={Queries} />
      <Route
        path="graphiql"
        getComponent={(location, cb) => {
          import('core/my-graphiql').then(module => {
            cb(null, module.default);
          }).catch(importError)
        }}
      />
    </Route>
  </Router>,
  document.getElementById('react-root')
);
