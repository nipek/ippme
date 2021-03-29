import React from 'react';
import 'components/notfound.css';
const NotFound = () => {
  return (
    <div id="notfound">
      <div className="notfound">
        <div className="notfound-404"></div>
        <h2>404 - Page not found</h2>
        <p>
          The page you are looking for might have been removed had its name
          changed or is temporarily unavailable.
        </p>
        <a href="/login">Login</a>
      </div>
    </div>
  );
};

export default NotFound;
