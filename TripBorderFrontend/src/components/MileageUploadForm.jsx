import { useState } from 'react';
import { BACKEND_DOMAIN, PORT } from '../constants/constants';
import CustomButton from './CustomButton';

function MileageUploadForm() {
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    uuid: '',
    frequent_flyer_number: '',
    airline: '',
    mileage_price: '',
    mileage_amount: '',
    mileage_unit: 'km',
    mileage_expired_at: '',
    mileage_picture: null,
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file && file.type === 'image/png') {
      setFormData((prev) => ({ ...prev, mileage_picture: file }));
      setError('');
    } else {
      setError('Please select a PNG file');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    try {
      let mileagePicture = '';
      if (formData.mileage_picture) {
        const arrayBuffer = await formData.mileage_picture.arrayBuffer();
        const uint8Array = new Uint8Array(arrayBuffer);
        const hexString = Array.from(uint8Array)
          .map((byte) => byte.toString(16).padStart(2, '0'))
          .join('');
        mileagePicture = `\\x${hexString}`;
      }

      const payload = {
        frequent_flyer_number: formData.frequent_flyer_number,
        airline: formData.airline,
        mileage_price: formData.mileage_price ? parseFloat(formData.mileage_price) : undefined,
        mileage_amount: formData.mileage_amount ? parseInt(formData.mileage_amount, 10) : undefined,
        mileage_unit: formData.mileage_unit,
        mileage_expired_at: formData.mileage_expired_at || undefined,
        mileage_picture: mileagePicture,
      };

      // Upload new mileage to server
      const response = await fetch(`https://${BACKEND_DOMAIN}:${PORT}/api/uploadmileages`, {
        method: 'POST',
        body: JSON.stringify({ data: payload }),
        headers: { 'Content-Type': 'application/json' }
      });

      if (!response.ok) throw new Error('Request failed');
      const result = await response.json();
      console.log(result);

      // Reset form and refresh data
      setFormData({
        uuid: '',
        frequent_flyer_number: '',
        airline: '',
        mileage_price: '',
        mileage_amount: '',
        mileage_unit: '',
        mileage_expired_at: '',
        mileage_picture: null,
      });
    } catch (err) {
      setError(`Error submitting form: ${err.message}`);
    }
  };

  return (
    <div className='flex cardMileage   p-4 overflow-x-auto justify-between'>
      <form onSubmit={handleSubmit}>
        <h1 className='text-2xl'>Create New Mileage</h1>
        <div>
          <label htmlFor='ffn'>
            Frequent Flyer Number
            <input
              id='ffn'
              type='text'
              name='frequent_flyer_number'
              value={formData.frequent_flyer_number}
              onChange={handleInputChange}
            />
          </label>
        </div>
        <div>
          <label htmlFor='al'>
            Airline
            <input
              id='al'
              type='text'
              name='airline'
              value={formData.airline}
              onChange={handleInputChange}
            />
          </label>
        </div>
        <div>
          <label htmlFor='mp'>
            Mileage Price
            <input
              id='mp'
              type='number'
              name='mileage_price'
              value={formData.mileage_price}
              onChange={handleInputChange}
            />
          </label>
        </div>
        <div>
          <label htmlFor='ma'>
            Mileage Amount
            <input
              id='ma'
              type='number'
              name='mileage_amount'
              value={formData.mileage_amount}
              onChange={handleInputChange}
            />
          </label>
        </div>
        <div>
          <label htmlFor='mu'>
            Mileage Unit
            <select
              id='mu'
              name='mileage_unit'
              value={formData.mileage_unit}
              onChange={handleInputChange}
            >
              <option key='km' value='km'>km</option>
              <option key='miles' value='miles'>miles</option>
            </select>
          </label>
        </div>
        <div>
          <label htmlFor='ed'>
            Expiration Date
            <input
              id='ed'
              type='date'
              name='mileage_expired_at'
              value={formData.mileage_expired_at}
              onChange={handleInputChange}
            />
          </label>
        </div>
        <div>
          <label htmlFor='mppng'>
            Mileage Picture (PNG)
            <input
              id='mppng'
              type='file'
              accept='image/png'
              onChange={handleFileChange}
            />
          </label>
        </div>
        <CustomButton type='submit' label='Upload' />
        {error && <p className='text-red-600'>{error}</p>}
      </form>
    </div>
  );
}

export default MileageUploadForm;
