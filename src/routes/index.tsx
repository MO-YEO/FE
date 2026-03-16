import { createBrowserRouter } from 'react-router-dom';
import { publicRoutes } from './public-routes';
import { protectedRoutes } from './protected-routes';
//import ProtectedRoute from './ProtectedRoute';
//import RootLayout from '../components/layout/RootLayout';
//import NotFoundPage from '../pages/NotFound';

// export const router = createBrowserRouter([
//   {
//     Component: RootLayout,
//     children: [
//       // 1. 누구나 접근 가능한 페이지
//       ...publicRoutes,
      
//       // 2. 로그인(인증)이 필요한 페이지들
//       {
//         Component: ProtectedRoute,
//         children: protectedRoutes,
//       },

//       // 3. 404 에러 페이지
//       {
//         path: '*',
//         Component: NotFoundPage,
//       },
//     ],
//   },
// ]);