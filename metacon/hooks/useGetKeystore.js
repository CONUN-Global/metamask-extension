import { useMutation } from 'react-query';

import metaconAxios from '../metacon-axios';
import { metacon } from '../config';

function useGetKeystore() {
  const { mutateAsync: getKeystore, isLoading } = useMutation(async (args) => {
    const { data } = await metaconAxios.post('/users/getLinkedWallets', {
      ...args,
      orgName: metacon.org,
      walletType: metacon.walletType,
    });

    // const account = web3.eth.accounts.decrypt(
    //   data?.payload?.keyStore,
    //   args.password,
    // );
    // setPrivateKey(account?.privateKey);

    return data;
  });

  return {
    getKeystore,
    isLoading,
  };
}

export default useGetKeystore;
