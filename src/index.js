import React from 'react';
import ReactDOM from 'react-dom';
import { Switch, Route, BrowserRouter} from "react-router-dom";

import App from './App';
import CodeFlow from "./CodeFlow";

const PracticeRouter = () => {
  return(
    <BrowserRouter>
      <Switch>
        <Route path="/" exact key="app" component={App}/>
        <Route path="/codeflow" exact key="codeflow" component={CodeFlow}/>
        <Route render={() => <div>404</div>} /> 
      </Switch>
    </BrowserRouter>
  )
}
ReactDOM.render(
    <PracticeRouter />,
  document.getElementById('root')
);