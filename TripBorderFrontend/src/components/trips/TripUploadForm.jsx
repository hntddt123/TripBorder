import { useState } from 'react';
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

function TripUploadForm() {
  const [inputError, setInputError] = useState('');
  const {
    uuid,
    title,
    startDate,
    endDate
  } = useSelector((state) => state.tripReducer);

  const [updateTripByUUID, { isLoading: updateLoading }] = useUpdateTripByUUIDMutation();

  const dispatch = useDispatch();

  const handleInputChange = (e) => {
    const { name } = e.target;

    if (name === 'trip_title') {
      dispatch(setTitle(e.target.value));
    }
    if (name === 'trip_start_date') {
      if (isDatePast(e.target.value)) {
        setInputError('Start Date cannot be past');
      } else if (isStartDateAfterEndDate(e.target.value, endDate)) {
        setInputError('Start Date cannot be after End Date');
      } else {
        setInputError('');
        dispatch(setStartDate(e.target.value));
      }
    }
    if (name === 'trip_end_date') {
      if (isEndDateBeforeStartDate(e.target.value, startDate)) {
        setInputError('End Date cannot be before Start Date');
      } else {
        setInputError('');
        dispatch(setEndDate(e.target.value));
      }
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
          onChange={handleInputChange}
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
          onChange={handleInputChange}
          required
        />
        <label htmlFor='trip_end_date'>
          End Date
        </label>
        <input
          className='customInput'
          id='trip_end_date'
          type='date'
          name='trip_end_date'
          value={formatLocalDateString(endDate)}
          onChange={handleInputChange}
          required
        />
        {(inputError) ? <div className='text-red-600'>{`${inputError}`}</div> : null}
        {(updateLoading) ? 'Updating' : null}
        <CustomButton type='submit' label='Save' />
      </div>
    </form>
  );
}

export default TripUploadForm;
