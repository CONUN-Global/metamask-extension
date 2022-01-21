import React, { useState } from 'react';

import Dropdown from '../../../components/ui/dropdown/dropdown';

import JsonImportView from './json';
import PrivateKeyImportView from './private-key/private-key';

const menuItems = [
  {
    name: 'Private Key',
    component: PrivateKeyImportView,
  },
  {
    name: 'JSON File',
    component: JsonImportView,
  },
];

export default function AccountImportSubview() {
  const [importView, setImportView] = useState(menuItems[0]);

  return (
    <>
      <div className="page-container__header">
        <div className="page-container__title">Import Account</div>
        <div className="page-container__subtitle">
          Import Certificate
          <span
            className="new-account-info-link"
            onClick={() => {
              global.platform.openTab({
                url:
                  'https://metamask.zendesk.com/hc/en-us/articles/360015289932',
              });
            }}
          >
            Here
          </span>
        </div>
      </div>
      <div className="new-account-import-form">
        <div className="new-account-import-form__select-section">
          <div className="new-account-import-form__select-label">
            Select Type
          </div>
          <Dropdown
            className="new-account-import-form__select"
            options={menuItems.map((item) => ({ value: item.name }))}
            selectedOption={importView.name}
            onChange={(value) => {
              console.log(`value`, value);
              const toUse = menuItems.find((item) => item.name === value);
              console.log(`toUse`, toUse);
              setImportView(toUse);
            }}
          />
        </div>
        <importView.component />
      </div>
    </>
  );
}
