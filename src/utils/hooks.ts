import lodash from 'lodash';
import { useReducer } from 'react';

export function useUpdater<T extends { [key: string]: any }>(
  initialValue: T,
): [T, React.Dispatch<Partial<T>>] {
  const [params, updateParams] = useReducer((state: T, action: Partial<T>) => {
    const newState: T = { ...state, ...action };

    Object.keys(newState).forEach((key) => {
      if (newState[key] === undefined) {
        delete newState[key];
      }
    });

    if (!lodash.isEqual(state, newState)) {
      return newState;
    } else {
      return state;
    }
  }, initialValue);

  return [params, updateParams];
}
