import { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { authAPI } from '../../api/authAPI';
import { useGetTripsByEmailQuery } from '../../api/tripsAPI';
import {
  setTrip,
  setStartDate,
  setEndDate,
  setUpdatedDate
} from '../../redux/reducers/tripReducer';
import { getLocalTimeToMin, getLocalTimeToSecond } from '../../utility/time';
import CustomToggle from '../CustomToggle';
import Meals from './Meals';
import Hotels from './Hotels';
import POIs from './POIs';
import Transports from './Transports';
import Ratings from './Ratings';
import TripTags from './TripTags';

function CurrentTrip() {
  const user = useSelector(authAPI.endpoints.checkAuthStatus.select());
  const email = user.data?.email;

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

  const renderTripInputs = () => (
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

  const renderDetail = () => (
    <div>
      <div>{`Start: ${getLocalTimeToMin(tripData.start_date)}`}</div>
      <div>{`End: ${getLocalTimeToMin(tripData.end_date)}`}</div>
      <div>{`Created: ${getLocalTimeToSecond(tripData.created_at)}`}</div>
      <div>{`Updated: ${getLocalTimeToSecond(tripData.updated_at)}`}</div>
    </div>
  );

  const renderTripsItem = () => (
    <div className='flex justify-center'>
      <CustomToggle
        className='container overflow-x-auto font-mono -tracking-wider text-center'
        aria-label={`Trip Button ${tripData.uuid}`}
        id={tripData.uuid}
        title={tripData.title}
        component={renderDetail()}
      />
    </div>
  );

  return (
    <div className='overflow-x-auto table-fixed whitespace-nowrap'>
      <div className='cardInfo'>
        <CustomToggle
          className='text-2xl'
          title='Create New Trip'
          component={renderTripInputs()}
        />
      </div>
      <div className='text-base text-center'>
        Current Trips
      </div>
      {/* {isFetching && <div>Fetching new page...</div>} */}
      <div key={tripData.uuid}>
        <div className='cardMileage'>
          {renderTripsItem()}
          {/* <Meals tripID={trip.uuid} />
          <Hotels tripID={trip.uuid} />
          <POIs tripID={trip.uuid} />
          <Transports tripID={trip.uuid} />
          <Ratings tripID={trip.uuid} />
          <TripTags tripID={trip.uuid} /> */}
        </div>
      </div>
    </div>
  );
}

export default CurrentTrip;
