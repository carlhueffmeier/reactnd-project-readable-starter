import axios from 'axios';

export default function configureAxios() {
  axios.defaults.headers.Authorization = `42`; // Arbitrary value for identification
  return axios;
}
