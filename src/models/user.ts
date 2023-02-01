import { useEffect, useState } from 'react';

export default () => {
  const [user, setUser] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const res = {
      uid: 1,
      username: 'test01',
      nickname: 'Test 01',
    };
    setUser(res);
    setLoading(false);
  }, []);

  return {
    user,
    loading,
  };
};
