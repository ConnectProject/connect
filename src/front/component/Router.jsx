import React from 'react';
import { Route, Routes } from 'react-router-dom';

import LoginPage from '../pages/login/login';
import HomePage from '../pages/home/home';
import OAuthAuthorizePage from '../pages/oauth/authorize';
import DetailsPage from '../pages/details/details';
import ProfilePage from '../pages/profile/profile';
import NoFound404Page from '../pages/notfound/notfound';
import Github from '../pages/login/github';

const Router = function () {
  return (
    <Routes>
      <Route path="/login/github" element={<Github />} />
      <Route path="/application/:appId" element={<DetailsPage />} />
      <Route path="/profile" element={<ProfilePage />} />
      <Route path="/home" element={<HomePage />} />
      <Route path="/authorize" element={<OAuthAuthorizePage />} />
      <Route path="/" element={<LoginPage />} />
      <Route path="*" element={<NoFound404Page />} />
    </Routes>
  );
};

export default Router;
