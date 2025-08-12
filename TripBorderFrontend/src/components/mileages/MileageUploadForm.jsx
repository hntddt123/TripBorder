import { useState, useRef } from 'react';
import { useSelector } from 'react-redux';
import CustomButton from '../CustomButton';
import { authAPI } from '../../api/authAPI';
import { usePostMileagesMutation } from '../../api/mileagesAPI';
import { formatHex } from '../../utility/formatHex';
import CustomToggle from '../CustomToggle';
import CustomError from '../CustomError';
import CustomLoading from '../CustomLoading';

export default function MileageUploadForm() {
  const [postMileages, { data: message, isLoading, error }] = usePostMileagesMutation();
  const [inputError, setInputError] = useState('');
  const fileInputRef = useRef(null);

  const user = useSelector(authAPI.endpoints.checkAuthStatus.select());
  const email = user.data?.email;

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

    if ((e.target.name === 'mileage_amount'
      || e.target.name === 'mileage_price')
      && e.target.value < 0
    ) {
      setInputError('Numberic value cannot be negative');
      setFormData((prev) => ({ ...prev, [name]: '' }));
    } else if ((e.target.name === 'mileage_expired_at')
      && new Date(e.target.value) - new Date().setHours(0, 0, 0, 0) <= 0
    ) {
      setInputError('Expiration Date cannot be past');
      setFormData((prev) => ({ ...prev, [name]: '' }));
    } else {
      setInputError('');
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData((prev) => ({ ...prev, mileage_picture: file }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    let mileagePicture = '';
    if (formData.mileage_picture) {
      mileagePicture = await formatHex(formData.mileage_picture);
    }
    const newMileage = {
      owner_email: email,
      frequent_flyer_number: formData.frequent_flyer_number,
      airline: formData.airline,
      mileage_price: formData.mileage_price ? parseFloat(formData.mileage_price) : undefined,
      mileage_amount: formData.mileage_amount ? parseInt(formData.mileage_amount, 10) : undefined,
      mileage_unit: formData.mileage_unit,
      mileage_expired_at: formData.mileage_expired_at || undefined,
      mileage_picture: mileagePicture
    };
    // Upload new mileage to server
    postMileages(newMileage);

    // Reset form and refresh data
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
    setFormData({
      uuid: '',
      frequent_flyer_number: '',
      airline: '',
      mileage_price: '',
      mileage_amount: '',
      mileage_unit: 'km',
      mileage_expired_at: '',
      mileage_picture: null
    });
  };

  const renderFormInputs = () => (
    <form onSubmit={handleSubmit} encType='multipart/form-data'>
      <div className='inputField mt-4'>
        <label htmlFor='ffn'>
          Frequent Flyer Number*
        </label>
        <input
          className='customInput'
          id='ffn'
          type='text'
          name='frequent_flyer_number'
          value={formData.frequent_flyer_number}
          onChange={handleInputChange}
          required
          placeholder='your flyer number'
          minLength={6}
          maxLength={50}
        />
      </div>
      <div className='inputField'>
        <label htmlFor='al'>
          Airline*
        </label>
        <input
          className='customInput'
          id='al'
          type='text'
          name='airline'
          value={formData.airline}
          onChange={handleInputChange}
          required
          placeholder='airline'
          maxLength={50}
        />
      </div>
      <div className='inputField'>
        <label htmlFor='mp'>
          Mileage Price*
        </label>
        <input
          className='customInput'
          id='mp'
          type='number'
          name='mileage_price'
          value={formData.mileage_price}
          onChange={handleInputChange}
          required
          placeholder='$'
          min={0}
          maxLength={20}
        />
      </div>
      <div className='inputField'>
        <label htmlFor='ma'>
          Mileage Amount*
        </label>
        <input
          className='customInput'
          id='ma'
          type='number'
          name='mileage_amount'
          value={formData.mileage_amount}
          onChange={handleInputChange}
          required
          placeholder='distance'
          min={1}
          maxLength={20}
        />
      </div>
      <div className='inputField'>
        <label htmlFor='mu'>
          Mileage Unit*
        </label>
        <select
          className='customInput text-nowrap'
          id='mu'
          name='mileage_unit'
          value={formData.mileage_unit}
          onChange={handleInputChange}
          required
        >
          <option key='km' value='km'>km</option>
          <option key='miles' value='miles'>miles</option>
        </select>
      </div>
      <div className='inputField'>
        <label htmlFor='ed'>
          Expiration Date*
        </label>
        <input
          className='customInput'
          id='ed'
          type='date'
          name='mileage_expired_at'
          value={formData.mileage_expired_at}
          onChange={handleInputChange}
          required
        />
      </div>
      <div className='inputField'>
        <label htmlFor='mppng'>
          Mileage Picture* (PNG, JPEG, HEIC)
        </label>
        <input
          className='customInput mt-0 mb-2'
          ref={fileInputRef}
          id='mppng'
          type='file'
          name='mileage_picture'
          accept='image/png, image/jpeg, image/heic'
          onChange={handleFileChange}
          required
        />
      </div>
      <CustomButton type='submit' label='Upload' />
      <CustomLoading isLoading={isLoading} text='Uploading...' />
      <CustomError error={error} />
      {(inputError) ? <div className='text-red-600'>{`${inputError}`}</div> : null}
      {(message) ? <div>{`${message.message}`}</div> : null}
    </form>
  );

  return (
    <div className='flex-col cardInfo p-4 overflow-x-auto'>
      <CustomToggle
        className='toggle text-xl px-2'
        title='Create New Mileage'
        component={renderFormInputs()}
      />
    </div>
  );
}
