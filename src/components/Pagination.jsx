export default function Pagination({
  currentPage,
  totalPages,
  onPageChange,
}) {
  if (totalPages <= 1) return null;

  return (
    <div className="flex items-center justify-center gap-6 mt-10">

      {/* PREVIOUS */}
      
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className="
          px-6 py-2 rounded-lg font-medium
          bg-[#0b1320] text-white
          disabled:opacity-50 disabled:cursor-not-allowed
        "
      >
        ← Previous
      </button>

      {/* PAGE INFO */}
      <span
        className="
          text-sm font-semibold
          text-[#0b1320]
          dark:text-[#0b1320]
        "
      >
        Page {currentPage} of {totalPages}
      </span>

      {/* NEXT */}
      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="
          px-6 py-2 rounded-lg font-medium
          bg-[#0b1320] text-white
          disabled:opacity-50 disabled:cursor-not-allowed
        "
      >
        Next →
      </button>
    </div>
  );
}
