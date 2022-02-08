import Web3 from 'web3';

export const web3 = new Web3(
  'https://ropsten.infura.io/v3/2b1758a74cf249a598f13e357bb058dc',
);

export const config = {
  serverUrl: 'http://192.168.100.172:80/api/v1/',
};

export const ORG_NAME = 'Org1';

export const WALLET_TYPE = 'ETH';
