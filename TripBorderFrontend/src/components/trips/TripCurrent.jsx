import { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { authAPI } from '../../api/authAPI';
import {
  setTripUUID,
  setOwnerEmail,
  setCreatedDate,
  setIsLoadTrip,
  resetTrip
} from '../../redux/reducers/tripReducer';
import { formatDateMMMddyyyy } from '../../utility/time';
import { useInitTripByEmailMutation } from '../../api/tripsAPI';
import CustomButton from '../CustomButton';
import CustomToggle from '../CustomToggle';
import CustomError from '../CustomError';
import Meals from './Meals';
import Hotels from './Hotels';
import POIs from './POIs';
import Transports from './Transports';
import Ratings from './Ratings';
import TripTags from './TripTags';
import TripsPast from './TripsPast';
import TripUploadForm from './TripUploadForm';
import Tags from './Tags';

function TripCurrent() {
  const [isEditing, setIsEditing] = useState(false);

  const tripData = useSelector((state) => state.tripReducer);
  const user = useSelector(authAPI.endpoints.checkAuthStatus.select());
  const email = user.data?.email;

  const [initTripByEmail, { data, isLoading, error }] = useInitTripByEmailMutation();

  const dispatch = useDispatch();

  useEffect(() => {
    if (data) {
      dispatch(setTripUUID(data.trip.uuid));
      dispatch(setOwnerEmail(data.trip.owner_email));
      dispatch(setCreatedDate(data.trip.created_at));
    }
  }, [data]);

  const handleEditButton = () => {
    setIsEditing(!isEditing);
  };

  const handleBackButton = () => {
    dispatch(setIsLoadTrip(false));
    dispatch(resetTrip());
  };

  const handleNewTripButtonClick = () => {
    initTripByEmail(email);
  };

  const handleLoadTripButtonClick = () => {
    dispatch(setIsLoadTrip(true));
  };

  const renderTripDetail = () => (
    <div>
      <div className='text-pretty px-4 gap-x-1 '>
        <div className='underline underline-offset-2'>Start</div>
        <div className='px-2 font-mono'>{formatDateMMMddyyyy(tripData.start_date)}</div>
        <div className='underline underline-offset-2'>End</div>
        <div className='px-2 font-mono'>{formatDateMMMddyyyy(tripData.end_date)}</div>
      </div>
      <Meals tripID={tripData.uuid} />
      <Hotels tripID={tripData.uuid} />
      <POIs tripID={tripData.uuid} />
      <Transports tripID={tripData.uuid} />
      <Ratings tripID={tripData.uuid} />
      <TripTags tripID={tripData.uuid} />
      <Tags tripID={tripData.uuid} />
    </div>
  );

  const renderTripOptions = () => {
    if (tripData.uuid === '') {
      if (tripData.isLoadTrip) {
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
    return null;
  };

  return (
    <div>
      {(tripData.uuid)
        ? (
          <div className='text-base'>
            <div className='cardInfo'>
              <div className='flex justify-between'>
                {(!isEditing)
                  ? (
                    <CustomButton
                      className='buttonBack'
                      label='←Trip Selection'
                      onClick={handleBackButton}
                    />
                  )
                  : <div />}
                <CustomButton
                  className='buttonBack'
                  label={(!isEditing) ? 'Edit' : 'Done'}
                  onClick={handleEditButton}
                />
              </div>
              {(!isEditing)
                ? (
                  <div className='text-center'>
                    <CustomToggle
                      className='toggle min-h-12 min-w-80 max-w-80 overflow-x-auto text-lg'
                      aria-label={`Trip Button ${tripData.uuid}`}
                      id={tripData.uuid}
                      title={tripData.title}
                      component={renderTripDetail()}
                    />
                  </div>
                )
                : (
                  <div className='text-center'>
                    <CustomToggle
                      className='text-xl'
                      title='Edit Trip'
                      component={<TripUploadForm />}
                      isOpened
                    />
                  </div>
                )}
            </div>
          </div>
        )
        : renderTripOptions()}
      {(isLoading) ? <div>Creating...</div> : null}
      {(error) ? <CustomError error={error} /> : null}
    </div>
  );
}

export default TripCurrent;
