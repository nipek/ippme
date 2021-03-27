// axios.js
import {
  get as gett,
  patch as patchh,
  post as postt,
  put as putt,
  delete as deletee,
  interceptors,
} from 'axios';

//defaults.headers.common['Authorization'] = sessionStorage.getItem('zer') ? `Bearer ${JSON.parse(sessionStorage.getItem('zer')).token}` : null;

//Add a request interceptor
interceptors.request.use(
  function (config) {
    // Do something before request is sent
    if (!config.headers.Authorization) {
      const zer = sessionStorage.getItem('zer');
      //   console.log(zer)
      // config.url += (config.url.split('?')[1] ? '&' : '?') + 'x-tag=' + 'opop';
      if (zer) {
        config.headers.Authorization = `Bearer ${zer}`;
      }
    }
    return config;
  },
  function (error) {
    // Do something with request error
    return Promise.reject(error);
  },
);

// // Add a response interceptor
interceptors.response.use(
  function (response) {
    // Do something with response data
    return response;
  },
  function (error) {
    // Do something with response error
    console.log(error, error.response);
    if (error.response && error.response.status === 401) {
      // alert('auth error, redirecting to login, disabled now')
      sessionStorage.clear();
      return (window.location.pathname = '/' + error.response.status);
    }

    // console.log(error.response)
    return Promise.reject(error);
  },
);

//export default axios;
export const patch = patchh;
export const get = gett;
export const post = postt;
export const put = putt;
export const delet = deletee;
