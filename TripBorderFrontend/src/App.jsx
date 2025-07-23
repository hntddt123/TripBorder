import { BrowserRouter, Routes, Route } from 'react-router-dom';
import ProtectedRoute from './components/ProtectedRoute';
import Auth from './components/Auth';
import CustomButton from './components/CustomButton';
import TripBoard from './components/TripBoard';
import TripsItems from './components/trips/TripsItems';
import TripsHistory from './components/trips/TripsHistory';
import Settings from './components/Settings';
import DatabaseTableDev from './components/devtables/DatabaseTableDev';
import MileagesList from './components/mileages/MileagesList';
import { VERSION_NUMBER, MODE } from './constants/constants';
import DevMode from './components/DevMode';
import MileagesAdmin from './components/mileages/MileagesAdmin';
import Disclaimers from './components/Disclaimers';

function App() {
  return (
    <div className='customdiv safeArea'>
      <BrowserRouter basename='/'>
        <header className='title'>
          Trip Border
        </header>
        <Routes>
          <Route
            path='/'
            element={(
              <div className='flex flex-col content container justify-center text-center mx-auto max-w-lg'>
                <Auth />
                {(MODE === 'development')
                  ? <DevMode />
                  : <div className='text-2xl m-2'>Version: {VERSION_NUMBER}</div>}
              </div>
            )}
          />
          <Route path='/plantrip' element={<ProtectedRoute />}>
            <Route
              index
              element={<TripBoard component={<TripsItems />} />}
            />
          </Route>
          <Route path='/trips' element={<ProtectedRoute />}>
            <Route
              index
              path='/trips'
              element={<TripBoard component={<TripsHistory />} />}
            />
          </Route>
          <Route path='/mileages' element={<ProtectedRoute />}>
            <Route
              index
              path='/mileages'
              element={<TripBoard component={<MileagesList />} />}
            />
          </Route>
          <Route path='/mileagesverification' element={<ProtectedRoute />}>
            <Route
              index
              path='/mileagesverification'
              element={<TripBoard component={<MileagesAdmin />} />}
            />
          </Route>
          <Route path='/settings' element={<ProtectedRoute />}>
            <Route
              index
              path='/settings'
              element={<TripBoard component={<Settings />} />}
            />
          </Route>
          <Route path='/disclaimers' element={<ProtectedRoute />}>
            <Route
              index
              path='/disclaimers'
              element={<TripBoard component={<Disclaimers />} />}
            />
          </Route>
          <Route path='/database' element={<ProtectedRoute />}>
            <Route
              index
              path='/database'
              element={<TripBoard component={<DatabaseTableDev />} />}
            />
          </Route>
          <Route
            path='*'
            element={(
              <div className='flex flex-col container justify-center text-center mx-auto m-4 max-w-2xl'>
                <h2 className='text-center text-4xl'>404 not found 🗺️</h2>
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
