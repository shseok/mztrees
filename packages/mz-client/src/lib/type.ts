import { UseQueryOptions } from '@tanstack/react-query';

export type FunctionResolve<T extends (...args: any) => any> = Awaited<
  ReturnType<T>
>;
export type UseQueryOptionsOf<T extends (...args: any) => any> =
  UseQueryOptions<
    Awaited<ReturnType<T>>,
    unknown,
    Awaited<ReturnType<T>>,
    any[]
  >;

// UseMutationOptions<Comment, unknown, { itemId: number; text: string; parentCommentId?: number | undefined; }, unknown>,
// muation을 hook으로 뺐을 때 option을 파라미터로 받기 위할 때, 사용할 수 있는 type
// export type UseMutationOptionsOf<
//   T extends (...args: any) => any,
//   E = any,
// > = UseMutationOptions<Awaited<ReturnType<T>>, E, Parameters<T>[0]>;
