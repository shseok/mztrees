"use client";

import { createContext, useContext, useMemo, useState } from "react";
import { NextAppError } from "@/lib/nextError";
import { produce } from "immer";
import { TagList } from "@/types/db";

type ThumbnailType = {
  extracted: string[];
  selected?: string;
};

interface WriteContextState {
  form: {
    link: string;
    title: string;
    body: string;
    thumbnail: ThumbnailType;
    id?: string;
    tags?: TagList;
  };
  error?: NextAppError;
}

interface WriteContextActions {
  change(
    key: keyof WriteContextState["form"],
    value: string | ThumbnailType | TagList
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
    link: "",
    title: "",
    body: "",
    thumbnail: {
      extracted: [],
    },
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
            if (key === "thumbnail") {
              draft.form.thumbnail = value as ThumbnailType;
            } else if (key === "tags") {
              draft.form.tags = value as TagList;
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

  return (
    <WriteContext.Provider value={value}>{children}</WriteContext.Provider>
  );
};

export const useWriteContext = () => {
  const context = useContext(WriteContext);

  if (!context) {
    throw new Error("useWriteContext must be used within a WriteProvider");
  }

  return context;
};
