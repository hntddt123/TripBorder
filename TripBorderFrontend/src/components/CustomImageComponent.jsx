import { useState, useEffect, useCallback } from 'react';
import { processBytea } from '../utility/processBytea';
import { ImageComponentByteaPropTypes, ImageComponentUUIDPropTypes } from '../constants/imagePropTypes';

function CustomImageComponent({ uuid, bytea }) {
  const [imageSrc, setImageSrc] = useState({ src: null, loading: false, error: null });

  const loadImage = useCallback(async () => {
    const src = await processBytea(bytea);
    setImageSrc({ src, loading: false, error: null });
  }, [bytea]);

  useEffect(() => {
    if (bytea && bytea.data.length > 0) {
      requestIdleCallback(() => {
        loadImage();
      });
    }
  }, [bytea]);

  if (imageSrc.length === 0) {
    return <div>Loading...</div>;
  }

  return (
    <img
      key={uuid}
      src={imageSrc.src}
      alt={`Mileage ${uuid}`}
      loading='lazy'
    />
  );
}

CustomImageComponent.propTypes = {
  bytea: ImageComponentByteaPropTypes,
  uuid: ImageComponentUUIDPropTypes
};

export default CustomImageComponent;
