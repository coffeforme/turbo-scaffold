import { useCallback, useEffect } from "react";
import { useAppDispatch, useAppSelector } from "@repo/state";
import {
  fetchUserFailure,
  fetchUserStart,
  fetchUserSuccess,
  selectUser,
  selectUserError,
  selectUserLoading,
} from "@repo/state";
import { useUserApi } from "../api/useUserApi";

export const useUserProfile = (userId = 1) => {
  const dispatch = useAppDispatch();
  const { fetchUser: fetchUserRequest } = useUserApi();

  const user = useAppSelector(selectUser);
  const loading = useAppSelector(selectUserLoading);
  const error = useAppSelector(selectUserError);

  const fetchUser = useCallback(
    async (id: number) => {
      dispatch(fetchUserStart());
      try {
        const user = await fetchUserRequest(id);
        dispatch(fetchUserSuccess(user));
      } catch (error: any) {
        dispatch(fetchUserFailure(error?.message ?? "Unknown error"));
      }
    },
    [dispatch, fetchUserRequest]
  );

  useEffect(() => {
    fetchUser(userId);
  }, [fetchUser, userId]);

  return { user, loading, error };
};
