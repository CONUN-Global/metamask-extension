import { useMutation } from 'react-query';
import metaconAxios from '../metacon-axios';
import { ORG_NAME, WALLET_TYPE } from '../config';

function useGetKeystore() {
  const { mutateAsync: getKeystore, isLoading } = useMutation(async (args) => {
    const { data } = await metaconAxios.post('/users/getLinkedWallets', {
      ...args,
      orgName: ORG_NAME,
      walletType: WALLET_TYPE,
    });

    const account = web3.eth.accounts.decrypt(
      data?.payload?.keyStore,
      args.password,
    );
    setPrivateKey(account?.privateKey);

    return data;
  });

  return {
    getKeystore,
    isLoading,
  };
}

export default useGetKeystore;
