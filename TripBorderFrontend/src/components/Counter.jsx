import { useSelector, useDispatch } from 'react-redux';
import { incrementCount, decrementCount } from '../redux/reducers/counterReducer';
import CustomButton from './CustomButton';

export default function Counter() {
  const count = useSelector((state) => state.counterReducer.count);
  const dispatch = useDispatch();

  return (
    <div>
      <h1 className='text-3xl'>Show {count > 1 ? `${count} items` : `${count} item`}</h1>
      <div className='grid grid-cols-3'>
        <CustomButton label='+' onClick={() => dispatch(incrementCount(count))}>Increment</CustomButton>
        <CustomButton label='-' onClick={() => dispatch(decrementCount(count))}>Decrement</CustomButton>
      </div>
    </div>
  );
}
