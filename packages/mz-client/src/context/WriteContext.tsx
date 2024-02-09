'use client';

import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { NextAppError } from '@/lib/nextError';
import { produce } from 'immer';
import type { FormType, TagList, ThumbnailType } from '@/types/db';
import type { OutputData } from '@editorjs/editorjs';

interface WriteContextState {
  form: FormType;
  error?: NextAppError;
}
interface WriteContextActions {
  change(
    key: keyof WriteContextState['form'],
    value: string | ThumbnailType | TagList | OutputData
  ): void;
  reset(): void;
  setError(error?: NextAppError): void;
}

interface WriteContextType {
  state: WriteContextState;
  actions: WriteContextActions;
}

const WriteContext = createContext<WriteContextType | null>(null);

interface Props {
  children: React.ReactNode;
}

const initialState = {
  form: {
    link: '',
    title: '',
    body: null,
    thumbnail: {
      extracted: [],
    },
    tags: [],
  },
  error: undefined,
};

export const WriteProvider = ({ children }: Props) => {
  const [state, setState] = useState<WriteContextState>(initialState);
  // TODO: refactoring with immer
  const actions: WriteContextActions = useMemo(() => {
    return {
      // change(key, value) {
      //   setState((prev) => ({
      //     ...prev,
      //     form: {
      //       ...prev.form,
      //       [key]: value,
      //     },
      //   }));
      // },
      change(key, value) {
        setState((prev) =>
          produce(prev, (draft) => {
            if (key === 'thumbnail') {
              draft.form.thumbnail = value as ThumbnailType;
            } else if (key === 'tags') {
              draft.form.tags = value as TagList;
            } else if (key === 'body') {
              // 글 수정시 사용된다고 가정
              draft.form.body = JSON.parse(value as string) as OutputData;
            } else {
              draft.form[key] = value as string;
            }
          })
        );
      },
      reset() {
        setState(initialState);
      },
      setError(error) {
        setState((prev) => ({
          ...prev,
          error,
        }));
      },
    };
  }, []);

  const value = useMemo(() => ({ state, actions }), [state, actions]);

  // get localStorage data at first render
  useEffect(() => {
    const localData = localStorage.getItem('writeData');
    if (!localData) return;
    const { title, body, tags } = JSON.parse(localData);
    setState((prev) => ({
      ...prev,
      form: {
        ...prev.form,
        title,
        body,
        tags,
      },
    }));
  }, []);

  return (
    <WriteContext.Provider value={value}>{children}</WriteContext.Provider>
  );
};

export const useWriteContext = () => {
  const context = useContext(WriteContext);

  if (!context) {
    throw new Error('useWriteContext must be used within a WriteProvider');
  }

  return context;
};
