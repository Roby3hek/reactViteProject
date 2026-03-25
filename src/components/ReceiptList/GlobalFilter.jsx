import React from 'react';

const GlobalFilter = ({ filter, setFilter }) => {
  return (
    <span className="mb-2 block">
      Поиск:{' '}
      <input
        value={filter || ''}
        onChange={e => setFilter(e.target.value)}
        placeholder="Название или категория..."
        className="border px-2 py-1 rounded w-64"
      />
    </span>
  );
};

export default GlobalFilter;
