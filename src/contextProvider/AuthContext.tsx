import React, {
  createContext,
  useContext,
  useState,
  ReactNode,
  useEffect,
} from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { message } from "antd";

interface AuthContextProps {
  loggedIn: boolean;
  login: (username: string, password: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextProps | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [loggedIn, setLoggedIn] = useState<boolean>(
    () => !!localStorage.getItem("bookRental")
  );

  const navigate = useNavigate();

  useEffect(() => {
    if (!loggedIn) {
      navigate("/login");
    }
  }, [loggedIn]);

  const login = async (username: string, password: string) => {
    try {
      const response = await axios.post(
        "https://bookrental-7yd6.onrender.com/admin/user/login",
        {
          username,
          password,
        }
      );

      const responseData = response.data;

      if (responseData) {
        const token = responseData.data;
        console.log(token);
        localStorage.setItem("bookRental", token.accessToken);
        localStorage.setItem("refreshToken", token.refreshToken);
        setLoggedIn(true);
      } else {
        console.error("Login failed:", responseData.message);
      }
      console.log(responseData);
    } catch (error) {
      console.error("Login failed", error);
      message.error(`Failed : ${error.response.data.data.errorMessage}`);
    }
  };

  const logout = () => {
    localStorage.removeItem("bookRental");
    localStorage.removeItem("userRole");
    localStorage.removeItem("userName");
    localStorage.removeItem("refreshToken");
    setLoggedIn(false);
    console.log("Logged out");
  };

  return (
    <AuthContext.Provider value={{ loggedIn, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
