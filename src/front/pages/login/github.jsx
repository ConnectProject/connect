import * as React from 'react';
import { setAuthToken } from '../../services/auth';
import { ROUTES } from '../../component/Router';
import Page from '../../component/Page';

class Github extends React.Component {
  constructor(props) {
    super(props);

    this.state = {};
  }

  async componentDidMount() {
    let params = new URLSearchParams(this.props.location.search);

    const responses = await fetch(`/api/auth`, {
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      method: 'POST',
      body: JSON.stringify({ code: params.get('code') }),
    });

    if ((await responses.code) !== 200) {
      this.props.history.push(ROUTES.HOME);
    }

    setAuthToken(await responses.text());

    this.props.history.push(ROUTES.HOME);
  }

  render() {
    return <Page isPublic>Happy to see you back</Page>;
  }
}

export default Github;
