import { useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchHeadlines, selectLastFetched, selectCurrentCategory } from '../store/slices/newsSlice';

const REFRESH_INTERVAL = parseInt(import.meta.env.VITE_NEWS_REFRESH_INTERVAL) || 300000;

export const useAutoRefresh = () => {
  const dispatch = useDispatch();
  const lastFetched = useSelector(selectLastFetched);
  const currentCategory = useSelector(selectCurrentCategory);
  const intervalRef = useRef(null);

  useEffect(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }

    intervalRef.current = setInterval(() => {
      dispatch(fetchHeadlines({ category: currentCategory, page: 1 }));
    }, REFRESH_INTERVAL);

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [dispatch, currentCategory]);

  return { lastFetched, refreshInterval: REFRESH_INTERVAL };
};
