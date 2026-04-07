import TripsMap from './trips/TripsMap';
import { useCheckAuthStatusQuery } from '../api/authAPI';

export default function DevMode() {
  const { data } = useCheckAuthStatusQuery({ skip: true });

  return (
    <div>
      {(!data?.isAuthenticated)
        ? (
          <div>
            <div className='my-2'>
              <TripsMap premium={false} />
            </div>
          </div>
        )
        : null}
    </div>
  );
}
