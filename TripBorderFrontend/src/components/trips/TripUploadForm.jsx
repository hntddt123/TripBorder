import { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {
  setTrip,
  setStartDate,
  setEndDate,
  setUpdatedDate
} from '../../redux/reducers/tripReducer';

function TripUploadForm() {
  const [inputError, setInputError] = useState('');

  const tripData = useSelector((state) => state.tripReducer);

  const dispatch = useDispatch();

  const handleInputChange = (e) => {
    const { name } = e.target;

    if (name === 'trip_title') {
      dispatch(setTrip(e.target.value));
    }
    if (name === 'trip_start_date') {
      if (new Date(e.target.value) - new Date().setHours(0, 0, 0, 0) <= 0) {
        setInputError('Start Date cannot be past');
      } else if (new Date(tripData.end_date) - new Date(e.target.value) < 0) {
        setInputError('End Date cannot be before Start Date');
      } else {
        setInputError('');
        dispatch(setStartDate(e.target.value));
      }
    }
    if (name === 'trip_end_date') {
      if (new Date(e.target.value) - new Date(tripData.start_date) < 0) {
        setInputError('End Date cannot be before Start Date');
      } else {
        setInputError('');
        dispatch(setEndDate(e.target.value));
      }
    }

    dispatch(setUpdatedDate(Date.now()));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
  };

  return (
    <form onSubmit={handleSubmit} encType='multipart/form-data'>
      <div className='inputField mt-4'>
        <label htmlFor='trip_title'>
          Title
        </label>
        <input
          className='customInput'
          id='trip_title'
          type='text'
          name='trip_title'
          value={tripData.title}
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
          type='datetime-local'
          name='trip_start_date'
          value={tripData.start_date}
          onChange={handleInputChange}
          required
        />
        <label htmlFor='trip_end_date'>
          End Date
        </label>
        <input
          className='customInput'
          id='trip_end_date'
          type='datetime-local'
          name='trip_end_date'
          value={tripData.end_date}
          onChange={handleInputChange}
          required
        />
      </div>
      {(inputError) ? <div className='text-red-600'>{`${inputError}`}</div> : null}
    </form>
  );
}

export default TripUploadForm;
