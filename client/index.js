import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { HashRouter, Switch, Route, Redirect } from 'react-router-dom';

const APP_STARTUP_TIME = 'app_startup_time';

console.time(APP_STARTUP_TIME);

const { API_URL } = process.env;

class App extends Component {
  state = { 
    loaded: false,
    products: [] 
  };

  componentDidMount() {
    console.log('component did mount ran')
    fetch(`${API_URL}/api/products`)
      .then((res) => res.json())
      .then((products) => {
        this.setState({ 
          loaded: true,
          products,
        }, ()=>console.log('we have state, yes we do,'));
      })
      .catch((e) => {
        console.error(`Failed to load initial health check.`, e);
      });
  }

  render() {
    const { loaded, products } = this.state;
    console.log(products);
    return (
      <HashRouter>
        <Switch>
          <Route exact path="/">
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                width: '100vw',
                alignItems: 'center',
                fontFamily: 'Roboto',
                color: 'black'
              }}
            >
              {
                products.map(el => {
                  return (
                    <div key={el.id}>
                      <h4>{el.name}</h4>
                      <p>{el.description}</p>
                      <p>{`$${el.suggestedPrice.toFixed(2)}`}</p> 
                    </div>
                  )
                  
                })
              }
            </div>
          </Route>
          <Redirect to="/" />
        </Switch>
      </HashRouter>
    );
  }
}

ReactDOM.render(<App />, document.querySelector('#app'), () => {
  console.timeEnd(APP_STARTUP_TIME);
});
