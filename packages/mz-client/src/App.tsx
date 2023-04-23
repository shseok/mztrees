import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import Home from '~/pages/Home';
import Error from '~/pages/Error';
import Register from '~/pages/Register';
import React from 'react';
import Login from '~/pages/Login';
import Search from '~/pages/Search';
import BookMarks from '~/pages/BookMarks';
import Setting from '~/pages/Setting';
import TapLayout from '~/components/layout/TapLayout';

const router = createBrowserRouter([
  {
    path: '/',
    element: <TapLayout />,
    children: [
      {
        path: '/',
        element: <Home />,
      },
      {
        path: '/search',
        element: <Search />,
      },
      {
        path: '/bookmarks',
        element: <BookMarks />,
      },
      {
        path: '/setting',
        element: <Setting />,
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