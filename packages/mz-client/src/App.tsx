import { createBrowserRouter, Outlet, RouterProvider } from 'react-router-dom';
import Home from '~/pages/Home';
import Error from '~/pages/Error';
import Register from '~/pages/Register';
import Header from '~/components/base/Header';
import React from 'react';
import Login from '~/pages/Login';
import Footer from '~/components/base/Footer';
import FullHeightPage from '~/components/system/FullHeightPage';
import Search from '~/pages/Search';

const Layout = () => {
  return (
    <FullHeightPage>
      <Header />
      <Outlet />
      <Footer />
    </FullHeightPage>
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
      {
        path: '/search',
        element: <Search />,
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
  // useEffect(() => {
  //   const fetchData = async () => {
  //     // const cookie = cookieState;
  //     // if (!cookie) return;
  //     // setClientCookie(cookie);
  //     const me = await getMyAccount();
  //     console.log('hhhh', me);
  //   };
  //
  //   fetchData();
  // }, []);

  return (
    <div className='app'>
      <RouterProvider router={router} />
    </div>
  );
}

export default App;
