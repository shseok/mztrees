import { UseQueryOptions, UseMutationOptions } from '@tanstack/react-query';

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
export type UseMutationOptionsOf<
  T extends (...args: any) => any,
  E = any,
> = UseMutationOptions<Awaited<ReturnType<T>>, E, Parameters<T>[0]>;
