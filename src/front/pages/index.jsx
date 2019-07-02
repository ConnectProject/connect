import * as React from 'react';
import { hasJwt } from '../services/auth';
import Page from '../component/Page';

class Home extends React.Component {
  render() {
    return (
      <Page isPublic>
        <div>Hello worlds</div>
        <a
          href={`https://github.com/login/oauth/authorize?client_id=c262ab4075b97372f8a4`}
          title="get connect"
        >
          Github oauth link
        </a>
        {hasJwt() && <div>Your are authorize to see this</div>}
      </Page>
    );
  }
}

export default Home;
