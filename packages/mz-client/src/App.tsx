import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import Home from '~/pages/Home';
import Error from '~/pages/Error';
import Register from '~/pages/Register';
import React, { useEffect, useState } from 'react';
import Login from '~/pages/Login';
import Search from '~/pages/Search';
import BookMarks from '~/pages/BookMarks';
import Setting from '~/pages/Setting';
import TapLayout from '~/components/layout/TapLayout';
import Write from '~/pages/Write';
import { UserContext } from '~/context/UserContext';
import { getMemorizedMyAccount, User } from '~/lib/api/auth';

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
  {
    path: '/write',
    element: <Write />,
  },
  // {
  //   path: '/error',
  //   element: <NetworkError />,
  // },
]);

function App() {
  const [data, setData] = useState<User | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      // const cookie = cookieState;
      // if (!cookie) return;
      // setClientCookie(cookie);
      const result = await getMemorizedMyAccount();
      setData(result);
    };
    fetchData();
  }, []);
  console.log(data);
  return (
    <div className='app'>
      <UserContext.Provider value={data}>
        <RouterProvider router={router} />
      </UserContext.Provider>
    </div>
  );
}

export default App;
