import React from 'react';
import { Route, Routes } from 'react-router-dom';

import DetailsPage from '../pages/details/details';
import HomePage from '../pages/home/home';
import Github from '../pages/login/github';
import LoginPage from '../pages/login/login';
import NoFound404Page from '../pages/notfound/notfound';
import OAuthAuthorizePage from '../pages/oauth/authorize';
import ProfilePage from '../pages/profile/profile';

const Router = function Router () {
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
