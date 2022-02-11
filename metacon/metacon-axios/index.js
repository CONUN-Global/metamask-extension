import axios from 'axios';

import { metacon } from '../const';

const metaconAxios = axios.create({
  baseURL: metacon.testnet.serverUrl,
});

export default metaconAxios;
