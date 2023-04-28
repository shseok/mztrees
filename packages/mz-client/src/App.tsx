import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import Home from '~/pages/Home';
import Error from '~/pages/Error';
import Register from '~/pages/Register';
import Login from '~/pages/Login';
import Search from '~/pages/Search';
import BookMarks from '~/pages/BookMarks';
import Setting from '~/pages/Setting';
import TapLayout from '~/components/layout/TapLayout';
import WriteIntro from '~/pages/write/WriteIntro';
import WriteLink from '~/pages/write/WriteLink';
import Write from '~/pages/Write';

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
    children: [
      {
        path: '/write',
        element: <WriteLink />,
      },
      {
        path: '/write/intro',
        element: <WriteIntro />,
      },
      {
        path: '/write/link',
        element: <WriteLink />,
      },
    ],
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
