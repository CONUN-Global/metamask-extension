import axios from 'axios';

import { metacon } from '../config';

const metaconAxios = axios.create({
  baseURL: metacon.testnet.serverUrl,
});

export default metaconAxios;
