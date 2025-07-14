import { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { authAPI } from '../../api/authAPI';
import {
  setTripUUID,
  setOwnerEmail,
  setCreatedDate,
  resetTrip
} from '../../redux/reducers/tripReducer';
import { getLocalTime } from '../../utility/time';
import { useInitTripByEmailMutation } from '../../api/tripsAPI';
import CustomButton from '../CustomButton';
import CustomToggle from '../CustomToggle';
import TripUploadForm from './TripUploadForm';
import CustomError from '../CustomError';
import Meals from './Meals';
import Hotels from './Hotels';
import POIs from './POIs';
import Transports from './Transports';
import Ratings from './Ratings';
import TripTags from './TripTags';
import TripsPast from './TripsPast';

function TripCurrent() {
  const [isLoadTrip, setIsLoadTrip] = useState(false);
  const user = useSelector(authAPI.endpoints.checkAuthStatus.select());
  const email = user.data?.email;

  const [initTripByEmail, { data, isLoading, error }] = useInitTripByEmailMutation();
  const tripData = useSelector((state) => state.tripReducer);

  const dispatch = useDispatch();

  useEffect(() => {
    if (data) {
      dispatch(setTripUUID(data.trip.uuid));
      dispatch(setOwnerEmail(data.trip.owner_email));
      dispatch(setCreatedDate(data.trip.created_at));
    }
  }, [data]);

  const handleBackButton = () => {
    setIsLoadTrip(false);
    dispatch(resetTrip());
  };

  const handleNewTripButtonClick = () => {
    initTripByEmail(email);
  };

  const handleLoadTripButtonClick = () => {
    setIsLoadTrip(true);
  };

  const renderTripDetail = () => (
    <div>
      <div>{`Start: ${getLocalTime(tripData.start_date)}`}</div>
      <div>{`End: ${getLocalTime(tripData.end_date)}`}</div>
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

  const renderTripOptions = () => {
    if (tripData.uuid === '') {
      if (isLoadTrip) {
        return <TripsPast />;
      }
      return (
        <div className='text-center'>
          <CustomButton
            label='New Trip'
            onClick={handleNewTripButtonClick}
          />
          <CustomButton
            label='Load Trip'
            onClick={handleLoadTripButtonClick}
          />
        </div>
      );
    }
    return (
      <div>
        <CustomButton className='backButton' label='←' onClick={handleBackButton} />
        <div className='text-center'>
          <CustomToggle
            className='text-2xl'
            title='Plan Trip'
            component={<TripUploadForm />}
            isOpened
          />
        </div>
      </div>
    );
  };

  return (
    <div className='overflow-x-auto table-fixed whitespace-nowrap'>
      <div className='cardInfo'>
        {renderTripOptions()}
        {(isLoading) ? <div>Creating...</div> : null}
        {(error) ? <CustomError error={error} /> : null}
      </div>
      {tripData.uuid ? (
        <div className='text-base text-center'>
          Current Trips
          <div key={tripData.uuid}>
            <div className='cardMileage'>
              {renderTripsItem()}
              <Meals tripID={tripData.uuid} />
              <Hotels tripID={tripData.uuid} />
              <POIs tripID={tripData.uuid} />
              <Transports tripID={tripData.uuid} />
              <Ratings tripID={tripData.uuid} />
              <TripTags tripID={tripData.uuid} />
            </div>
          </div>
        </div>
      ) : ''}
    </div>
  );
}

export default TripCurrent;
