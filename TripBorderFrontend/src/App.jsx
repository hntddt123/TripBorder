import { BrowserRouter, Routes, Route } from 'react-router-dom';
import ProtectedRoute from './components/ProtectedRoute';
import ProtectedRoutePremium from './components/ProtectedRoutePremium';
import ProtectedRouteAdmin from './components/ProtectedRouteAdmin';
import Auth from './components/Auth';
import CustomButton from './components/CustomButton';
import TripBoard from './components/TripBoard';
import TripsMap from './components/trips/TripsMap';
import TripsHistory from './components/trips/TripsHistory';
import Settings from './components/Settings';
import DatabaseTableDev from './components/devtables/DatabaseTableDev';
import MileagesList from './components/mileages/MileagesList';
import { VERSION_NUMBER, isDevMode } from './constants/constants';
import DevMode from './components/DevMode';
import MileagesAdmin from './components/mileages/MileagesAdmin';
import Disclaimers from './components/Disclaimers';
import Upgrade from './components/Upgrade';

export default function App() {
  return (
    <div className='customdiv safeArea'>
      <BrowserRouter basename='/'>
        <Routes>
          <Route
            path='/'
            element={(
              <div className='flex flex-col justify-center text-center mx-auto'>
                <header className='title bg-[url(/menuImages/TripBorderTitleBackground.JPG)]'>
                  <div>
                    Trip Border
                  </div>
                </header>
                {(isDevMode)
                  ? (
                    <div>
                      <Auth />
                      <DevMode />
                    </div>
                  )
                  : (
                    <>
                      <Auth />
                      <div className='text-2xl m-2'>
                        Version: {VERSION_NUMBER}
                      </div>
                    </>
                  )}
              </div>
            )}
          />
          <Route path='/plantrip' element={<ProtectedRoutePremium />}>
            <Route
              index
              element={<TripBoard component={<TripsMap />} />}
            />
          </Route>
          <Route path='/trips' element={<ProtectedRoutePremium />}>
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
          <Route path='/upgrade' element={<ProtectedRoute />}>
            <Route
              index
              path='/upgrade'
              element={<TripBoard component={<Upgrade />} />}
            />
          </Route>
          <Route path='/database' element={<ProtectedRouteAdmin />}>
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
