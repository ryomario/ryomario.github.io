import { parseJSON, toJSON } from "@/lib/json";
import { IAuthSessionToken } from "@/types/IAuth";
import { Logger } from "./logger";

const AUTH_STORAGE_KEY = 'AUTH_STORAGE_KEY';

export async function checkIsLoggedIn(shouldReturn = false) {
  try {
    const token = sessionStorage.getItem(AUTH_STORAGE_KEY);

    if(!token) {
      throw Error('unauthorized');
    }

    const data = parseJSON<IAuthSessionToken>(atob(token));
    if(!data || !('exp' in data)) {
      throw Error('unauthorized');
    }
    
    const currentTime = Date.now() / 1000;

    if(data.exp <= currentTime) {
      throw Error('unauthorized');
    }

    return true;
  } catch (error: any) {
    sessionStorage.removeItem(AUTH_STORAGE_KEY);
    Logger.debug(error.message || error || 'unknown error', 'checkIsLoggedIn');
    if(shouldReturn) {
      return false;
    }
    throw error;
  }
}

export async function loginWithPassword(password: string) {
  if(password != process.env.NEXT_PUBLIC_ADMIN_PASSWORD) {
    throw Error("Password didn't match!");
  }

  let maxLoggedIn = Number(process.env.NEXT_PUBLIC_ADMIN_MAX_LOGIN_TIME ?? '10800');

  if(isNaN(maxLoggedIn)) {
    maxLoggedIn = 10800;
  }

  const data: IAuthSessionToken = {
    name: 'admin',
    exp: (Date.now() / 1000) + maxLoggedIn,
  }

  sessionStorage.setItem(AUTH_STORAGE_KEY, btoa(toJSON(data)));

  sessionExpired(data.exp);

  return true;
}

export async function logout() {
  try {
    sessionStorage.removeItem(AUTH_STORAGE_KEY);
    Logger.debug('Logged out!');
  } catch (error) {
    Logger.debug(error, 'Logout error');
  }
}

export function sessionExpired(exp: number) {
  const currentTime = Date.now();
  const timeLeft = (exp * 1000) - currentTime;

  setTimeout(() => {
    Logger.warning('Session Expired!');

    alert('Session Expired!');
    sessionStorage.removeItem(AUTH_STORAGE_KEY);
    window.location.reload();
  },timeLeft);
}
