import React, { useRef, useState } from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';
import { compose } from 'redux';
import { connect } from 'react-redux';
import FileInput from 'react-simple-file-input';
import * as actions from '../../../../store/actions';
import { getMetaMaskAccounts } from '../../../../selectors';
import Button from '../../../../components/ui/button';
import { getMostRecentOverviewPage } from '../../../../ducks/history/history';

const HELP_LINK =
  'https://metamask.zendesk.com/hc/en-us/articles/360015489331-Importing-an-Account';

function JsonImportSubview(props) {
  const { error, history, mostRecentOverviewPage } = props;

  const [fileContents, setFileContents] = useState('');
  const [isEmpty, setEmpty] = useState(true);
  const inputRef = useRef(null);

  function createKeyringOnEnter(event) {
    if (event.key === 'Enter') {
      event.preventDefault();
      createNewKeychain();
    }
  }

  function createNewKeychain() {
    const {
      firstAddress,
      displayWarning,
      importNewJsonAccount,
      setSelectedAddress,
    } = props;
    if (!fileContents) {
      const message = 'Need To Import File';
      displayWarning(message);
      return;
    }

    const password = inputRef.current.value;

    importNewJsonAccount([fileContents, password])
      .then(({ selectedAddress }) => {
        if (selectedAddress) {
          history.push(mostRecentOverviewPage);
          displayWarning(null);
        } else {
          displayWarning('Error Importing Account');
          setSelectedAddress(firstAddress);
        }
      })
      .catch((err) => err && displayWarning(err.message || err));
  }

  function checkInputEmpty() {
    const password = inputRef.current.value;
    let passwordEmpty = true;
    if (password !== '') {
      passwordEmpty = false;
    }
    setEmpty(passwordEmpty);
  }

  function handleFile(fileEvent) {
    setFileContents(fileEvent.target.result);
  }

  return (
    <div className="new-account-import-form__json">
      <p>Used By Clients</p>
      <a
        className="warning"
        href={HELP_LINK}
        target="_blank"
        rel="noopener noreferrer"
      >
        File Import Fail
      </a>
      <FileInput
        readAs="text"
        onLoad={(e) => handleFile(e)}
        style={{
          padding: '20px 0px 12px 15%',
          fontSize: '15px',
          display: 'flex',
          justifyContent: 'center',
          width: '100%',
        }}
      />
      <input
        className="new-account-import-form__input-password"
        type="password"
        placeholder="Enter Password"
        id="json-password-box"
        onKeyPress={createKeyringOnEnter}
        onChange={checkInputEmpty}
        ref={inputRef}
      />
      <div className="new-account-create-form__buttons">
        <Button
          type="secondary"
          large
          className="new-account-create-form__button"
          onClick={() => history.push(mostRecentOverviewPage)}
        >
          Cancel
        </Button>
        <Button
          type="primary"
          large
          className="new-account-create-form__button"
          onClick={() => createNewKeychain()}
          disabled={!isEmpty && fileContents !== ''}
        >
          Import
        </Button>
      </div>
      {error ? <span className="error">{error}</span> : null}
    </div>
  );
}

const mapStateToProps = (state) => {
  return {
    error: state.appState.warning,
    firstAddress: Object.keys(getMetaMaskAccounts(state))[0],
    mostRecentOverviewPage: getMostRecentOverviewPage(state),
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    displayWarning: (warning) => dispatch(actions.displayWarning(warning)),
    importNewJsonAccount: (options) =>
      dispatch(actions.importNewAccount('JSON File', options)),
    setSelectedAddress: (address) =>
      dispatch(actions.setSelectedAddress(address)),
  };
};

JsonImportSubview.propTypes = {
  error: PropTypes.string,
  displayWarning: PropTypes.func,
  firstAddress: PropTypes.string,
  importNewJsonAccount: PropTypes.func,
  history: PropTypes.object,
  setSelectedAddress: PropTypes.func,
  mostRecentOverviewPage: PropTypes.string.isRequired,
};

export default compose(
  withRouter,
  connect(mapStateToProps, mapDispatchToProps),
)(JsonImportSubview);
