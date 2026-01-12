import PropTypes from 'prop-types';
import { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useCheckAuthStatusQuery } from '../../api/authAPI';
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
import { formatDateccc, formatDatecccMMMdyyyy, formatDateMMMdyyyy } from '../../utility/time';
import { useInitTripByEmailMutation } from '../../api/tripsAPI';
import CustomButton from '../CustomButton';
import CustomToggle from '../CustomToggle';
import CustomError from '../CustomError';
import CustomLoading from '../CustomLoading';
import Meals from './Meals';
import Hotels from './Hotels';
import POIs from './POIs';
import Transports from './Transports';
import Ratings from './Ratings';
import TripTags from './TripTags';
import TripsLoading from './TripsLoading';
import TripUploadForm from './TripUploadForm';
import Tags from './Tags';
import IconMapOverview from './IconMapOverview';

export default function TripCurrent({ handleFlyTo, handleFitBounds }) {
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

  const { data: user } = useCheckAuthStatusQuery();
  const email = user?.email;

  const [initTripByEmail, { data, isLoading, error }] = useInitTripByEmailMutation();

  const dispatch = useDispatch();

  useEffect(() => {
    if (data) {
      dispatch(setStartDate(data.trip.start_date));
      dispatch(setEndDate(data.trip.end_date));
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
            <>
              <div className='px-2 font-mono'>
                {formatDateMMMdyyyy(startDate)} - {formatDateMMMdyyyy(endDate)}
              </div>
              <div className='px-2 font-mono'>
                {formatDateccc(startDate)} - {formatDateccc(endDate)}
              </div>
            </>
          )}
      </div>
      <div>
        <IconMapOverview tripID={uuid} handleFlyTo={handleFlyTo} handleFitBounds={handleFitBounds} />
        <Meals tripID={uuid} handleFlyTo={handleFlyTo} />
        <Hotels tripID={uuid} handleFlyTo={handleFlyTo} />
        <POIs tripID={uuid} handleFlyTo={handleFlyTo} />
        <Transports tripID={uuid} handleFlyTo={handleFlyTo} />
        <TripTags tripID={uuid} />
        <Tags tripID={uuid} />
        <Ratings tripID={uuid} />
      </div>
    </div>
  );

  const renderTripOptions = () => {
    if (uuid === '') {
      if (isLoadTrip) {
        return <TripsLoading />;
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
                    className='toggle toggleTripTitle'
                    aria-label={`Trip Button ${uuid}`}
                    id={uuid}
                    titleOn={`${title} ▼`}
                    titleOff={`${title}`}
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
        )
        : renderTripOptions()}
      <CustomLoading isLoading={isLoading} text='Creating...' />
      <CustomError error={error} />
    </div>
  );
}

TripCurrent.propTypes = {
  handleFlyTo: PropTypes.func,
  handleFitBounds: PropTypes.func
};
