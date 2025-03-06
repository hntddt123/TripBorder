import { useState } from 'react';
import { useSelector } from 'react-redux';
import { BACKEND_DOMAIN, PORT } from '../constants/constants';
import CustomButton from './CustomButton';
import { authAPI } from '../api/authAPI';

const uploadMileages = async (payload) => {
  const response = await fetch(`https://${BACKEND_DOMAIN}:${PORT}/api/uploadmileages`, {
    method: 'POST',
    body: JSON.stringify({ data: payload }),
    headers: { 'Content-Type': 'application/json' }

  });
  if (!response.ok) {
    throw new Error('Upload mileages failed');
  }
  return response.json();
};

function MileageUploadForm() {
  const user = useSelector(authAPI.endpoints.checkAuthStatus.select());
  const email = user.data?.email;

  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
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
        owner_email: email,
        frequent_flyer_number: formData.frequent_flyer_number,
        airline: formData.airline,
        mileage_price: formData.mileage_price ? parseFloat(formData.mileage_price) : undefined,
        mileage_amount: formData.mileage_amount ? parseInt(formData.mileage_amount, 10) : undefined,
        mileage_unit: formData.mileage_unit,
        mileage_expired_at: formData.mileage_expired_at || undefined,
        mileage_picture: mileagePicture,
      };

      // Upload new mileage to server
      uploadMileages(payload)
        .then((data) => setMessage(data.message))
        .catch((err) => setError(err.message));

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
    <div className='flex cardMileage p-4 overflow-x-auto'>
      <form onSubmit={handleSubmit}>
        <h1 className='text-2xl'>Create New Mileage</h1>
        <div className='inputField'>
          <label htmlFor='ffn'>
            Frequent Flyer Number
          </label>
          <input
            id='ffn'
            type='text'
            name='frequent_flyer_number'
            value={formData.frequent_flyer_number}
            onChange={handleInputChange}
          />
        </div>
        <div className='inputField'>
          <label htmlFor='al'>
            Airline
          </label>
          <input
            id='al'
            type='text'
            name='airline'
            value={formData.airline}
            onChange={handleInputChange}
          />
        </div>
        <div className='inputField'>
          <label htmlFor='mp'>
            Mileage Price
          </label>
          <input
            id='mp'
            type='number'
            name='mileage_price'
            value={formData.mileage_price}
            onChange={handleInputChange}
          />
        </div>
        <div className='inputField'>
          <label htmlFor='ma'>
            Mileage Amount
          </label>
          <input
            id='ma'
            type='number'
            name='mileage_amount'
            value={formData.mileage_amount}
            onChange={handleInputChange}
          />
        </div>
        <div className='inputField'>
          <label htmlFor='mu'>
            Mileage Unit
          </label>
          <select
            id='mu'
            name='mileage_unit'
            value={formData.mileage_unit}
            onChange={handleInputChange}
          >
            <option key='km' value='km'>km</option>
            <option key='miles' value='miles'>miles</option>
          </select>
        </div>
        <div className='inputField'>
          <label htmlFor='ed'>
            Expiration Date
          </label>
          <input
            id='ed'
            type='date'
            name='mileage_expired_at'
            value={formData.mileage_expired_at}
            onChange={handleInputChange}
          />
        </div>
        <div className='inputField'>
          <label htmlFor='mppng'>
            Mileage Picture (PNG)
          </label>
          <input
            id='mppng'
            type='file'
            accept='image/png'
            onChange={handleFileChange}
          />
        </div>
        <CustomButton type='submit' label='Upload' />
        {error && <p className='text-red-600'>{error}</p>}
        {message && <p>{message}</p>}
      </form>
    </div>
  );
}

export default MileageUploadForm;
