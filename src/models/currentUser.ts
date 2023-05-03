import * as AuthService from '@/services/auth';
import { useObservable } from 'rxjs-hooks';

export default () => {
  const currentUser = useObservable(() => AuthService.currentUser);

  return {
    currentUser: currentUser,
    loading: false,
    login: AuthService.login,
    logout: AuthService.logout,
    refresh: AuthService.refreshCurrentUser,
  };
};
