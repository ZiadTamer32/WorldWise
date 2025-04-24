import { createContext, useContext, useReducer } from "react";

const FakeAuthContext = createContext();

const initialValue = {
  user: null,
  isAuth: false,
};
function reducer(state, action) {
  switch (action.type) {
    case "login":
      return { ...state, user: action.payload, isAuth: true };
    case "logout":
      return { ...state, user: null, isAuth: false };
    default:
      throw new Error("Unkown Type");
  }
}

const FAKE_USER = {
  name: "Ziad",
  email: "ziad@example.com",
  password: "qwerty",
  avatar: "https://i.pravatar.cc/100?u=zz",
};

function FakeAuthProvider({ children }) {
  const [{ user, isAuth }, dispatch] = useReducer(reducer, initialValue);

  function login(email, password) {
    if (email === FAKE_USER.email && password === FAKE_USER.password)
      dispatch({ type: "login", payload: FAKE_USER });
  }
  function logout() {
    dispatch({ type: "logout" });
  }
  return (
    <FakeAuthContext.Provider value={{ user, isAuth, login, logout }}>
      {children}
    </FakeAuthContext.Provider>
  );
}

function useAuth() {
  const context = useContext(FakeAuthContext);
  if (context === undefined) {
    throw new Error("Wrong Place");
  }
  return context;
}
export { useAuth, FakeAuthProvider };
