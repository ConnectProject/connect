/* eslint-disable react/forbid-prop-types */
import React, { useEffect } from 'react';
import { useHistory, useLocation } from "react-router-dom";
import UserService from '../../services/user-service';

const Github = function () {
  const location = useLocation();
  const history = useHistory();
  const params = new URLSearchParams(location.search);

  useEffect(() => {
    UserService.confirmGithubAuth({ code: params.get('code') })
      .then(() => {
        if (params.get('redirectPath')) {
          history.push(params.get('redirectPath'));
        } else {
          history.push('/home');
        }
      })
      .catch((err) => {
        console.error(err);
        history.push('/');
      });
  }, []);


  return <p>Redirecting...</p>;
};

export default Github;
