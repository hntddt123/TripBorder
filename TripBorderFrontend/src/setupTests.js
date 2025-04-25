// jest-dom adds custom jest matchers for asserting on DOM nodes.
// allows you to do things like:
// expect(element).toHaveTextContent(/react/i)
// learn more: https://github.com/testing-library/jest-dom
/* eslint-disable import/no-extraneous-dependencies */
import '@testing-library/jest-dom';
import { TextEncoder, TextDecoder } from 'util';
import fetch, { Response, Request } from 'node-fetch';
import path from 'path';

global.fetch = fetch;
global.Response = Response;
global.Request = Request;

process.env.NODE_EXTRA_CA_CERTS = path.resolve(__dirname, '../ssl/tripborderfrontend-cert.pem');

Object.assign(global, { TextDecoder, TextEncoder });
const mockedUsedNavigate = jest.fn();

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockedUsedNavigate,
}));

jest.mock('heic2any', () => ({
  __esModule: true,
  default: async ({ toType }) => new Blob(['mocked-jpeg-data'], { type: toType || 'image/jpeg' }),
}));

jest.mock('@mapbox/mapbox-gl-geocoder', () => ({
  MapboxGeocoder: ''
}));
