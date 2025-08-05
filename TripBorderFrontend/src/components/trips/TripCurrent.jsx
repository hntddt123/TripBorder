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

export default function TripCurrent() {
  const {
    isLoadTrip,
    isEditingTrip,
  } = useSelector((state) => state.userSettingsReducer);
  const {
    uuid,
    title,
    startDate,
    endDate
  } = useSelector((state) => state.tripReducer);

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
        {(formatDatecccMMMdyyyy(startDate) === formatDatecccMMMdyyyy(endDate))
          ? (
            <div className='px-2 font-mono'>
              {formatDatecccMMMdyyyy(endDate)}
            </div>
          )
          : (
            <div className='px-2 font-mono'>
              {formatDatecccMMMdyyyy(startDate)} - {formatDatecccMMMdyyyy(endDate)}
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
              <Meals tripID={uuid} />
              <Hotels tripID={uuid} />
              <POIs tripID={uuid} />
              <Transports tripID={uuid} />
              <TripTags tripID={uuid} />
              <Tags tripID={uuid} />
              <Ratings tripID={uuid} />
            </div>
          )}
          isOpened
        />
      </div>
    </div>
  );

  const renderTripOptions = () => {
    if (uuid === '') {
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
      {(uuid)
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
                      aria-label={`Trip Button ${uuid}`}
                      id={uuid}
                      title={title}
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
