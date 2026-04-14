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
  setEndDate,
  setSharedMode
} from '../../redux/reducers/tripReducer';
import {
  setIsLoadTrip,
  setIsLoadTripPublic,
  setIsLoadTripShared,
  setIsLoadTripOthersShared,
  setIsEditingTrip
} from '../../redux/reducers/userSettingsReducer';
import { formatDateccc, formatDatecccMMMdyyyy, formatDateMMMdyyyy } from '../../utility/time';
import { useInitTripByEmailMutation } from '../../api/tripsAPI';
import CustomButton from '../CustomButton';
import CustomToggle from '../CustomToggle';
import CustomError from '../CustomError';
import CustomLoading from '../CustomLoading';
import Meals from './tripItems/Meals';
import Hotels from './tripItems/Hotels';
import POIs from './tripItems/POIs';
import Transports from './tripItems/Transports';
import Ratings from './tripItems/Ratings';
import Tags from './tripItems/Tags';
import TripTags from './tripItems/TripTags';
import MealsReadOnly from './tripItems/MealsReadOnly';
import HotelsReadOnly from './tripItems/HotelsReadOnly';
import POIsReadOnly from './tripItems/POIsReadOnly';
import TransportsReadOnly from './tripItems/TransportsReadOnly';
import RatingsReadOnly from './tripItems/RatingsReadOnly';
import TripTagsReadOnly from './tripItems/TripTagsReadOnly';
import TripsLoading from './TripsLoading';
import TripsPublicLoading from './TripsPublicLoading';
import TripsSharedLoading from './TripsSharedLoading';
import TripsOthersSharedLoading from './TripsOthersSharedLoading';
import TripUploadForm from './TripUploadForm';
import IconMapOverview from './IconMapOverview';

export default function TripCurrent({ handleFlyTo, handleFitBounds }) {
  const {
    isLoadTrip,
    isLoadTripPublic,
    isLoadTripShared,
    isLoadTripOthersShared,
    isEditingTrip,
  } = useSelector((state) => state.userSettingsReducer);
  const {
    uuid,
    title,
    startDate,
    endDate,
    sharedMode
  } = useSelector((state) => state.tripReducer);

  const { data: user } = useCheckAuthStatusQuery(undefined, { refetchOnFocus: true, refetchOnReconnect: true });
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
      dispatch(setSharedMode(data.trip.shared_mode));
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

  const handleTripSharedButtonClick = () => {
    dispatch(setIsLoadTripShared(true));
  };

  const handleTripOthersSharedButtonClick = () => {
    dispatch(setIsLoadTripOthersShared(true));
  };

  const handleTripPublicButtonClick = () => {
    dispatch(setIsLoadTripPublic(true));
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
      {isLoadTripPublic || isLoadTripShared || isLoadTripOthersShared
        ? (
          <div>
            <IconMapOverview tripID={uuid} handleFlyTo={handleFlyTo} handleFitBounds={handleFitBounds} />
            <MealsReadOnly tripID={uuid} handleFlyTo={handleFlyTo} />
            <HotelsReadOnly tripID={uuid} handleFlyTo={handleFlyTo} />
            <POIsReadOnly tripID={uuid} handleFlyTo={handleFlyTo} />
            <TransportsReadOnly tripID={uuid} handleFlyTo={handleFlyTo} />
            <TripTagsReadOnly tripID={uuid} />
            <RatingsReadOnly tripID={uuid} />
          </div>
        )
        : (
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
        )}
    </div>
  );

  const renderTripOptions = () => {
    if (uuid === '') {
      if (isLoadTrip) {
        return <TripsLoading handleFlyTo={handleFlyTo} />;
      }
      if (isLoadTripPublic) {
        return <TripsPublicLoading handleFlyTo={handleFlyTo} />;
      }
      if (isLoadTripShared) {
        return <TripsSharedLoading handleFlyTo={handleFlyTo} />;
      }
      if (isLoadTripOthersShared) {
        return <TripsOthersSharedLoading handleFlyTo={handleFlyTo} />;
      }
      return (
        <div className='text-center'>
          <CustomButton
            label='New Trip'
            onClick={handleNewTripButtonClick}
          />
          <CustomButton
            label='My Trips'
            onClick={handleLoadTripButtonClick}
          />
          <CustomButton
            label='My Shared Trips'
            onClick={handleTripSharedButtonClick}
          />
          <CustomButton
            label='Shared Trips to Me'
            onClick={handleTripOthersSharedButtonClick}
          />
          <CustomButton
            label='Public Trips'
            onClick={handleTripPublicButtonClick}
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
              {(isLoadTripPublic || isLoadTripOthersShared)
                ? null
                : (
                  <CustomButton
                    className='buttonBack'
                    label={(!isEditingTrip) ? 'Edit Trip' : 'Done'}
                    onClick={handleEditButton}
                  />
                )}
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
                  <div>Sharing Mode: {sharedMode}</div>
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
