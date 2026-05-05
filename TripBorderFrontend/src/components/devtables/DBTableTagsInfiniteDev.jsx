import { useCallback, useEffect, useRef, useState } from 'react';
import { useGetTagsAllInfiniteQuery } from '../../api/tagsAPI';
import CustomError from '../CustomError';
import CustomLoading from '../CustomLoading';
import CustomFetching from '../CustomFetching';

export default function DBTableTagsInfiniteDev() {
  const [page, setPage] = useState(1);
  const limit = 10;

  const [allTags, setAllTags] = useState([]);
  const [hasMore, setHasMore] = useState(true);

  const { data, isLoading, isFetching, error } = useGetTagsAllInfiniteQuery({ page, limit }, { keepPreviousData: true });

  const observer = useRef();
  const lastRowRef = useCallback((node) => {
    if (isFetching) return; // don't trigger while loading
    if (observer.current) observer.current.disconnect();

    observer.current = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting && hasMore) {
        setPage((prev) => prev + 1);
      }
    }, {
      threshold: 0.8, // Trigger when most of the sentinel is visible
      rootMargin: '0px 120px 0px 0px' // Extra margin on the right for smoother feel
    });

    if (node) observer.current.observe(node);
  }, [isFetching, hasMore]);

  // When new page data arrives → append it (infinite scroll!)
  useEffect(() => {
    if (data?.tags) {
      setAllTags((prev) => {
        const existingIds = new Set(prev.map((t) => t.uuid));
        const freshTags = data.tags.filter((tag) => !existingIds.has(tag.uuid));
        return [...prev, ...freshTags];
      });

      setHasMore(data.hasMore !== false);
    }
  }, [data]);

  // Cleanup observer when component unmounts
  useEffect(() => () => {
    if (observer.current) observer.current.disconnect();
  }, []);

  if (isLoading && page === 1) {
    return <div><CustomLoading isLoading={isLoading} /></div>;
  }

  if (error) {
    return <CustomError error={error} />;
  }

  return (
    <div>
      <div>tags (Infinite Scroll)</div>
      <div className='text-center'>
        <span>
          Showing {allTags.length} of {data?.total || 0} tags
        </span>
      </div>
      <div>
        <CustomFetching isFetching={isFetching} text='Fetching more' />
      </div>
      <div className='overflow-x-auto'>
        <table className='min-w-full table-fixed whitespace-nowrap'>
          <thead>
            <tr>
              {allTags.map((tag) => (
                <th key={tag.uuid} className='tdScroll w-20'>
                  {tag.name}
                </th>
              ))}
              {hasMore && (
                <th
                  ref={lastRowRef}
                  className='tdScroll'
                >
                  {isFetching && <CustomLoading isLoading />}
                </th>
              )}
            </tr>
          </thead>
        </table>
      </div>
      {!hasMore && allTags.length > 0 && (
        <div className='text-center text-amber-600 dark:text-amber-400'>
          🎉 All tags shown
        </div>
      )}

      {allTags.length === 0 && !isLoading && (
        <div className='text-center text-gray-500'>No tags found</div>
      )}
    </div>
  );
}
