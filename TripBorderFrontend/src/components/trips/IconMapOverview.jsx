import mapboxgl from 'mapbox-gl';
import { useDispatch, useSelector } from 'react-redux';
import PropTypes from 'prop-types';
import { useGetMealsByTripIDQuery } from '../../api/mealsAPI';
import { useGetHotelsByTripIDQuery } from '../../api/hotelsAPI';
import { useGetPOIsByTripIDQuery } from '../../api/poisAPI';
import { useGetTransportByTripIDQuery } from '../../api/transportsAPI';
import {
  formatDatecccMMMdyyyy,
  setLocalTime
} from '../../utility/time';
import { setMarker } from '../../redux/reducers/mapReducer';
import { allIcon, hotelIcon, parkIcon, restaurantIcon, transportIcon } from '../../constants/constants';
import CustomButton from '../CustomButton';
import CustomLoading from '../CustomLoading';
import CustomFetching from '../CustomFetching';
import CustomError from '../CustomError';

export default function IconMapOverview({ tripID, handleFlyTo, handleFitBounds }) {
  const { data: mealData,
    isLoading: isMealLoading,
    isFetching: isMealFetching,
    error: isMealError } = useGetMealsByTripIDQuery({ tripID });
  const { data: hotelData,
    isLoading: isHotelLoading,
    isFetching: isHotelFetching,
    error: isHotelError } = useGetHotelsByTripIDQuery({ tripID });
  const { data: poiData,
    isLoading: isPOILoading,
    isFetching: isPOIFetching,
    error: isPOIError } = useGetPOIsByTripIDQuery({ tripID });
  const { data: transportData,
    isLoading: isTransportLoading,
    isFetching: isTransportFetching,
    error: isTransportError } = useGetTransportByTripIDQuery({ tripID });
  const { meals } = mealData || {};
  const { hotels } = hotelData || {};
  const { points_of_interest: pois } = poiData || {};
  const { transports } = transportData || {};

  const { viewState } = useSelector((state) => state.mapReducer);
  const dispatch = useDispatch();

  // Group meals by formatted date
  const dateGroupedMeals = (() => {
    const result = {};
    meals?.forEach((meal) => {
      const date = formatDatecccMMMdyyyy(meal.meal_time);
      result[date] = (result[date] || []).concat([meal]);
    });
    return result;
  })();

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

  // Group POIs by formatted date
  const dateGroupedPOIs = (() => {
    const result = {};
    pois?.forEach((poi) => {
      const date = formatDatecccMMMdyyyy(poi.visit_time);
      result[date] = (result[date] || []).concat([poi]);
    });
    return result;
  })();

  // Group transports by formatted date
  const dateGroupedTransports = (() => {
    const result = {};
    transports?.forEach((transport) => {
      const date = formatDatecccMMMdyyyy(transport.departure_time);
      result[date] = (result[date] || []).concat([transport]);
    });
    return result;
  })();

  const prepareMarkerArray = (dateGroupedItems, icon) => {
    const seen = new Map();
    return Object.values(dateGroupedItems)
      .flat()
      .filter((item) => item.location?.x != null && item.location?.y != null)
      .filter((item) => {
        if (seen.has(item.uuid)) {
          return false;
        }
        seen.set(item.uuid, true);
        return true;
      })
      .map((item) => ({
        id: item.uuid,
        icon,
        text: item.name,
        lng: item.location.x,
        lat: item.location.y
      }));
  };

  const calculateMarkerArrayBoundsAndFlyTo = (markers, zoom) => {
    const bounds = new mapboxgl.LngLatBounds();
    markers.forEach((marker) => bounds.extend([marker.lng, marker.lat]));
    if (markers.length > 1) {
      handleFitBounds(bounds, 80, zoom);
    } else if (markers.length === 1) {
      handleFlyTo(markers[0].lng, markers[0].lat);
    }
  };

  const showAllLocations = () => {
    if (dateGroupedMeals && dateGroupedHotels && dateGroupedPOIs && dateGroupedTransports && handleFlyTo) {
      const newMealsMarkers = prepareMarkerArray(dateGroupedMeals, restaurantIcon);
      const newHotelswMarkers = prepareMarkerArray(dateGroupedHotels, hotelIcon);
      const newPOIsMarkers = prepareMarkerArray(dateGroupedPOIs, parkIcon);
      const newTransportsMarkers = prepareMarkerArray(dateGroupedTransports, transportIcon);

      const newMarkers = [
        ...newMealsMarkers,
        ...newHotelswMarkers,
        ...newPOIsMarkers,
        ...newTransportsMarkers
      ];
      dispatch(setMarker(newMarkers));
      calculateMarkerArrayBoundsAndFlyTo(newMarkers, 4);
    }
  };

  const showAllMealsLocations = () => {
    if (dateGroupedMeals && handleFlyTo) {
      const newMarkers = prepareMarkerArray(dateGroupedMeals, restaurantIcon);
      dispatch(setMarker(newMarkers));
      calculateMarkerArrayBoundsAndFlyTo(newMarkers);
    }
  };

  const showAllHotelsLocations = () => {
    if (dateGroupedHotels && handleFlyTo) {
      const newMarkers = prepareMarkerArray(dateGroupedHotels, hotelIcon);
      dispatch(setMarker(newMarkers));
      calculateMarkerArrayBoundsAndFlyTo(newMarkers);
    }
  };

  const showAllPOIsLocations = () => {
    if (dateGroupedPOIs && handleFlyTo) {
      const newMarkers = prepareMarkerArray(dateGroupedPOIs, parkIcon);
      dispatch(setMarker(newMarkers));
      calculateMarkerArrayBoundsAndFlyTo(newMarkers);
    }
  };

  const showAllTransportsLocations = () => {
    if (dateGroupedTransports && handleFlyTo) {
      const newMarkers = prepareMarkerArray(dateGroupedTransports, transportIcon);
      dispatch(setMarker(newMarkers));
      calculateMarkerArrayBoundsAndFlyTo(newMarkers);
    }
  };

  const zoomMinus = () => {
    handleFlyTo(viewState.longitude, viewState.latitude, viewState.zoom - 1.375, 500);
  };

  const zoomPlus = () => {
    handleFlyTo(viewState.longitude, viewState.latitude, viewState.zoom + 1.375, 500);
  };

  return (
    <div>
      <div className='text-lg text-center'>
        <CustomButton
          className='buttonLocate'
          label='-'
          onClick={zoomMinus}
        />
        <CustomButton
          className='buttonLocate'
          label={allIcon}
          onClick={showAllLocations}
        />
        <CustomButton
          className='buttonLocate'
          label={restaurantIcon}
          onClick={showAllMealsLocations}
        />
        <CustomButton
          className='buttonLocate'
          label={hotelIcon}
          onClick={showAllHotelsLocations}
        />
        <CustomButton
          className='buttonLocate'
          label={parkIcon}
          onClick={showAllPOIsLocations}
        />
        <CustomButton
          className='buttonLocate'
          label={transportIcon}
          onClick={showAllTransportsLocations}
        />
        <CustomButton
          className='buttonLocate'
          label='+'
          onClick={zoomPlus}
        />
        <div>
          <CustomLoading isLoading={isMealLoading} text='Loading Meals' />
        </div>
        <div>
          <CustomLoading isLoading={isHotelLoading} text='Loading Hotels' />
        </div>
        <div>
          <CustomLoading isLoading={isPOILoading} text='Loading POIs' />
        </div>
        <div>
          <CustomLoading isLoading={isTransportLoading} text='Loading Transports' />
        </div>
        <div>
          <CustomFetching isFetching={isMealFetching} text='Fetching new page' />
        </div>
        <div>
          <CustomFetching isFetching={isHotelFetching} text='Fetching new page' />
        </div>
        <div>
          <CustomFetching isFetching={isPOIFetching} text='Fetching new page' />
        </div>
        <div>
          <CustomFetching isFetching={isTransportFetching} text='Fetching new page' />
        </div>
        <div>
          <CustomError error={isMealError} />
        </div>
        <div>
          <CustomError error={isHotelError} />
        </div>
        <div>
          <CustomError error={isPOIError} />
        </div>
        <div>
          <CustomError error={isTransportError} />
        </div>
      </div>
    </div>
  );
}

IconMapOverview.propTypes = {
  tripID: PropTypes.string,
  handleFlyTo: PropTypes.func,
  handleFitBounds: PropTypes.func
};
