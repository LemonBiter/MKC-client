import { HttpError } from "react-admin";
import {dataProvider} from "./dataProvider";

/**
 * This authProvider is only for test purposes. Don't use it in production.
 */
export const authProvider = {
  login: async ({ username, password }) => {
    try {
      const result = await  dataProvider.validateLogin('login',{ data :{username, password} })
      console.log('result:', result);
      const { success, message } = result;
      if (success) {
        localStorage.setItem("user", '1');
        return Promise.resolve();
      } else {
        return Promise.reject(
            new HttpError(message, 200, {
              message,
            })
        );
      }
    } catch (e) {
      return Promise.reject(e);
    }
  },
  logout: () => {
    localStorage.removeItem("user");
    return Promise.resolve();
  },
  checkError: () => Promise.resolve(),
  checkAuth: () =>
    localStorage.getItem("user") ? Promise.resolve() : Promise.reject(),
  getPermissions: () => {
    return Promise.resolve(undefined);
  },
  getIdentity: () => {
    const persistedUser = localStorage.getItem("user");
    const user = persistedUser ? JSON.parse(persistedUser) : null;

    return Promise.resolve(user);
  },
};

export default authProvider;
