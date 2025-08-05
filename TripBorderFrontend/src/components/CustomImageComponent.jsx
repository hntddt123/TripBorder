import { useState, useEffect, useCallback } from 'react';
import PropTypes from 'prop-types';
import { processBytea } from '../utility/processBytea';
import { ImageComponentByteaPropTypes, ImageComponentUUIDPropTypes } from '../constants/imagePropTypes';

export default function CustomImageComponent({ uuid, bytea, className = 'max-h-60' }) {
  const [imageSrc, setImageSrc] = useState({ src: null, loading: false, error: null });

  const loadImage = useCallback(async () => {
    const src = await processBytea(bytea);
    setImageSrc({ src, loading: false, error: null });
  }, [bytea]);

  useEffect(() => {
    if (bytea && bytea.data?.length > 0) {
      if (window.requestIdleCallback) {
        requestIdleCallback(loadImage);
      } else {
        setTimeout(loadImage, 0); // Fallback for Safari
      }
    }
  }, [bytea]);

  if (imageSrc.length === 0) {
    return <div>Loading...</div>;
  }

  return (
    <img
      className={className}
      key={uuid}
      src={imageSrc.src}
      alt={`Mileage ${uuid}`}
      loading='lazy'
    />
  );
}

CustomImageComponent.propTypes = {
  bytea: ImageComponentByteaPropTypes,
  uuid: ImageComponentUUIDPropTypes,
  className: PropTypes.string,
};
