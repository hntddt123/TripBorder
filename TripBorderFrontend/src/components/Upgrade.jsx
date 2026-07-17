import { useEffect, useState } from 'react';
import { DateTime } from 'luxon';
import { useCheckAuthStatusQuery } from '../api/authAPI';
import { useUpdateUserMutation } from '../api/usersAPI';
import { useCreateCheckoutSessionMutation } from '../api/stripeAPI';
import CustomButton from './CustomButton';
import CustomError from './CustomError';
import CustomLoading from './CustomLoading';
import { isTrialActive } from '../utility/time';

export default function Upgrade() {
  const [isTrial, setIsTrial] = useState(false);
  const { data: user, refetch } = useCheckAuthStatusQuery();
  const [createStripeCheckoutSession, { error: checkoutError }] = useCreateCheckoutSessionMutation();
  const [updateUser, { isLoading, error }] = useUpdateUserMutation();

  useEffect(() => {
    if (user && isTrialActive(user.trial_started_at)) {
      setIsTrial(true);
    } else if (user && user.is_trialed && !isTrialActive(user.trial_started_at)) {
      setIsTrial(false);
    }
  }, [user]);

  const handleFreeTrial = () => {
    const updates = {
      trial_started_at: DateTime.utc(),
      is_trialed: true
    };

    updateUser({
      uuid: user.uuid,
      updates: updates
    }).unwrap();
    setIsTrial(true);
    refetch();
  };

  const handlePremium = async () => {
    const result = await createStripeCheckoutSession(user.email).unwrap();
    if (result.url) {
      window.location.href = result.url;
    }
  };

  const renderFreeTrial = () => {
    if (!isTrialActive(user?.trial_started_at) && !user?.is_trialed && !isTrial) {
      return (
        <div className='cardInfo p-4 text-3xl'>
          <div className='mb-2'>
            Trip Border Trial For 30 Days
          </div>
          <CustomButton
            className='buttonUpgrade'
            label='Start Free trial'
            onClick={handleFreeTrial}
          />
        </div>
      );
    }
    if (isTrialActive(user?.trial_started_at) || isTrial) {
      return (
        <div className='cardInfo p-4 mb-2 text-3xl'>
          In Trip Border Trial For 30 Days
        </div>
      );
    }
    return (
      <div className='cardInfo p-4 mb-2 text-3xl'>
        Trip Border Trial For 30 Days Ended
      </div>
    );
  };

  return (
    <div className='cardMX1'>
      <div className='grid grid-cols-1 container mx-auto max-w-6xl'>
        {renderFreeTrial()}
        <CustomLoading isLoading={isLoading} />
        <CustomError error={error} />
        <CustomError error={checkoutError} />
        <div className='cardInfo p-4 text-lg'>
          <div className='text-3xl mb-2'>Upgrade to Premium User</div>
          <div>
            - Plan Unlimited Trips
          </div>
          {/* $9.99/year */}
          <CustomButton
            className='buttonUpgrade'
            label='Subscribe'
            onClick={handlePremium}
          />
        </div>
        <div className='cardInfo p-4 text-lg'>
          <div className='text-3xl mb-2'>Contact</div>
          <div>
            support@tripborder.com
          </div>
        </div>
      </div>
    </div>
  );
}
