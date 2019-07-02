import * as React from 'react';
import { BrowserRouter as Router } from "react-router-dom";
import Routes from "./Router";

class App extends React.Component {
  render() {
    return (
      <div>
        <Router>
          <Routes />
        </Router>
      </div>
    );
  }
}

export default App;
