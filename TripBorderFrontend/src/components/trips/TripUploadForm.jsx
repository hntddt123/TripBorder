import { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {
  setTitle,
  setStartDate,
  setEndDate
} from '../../redux/reducers/tripReducer';
import { useUpdateTripByUUIDMutation } from '../../api/tripsAPI';
import CustomButton from '../CustomButton';
import {
  formatLocalDateString,
  isDatePast,
  isStartDateAfterEndDate,
  isEndDateBeforeStartDate
} from '../../utility/time';
import CustomLoading from '../CustomLoading';

export default function TripUploadForm() {
  const [inputError, setInputError] = useState({});
  const {
    uuid,
    title,
    startDate,
    endDate
  } = useSelector((state) => state.tripReducer);

  const [updateTripByUUID, { isLoading }] = useUpdateTripByUUIDMutation();

  const dispatch = useDispatch();

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

  useEffect(() => {
    const initialStartError = validateStartDate(startDate, endDate);
    const initialEndError = validateEndDate(endDate, startDate);

    setInputError({
      startDate: initialStartError,
      endDate: initialEndError
    });
  }, []);

  const handleTitleInputChange = (e) => {
    dispatch(setTitle(e.target.value));
  };

  const handleStartDateInputChange = (e) => {
    const { value } = e.target;
    const startError = validateStartDate(value, endDate);

    dispatch(setStartDate(value));

    setInputError((prev) => ({
      ...prev,
      startDate: startError
    }));

    if (endDate !== '') {
      const endError = validateEndDate(endDate, value);
      setInputError((prev) => ({
        ...prev,
        endDate: endError
      }));
    }
  };

  const handleEndDateInputChange = (e) => {
    const { value } = e.target;
    const endError = validateEndDate(value, startDate);

    dispatch(setEndDate(value));

    setInputError((prev) => ({
      ...prev,
      endDate: endError
    }));

    if (startDate !== '') {
      const startError = validateStartDate(startDate, value);
      setInputError((prev) => ({
        ...prev,
        startDate: startError
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    updateTripByUUID({
      uuid: uuid,
      updates: {
        title: title,
        start_date: startDate,
        end_date: endDate,
      }
    });
  };

  return (
    <form onSubmit={handleSubmit} encType='multipart/form-data'>
      <div className='inputField mt-2 text-left'>
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
          value={formatLocalDateString(startDate)}
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
          value={formatLocalDateString(endDate)}
          onChange={handleEndDateInputChange}
          required
        />
        {(inputError.endDate) ? <div className='text-red-600'>{`${inputError.endDate}`}</div> : null}
        <CustomLoading isLoading={isLoading} text='Updating' />
        <CustomButton
          type='submit'
          label='Save'
          disabled={!!inputError.startDate
            || !!inputError.endDate
            || !startDate
            || !endDate}
        />
      </div>
    </form>
  );
}
