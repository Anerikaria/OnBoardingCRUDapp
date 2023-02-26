import { Counter } from "./components/Counter";
import { FetchData } from "./components/FetchData";
import { Home } from "./components/Home";
import Customer from "./components/Customer";
import Store from "./components/Store";
import Product from "./components/Product";
import Sales from "./components/Sales";

const AppRoutes = [
  {
    index: true,
    element: <Customer />
  },
  //{
  //  path: '/counter',
  //  element: <Counter />
  //},
  //{
  //  path: '/fetch-data',
  //  element: <FetchData />
  //  },
    {
        path: '/Customer',
        element: <Customer/>
    },
    {
        path: '/Store',
        element: <Store/>
    },
    {
        path: '/Product',
        element: <Product/>
    },
    {
        path: '/Sales',
        element:<Sales/>
        }
];

export default AppRoutes;
