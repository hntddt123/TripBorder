import { useState, useEffect } from 'react';
import { processBytea } from '../utility/processBytea';
import { ImageComponentByteaPropTypes, ImageComponentUUIDPropTypes } from '../constants/imagePropTypes';

function CustomImageComponent({ uuid, bytea }) {
  const [imageSrc, setImageSrc] = useState([]);

  useEffect(() => {
    const loadImage = async () => {
      const src = await processBytea(bytea);
      setImageSrc(src);
    };
    loadImage();
  }, [bytea]);

  if (imageSrc.length === 0) {
    return <div>Loading...</div>;
  }

  return (
    <img
      key={uuid}
      src={imageSrc}
      alt={`Mileage ${uuid}`}
    />
  );
}

CustomImageComponent.propTypes = {
  bytea: ImageComponentByteaPropTypes,
  uuid: ImageComponentUUIDPropTypes
};

export default CustomImageComponent;
