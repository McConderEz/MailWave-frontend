import { createContext, useEffect, useLayoutEffect, useState } from "react";
import { User } from "../../models/User";
import { AccountsService } from "../../api/accounts";
import { api } from "../../api/api";

type AuthContextType = {
  accessToken: string | undefined;
  user: User | undefined;
  login: (email: string, password: string) => Promise<void>;
};

export const AuthContext = createContext<AuthContextType | undefined>(
  undefined
);

type Props = {
  children: React.ReactNode;
};

export const AuthProvider = ({ children }: Props) => {
  const [accessToken, setAccessToken] = useState<string | undefined>();
  const [refreshToken, setRefreshToken] = useState<string | undefined>();
  const [user, setUser] = useState<User | undefined>();

  useEffect(() => {
    const accessTokenInterceptor = api.interceptors.request.use((config) => {
      config.headers.Authorization = accessToken
        ? `Bearer ${accessToken}`
        : config.headers.Authorization;

      return config;
    });

    return () => {
      api.interceptors.response.eject(accessTokenInterceptor);
    };
  }, [accessToken]);

  useLayoutEffect(() => {
    const refreshInterceptor = api.interceptors.response.use(
      (config) => config,
      async (error) => {
        const originalRequest = error.config;

        if (error.response.status === 401) {
          try {
            const response = await AccountsService.refresh();

            setAccessToken(response.data.result!.accessToken);

            originalRequest.headers.Authorization = `Bearer ${
              response.data.result!.accessToken
            }`;

            return api(originalRequest);
          } catch {
            setAccessToken(undefined);
          }
        }

        return Promise.reject(error);
      }
    );

    return () => {
      api.interceptors.response.eject(refreshInterceptor);
    };
  }, []);

  const login = async (email: string, password: string) => {
    try {
      const response = await AccountsService.login(email, password);
      setAccessToken(response.data.result!.accessToken);
    } catch {
      console.log("error");
    }
  };

  return (
    <AuthContext.Provider value={{ accessToken, user, login }}>
      {children}
    </AuthContext.Provider>
  );
};
