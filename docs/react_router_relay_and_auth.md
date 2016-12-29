# react-router-relay and Auth

## Auth

[Auth](ui/core/src/lib/auth.js) is a module created to manage the `Relay.Environment` and any information related to the authentication process, for example the [JWT access token](https://jwt.io/introduction/). Most of the `Auth` functions are self explanatory. You can see some of this in action in the code in the sections bellow.

## react-router-relay environment

For security reasons you might want to reset the Router environment (_stored in the browser_) every time a User logs in or out. We first tried to implement environment as a function but ended up changing the `Application` state to trigger its `render()` as discussed in the [pull request](https://goo.gl/vwxrPK) and like in the following example:

```javascript
/*
  Extract routes as a constant so it is re used for every render
  To avoid errors like:
  Warning: [react-router] You cannot change <Router routes>; it will be ignored
 */

const routes = (
 <Route path="/">
   <IndexRoute component={Hello}/>
   <Route path="/login" component={Login}  onEnter={verifySession}/>
   <Route path="/admin" component={AdminLayout} onEnter={requireAuth}>
     <IndexRoute component={Hello}/>
     <Route path="star-wars" component={StarWarsApp} queries={StarWarsQueries}/>
     <Route path="graphiql" component={GraphiQL} />
   </Route>
 </Route>
)

/*
  Wrapp the routes in another component so you can use the state to trigger
  react render every time the environment changes
*/


class Application extends React.Component{
  constructor(props){
    super(props);
    this.state = {environment: Auth.getEnvironment()};
    Auth.afterLogin = () => this.resetRelayEnvironment();
    Auth.afterLogout = () => this.resetRelayEnvironment();
  }

  resetRelayEnvironment(){
    this.setState({environment: Auth.getEnvironment()});
  }

  render(){
    return (
      <Router history={browserHistory}
        render={applyRouterMiddleware(useRelay)}
        environment={this.state.environment}>
        {routes}
      </Router>
    );
  }
}

ReactDOM.render(
  <Application />,
  document.getElementById('react-root')
);

```
