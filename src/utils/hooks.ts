import lodash from 'lodash';
import { useReducer } from 'react';

export function useUpdater<T>(
  initialValue: T,
): [T, React.Dispatch<Partial<T>>] {
  const [params, updateParams] = useReducer((state: T, action: Partial<T>) => {
    const newState = { ...state, ...action };
    if (!lodash.isEqual(state, newState)) {
      return newState;
    } else {
      return state;
    }
  }, initialValue);

  return [params, updateParams];
}
