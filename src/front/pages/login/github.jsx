/* eslint-disable react/forbid-prop-types */
import React, { useEffect } from 'react';
import { useNavigate, useLocation } from "react-router-dom";
import UserService from '../../services/user-service';

const Github = function () {
  const location = useLocation();
  const navigate = useNavigate();
  const params = new URLSearchParams(location.search);

  useEffect(() => {
    UserService.confirmGithubAuth({ code: params.get('code') })
      .then(() => {
        if (params.get('redirectPath')) {
          navigate(params.get('redirectPath'));
        } else {
          navigate('/home');
        }
      })
      .catch((err) => {
        console.error(err);
        navigate('/');
      });
  }, []);


  return <p>Redirecting...</p>;
};

export default Github;
