// import { createContext, useContext, useMemo, useState } from 'react';
// import { AppError } from '@/lib/nextError';

// interface WriteContextState {
//   form: {
//     link: string;
//     title: string;
//     body: string;
//   };
//   error?: AppError;
// }

// interface WriteContextActions {
//   change(key: keyof WriteContextState['form'], value: string): void;
//   reset(): void;
//   setError(error?: AppError): void;
// }

// interface WriteContextType {
//   state: WriteContextState;
//   actions: WriteContextActions;
// }

// const WriteContext = createContext<WriteContextType | null>(null);

// interface Props {
//   children: React.ReactNode;
// }

// const initialState = {
//   form: {
//     link: '',
//     title: '',
//     body: '',
//   },
//   error: undefined,
// };

// export const WriteProvider = ({ children }: Props) => {
//   const [state, setState] = useState<WriteContextState>(initialState);
//   // change > immer를 써도되지만, 일단 킵
//   const actions: WriteContextActions = useMemo(() => {
//     return {
//       change(key, value) {
//         setState((prev) => ({
//           ...prev,
//           form: {
//             ...prev.form,
//             [key]: value,
//           },
//         }));
//       },
//       reset() {
//         setState(initialState);
//       },
//       setError(error) {
//         setState((prev) => ({
//           ...prev,
//           error,
//         }));
//       },
//     };
//   }, []);

//   const value = useMemo(() => ({ state, actions }), [state, actions]);

//   return <WriteContext.Provider value={value}>{children}</WriteContext.Provider>;
// };

// export const useWriteContext = () => {
//   const context = useContext(WriteContext);

//   if (!context) {
//     throw new Error('useWriteContext must be used within a WriteProvider');
//   }

//   return context;
// };
