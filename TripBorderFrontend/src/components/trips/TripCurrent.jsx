import PropTypes from 'prop-types';
import { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { json2csv } from 'json-2-csv';
// import ExcelJS from 'exceljs';
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
import {
  addDays,
  getDateTimeDifferencesAsDays,
  formatDateccc,
  formatDatecccMMMdyyyy,
  formatDatedd,
  formatDateM,
  formatDateMMMdyyyy,
  formatDateyyyy,
  setLocalTime
} from '../../utility/time';
import { useInitTripByEmailMutation } from '../../api/tripsAPI';
import { TRIPMENU_MODES } from '../../constants/constants';
import { useLazyGetMealsByTripIDQuery } from '../../api/mealsAPI';
import CustomButton from '../CustomButton';
import CustomToggle from '../CustomToggle';
import CustomError from '../CustomError';
import CustomLoading from '../CustomLoading';
import Meals from './tripItems/Meals';
import Hotels from './tripItems/Hotels';
import POIs from './tripItems/POIs';
import Transports from './tripItems/Transports';
import Ratings from './tripItems/Ratings';
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
import { useLazyGetHotelsByTripIDQuery } from '../../api/hotelsAPI';
import { useLazyGetPOIsByTripIDQuery } from '../../api/poisAPI';
import { useLazyGetTransportByTripIDQuery } from '../../api/transportsAPI';

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
  const [mealsDataTrigger, { data: mealsData }] = useLazyGetMealsByTripIDQuery();
  const [hotelsDataTrigger, { data: hotelsData }] = useLazyGetHotelsByTripIDQuery();
  const [poisDataTrigger, { data: poisData }] = useLazyGetPOIsByTripIDQuery();
  const [transportsDataTrigger, { data: transportsData }] = useLazyGetTransportByTripIDQuery();

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

  useEffect(() => {
    if (uuid) {
      mealsDataTrigger({ tripID: uuid });
      hotelsDataTrigger({ tripID: uuid });
      poisDataTrigger({ tripID: uuid });
      transportsDataTrigger({ tripID: uuid });
    }
  }, [uuid]);

  //   const handleXLSXButton = () => {
  //     try {
  //       const wb = new ExcelJS.Workbook();
  //       const ws = wb.addWorksheet(`${title}`);

  //       const tripJSONRows = [];
  //       tripJSONRows.push({
  //         '🗺️': index,
  //         Y: `${formatDateyyyy(addDays(startDate, index))}`,
  //         M: `${formatDateM(addDays(startDate, index))}`,
  //         D: `${formatDatedd(addDays(startDate, index))}`,
  //         W: `${formatDateccc(addDays(startDate, index))}`,
  //         '🍱': Object.entries(dateGroupedMeals)
  //           // eslint-disable-next-line no-unused-vars, @typescript-eslint/no-unused-vars
  //           .map(([date, mealsForDate]) => mealsForDate.map((meal) => meal.name)),
  //         '🛌': Object.entries(dateGroupedHotels)
  //           // eslint-disable-next-line no-unused-vars, @typescript-eslint/no-unused-vars
  //           .map(([date, hotelsForDate]) => hotelsForDate.map((hotel) => hotel.name)),
  //         '🏞️': Object.entries(dateGroupedPOIs)
  //           // eslint-disable-next-line no-unused-vars, @typescript-eslint/no-unused-vars
  //           .map(([date, poisForDate]) => poisForDate.map((poi) => poi.name)),
  //         '🚀': Object.entries(dateGroupedTransports)
  //           // eslint-disable-next-line no-unused-vars, @typescript-eslint/no-unused-vars
  //           .map(([date, transportsForDate]) => transportsForDate.map((transport) => transport.name)),
  //       });
  //       days -= 1;
  //       index += 1;
  //     }

  //       ws.columns = [
  //       { header: 'type', key: 'type', width: 12 },
  //       { header: 'name', key: 'name', width: 28 },
  //       { header: 'address', key: 'address', width: 36 },
  //       { header: 'start_time', key: 'start_time', width: 22 },
  //       { header: 'end_time', key: 'end_time', width: 22 },
  //       { header: 'details', key: 'details', width: 32 },
  //       { header: 'longitude', key: 'longitude', width: 12 },
  //       { header: 'latitude', key: 'latitude', width: 12 },
  //     ];
  //     const buffer = await rowsToXlsxBuffer(rows, { title });
  //     const blob = new Blob([buffer], {
  //       type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
  //     });
  //     const url = URL.createObjectURL(blob);
  //     const link = document.createElement('a');
  //     link.href = url;
  //     link.setAttribute('download', `${title}.xlsx`);
  //     document.body.appendChild(link);
  //     link.click();
  //     document.body.removeChild(link);
  //     URL.revokeObjectURL(url);
  //   } catch (err) {
  //     console.error('Failed to format or download xlsx', err);
  //   }
  // };

  const handleCSVButton = () => {
    const dateGroupedMeals = (() => {
      const result = {};
      mealsData?.meals.forEach((meal) => {
        const date = formatDatecccMMMdyyyy(meal.meal_time);
        result[date] = (result[date] || []).concat([meal]);
      });
      return result;
    })();
    const dateGroupedHotels = hotelsData.hotels?.reduce((result, hotel) => {
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

    const dateGroupedPOIs = (() => {
      const result = {};
      poisData?.points_of_interest.forEach((poi) => {
        const date = formatDatecccMMMdyyyy(poi.visit_time);
        result[date] = (result[date] || []).concat([poi]);
      });
      return result;
    })();

    const dateGroupedTransports = (() => {
      const result = {};
      transportsData?.transports.forEach((transport) => {
        const date = formatDatecccMMMdyyyy(transport.departure_time);
        result[date] = (result[date] || []).concat([transport]);
      });
      return result;
    })();

    const tripJSONRows = [];
    let index = 1;
    let days = getDateTimeDifferencesAsDays(startDate, endDate);
    while (days >= 0) {
      tripJSONRows.push({
        '🗺️': index,
        Y: `${formatDateyyyy(addDays(startDate, index))}`,
        M: `${formatDateM(addDays(startDate, index))}`,
        D: `${formatDatedd(addDays(startDate, index))}`,
        W: `${formatDateccc(addDays(startDate, index))}`,
        '🍱': Object.entries(dateGroupedMeals)
          // eslint-disable-next-line no-unused-vars, @typescript-eslint/no-unused-vars
          .map(([date, mealsForDate]) => mealsForDate.map((meal) => meal.name)),
        '🛌': Object.entries(dateGroupedHotels)
          // eslint-disable-next-line no-unused-vars, @typescript-eslint/no-unused-vars
          .map(([date, hotelsForDate]) => hotelsForDate.map((hotel) => hotel.name)),
        '🏞️': Object.entries(dateGroupedPOIs)
          // eslint-disable-next-line no-unused-vars, @typescript-eslint/no-unused-vars
          .map(([date, poisForDate]) => poisForDate.map((poi) => poi.name)),
        '🚀': Object.entries(dateGroupedTransports)
          // eslint-disable-next-line no-unused-vars, @typescript-eslint/no-unused-vars
          .map(([date, transportsForDate]) => transportsForDate.map((transport) => transport.name)),
      });
      days -= 1;
      index += 1;
    }

    try {
      const csv = json2csv(tripJSONRows);

      const blob = new Blob([`\uFEFF${csv}`], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `${title}.csv`);
      link.click();
      URL.revokeObjectURL(url);
    } catch (err) {
      console.error('Failed to format or download csv', err);
    }
  };

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
          </div>
        )}
    </div>
  );

  const renderTripMenu = () => {
    if (role) {
      return (
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
    }
    return (
      <CustomButton
        className='button min-w-36'
        label='Public Trips'
        onClick={handleTripPublicButtonClick}
      />
    );
  };

  const renderMileageMenu = () => {
    if (role) {
      return (
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
    }
    return null;
  };

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
                  <CustomButton
                    label='💾 CSV'
                    onClick={handleCSVButton}
                  />
                  {/* <CustomButton
                    label='💾 XLSX'
                    onClick={handleXLSXButton}
                  /> */}
                  <div>Sharing Mode: {sharedMode}</div>
                </div>
              )
              : (
                <div className='text-left'>
                  <CustomButton
                    className='buttonBack'
                    label={`←${title}`}
                    onClick={handleEditButton}
                  />
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
