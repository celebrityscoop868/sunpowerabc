import React, { createContext, useContext, useEffect, useState } from "react";
import { base44 } from "@/api/base44Client";
import { appParams } from "@/lib/app-params";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoadingAuth, setIsLoadingAuth] = useState(true);
  const [isLoadingPublicSettings, setIsLoadingPublicSettings] = useState(false);
  const [authError, setAuthError] = useState(null);
  const [appPublicSettings, setAppPublicSettings] = useState(null);

  useEffect(() => {
    checkAppState();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const checkUserAuth = async () => {
    try {
      setIsLoadingAuth(true);
      const currentUser = await base44.auth.me();
      setUser(currentUser);
      setIsAuthenticated(true);
      setAuthError(null);
    } catch (error) {
      setUser(null);
      setIsAuthenticated(false);

      // si falla auth (token inválido/expirado) marcamos auth_required
      setAuthError({
        type: "auth_required",
        message: "Authentication required",
      });
    } finally {
      setIsLoadingAuth(false);
    }
  };

  /**
   * En el repo viejo esto consultaba /api/apps/public con @base44/sdk.
   * En el repo actual (Vite) eso puede NO existir y te revienta por deps.
   *
   * Por eso:
   * - NO llamo ese endpoint aquí (para no romper).
   * - Si hay token (appParams.token) intento auth con base44.auth.me().
   * - Si no hay token, quedas como no autenticado.
   */
  const checkAppState = async () => {
    try {
      setIsLoadingPublicSettings(false);
      setAppPublicSettings(null);
      setAuthError(null);

      if (appParams?.token) {
        await checkUserAuth();
      } else {
        setUser(null);
        setIsAuthenticated(false);
        setIsLoadingAuth(false);
      }
    } catch (error) {
      setAuthError({
        type: "unknown",
        message: error?.message || "An unexpected error occurred",
      });
      setIsLoadingAuth(false);
      setIsAuthenticated(false);
    }
  };

  const logout = (shouldRedirect = true) => {
    setUser(null);
    setIsAuthenticated(false);

    // en tu mock, logout() existe
    // si luego vuelves a base44 real, esto sigue funcionando
    if (shouldRedirect) {
      base44.auth.logout(window.location.href);
    } else {
      base44.auth.logout();
    }
  };

  const navigateToLogin = () => {
    // si tu base44 real tiene redirectToLogin, ok.
    // si no, no rompemos: fallback a recargar
    if (typeof base44.auth?.redirectToLogin === "function") {
      base44.auth.redirectToLogin(window.location.href);
      return;
    }
    window.location.href = "/";
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated,
        isLoadingAuth,
        isLoadingPublicSettings,
        authError,
        appPublicSettings,
        logout,
        navigateToLogin,
        checkAppState,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within an AuthProvider");
  return context;
};
