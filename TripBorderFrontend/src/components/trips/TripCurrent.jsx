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
  setSharedMode,
  setIsLoadTrip,
  setIsLoadTripPublic,
  setIsLoadTripShared,
  setIsLoadTripOthersShared,
  setIsEditingTrip
} from '../../redux/reducers/tripReducer';
import { setSelectedMenu } from '../../redux/reducers/userSettingsReducer';
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
import { TRIPMENU_MODES } from '../../constants/constants';

export default function TripCurrent({ handleFlyTo, handleFitBounds }) {
  const {
    uuid,
    title,
    startDate,
    endDate,
    sharedMode,
    isLoadTrip,
    isLoadTripPublic,
    isLoadTripShared,
    isLoadTripOthersShared,
    isEditingTrip
  } = useSelector((state) => state.tripReducer);
  const { selectedMenu } = useSelector((state) => state.userSettingsReducer);

  const { data: user } = useCheckAuthStatusQuery(undefined, { refetchOnFocus: true, refetchOnReconnect: true });
  const email = user?.email;
  const role = user?.role || null;

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

  const handleTripMenuSelection = (key) => () => {
    dispatch(setSelectedMenu(key));
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
            <RatingsReadOnly tripID={uuid} />
            <TripTagsReadOnly tripID={uuid} />
          </div>
        )
        : (
          <div>
            <IconMapOverview tripID={uuid} handleFlyTo={handleFlyTo} handleFitBounds={handleFitBounds} />
            <Meals tripID={uuid} handleFlyTo={handleFlyTo} />
            <Hotels tripID={uuid} handleFlyTo={handleFlyTo} />
            <POIs tripID={uuid} handleFlyTo={handleFlyTo} />
            <Transports tripID={uuid} handleFlyTo={handleFlyTo} />
            <Ratings tripID={uuid} />
            <TripTags tripID={uuid} />
            <Tags tripID={uuid} />
          </div>
        )}
    </div>
  );

  const renderTripMenu = () => (
    <>
      <CustomButton
        className='button min-w-36'
        label='New Trip'
        onClick={handleNewTripButtonClick}
      />
      <CustomButton
        className='button min-w-36'
        label='My Trips'
        onClick={handleLoadTripButtonClick}
      />
      <CustomButton
        className='button min-w-36'
        label='Shared Trips'
        onClick={handleTripSharedButtonClick}
      />
      <CustomButton
        className='button min-w-36'
        label='Shared to Me'
        onClick={handleTripOthersSharedButtonClick}
      />
      <CustomButton
        className='button min-w-36'
        label='Public Trips'
        onClick={handleTripPublicButtonClick}
      />
    </>
  );

  const renderMileageMenu = () => (
    <>
      <CustomButton
        className='button min-w-36'
        label='Mileages'
        to='/mileages'
      />
      {role === 'admin'
        ? (
          <CustomButton
            className='button min-w-36'
            label='Mileage Verification'
            to='/mileagesverification'
          />
        )
        : null}
    </>
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
          <div className='flex justify-center gap-2'>
            {Object.entries(TRIPMENU_MODES).map(([key, menu]) => {
              const isActive = (selectedMenu === key);
              return (
                <CustomButton
                  key={key}
                  className={`buttonPOI ${isActive ? 'bg-primary-button-light-hover dark:bg-primary-button-dark-hover' : ''}`}
                  label={`${menu.icon} ${menu.label}`}
                  onClick={handleTripMenuSelection(key)}
                />
              );
            })}
          </div>
          {selectedMenu === 'trip'
            ? renderTripMenu()
            : renderMileageMenu()}
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
              {((isLoadTripPublic || isLoadTripOthersShared)
                ? null
                : (
                  <CustomButton
                    className='buttonBack'
                    label='Edit Trip'
                    onClick={handleEditButton}
                    hidden={isEditingTrip}
                  />
                )
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
                    titleOn={`${title} ${isLoadTrip ? '▼' : ''}`}
                    titleOff={`${title}`}
                    component={renderTripDetail()}
                    isOpened
                    disabled={!isLoadTrip}
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
