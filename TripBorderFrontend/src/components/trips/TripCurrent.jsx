import PropTypes from 'prop-types';
import { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { json2csv } from 'json-2-csv';
import ExcelJS from 'exceljs';
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
  formatDateMMMdyyyy,
  formatDateyyyy,
  formatDateMM
} from '../../utility/time';
import { useInitTripByEmailMutation } from '../../api/tripsAPI';
import { TRIPMENU_MODES } from '../../constants/constants';
import { useLazyGetMealsByTripIDQuery } from '../../api/mealsAPI';
import { useLazyGetHotelsByTripIDQuery } from '../../api/hotelsAPI';
import { useLazyGetPOIsByTripIDQuery } from '../../api/poisAPI';
import { useLazyGetTransportByTripIDQuery } from '../../api/transportsAPI';
import {
  getDateGroupedHotels,
  getDateFillGroupedMeals,
  getDateFillGroupedPOIs,
  getDateFillGroupedTransports
} from '../../utility/TripFormat';
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

  const fillExcelStyle = (worksheet, index, days) => {
    let row = index;
    while (row <= days + 2) {
      const column = worksheet.getRow(row);
      const fgColor = 'F3CCA8';
      const fgDateColor = 'FDF2D0';
      const fgBorderColor = '00000000';

      column.eachCell((cell) => {
        cell.font = { size: 16 };
        if (cell._column._header === ('🏞️')
          || cell._column._header === ('🚀')
          || cell._column._header === ('🍱')
          || cell._column._header === ('🛌')) {
          cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: fgColor } };
          cell.border = {
            top: { style: 'thin', color: { argb: fgBorderColor } },
            left: { style: 'thin', color: { argb: fgBorderColor } },
            bottom: { style: 'thin', color: { argb: fgBorderColor } },
            right: { style: 'thin', color: { argb: fgBorderColor } }
          };
          cell.alignment = { vertical: 'middle', horizontal: 'center' };
        } else {
          cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: fgDateColor } };
          cell.border = {
            top: { style: 'thin', color: { argb: fgBorderColor } },
            left: { style: 'thin', color: { argb: fgBorderColor } },
            bottom: { style: 'thin', color: { argb: fgBorderColor } },
            right: { style: 'thin', color: { argb: fgBorderColor } }
          };
          cell.alignment = { vertical: 'middle', horizontal: 'center' };
        }
      });
      row += 1;
    }
  };

  const generateXLSXFile = async () => {
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet(`${title}`);

    worksheet.columns = [
      { header: '🗺️', key: '🗺️', width: 4 },
      { header: 'Y', key: 'Y', width: 8 },
      { header: 'M', key: 'M', width: 4 },
      { header: 'D', key: 'D', width: 4 },
      { header: 'W', key: 'W', width: 8 },
      { header: '🏞️', key: '🏞️', width: 50 },
      { header: '🚀', key: '🚀', width: 50 },
      { header: '🍱', key: '🍱', width: 50 },
      { header: '🛌', key: '🛌', width: 50 },
    ];

    const dateGroupedPOIs = getDateFillGroupedPOIs(poisData, startDate, endDate)
      .map((dateGroupedPOI) => dateGroupedPOI.poisForDate);
    const dateGroupedMeals = getDateFillGroupedMeals(mealsData, startDate, endDate)
      .map((dateGroupedMeal) => dateGroupedMeal.mealsForDate);
    const dateGroupedTransports = getDateFillGroupedTransports(transportsData, startDate, endDate)
      .map((dateGroupedTransport) => dateGroupedTransport.transportsForDate);
    const dateGroupedHotels = getDateGroupedHotels(hotelsData, startDate, endDate)
      .map((dateGroupedHotel) => dateGroupedHotel.hotelsForDate);

    let index = 1;
    let days = getDateTimeDifferencesAsDays(startDate, endDate);
    while (days >= 0) {
      worksheet.addRow({
        '🗺️': index,
        Y: `${formatDateyyyy(addDays(startDate, index))}`,
        M: `${formatDateMM(addDays(startDate, index))}`,
        D: `${formatDatedd(addDays(startDate, index))}`,
        W: `${formatDateccc(addDays(startDate, index))}`,
        '🏞️': dateGroupedPOIs[index - 1].map((poi) => (poi.name).trim()).join(', '),
        '🍱': dateGroupedMeals[index - 1].map((meal) => (meal.name).trim()).join(', '),
        '🚀': dateGroupedTransports[index - 1].map((transport) => (transport.name).trim()).join(', '),
        '🛌': dateGroupedHotels[index - 1].map((hotel) => (hotel.name).trim()).join(', ')
      });
      days -= 1;
      index += 1;
    }

    const header = worksheet.getRow(1);
    const fgFontColor = '00000000';
    header.font = { size: 14, bold: true, color: { argb: fgFontColor } };
    fillExcelStyle(worksheet, 1, getDateTimeDifferencesAsDays(startDate, endDate));

    return workbook.xlsx.writeBuffer();
  };

  const handleXLSXButton = async () => {
    const buffer = await generateXLSXFile();
    const blob = new Blob([buffer], {
      type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
    });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');

    link.href = url;
    link.setAttribute('download', `${title}.xlsx`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handleCSVButton = () => {
    const dateGroupedPOIs = getDateFillGroupedPOIs(poisData, startDate, endDate)
      .map((dateGroupedPOI) => dateGroupedPOI.poisForDate);
    const dateGroupedMeals = getDateFillGroupedMeals(mealsData, startDate, endDate)
      .map((dateGroupedMeal) => dateGroupedMeal.mealsForDate);
    const dateGroupedTransports = getDateFillGroupedTransports(transportsData, startDate, endDate)
      .map((dateGroupedTransport) => dateGroupedTransport.transportsForDate);
    const dateGroupedHotels = getDateGroupedHotels(hotelsData, startDate, endDate)
      .map((dateGroupedHotel) => dateGroupedHotel.hotelsForDate);

    const tripJSONRows = [];
    let index = 1;
    let days = getDateTimeDifferencesAsDays(startDate, endDate);
    while (days >= 0) {
      tripJSONRows.push({
        '🗺️': index,
        Y: `${formatDateyyyy(addDays(startDate, index))}`,
        M: `${formatDateMM(addDays(startDate, index))}`,
        D: `${formatDatedd(addDays(startDate, index))}`,
        W: `${formatDateccc(addDays(startDate, index))}`,
        '🏞️': dateGroupedPOIs[index - 1].map((poi) => (poi.name).trim()).join(', '),
        '🍱': dateGroupedMeals[index - 1].map((meal) => (meal.name).trim()).join(', '),
        '🚀': dateGroupedTransports[index - 1].map((transport) => (transport.name).trim()).join(', '),
        '🛌': dateGroupedHotels[index - 1].map((hotel) => (hotel.name).trim()).join(', ')
      });
      days -= 1;
      index += 1;
    }

    const csv = json2csv(tripJSONRows);
    const blob = new Blob([`\uFEFF${csv}`], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');

    link.href = url;
    link.setAttribute('download', `${title}.csv`);
    link.click();
    URL.revokeObjectURL(url);
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
                  <CustomButton
                    label='💾 XLSX'
                    onClick={handleXLSXButton}
                  />
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
