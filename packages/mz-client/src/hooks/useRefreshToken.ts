import { refreshToken } from "@/lib/api/auth";

const useRefreshToken = () => {
  // const set = setUser();
  /*
  const response = await refreshToken();
  set(response.accessToken);
  return response.accessToken;
  */

  const refresh = async () => {
    try {
    } catch (e) {
      throw new Error("useRefreshToken hook error");
    }
    const response = await refreshToken();
    return response.accessToken;
  };

  return refresh;
};

export default useRefreshToken;
