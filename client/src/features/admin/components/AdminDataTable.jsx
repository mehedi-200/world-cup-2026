import Table from '@/components/ui/Table';
import Loader from '@/components/ui/Loader';
import EmptyState from '@/components/ui/EmptyState';

export default function AdminDataTable({
  columns,
  data,
  loading,
  error,
  emptyTitle = 'No data',
  emptyDescription = '',
  mobileRender,
  onRowClick,
}) {
  if (loading) return <Loader size="lg" text="Loading..." />;
  if (error) return <div className="text-center py-12"><p className="text-red-400">{error}</p></div>;
  if (!data?.length) return <EmptyState title={emptyTitle} description={emptyDescription} />;

  return (
    <>
      {/* Desktop table */}
      <div className="hidden lg:block">
        <Table columns={columns} data={data} onRowClick={onRowClick} />
      </div>

      {/* Mobile card list */}
      <div className="lg:hidden space-y-3">
        {data.map((row, i) => (
          <div
            key={row.id || i}
            onClick={() => onRowClick?.(row, i)}
            className={`bg-white/5 backdrop-blur-md border border-white/10 rounded-xl p-4 ${
              onRowClick ? 'cursor-pointer active:bg-white/10' : ''
            } transition-colors`}
          >
            {mobileRender ? mobileRender(row) : (
              <div className="space-y-1">
                {columns.slice(0, 3).map((col) => (
                  <div key={col.key} className="flex justify-between items-center">
                    <span className="text-xs text-gray-500 uppercase">{col.label}</span>
                    <span className="text-sm text-gray-200">
                      {col.render ? col.render(row[col.key], row) : row[col.key]}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </>
  );
}
