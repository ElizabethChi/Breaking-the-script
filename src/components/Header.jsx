import React from 'react';
import SearchBar from './SearchBar.jsx';
import AccountMenu from './AccountMenu.jsx';
import TopicNavigation from './TopicNavigation.jsx';

export default function Header({ search, account, topics }) {
  return (
    <header className="header">
      <div className="header__row">
        <SearchBar {...search} />
        <AccountMenu {...account} />
      </div>
      <TopicNavigation {...topics} />
    </header>
  );
}
