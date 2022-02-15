import { useMutation } from 'react-query';

// import useStore from '@/store/store';

// import { getIdentity } from '@/helpers/indentity';
// import { setAuthToken } from '@/helpers/authToken';

import instance from '../metacon-axios';

import { metacon } from '../config';

function useLogin() {
  // const setStoreAuthToken = useStore((state) => state.setAuthToken);

  const { mutateAsync: login, isLoading, isError } = useMutation(
    async (password) => {
      // const identity = getIdentity();
      const identity = 'thing';

      const { data } = await instance.post('/users/importCertificate', {
        orgName: metacon.org,
        x509Identity:
          typeof identity === 'string' ? JSON.parse(identity) : identity,
        password,
      });

      return data;
    },
    {
      // onSuccess: (data) => {
      //   setStoreAuthToken(data?.payload?.jwtAuthToken);
      //   setAuthToken(data?.payload?.jwtAuthToken);
      // },
    },
  );

  return {
    login,
    isLoading,
    isError,
  };
}

export default useLogin;
