import { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { authAPI } from '../../api/authAPI';
import {
  setTripUUID,
  setOwnerEmail,
  setCreatedDate,
  resetTrip,
  setStartDate,
  setEndDate
} from '../../redux/reducers/tripReducer';
import {
  setIsLoadTrip,
  setIsEditingTrip
} from '../../redux/reducers/userSettingsReducer';
import { formatDatecccMMMdyyyy } from '../../utility/time';
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
  const isLoadTrip = useSelector((state) => state.userSettingsReducer.isLoadTrip);
  const isEditingTrip = useSelector((state) => state.userSettingsReducer.isEditingTrip);
  const tripData = useSelector((state) => state.tripReducer);

  const user = useSelector(authAPI.endpoints.checkAuthStatus.select());
  const email = user.data?.email;

  const [initTripByEmail, { data, isLoading, error }] = useInitTripByEmailMutation();

  const dispatch = useDispatch();

  useEffect(() => {
    if (data) {
      dispatch(setStartDate(data.trip.start_date));
      dispatch(setEndDate(data.trip.end_date));
      dispatch(setTripUUID(data.trip.uuid));
      dispatch(setTripUUID(data.trip.uuid));
      dispatch(setOwnerEmail(data.trip.owner_email));
      dispatch(setCreatedDate(data.trip.created_at));
    }
  }, [data]);

  const handleEditButton = () => {
    dispatch(setIsEditingTrip(!isEditingTrip));
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
      <div className='text-pretty px-4 gap-x-1'>
        <div className='underline underline-offset-2'>Travel Date</div>
        {(formatDatecccMMMdyyyy(tripData.start_date) === formatDatecccMMMdyyyy(tripData.end_date))
          ? (
            <div className='px-2 font-mono'>
              {formatDatecccMMMdyyyy(tripData.end_date)}
            </div>
          )
          : (
            <div className='px-2 font-mono'>
              {formatDatecccMMMdyyyy(tripData.start_date)} - {formatDatecccMMMdyyyy(tripData.end_date)}
            </div>
          )}
      </div>
      <div>
        <CustomToggle
          translate='no'
          className='toggle min-h-12 min-w-72 max-w-72 text-lg mb-1'
          aria-label='All Trip items'
          title='All items'
          component={(
            <div>
              <Meals tripID={tripData.uuid} />
              <Hotels tripID={tripData.uuid} />
              <POIs tripID={tripData.uuid} />
              <Transports tripID={tripData.uuid} />
              <TripTags tripID={tripData.uuid} />
              <Tags tripID={tripData.uuid} />
              <Ratings tripID={tripData.uuid} />
            </div>
          )}
          isOpened
        />
      </div>
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
    return null;
  };

  return (
    <div>
      {(tripData.uuid)
        ? (
          <div className='text-base'>
            <div className='cardInfo'>
              <div className='flex justify-between mb-1'>
                {(!isEditingTrip)
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
                  label={(!isEditingTrip) ? 'Edit Trip' : 'Done'}
                  onClick={handleEditButton}
                />
              </div>
              {(!isEditingTrip)
                ? (
                  <div className='text-center'>
                    <CustomToggle
                      translate='no'
                      className='toggle min-h-12 min-w-80 max-w-80 text-lg'
                      aria-label={`Trip Button ${tripData.uuid}`}
                      id={tripData.uuid}
                      title={tripData.title}
                      component={renderTripDetail()}
                      isOpened
                    />
                  </div>
                )
                : (
                  <div className='text-center'>
                    <TripUploadForm />
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
