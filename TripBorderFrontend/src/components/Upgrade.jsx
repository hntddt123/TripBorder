import { DateTime } from 'luxon';
import { useCheckAuthStatusQuery } from '../api/authAPI';
import { useUpdateUserMutation } from '../api/usersAPI';
import CustomButton from './CustomButton';
import CustomError from './CustomError';
import CustomLoading from './CustomLoading';
import { isTrialActive } from '../utility/time';

export default function Upgrade() {
  const { data: user, refetch } = useCheckAuthStatusQuery();
  const [updateUser, { isLoading, error }] = useUpdateUserMutation();

  const handleFreeTrial = () => {
    const updates = {
      trial_started_at: DateTime.utc(),
      is_trialed: true
    };

    updateUser({
      uuid: user.uuid,
      updates: updates
    });
    refetch();
  };

  const renderFreeTrial = () => {
    if (!isTrialActive(user?.trial_started_at) && !user?.is_trialed) {
      return (
        <div className='cardInfo p-4 text-3xl'>
          <div>
            Trip Border Trial For 7 Days
          </div>
          <CustomButton
            className='buttonUpgrade'
            label='Start Free trial'
            onClick={handleFreeTrial}
          />
        </div>
      );
    }
    if (isTrialActive(user?.trial_started_at)) {
      return (
        <div className='cardInfo p-4 text-3xl'>
          In Trip Border Trial For 7 Days
        </div>
      );
    }
    return (
      <div className='cardInfo p-4 text-3xl'>
        Trip Border Trial For 7 Days Ended
      </div>
    );
  };

  return (
    <div className='cardMX1'>
      <div className='grid grid-cols-1 container mx-auto max-w-6xl'>
        {renderFreeTrial()}
        <CustomLoading isLoading={isLoading} />
        <CustomError error={error} />
        <div className='cardInfo p-4 text-lg'>
          <div className='text-3xl mb-2'>Upgrade to Premium User</div>
          <div>
            Plan Trip with Trip Border custom map
          </div>
          <div>
            Fast Point of Interest Search (currently support US, JP, TW)
          </div>
          <div>
            View Past Trip
          </div>
          {/* $3.99/year */}
        </div>
      </div>
    </div>
  );
}
