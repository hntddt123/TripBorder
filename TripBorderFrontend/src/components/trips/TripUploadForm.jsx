import { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {
  setTitle,
  setStartDate,
  setEndDate,
  setSharedMode,
  // setSharedEmail
} from '../../redux/reducers/tripReducer';
import { useUpdateTripByUUIDMutation } from '../../api/tripsAPI';
// import { useUpdateTripShareByUUIDMutation } from '../../api/tripSharesAPI';
import CustomButton from '../CustomButton';
import {
  formatLocalDateString,
  isDatePast,
  isStartDateAfterEndDate,
  isEndDateBeforeStartDate
} from '../../utility/time';
import CustomLoading from '../CustomLoading';

export default function TripUploadForm() {
  const [tripStartDate, setTripStartDate] = useState();
  const [tripEndDate, setTripEndDate] = useState();
  const [inputError, setInputError] = useState({});
  const {
    uuid,
    title,
    startDate,
    endDate,
    sharedMode,
    // sharedEmail
  } = useSelector((state) => state.tripReducer);

  const [updateTripByUUID, { isLoading }] = useUpdateTripByUUIDMutation();
  // const [updateTripShareByTripUUID, { isTripShareLoading }] = useUpdateTripShareByUUIDMutation();

  const dispatch = useDispatch();

  const getStartDateValue = () => {
    if (tripStartDate === undefined) {
      setTripStartDate(formatLocalDateString(startDate));
    }
    return tripStartDate;
  };

  const getEndDateValue = () => {
    if (tripEndDate === undefined) {
      setTripEndDate(formatLocalDateString(endDate));
    }
    return tripEndDate;
  };

  const validateStartDate = (value, currentEnd) => {
    if (value === '') return 'Start Date is required';
    if (isDatePast(value)) return 'Start Date cannot be past';
    if (isStartDateAfterEndDate(value, currentEnd)) return 'Start Date cannot be after End Date';
    return '';
  };

  const validateEndDate = (value, currentStart) => {
    if (value === '') return 'End Date is required';
    if (isEndDateBeforeStartDate(value, currentStart)) return 'End Date cannot be before Start Date';
    return '';
  };

  // const handleSharedEmailChange = (e) => {
  //   dispatch(setSharedEmail(e.target.value));
  // };

  const handleShareModeChange = (e) => {
    dispatch(setSharedMode(e.target.value));
  };

  const handleTitleInputChange = (e) => {
    dispatch(setTitle(e.target.value));
  };

  const handleStartDateInputChange = (e) => {
    const { value } = e.target;
    const startError = validateStartDate(value, tripEndDate);

    setTripStartDate(value);

    setInputError((prev) => ({
      ...prev,
      startDate: startError
    }));

    if (tripEndDate !== '') {
      const endError = validateEndDate(tripEndDate, value);
      setInputError((prev) => ({
        ...prev,
        endDate: endError
      }));
    }
  };

  const handleEndDateInputChange = (e) => {
    const { value } = e.target;
    const endError = validateEndDate(value, tripStartDate);

    setTripEndDate(value);

    setInputError((prev) => ({
      ...prev,
      endDate: endError
    }));

    if (tripStartDate !== '') {
      const startError = validateStartDate(tripStartDate, value);
      setInputError((prev) => ({
        ...prev,
        startDate: startError
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    dispatch(setStartDate(tripStartDate));
    dispatch(setEndDate(tripEndDate));
    updateTripByUUID({
      uuid: uuid,
      updates: {
        title: title,
        start_date: tripStartDate,
        end_date: tripEndDate,
        shared_mode: sharedMode
      }
    });
    // updateTripShareByTripUUID({
    //   updates: {
    //     trips_uuid: uuid,
    //     shared_email: sharedEmail
    //   }
    // });
  };

  return (
    <form onSubmit={handleSubmit} encType='multipart/form-data'>
      <div className='inputField px-4 mt-2 text-left'>
        <label htmlFor='trip_title'>
          Trip Name
        </label>
        <input
          className='customInput'
          id='trip_title'
          type='text'
          name='trip_title'
          value={title}
          onChange={handleTitleInputChange}
          required
          placeholder='Trip Name'
          minLength={1}
          maxLength={42}
        />
        <label htmlFor='trip_start_date'>
          Start Date
        </label>
        <input
          className='customInput'
          id='trip_start_date'
          type='date'
          name='trip_start_date'
          value={getStartDateValue()}
          onChange={handleStartDateInputChange}
          required
        />
        {(inputError.startDate) ? <div className='text-red-600'>{`${inputError.startDate}`}</div> : null}
        <label htmlFor='trip_end_date'>
          End Date
        </label>
        <input
          className='customInput'
          id='trip_end_date'
          type='date'
          name='trip_end_date'
          value={getEndDateValue()}
          onChange={handleEndDateInputChange}
          required
        />
        <label htmlFor='trip_shared_mode'>
          Shared Mode
        </label>
        <select
          className='customInput text-nowrap'
          id='trip_shared_mode'
          name='trip_shared_mode'
          value={sharedMode}
          onChange={handleShareModeChange}
          required
        >
          <option key='private' value='private'>Private</option>
          <option key='shared' value='shared'>Shared</option>
          <option key='public' value='public'>Public</option>
        </select>
        {/* {sharedMode === 'shared'
          ? (
            <>
              <label htmlFor='trip_shared_email'>
                Trip Shared Email
              </label>
              <input
                className='customInput'
                id='trip_shared_email'
                type='email'
                name='trip_shared_email'
                value={sharedEmail}
                onChange={handleSharedEmailChange}
                placeholder='Trip Shared Email'
                maxLength={300000}
              />
            </>
          ) : null} */}
        {(inputError.endDate) ? <div className='text-red-600'>{`${inputError.endDate}`}</div> : null}
        <CustomButton
          type='submit'
          label='Save'
          disabled={!!inputError.startDate
            || !!inputError.endDate
            || tripStartDate === ''
            || tripEndDate === ''}
        />
        <CustomLoading isLoading={isLoading} text='Updating Trip' />
        {/* <CustomLoading isLoading={isTripShareLoading} text='Updating Trip Share' /> */}
      </div>
    </form>
  );
}
