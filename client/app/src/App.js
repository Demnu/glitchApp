import * as React from "react";
import jsonServerProvider from 'ra-data-json-server';
import { Admin, Resource, ListGuesser, fetchUtils } from 'react-admin';
import dataProvider from './dataProvider';
import OrderList from './components/orderList/OrderList';

// const httpClient = (url, options = {}) => {
//   if (!options.headers) {
//       options.headers = new Headers({ Accept: 'application/json' });
//   }
//   // add your own headers here
//   // options.headers.set('X-Custom-Header', 'foobar');
//   return fetchUtils.fetchJson(url, options);
// };

// const dataProvider = jsonServerProvider('https://jsonplaceholder.typicode.com');
const App = () => (
<Admin dataProvider={dataProvider}>
  <Resource name="orders" list={OrderList} />
  <Resource name="hello" list={OrderList} />
</Admin>
)

export default App