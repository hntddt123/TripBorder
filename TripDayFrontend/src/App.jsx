import { BrowserRouter, Routes, Route } from 'react-router-dom';
import TripBoard from './components/TripBoard';
import TripsList from './components/TripsList';
import CustomButton from './components/CustomButton';
import DarkModeToggle from './components/DarkModeToggle';
import Auth from './components/Auth';
import ProtectedRoute from './components/ProtectedRoute';
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
              <div className='flex flex-col container justify-center text-center mx-auto m-2 max-w-2xl'>
                <Auth />
                <p className='customdiv text-2xl m-2'>Version: 1.2.0 {MODE}</p>
              </div>
            )}
          />
          <Route path='/newtrip' element={<ProtectedRoute />}>
            <Route
              index
              element={<TripBoard label='Adventure Summary' component={<TripsList />} />}
            />
          </Route>
          <Route path='/trips' element={<ProtectedRoute />}>
            <Route
              index
              path='/trips'
              element={<TripBoard label='Memories' />}
            />
          </Route>
          <Route
            path='*'
            element={(
              <div className='flex flex-col container justify-center text-center mx-auto mt-10 mb-10 max-w-2xl'>
                <h2 className='customdiv text-center text-4xl'>404 not found 🗺️</h2>
                <CustomButton label='Back' to='/' />
              </div>
            )}
          />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
