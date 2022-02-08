import axios from 'axios';

import { config } from '../config';

const metaconAxios = axios.create({
  baseURL: config.serverUrl,
});

export default metaconAxios;
