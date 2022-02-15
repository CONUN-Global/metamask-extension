import React, { useState, useRef } from 'react';
import { withRouter } from 'react-router-dom';
import { compose } from 'redux';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import useGetKeystore from '../../../../../metacon/hooks/useGetKeystore';
import * as actions from '../../../../store/actions';
import { getMetaMaskAccounts } from '../../../../selectors';
import Button from '../../../../components/ui/button';
import { getMostRecentOverviewPage } from '../../../../ducks/history/history';

function PrivateKeyImportView(props) {
  const inputRef = useRef(null);
  const ourInputRef = useRef(null);
  const [isEmpty, setEmpty] = useState(true);
  const { getKeystore } = useGetKeystore();

  if (props.error) {
    console.log(props.error);
  }

  function checkInputEmpty() {
    const privateKey = inputRef.current.value;
    if (privateKey !== '') {
      setEmpty(false);
      return;
    }
    setEmpty(true);
  }

  const createKeyringOnEnter = (event) => {
    if (event.key === 'Enter') {
      event.preventDefault();
      createNewKeychain();
    }
  };

  function createNewKeychain() {
    const privateKey = inputRef.current.value;
    const {
      importNewAccount,
      history,
      displayWarning,
      mostRecentOverviewPage,
      setSelectedAddress,
      firstAddress,
    } = props;

    const certificateData = privateKey.toString('base64');
    console.log(privateKey);
    console.log('certificateData', certificateData);

    // const keystoreData = getKeystore(privateKey);
    // console.log('keystoreData', keystoreData);

    importNewAccount('Private Key', [privateKey])
      .then(({ selectedAddress }) => {
        if (selectedAddress) {
          history.push(mostRecentOverviewPage);
          displayWarning(null);
        } else {
          displayWarning('Error importing account');
          setSelectedAddress(firstAddress);
        }
      })
      .catch((err) => err && displayWarning(err.message || err));
  }

  function getMetaconCertificateDetails() {
    getKeystore().then((res) => {
      console.log('Keystore', res);
    });
  }

  return (
    <div className="new-account-import-form__private-key">
      <span className="new-account-create-form__instruction">
        Paste your private key string here
      </span>
      <div className="new-account-import-form__private-key-password-container">
        <input
          className="new-account-import-form__input-password"
          type="password"
          id="private-key-box"
          onKeyPress={(e) => createKeyringOnEnter(e)}
          onChange={checkInputEmpty}
          ref={inputRef}
          autoFocus
        />
        <input
          className="new-account-import-form__input-password"
          type="password"
          id="private-key-box"
          onChange={checkInputEmpty}
          ref={ourInputRef}
          autoFocus
        />
      </div>
      <div className="new-account-import-form__buttons">
        <Button
          type="secondary"
          large
          className="new-account-create-form__button"
          onClick={() => {
            const { history, mostRecentOverviewPage, displayWarning } = props;
            displayWarning(null);
            history.push(mostRecentOverviewPage);
          }}
        >
          Cancel
        </Button>
        <Button
          type="primary"
          large
          className="new-account-create-form__button"
          onClick={getMetaconCertificateDetails}
          disabled={isEmpty}
        >
          Import
        </Button>
      </div>
      {props.error ? <span className="error">{props.error}</span> : null}
    </div>
  );
}

export default compose(
  withRouter,
  connect(mapStateToProps, mapDispatchToProps),
)(PrivateKeyImportView);

PrivateKeyImportView.propTypes = {
  importNewAccount: PropTypes.func.isRequired,
  history: PropTypes.object.isRequired,
  displayWarning: PropTypes.func.isRequired,
  setSelectedAddress: PropTypes.func.isRequired,
  firstAddress: PropTypes.string.isRequired,
  error: PropTypes.node,
  mostRecentOverviewPage: PropTypes.string.isRequired,
};

function mapStateToProps(state) {
  return {
    error: state.appState.warning,
    firstAddress: Object.keys(getMetaMaskAccounts(state))[0],
    mostRecentOverviewPage: getMostRecentOverviewPage(state),
  };
}

function mapDispatchToProps(dispatch) {
  return {
    importNewAccount: (strategy, [privateKey]) => {
      return dispatch(actions.importNewAccount(strategy, [privateKey]));
    },
    displayWarning: (message) =>
      dispatch(actions.displayWarning(message || null)),
    setSelectedAddress: (address) =>
      dispatch(actions.setSelectedAddress(address)),
  };
}

/* 
---
2022-02-14
To get the keystore data, I need to login AND fire off the getKeystore hook.
To login, I need something called 'identity'.
Identity is basically an object made up of the contents of the certificate file.

The process is as follows:

Paste in file contents
Decode with btoa
Pass this into login
Return login JWT
Add this to the keystore hook post request
???
profit

Perhaps a new hook is in order

---
2022-02-11
There is a thing called accountImporter (it is present in 'importNewAccount') and it interferes with our ability to get our private keys.
If I make some separate fields in this file then I might be able to do our processes before doing metamask's.

*/
