import React, { useCallback, useMemo, useState } from 'react';
import { AppProvider, useApp } from './context/AppContext.jsx';
import Sidebar from './components/Sidebar.jsx';
import Header from './components/Header.jsx';
import MasonryFeed from './components/MasonryFeed.jsx';
import ImageDetailModal from './components/ImageDetailModal.jsx';
import CreatePinModal from './components/CreatePinModal.jsx';
import VisualSearchModal from './components/VisualSearchModal.jsx';
import Toast from './components/Toast.jsx';
import { TOPICS } from './data/topics.js';
import { useFeed } from './hooks/useFeed.js';
import { clearSearchCache } from './api/openverse.js';
import { isBlockedQuery } from './utils/safety.js';

const DEFAULT_FILTERS = { category: '', licenseType: 'commercial' };

function Discover() {
  const { saved, clearSaved, showToast } = useApp();
  const [view, setView] = useState('feed'); // feed | saved
  const [topicIndex, setTopicIndex] = useState(0);
  const [searchQuery, setSearchQuery] = useState(''); // submitted query ('' = browsing topics)
  const [searchText, setSearchText] = useState(''); // text currently in the input
  const [filters, setFilters] = useState(DEFAULT_FILTERS);
  const [reloadToken, setReloadToken] = useState(0);
  const [myPins, setMyPins] = useState([]);
  const [modal, setModal] = useState(null); // 'create' | 'visual' | null

  const source = useMemo(() => {
    if (searchQuery) return { key: `search:${searchQuery}`, type: 'search', queries: [searchQuery] };
    const topic = TOPICS[topicIndex];
    return {
      key: `topic:${topicIndex}`,
      type: topic.home ? 'home' : 'topic',
      queries: topic.queries,
    };
  }, [searchQuery, topicIndex]);

  const feed = useFeed(source, filters, reloadToken);

  const scrollTop = () => window.scrollTo({ top: 0, behavior: 'auto' });

  const goHome = useCallback(() => {
    setView('feed');
    setTopicIndex(0);
    setSearchQuery('');
    setSearchText('');
    scrollTop();
  }, []);

  const selectTopic = useCallback((i) => {
    setView('feed');
    setTopicIndex(i);
    setSearchQuery('');
    setSearchText('');
    scrollTop();
  }, []);

  const runSearch = useCallback((q) => {
    setView('feed');
    setSearchQuery(q);
    setSearchText(q);
    scrollTop();
  }, []);

  const clearSearch = useCallback(() => {
    setSearchText('');
    if (searchQuery) {
      setSearchQuery('');
      scrollTop();
    }
  }, [searchQuery]);

  const retry = useCallback(() => setReloadToken((n) => n + 1), []);

  const onClearCache = useCallback(() => {
    clearSearchCache();
    setReloadToken((n) => n + 1);
    showToast('Cached results cleared');
  }, [showToast]);

  const publishPin = useCallback(
    (pin) => {
      setMyPins((list) => [pin, ...list]);
      setView('feed');
      setTopicIndex(0);
      setSearchQuery('');
      setSearchText('');
      scrollTop();
      showToast('Your pin was added to the top of Home');
    },
    [showToast],
  );

  const onFiltersChange = useCallback((next) => setFilters(next), []);

  let feedProps;
  if (view === 'saved') {
    feedProps = {
      items: saved,
      phase: saved.length ? 'ready' : 'empty',
      hasMore: false,
      emptyTitle: 'No saved pins yet',
      emptyHint: 'Hover over any pin and press Save — it will show up here.',
    };
  } else {
    const showMine = !searchQuery && TOPICS[topicIndex].home && feed.phase !== 'error';
    feedProps = {
      items: showMine ? [...myPins, ...feed.items] : feed.items,
      phase: feed.phase,
      hasMore: feed.hasMore,
      loadingMore: feed.loadingMore,
      loadError: feed.loadError,
      offline: feed.offline,
      onLoadMore: feed.loadMore,
      onRetry: retry,
      emptyTitle: isBlockedQuery(searchQuery)
        ? 'This search isn’t available'
        : searchQuery
          ? `No results for “${searchQuery}”`
          : 'No pins found',
      emptyHint: isBlockedQuery(searchQuery)
        ? 'Explicit content is never shown here. Try a different search.'
        : 'Check the spelling, try a more general term, or loosen the feed options.',
    };
  }

  return (
    <>
      <Sidebar
        view={view}
        onHome={goHome}
        onSaved={() => {
          setView('saved');
          scrollTop();
        }}
        onCreate={() => setModal('create')}
        filters={filters}
        onFilters={onFiltersChange}
        savedCount={saved.length}
        onClearSaved={() => {
          clearSaved();
          showToast('Saved pins cleared');
        }}
        onClearCache={onClearCache}
      />
      <Header
        search={{
          value: searchText,
          onChange: setSearchText,
          onSearch: runSearch,
          onClear: clearSearch,
          onCamera: () => setModal('visual'),
          onNotify: showToast,
        }}
        account={{
          savedCount: saved.length,
          onSaved: () => {
            setView('saved');
            scrollTop();
          },
          onClearSaved: () => {
            clearSaved();
            showToast('Saved pins cleared');
          },
        }}
        topics={{
          topics: TOPICS,
          activeIndex: view === 'feed' && !searchQuery ? topicIndex : -1,
          onSelect: selectTopic,
        }}
      />
      <MasonryFeed {...feedProps} />
      <ImageDetailModal />
      {modal === 'create' && <CreatePinModal onClose={() => setModal(null)} onPublish={publishPin} />}
      {modal === 'visual' && <VisualSearchModal onClose={() => setModal(null)} onSearch={runSearch} />}
      <Toast />
    </>
  );
}

export default function App() {
  return (
    <AppProvider>
      <Discover />
    </AppProvider>
  );
}
