import { FeedUI } from '@ui-pages';
import { FC } from 'react';
import { useSelector, useDispatch } from '../../services/store';
import { fetchFeed } from '../../services/slices/feedSlice';
import { useEffect } from 'react';
import { Preloader } from '@ui';
import { TOrder } from '@utils-types';

export const Feed: FC = () => {
  const dispatch = useDispatch();

  const orders: TOrder[] = useSelector((state) => state.feed.orders);
  const isLoading = useSelector((state) => state.feed.isLoading);

  const handleGetFeeds = () => {
    dispatch(fetchFeed());
  };

  useEffect(() => {
    dispatch(fetchFeed());
  }, [dispatch]);

  if (isLoading) return <Preloader />;

  return <FeedUI orders={orders} handleGetFeeds={handleGetFeeds} />;
};
