import { useCheckAuthStatusQuery } from '../api/authAPI';
import { useCreateCheckoutSessionMutation } from '../api/stripeAPI';
import CustomButton from './CustomButton';
import CustomError from './CustomError';

export default function Upgrade() {
  const { data: user } = useCheckAuthStatusQuery();
  const [createStripeCheckoutSession, { error: checkoutError }] = useCreateCheckoutSessionMutation();

  const handlePremium = async () => {
    const result = await createStripeCheckoutSession(user.email).unwrap();
    if (result.url) {
      window.location.href = result.url;
    }
  };

  return (
    <div className='cardMX1'>
      <div className='grid grid-cols-1 container mx-auto max-w-6xl'>
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
