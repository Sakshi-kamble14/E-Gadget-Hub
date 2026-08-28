import { useMemo, useState } from "react";

export function usePagination(items = [], pageSize = 8) {
  const [page, setPage] = useState(1);

  const totalPages = Math.max(1, Math.ceil(items.length / pageSize));
  const safePage = Math.min(page, totalPages);

  const pageItems = useMemo(() => {
    const start = (safePage - 1) * pageSize;
    return items.slice(start, start + pageSize);
  }, [items, safePage, pageSize]);

  const setPageClamped = (p) => setPage(Math.min(Math.max(1, p), totalPages));

  return {
    page: safePage,
    totalPages,
    pageItems,
    setPage: setPageClamped,
    totalItems: items.length,
    pageSize,
  };
}

export default usePagination;
