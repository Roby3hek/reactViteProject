import React, { useContext, useMemo, useState } from 'react';
import { useTable, useSortBy, useGlobalFilter, usePagination } from 'react-table';
import { ReceiptContext } from '../../context/ReceiptContext';
import EditReceiptModal from './EditReceiptModal'; 
import GlobalFilter from './GlobalFilter'; 

const ReceiptList = () => {
  const { receipts, deleteReceipt } = useContext(ReceiptContext);
  const [editingReceipt, setEditingReceipt] = useState(null);

  const columns = useMemo(() => [
    {
      Header: 'Название',
      accessor: 'title',
    },
    {
      Header: 'Сумма',
      accessor: row => `${row.amount.toFixed(2)} ${row.currency}`,
      id: 'amount',
      sortType: (a, b) => {
        return a.original.amount - b.original.amount;
      },
    },
    {
      Header: 'Дата',
      accessor: row => new Date(row.date).toLocaleDateString(),
      id: 'date',
      sortType: (a, b) => new Date(a.original.date) - new Date(b.original.date),
    },
    {
      Header: 'Категория',
      accessor: 'category',
    },
    {
      Header: 'Действия',
      accessor: 'id',
      Cell: ({ value }) => (
        <div className="space-x-2">
          <button
            onClick={() => {
              const receipt = receipts.find(r => r.id === value);
              setEditingReceipt(receipt);
            }}
            className="text-blue-600 hover:underline"
          >
            Редактировать
          </button>
          <button
            onClick={() => {
              if (window.confirm('Удалить этот чек?')) {
                deleteReceipt(value);
              }
            }}
            className="text-red-600 hover:underline"
          >
            Удалить
          </button>
        </div>
      ),
    },
  ], [receipts, deleteReceipt]);


  const data = useMemo(() => receipts, [receipts]);

 
  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    prepareRow,
    page, 
    nextPage,
    previousPage,
    canNextPage,
    canPreviousPage,
    pageOptions,
    state,
    setGlobalFilter,
    gotoPage,
    pageCount,
  } = useTable(
    { columns, data, initialState: { pageIndex: 0, pageSize: 5 } },
    useGlobalFilter,
    useSortBy,
    usePagination
  );

  const { globalFilter, pageIndex } = state;

  return (
    <div className="bg-white p-4 rounded shadow max-w-4xl mx-auto">
      <h2 className="text-xl font-semibold mb-4">Список чеков</h2>

      <GlobalFilter filter={globalFilter} setFilter={setGlobalFilter} />

      <table {...getTableProps()} className="min-w-full border border-gray-300">
        <thead className="bg-gray-100">
          {headerGroups.map(headerGroup => (
            <tr {...headerGroup.getHeaderGroupProps()} key={headerGroup.id}>
              {headerGroup.headers.map(column => (
                <th
                  {...column.getHeaderProps(column.getSortByToggleProps())}
                  key={column.id}
                  className="border border-gray-300 px-4 py-2 text-left cursor-pointer select-none"
                >
                  {column.render('Header')}
                  <span>
                    {column.isSorted ? (column.isSortedDesc ? ' 🔽' : ' 🔼') : ''}
                  </span>
                </th>
              ))}
            </tr>
          ))}
        </thead>

        <tbody {...getTableBodyProps()}>
          {page.length === 0 && (
            <tr>
              <td colSpan={columns.length} className="text-center p-4">
                Нет данных
              </td>
            </tr>
          )}
          {page.map(row => {
            prepareRow(row);
            return (
              <tr {...row.getRowProps()} key={row.id} className="hover:bg-gray-50">
                {row.cells.map(cell => (
                  <td {...cell.getCellProps()} key={cell.column.id} className="border border-gray-300 px-4 py-2">
                    {cell.render('Cell')}
                  </td>
                ))}
              </tr>
            );
          })}
        </tbody>
      </table>

      {}
      <div className="flex justify-between items-center mt-4">
        <button
          onClick={() => previousPage()}
          disabled={!canPreviousPage}
          className="px-3 py-1 border rounded disabled:opacity-50"
        >
          Назад
        </button>
        <span>
          Страница{' '}
          <strong>
            {pageIndex + 1} из {pageOptions.length}
          </strong>
        </span>
        <button
          onClick={() => nextPage()}
          disabled={!canNextPage}
          className="px-3 py-1 border rounded disabled:opacity-50"
        >
          Вперед
        </button>
      </div>

      {/* Модальное окно редактирования */}
      {editingReceipt && (
        <EditReceiptModal
          receipt={editingReceipt}
          onClose={() => setEditingReceipt(null)}
        />
      )}
    </div>
  );
};

export default ReceiptList;
