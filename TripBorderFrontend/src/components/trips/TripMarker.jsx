import { useSelector, useDispatch } from 'react-redux';
import { Marker } from 'react-map-gl';
import { useState } from 'react';
import { markerIcon } from '../../constants/constants';
import { useGetDownloadImageMutation, useLazyGetUnsplashPhotosQuery } from '../../api/unsplashImageAPI';
import {
  setSelectedTripMarkerPOIName
} from '../../redux/reducers/mapReducer';
import CustomLoading from '../CustomLoading';
import CustomError from '../CustomError';
import CustomButton from '../CustomButton';

export default function TripMarker() {
  const {
    tripMarkers,
    selectedTripMarkerPOIName
  } = useSelector((state) => state.mapReducer);
  const dispatch = useDispatch();
  const [getUnsplashPhotosTrigger, { data: images = [], isLoading, isError }] = useLazyGetUnsplashPhotosQuery();
  const [getDownloadImageMutationTrigger] = useGetDownloadImageMutation();

  const [currentIndex, setCurrentIndex] = useState(0);

  const handlePrev = (e) => {
    e.stopPropagation();
    e.preventDefault();
    setCurrentIndex((prev) => Math.max(0, prev - 1));
  };

  const handleCancel = (e) => {
    e.stopPropagation();
    e.preventDefault();
    dispatch(setSelectedTripMarkerPOIName(''));
    setCurrentIndex(0);
  };

  const handleNext = (e) => {
    e.stopPropagation();
    e.preventDefault();
    setCurrentIndex((prev) => Math.min((images?.results?.length || 0) - 2, prev + 1));
  };

  const handleTripMarkerClick = (marker) => () => {
    dispatch(setSelectedTripMarkerPOIName(marker.text));
    getUnsplashPhotosTrigger({ poiName: marker.text });
  };

  const handleUsePhoto = async (selectedImage) => {
    if (!selectedImage?.links?.download_location) return;

    try {
      await getDownloadImageMutationTrigger(selectedImage.links.download_location).unwrap();
      const link = document.createElement('a');

      link.href = selectedImage.urls.full;
      link.download = `${selectedTripMarkerPOIName}.jpg`;
      link.target = 'blank';
      link.click();
    } catch (err) {
      console.error('Failed to track or download', err);
    }
  };

  return ((tripMarkers.length > 0) ? tripMarkers.map((marker) => (
    <div key={marker.id}>
      <Marker longitude={marker.lng} latitude={marker.lat} onClick={handleTripMarkerClick(marker)}>
        <div translate='no' className='text-2xl text-center'>{marker.icon || markerIcon}</div>
        <div translate='no' className={((marker.text) ? 'cardPOIMarker' : '')}>
          {marker.text || ''}
        </div>
      </Marker>
      {selectedTripMarkerPOIName === marker.text
        ? (
          <Marker longitude={marker.lng} latitude={marker.lat} offset={[0, -160]}>
            <div className='flex justify-center'>
              <CustomButton
                label='X'
                onClick={handleCancel}
                className='button min-w-10 h-10 flex items-center justify-center text-2xl'
              />
              <CustomButton
                label='←'
                onClick={handlePrev}
                className='button min-w-10 h-10 flex items-center justify-center text-2xl'
                disabled={currentIndex === 0}
              />
              <CustomButton
                label='→'
                onClick={handleNext}
                className='button min-w-10 h-10 flex items-center justify-center text-2xl'
                disabled={currentIndex >= (images?.results?.length || 0) - 2}
              />
            </div>
            <div className='flex rounded-2xl'>
              {images?.results?.slice(currentIndex, currentIndex + 2).map((selectedImage) => (
                <div key={selectedImage.id} className='mx-1'>
                  <button
                    onClick={() => {
                      handleUsePhoto(selectedImage);
                    }}
                  >
                    <img
                      className='max-w-42 aspect-square object-cover rounded-2xl hover:scale-105 transition-transform'
                      src={selectedImage.urls.regular}
                      alt={selectedImage.alt_description || 'unsplash image'}
                    />
                  </button>
                </div>
              ))}
              <CustomLoading isLoading={isLoading} />
              <CustomError isError={isError} />
            </div>
          </Marker>
        ) : null}
    </div>
  )) : null);
}
