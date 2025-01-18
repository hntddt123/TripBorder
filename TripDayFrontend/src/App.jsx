import { BrowserRouter, Routes, Route } from 'react-router-dom';
import TripBoard from './components/TripBoard';
import TripsList from './components/TripsList';
import CustomButton from './components/CustomButton';
import DarkModeToggle from './components/DarkModeToggle';
import { MODE } from './constants/constants';

function App() {
  return (
    <div className='safeArea'>
      <BrowserRouter basename='/'>
        <header className='flex title justify-between'>
          <div />
          <div className='content-center'>
            Trip Day
          </div>
          <DarkModeToggle />
        </header>
        <Routes>
          <Route
            path='/'
            element={(
              <div className='grid grid-cols-1 container text-center mx-auto max-w-2xl'>
                <CustomButton label='New Trip' to='/newtrip' />
                <CustomButton label='View Trips' to='/trips' />
                <p className='customdiv text-2xl'>Version: 1.2.0 {MODE}</p>
              </div>
            )}
          />
          <Route
            path='/newtrip'
            element={<TripBoard label='Adventure Summary' component={<TripsList />} />}
          />
          <Route
            path='/trips'
            element={<TripBoard label='Memories' />}
          />
          <Route
            path='*'
            element={<div><h2 className='text-4xl'>404 not found</h2></div>}
          />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
