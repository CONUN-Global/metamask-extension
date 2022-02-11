import { useMutation } from 'react-query';

import metaconAxios from '../metacon-axios';

// import { web3 } from '../config';
import { metacon } from '../const';

function useGetKeystore() {
  const { mutateAsync: getKeystore, isLoading } = useMutation(async (args) => {
    const { data } = await metaconAxios.post('/users/getLinkedWallets', {
      ...args,
      orgName: metacon.org,
      walletType: metacon.walletType,
    });

    console.log('keystore data', data);

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
