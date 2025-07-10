import { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import PropTypes from 'prop-types';
import { authAPI } from '../../api/authAPI';
import {
  setTripUUID,
  setOwnerEmail,
  setUpdatedDate,
  setCreatedDate
} from '../../redux/reducers/tripReducer';
import { getLocalTimeToMin, getLocalTimeToSecond } from '../../utility/time';
import CustomButton from '../CustomButton';
import CustomToggle from '../CustomToggle';
import TripUploadForm from './TripUploadForm';

function CurrentTrip({ initTripByEmail, initTripByEmailData }) {
  const { data, isLoading, error } = initTripByEmailData;
  const user = useSelector(authAPI.endpoints.checkAuthStatus.select());
  const email = user.data?.email;

  const tripData = useSelector((state) => state.tripReducer);

  const dispatch = useDispatch();

  useEffect(() => {
    if (data) {
      dispatch(setTripUUID(data.trip.uuid));
      dispatch(setOwnerEmail(data.trip.owner_email));
      dispatch(setCreatedDate(data.trip.created_at));
      dispatch(setUpdatedDate(data.trip.updated_at));
    }
  }, [data]);

  const handleButtonClick = () => {
    initTripByEmail(email);
  };

  const renderTripDetail = () => (
    <div>
      <div>{`Start: ${getLocalTimeToMin(tripData.start_date)}`}</div>
      <div>{`End: ${getLocalTimeToMin(tripData.end_date)}`}</div>
      <div>{`Created: ${getLocalTimeToSecond(tripData.created_at)}`}</div>
      <div>{`Updated: ${getLocalTimeToSecond(tripData.updated_at)}`}</div>
    </div>
  );

  const renderTripsItem = () => (
    <div className='flex justify-center'>
      <CustomToggle
        className='container overflow-x-auto font-mono -tracking-wider text-center'
        aria-label={`Trip Button ${tripData.uuid}`}
        id={tripData.uuid}
        title={tripData.title}
        component={renderTripDetail()}
      />
    </div>
  );

  return (
    <div className='overflow-x-auto table-fixed whitespace-nowrap'>
      <div className='cardInfo text-center'>
        {console.log(data)}
        {console.log(tripData)}
        {data || tripData.uuid ? (
          <CustomToggle
            className='text-2xl'
            title='New Trip'
            component={<TripUploadForm />}
            isOpened
          />
        ) : (
          <CustomButton
            label='Create New Trip'
            onClick={handleButtonClick}
          />
        )}
        {(isLoading) ? <div>Creating...</div> : null}
        {(error) ? <div className='text-red-600'>{`Status: ${error.status} - ${error.data.error}`}</div> : null}
      </div>
      {data ? (
        <div className='text-base text-center'>
          Current Trips
          <div key={tripData.uuid}>
            <div className='cardMileage'>
              {renderTripsItem()}
            </div>
          </div>
        </div>
      ) : ''}
    </div>
  );
}

CurrentTrip.propTypes = {
  initTripByEmail: PropTypes.func,
  initTripByEmailData: { trip: {}, message: {} }
};

export default CurrentTrip;
