// import axios from 'axios';

// interface NextAppError {
//   name: 'Forbidden' | 'BadRequest' | 'Unknown';
//   message: string;
//   statusCode: number;
// }

// export function isNextError(e: any): e is NextAppError {
//   return e?.name !== undefined && e?.message !== undefined && e?.statusCode !== undefined;
// }

// export function extractNextError(error: any): NextAppError {
//   if (axios.isAxiosError(error)) {
//     const data = error.response?.data;
//     if (isNextError(data)) {
//       return data;
//     }
//   }
//   return {
//     name: 'Unknown',
//     message: 'Unknown error',
//     statusCode: 500,
//   };
// }
