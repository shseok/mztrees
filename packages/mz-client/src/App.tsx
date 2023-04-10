import { createBrowserRouter, Outlet, RouterProvider } from 'react-router-dom';
import Home from '~/pages/Home';
import Error from '~/pages/Error';
import Register from '~/pages/Register';
import Header from '~/components/Header';
import React from 'react';
import Login from '~/pages/Login';

const Layout = () => {
  return (
    <>
      <Header />
      <div className='layout'>
        <Outlet />
      </div>
      {/*<Footer />*/}
    </>
  );
};

const router = createBrowserRouter([
  {
    path: '/',
    element: <Layout />,
    children: [
      {
        path: '/',
        element: <Home />,
      },
    ],
    errorElement: <Error />,
  },
  {
    path: '/register',
    element: <Register />,
  },
  {
    path: '/login',
    element: <Login />,
  },
  // {
  //   path: '/error',
  //   element: <NetworkError />,
  // },
]);

function App() {
  return (
    <div className='app'>
      <RouterProvider router={router} />
    </div>
  );
}

export default App;
