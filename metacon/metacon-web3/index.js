import Web3 from 'web3';

import { metacon } from '../config';

export const web3 = new Web3(metacon.testnet.web3Url);
