import { BrowserRouter, Routes, Route } from 'react-router-dom';
import TripBoard from './components/TripBoard';
import TripsList from './components/TripsList';
import CustomButton from './components/CustomButton';
import Auth from './components/Auth';
import ProtectedRoute from './components/ProtectedRoute';
import Settings from './components/Settings';
import DatabaseTableDev from './components/DatabaseTableDev';
import { VERSION_NUMBER, MODE } from './constants/constants';

function App() {
  return (
    <div className='safeArea'>
      <BrowserRouter basename='/'>
        <header className='flex title justify-center'>
          <div className='content-center'>
            Trip Border
          </div>
        </header>
        <Routes>
          <Route
            path='/'
            element={(
              <div className='flex flex-col container justify-center text-center mx-auto m-2 max-w-2xl'>
                <Auth />
                {(MODE === 'development')
                  ? <CustomButton label='Database Table Dev' to='/database' />
                  : null}
                <p className='customdiv text-2xl m-2'>Version: {VERSION_NUMBER} {MODE}</p>
              </div>
            )}
          />
          <Route path='/newtrip' element={<ProtectedRoute />}>
            <Route
              index
              element={<TripBoard component={<TripsList />} />}
            />
          </Route>
          <Route path='/trips' element={<ProtectedRoute />}>
            <Route
              index
              path='/trips'
              element={<TripBoard />}
            />
          </Route>
          <Route path='/mileages' element={<ProtectedRoute />}>
            <Route
              index
              path='/mileages'
              element={<TripBoard />}
            />
          </Route>
          <Route path='/settings' element={<ProtectedRoute />}>
            <Route
              index
              path='/settings'
              element={<TripBoard component={<Settings />} />}
            />
          </Route>
          {(MODE === 'development')
            ? (
              <Route
                index
                path='/database'
                element={<TripBoard component={<DatabaseTableDev />} />}
              />
            )
            : null}
          <Route
            path='*'
            element={(
              <div className='flex flex-col container justify-center text-center mx-auto m-4 max-w-2xl'>
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
