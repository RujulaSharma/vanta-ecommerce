import { ChevronLeft, ChevronRight } from "lucide-react";
import { tw } from "../../utils/twStyles.js";

const Pagination = ({ pagination, page, totalPages, setPage }) => {
  // Gracefully handle both object prop (pagination) and flat props (page, totalPages)
  const currentPage = pagination?.currentPage ?? page ?? 1;
  const pages = pagination?.totalPages ?? totalPages ?? 1;
  const hasPrev = pagination?.hasPreviousPage ?? currentPage > 1;
  const hasNext = pagination?.hasNextPage ?? currentPage < pages;

  if (!pages || pages <= 1) return null;

  return (
    <div className={tw("vanta-collection-pagination")}>
      <button
        type="button"
        disabled={!hasPrev}
        onClick={() => setPage && setPage((current) => Math.max(current - 1, 1))}
        aria-label="Previous page"
      >
        <ChevronLeft size={16} />
      </button>

      {Array.from({ length: Math.min(pages, 5) }).map((_, index) => {
        const pageNumber = index + 1;

        return (
          <button
            key={pageNumber}
            type="button"
            className={tw(pageNumber === currentPage ? "active" : "")}
            onClick={() => setPage && setPage(pageNumber)}
            aria-label={`Go to page ${pageNumber}`}
            aria-current={pageNumber === currentPage ? "page" : undefined}
          >
            {pageNumber}
          </button>
        );
      })}

      <button
        type="button"
        disabled={!hasNext}
        onClick={() => setPage && setPage((current) => current + 1)}
        aria-label="Next page"
      >
        <ChevronRight size={16} />
      </button>
    </div>
  );
};

export default Pagination;
