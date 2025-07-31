import { useState } from 'react';
import { useSelector } from 'react-redux';
import PropTypes from 'prop-types';
import {
  useGetHotelsByTripIDQuery,
  useDeleteHotelsMutation,
  useUpdateHotelByUUIDMutation
} from '../../api/hotelsAPI';
import {
  formatDatecccMMMdyyyy,
  formatLocalDateString,
  isTimeValid,
  setLocalTime
} from '../../utility/time';
import CustomToggle from '../CustomToggle';
import CustomError from '../CustomError';
import CustomButton from '../CustomButton';

function Hotels({ tripID }) {
  const isLoadTrip = useSelector((state) => state.userSettingsReducer.isLoadTrip);
  const [isEditing, setIsEditing] = useState(false);
  const [checkInDates, setCheckInTimes] = useState({});
  const [checkOutDates, setCheckOutTimes] = useState({});
  const [inputErrors, setInputErrors] = useState({});

  const tripData = useSelector((state) => state.tripReducer);
  const { data, isLoading, isFetching, error } = useGetHotelsByTripIDQuery({ tripID });
  const { hotels } = data || {};

  const [updateHotel] = useUpdateHotelByUUIDMutation();
  const [deleteHotel] = useDeleteHotelsMutation();

  // Group hotels by formatted date
  const dateGroupedHotels = hotels?.reduce((result, hotel) => {
    const checkInDate = setLocalTime(hotel.check_in);
    const checkOutDate = setLocalTime(hotel.check_out);
    const newResult = { ...result };

    let currentDate = checkInDate;
    while (currentDate < checkOutDate) {
      const formattedDate = formatDatecccMMMdyyyy(currentDate);
      newResult[formattedDate] = (newResult[formattedDate] || []).concat([hotel]);
      currentDate = currentDate.plus({ days: 1 });
    }

    return newResult;
  }, {}) ?? {};

  const handleSubmit = (hotelID) => (e) => {
    e.preventDefault();
    updateHotel({
      uuid: hotelID,
      updates: {
        check_in: setLocalTime(checkInDates[hotelID]),
        check_out: setLocalTime(checkOutDates[hotelID])
      }
    });
  };

  const validateCheckInTime = (value, checkOutDate) => isTimeValid(value, checkOutDate, tripData, 'Check-In');
  const validateCheckOutTime = (value, checkInDate) => isTimeValid(value, checkInDate, tripData, 'Check-Out');

  const handleCheckInDateChange = (hotelID) => (e) => {
    const { value } = e.target;

    const checkInTimeError = validateCheckInTime(value, checkOutDates[hotelID]);

    setInputErrors((prevErrors) => ({
      ...prevErrors,
      [hotelID]: checkInTimeError,
    }));

    if (!checkInTimeError) {
      setCheckInTimes((prevTimes) => ({
        ...prevTimes,
        [hotelID]: value,
      }));
    }
  };

  const handleCheckOutDateChange = (hotelID) => (e) => {
    const { value } = e.target;

    const checkOutTimeError = validateCheckOutTime(value, checkInDates[hotelID]);

    setInputErrors((prevErrors) => ({
      ...prevErrors,
      [hotelID]: checkOutTimeError,
    }));

    if (!checkOutTimeError) {
      setCheckOutTimes((prevTimes) => ({
        ...prevTimes,
        [hotelID]: value,
      }));
    }
  };

  const handleEditButton = () => {
    setIsEditing(!isEditing);
  };

  const renderDetail = (hotel) => (
    <div className='text-pretty'>
      <form onSubmit={handleSubmit(hotel.uuid)} encType='multipart/form-data'>
        {(hotel.booking_reference)
          ? (
            <>
              <div className='underline underline-offset-2'>Booking reference</div>
              <div>{hotel.booking_reference}
              </div>
            </>
          )
          : null}
        <div className='underline underline-offset-2'>Check in</div>
        <div className='px-2 font-mono'>{formatDatecccMMMdyyyy(hotel.check_in)}</div>
        {(isEditing) ? (
          <div>
            <input
              className='customInput'
              id={`check_in_${hotel.uuid}`}
              type='date'
              name='check_in_'
              value={checkInDates[hotel.uuid] || formatLocalDateString(hotel.check_in)}
              onChange={handleCheckInDateChange(hotel.uuid)}
              required
            />
            <div className='text-red-600'>{inputErrors[hotel.uuid] || ''}</div>
          </div>
        )
          : null}
        <div className='underline underline-offset-2'>Check out</div>
        <div className='px-2 font-mono'>{formatDatecccMMMdyyyy(hotel.check_out)}</div>
        {(isEditing) ? (
          <div>
            <input
              className='customInput'
              id={`check_out_${hotel.uuid}`}
              type='date'
              name='check_out_'
              value={checkOutDates[hotel.uuid] || formatLocalDateString(hotel.check_out)}
              onChange={handleCheckOutDateChange(hotel.uuid)}
              required
            />
            <div className='text-red-600'>{inputErrors[hotel.uuid] || ''}</div>
            <CustomButton type='submit' label='Update' />
          </div>
        )
          : null}
        <div className='underline underline-offset-2'>Address</div>
        <div className='px-2 font-mono'>{hotel.address}</div>
      </form>
    </div>
  );

  return (
    <div>
      <div className='text-lg text-center'>
        {(hotels?.length > 0 && !isEditing) ? <span>Hotels</span> : null}
        {(isEditing) ? <span>Edit Hotels</span> : null}
        {(hotels?.length > 0) && !isLoadTrip
          ? (
            <CustomButton
              translate='no'
              className='buttonEdit'
              label='✏️'
              onClick={handleEditButton}
            />
          ) : null}
      </div>
      {(dateGroupedHotels && !isEditing)
        ? Object.entries(dateGroupedHotels)
          .map(([date, hotelsForDate]) => (
            <div key={date}>
              <div>
                {date}
              </div>
              {hotelsForDate?.map((hotel) => (
                <div key={`${hotel.uuid}${date}`}>
                  <div className='text-pretty px-2'>
                    <CustomToggle
                      translate='no'
                      className='toggle min-h-12 min-w-72 max-w-72 overflow-x-auto text-center px-4 mb-1'
                      aria-label={`Hotel Button ${hotel.uuid}`}
                      id={hotel.uuid}
                      title={hotel.name}
                      component={renderDetail(hotel)}
                    />
                  </div>
                  <div>
                    {(isEditing)
                      ? (
                        <CustomButton
                          className='buttonDelete'
                          translate='no'
                          label={`🗑️ ${hotel.name}`}
                          onClick={() => deleteHotel(hotel.uuid)}
                        />
                      )
                      : null}
                  </div>
                </div>
              ))}
            </div>
          ))
        : hotels?.map(((hotel) => (
          <div key={`${hotel.uuid}`}>
            {`${formatDatecccMMMdyyyy(hotel.check_in)} - ${formatDatecccMMMdyyyy(hotel.check_out)}`}
            <div className='text-pretty px-2'>
              <CustomToggle
                translate='no'
                className='toggle min-h-12 min-w-72 max-w-72 overflow-x-auto text-center px-4 mb-1'
                aria-label={`Hotel Button ${hotel.uuid}`}
                id={hotel.uuid}
                title={hotel.name}
                component={renderDetail(hotel)}
              />
            </div>
            <div>
              {(isEditing)
                ? (
                  <CustomButton
                    className='buttonDelete'
                    translate='no'
                    label={`🗑️ ${hotel.name}`}
                    onClick={() => deleteHotel(hotel.uuid)}
                  />
                )
                : null}
            </div>
          </div>
        )))}
      {(isLoading) ? <div>Loading Hotels...</div> : null}
      {isFetching && <div>Fetching new page...</div>}
      {(error) ? <CustomError error={error} /> : null}
    </div>
  );
}

Hotels.propTypes = {
  tripID: PropTypes.string,
};

export default Hotels;
