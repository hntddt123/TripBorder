import { useState } from 'react';
import { useSelector } from 'react-redux';
import PropTypes from 'prop-types';
import { useGetHotelsByTripIDQuery, useDeleteHotelsMutation } from '../../api/hotelsAPI';
import { getLocalTimeToHour } from '../../utility/time';
import CustomToggle from '../CustomToggle';
import CustomError from '../CustomError';
import CustomButton from '../CustomButton';

function Hotels({ tripID }) {
  const tripData = useSelector((state) => state.tripReducer);
  const [isEditing, setIsEditing] = useState(false);

  const { data, isLoading, isFetching, error } = useGetHotelsByTripIDQuery({ tripID });
  const { hotels } = data || {};
  const [deleteHotel] = useDeleteHotelsMutation();

  const handleEditButton = () => {
    setIsEditing(!isEditing);
  };

  const renderDetail = (hotel) => (
    <div className='text-pretty'>
      {(hotel.booking_reference)
        ? (
          <>
            <div className='underline underline-offset-2'>Booking reference</div>
            <div>{hotel.booking_reference}1
            </div>
          </>
        )
        : null}
      <div className='underline underline-offset-2'>Check in</div>
      <div className='px-2 font-mono'>{getLocalTimeToHour(hotel.check_in)}</div>
      <div className='underline underline-offset-2'>Check out</div>
      <div className='px-2 font-mono'>{getLocalTimeToHour(hotel.check_out)}</div>
      <div className='underline underline-offset-2'>Address</div>
      <div className='px-2 font-mono'>{hotel.address}</div>
    </div>
  );

  return (
    <div>
      <div className='text-lg text-center'>
        {hotels?.length > 0 ? <span>Hotels</span> : null}
        {hotels?.length > 0 && !tripData.isLoadTrip
          ? (
            <CustomButton
              translate='no'
              className='editButton'
              label='✏️'
              onClick={handleEditButton}
            />
          ) : null}
      </div>
      {hotels?.map(((hotel) => (
        <div key={hotel.uuid}>
          <div className='text-pretty px-2'>
            <CustomToggle
              className='toggle container overflow-x-auto -tracking-wider text-left px-2 mb-1'
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
                  className='tripButton'
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
