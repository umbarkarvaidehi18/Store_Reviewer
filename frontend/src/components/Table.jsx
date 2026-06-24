import React from 'react';
import { ChevronUp, ChevronDown, ChevronLeft, ChevronRight, Search, SlidersHorizontal } from 'lucide-react';

const Table = ({
  columns,
  data = [],
  loading = false,
  // Search
  onSearchChange,
  searchValue = '',
  searchPlaceholder = 'Search...',
  // Sort
  onSortChange,
  sortBy = '',
  sortOrder = 'DESC',
  // Filter
  filterOptions = [],
  filterValue = '',
  onFilterChange,
  filterLabel = 'Filter',
  // Pagination
  currentPage = 1,
  totalPages = 1,
  onPageChange,
  totalItems = 0
}) => {

  const handleSort = (key) => {
    if (!onSortChange) return;
    const isAsc = sortBy === key && sortOrder === 'ASC';
    onSortChange(key, isAsc ? 'DESC' : 'ASC');
  };

  return (
    <div className="flex flex-col gap-4 w-full">
      {/* Controls Bar (Search + Filter) */}
      {(onSearchChange || onFilterChange) && (
        <div className="flex flex-col sm:flex-row gap-3 items-center justify-between w-full">
          {onSearchChange && (
            <div className="relative w-full sm:max-w-xs">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-slate-400">
                <Search size={16} />
              </span>
              <input
                type="text"
                value={searchValue}
                onChange={(e) => onSearchChange(e.target.value)}
                placeholder={searchPlaceholder}
                className="pl-9 pr-4 py-2 w-full glass-input rounded-xl text-sm"
              />
            </div>
          )}

          {onFilterChange && filterOptions.length > 0 && (
            <div className="flex items-center gap-2 w-full sm:w-auto">
              <span className="text-slate-400 text-sm flex items-center gap-1.5 font-medium">
                <SlidersHorizontal size={14} />
                {filterLabel}:
              </span>
              <select
                value={filterValue}
                onChange={(e) => onFilterChange(e.target.value)}
                className="py-2 pl-3 pr-8 w-full sm:w-40 glass-input rounded-xl text-sm cursor-pointer"
              >
                {filterOptions.map((opt) => (
                  <option key={opt.value} value={opt.value} className="bg-slate-900 text-white">
                    {opt.label}
                  </option>
                ))}
              </select>
            </div>
          )}
        </div>
      )}

      {/* Table Container */}
      <div className="w-full overflow-x-auto rounded-2xl border border-slate-900 bg-slate-950/40 backdrop-blur-md">
        <table className="min-w-full divide-y divide-slate-900 text-left text-sm text-slate-200">
          <thead className="bg-slate-900/60 text-xs font-semibold uppercase tracking-wider text-slate-400">
            <tr>
              {columns.map((col) => (
                <th
                  key={col.key}
                  className={`px-6 py-4 font-semibold ${
                    col.sortable ? 'cursor-pointer select-none hover:text-white' : ''
                  }`}
                  onClick={() => col.sortable && handleSort(col.key)}
                >
                  <div className="flex items-center gap-1">
                    <span>{col.header}</span>
                    {col.sortable && sortBy === col.key && (
                      sortOrder === 'ASC' ? <ChevronUp size={14} className="text-brand-400" /> : <ChevronDown size={14} className="text-brand-400" />
                    )}
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-900/50">
            {loading ? (
              // Skeleton Loader Rows
              Array.from({ length: 5 }).map((_, idx) => (
                <tr key={idx}>
                  {columns.map((_, colIdx) => (
                    <td key={colIdx} className="px-6 py-4">
                      <div className="h-4 bg-slate-800 animate-pulse rounded"></div>
                    </td>
                  ))}
                </tr>
              ))
            ) : data.length === 0 ? (
              // Empty State
              <tr>
                <td colSpan={columns.length} className="px-6 py-12 text-center text-slate-500">
                  <div className="flex flex-col items-center justify-center gap-2">
                    <span className="text-lg font-medium text-slate-400">No records found</span>
                    <span className="text-xs">Try adjusting your filters or search query</span>
                  </div>
                </td>
              </tr>
            ) : (
              // Active Data Rows
              data.map((row, idx) => (
                <tr key={row.id || idx} className="hover:bg-slate-900/30 transition-colors duration-150">
                  {columns.map((col) => (
                    <td key={col.key} className="px-6 py-4 whitespace-nowrap text-slate-300">
                      {col.render ? col.render(row) : row[col.key]}
                    </td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination controls */}
      {!loading && totalPages > 1 && onPageChange && (
        <div className="flex items-center justify-between mt-2 px-1">
          <div className="text-xs text-slate-400">
            Showing <span className="font-medium text-slate-200">page {currentPage}</span> of{' '}
            <span className="font-medium text-slate-200">{totalPages}</span>
            {totalItems > 0 && (
              <span> ({totalItems} total records)</span>
            )}
          </div>
          <div className="flex items-center gap-1">
            <button
              onClick={() => onPageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className="p-1.5 rounded-lg border border-slate-900 bg-slate-950 text-slate-400 hover:text-white hover:bg-slate-850 disabled:opacity-40 disabled:cursor-not-allowed transition"
            >
              <ChevronLeft size={16} />
            </button>
            {Array.from({ length: totalPages }).map((_, idx) => {
              const pageNum = idx + 1;
              const isCurrent = pageNum === currentPage;
              return (
                <button
                  key={pageNum}
                  onClick={() => onPageChange(pageNum)}
                  className={`h-8 w-8 text-xs font-semibold rounded-lg transition ${
                    isCurrent
                      ? 'bg-brand-600 text-white shadow-md'
                      : 'border border-slate-900 bg-slate-950 text-slate-400 hover:text-white hover:bg-slate-850'
                  }`}
                >
                  {pageNum}
                </button>
              );
            })}
            <button
              onClick={() => onPageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="p-1.5 rounded-lg border border-slate-900 bg-slate-950 text-slate-400 hover:text-white hover:bg-slate-850 disabled:opacity-40 disabled:cursor-not-allowed transition"
            >
              <ChevronRight size={16} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Table;
