import axios from 'axios';

let Http = (baseURL, token, headers = {}, contentType = 'application/json') => {
  headers = {
    ...headers,
    'Content-Type': contentType,
    Accept: 'application/json',
    'Transformd-Version': '2020-05-21'
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  return axios.create({
    baseURL,
    withCredentials: false,
    responseType: 'json',
    timeout: 0,
    headers
  });
};


let client;

const API = {
  init(apiUri, pat) {
    client = Http(apiUri, pat);
  },
  assignments: {
    update: (taskId, id, data) => client.patch(`tasks/${taskId}/assignments/${id}`, data),
  },
  submissions: {
    retrieve: (id) => client.get(`submissions/${id}`),
  }
}

export default API;
