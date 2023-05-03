import * as AuthService from '@/services/auth';
import { useObservable } from 'rxjs-hooks';

export default () => {
  const currentUser = useObservable(() => AuthService.currentUser);
  const loading = useObservable(() => AuthService.loadingCurrentUser);
  const isLoggedIn = Boolean(currentUser?.uid);

  return {
    currentUser,
    loading,
    isLoggedIn,
    login: AuthService.login,
    logout: AuthService.logout,
    refresh: AuthService.refreshCurrentUser,
  };
};
