import { normalize } from 'normalizr';
import { defaults, pick } from 'lodash';
import configureAxios from 'helpers/configureAxios';

const axios = configureAxios();

// Makes a server request and updates redux store

// Options:
// dispatch: the dispatch function to use (required)
// schema: schema for normalization (required)
// url: Url of the api endpoint (required)
// method: The request method to use (default: `get`)
// data: Data to send with request (default: {})
// type: {
//   START,
//   ERROR,
//   SUCCESS
// }
export default class RequestHandler {
  constructor(options) {
    const defaultOptions = {
      method: `get`,
      data: {}
    };
    Object.assign(this, defaults(options, defaultOptions));
  }

  makeAndHandleRequest() {
    this.makeRequest()
      .then(this.handleResponse.bind(this))
      .catch(this.handleError.bind(this)); // Then and catch get both executed?
  }

  makeRequest() {
    this.commenceRequest();
    const axiosOptions = pick(this, [`method`, `url`, `data`]);
    return axios(axiosOptions);
  }

  commenceRequest() {
    const action = { type: this.type.START };
    this.dispatch(action);
  }

  handleResponse(response) {
    const normalizedData = this.normalize(response.data);
    this.sendToReducer(normalizedData);
  }

  normalize(data) {
    return normalize(data, this.schema);
  }

  sendToReducer(payload) {
    const action = {
      type: this.type.SUCCESS,
      payload
    };
    this.dispatch(action);
  }

  handleError(response) {
    const action = {
      type: this.type.ERROR,
      error: this.errorMessage
    };
    this.dispatch(action);
  }
}
