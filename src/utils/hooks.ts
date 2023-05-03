import lodash, { ceil } from 'lodash';
import React, { useEffect, useReducer, useState } from 'react';
import { distinctUntilChanged, interval, map } from 'rxjs';
import { useObservable } from 'rxjs-hooks';

export function useUpdater<T extends { [key: string]: any }>(
  initialValue: T,
): [T, React.Dispatch<Partial<T>>, boolean] {
  const [initialized, setInitialized] = useState(false);
  const [params, updateParams] = useReducer((state: T, action: Partial<T>) => {
    const newState: T = { ...state, ...action };

    Object.keys(newState).forEach((key) => {
      if (newState[key] === undefined) {
        delete newState[key];
      }
    });

    setInitialized(true);

    if (!lodash.isEqual(state, newState)) {
      return newState;
    } else {
      return state;
    }
  }, initialValue);

  return [params, updateParams, initialized];
}

export function useWindowSize() {
  const [size, setSize] = useState([window.innerHeight, window.innerWidth]);
  useEffect(() => {
    const handleResize = () => {
      setSize([window.innerHeight, window.innerWidth]);
    };
    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);
  return size;
}

export function useIsIntersecting(
  ref: React.RefObject<HTMLElement>,
  root?: React.RefObject<HTMLElement>,
) {
  const [isIntersecting, setIsIntersecting] = useState(false);

  useEffect(() => {
    if (ref.current) {
      const observer = new IntersectionObserver(
        ([entry]) => {
          setIsIntersecting(entry.isIntersecting);
        },
        {
          root: root?.current,
        },
      );

      observer.observe(ref.current);

      return () => {
        observer.disconnect();
      };
    }
  }, [ref.current, root?.current]);

  return isIntersecting;
}

const getEpochDay = (date: Date) => ceil(date.getTime() / 86400000);

export function useFriendlyDateFormatter() {
  const nowEpochDay =
    useObservable(() =>
      interval(1000)
        .pipe(map(() => getEpochDay(new Date())))
        .pipe(distinctUntilChanged()),
    ) ?? getEpochDay(new Date());

  console.log(nowEpochDay);

  return (date: Date) => {
    const epochDay = getEpochDay(date);
    if (epochDay === nowEpochDay) {
      return `今天`;
    } else if (epochDay - nowEpochDay > 0 && epochDay - nowEpochDay <= 7) {
      return `${epochDay - nowEpochDay}天后`;
    } else if (epochDay - nowEpochDay < 0 && epochDay - nowEpochDay >= -7) {
      return `${epochDay - nowEpochDay}天前`;
    } else {
      return date.toLocaleDateString();
    }
  };
}

export function useFriendlyDateTimeFormatter() {
  const nowEpochDay =
    useObservable(() =>
      interval(1000)
        .pipe(map(() => getEpochDay(new Date())))
        .pipe(distinctUntilChanged()),
    ) ?? getEpochDay(new Date());

  return (date: Date) => {
    const epochDay = getEpochDay(date);
    if (epochDay === nowEpochDay) {
      return `今天 ${date.toLocaleTimeString()}`;
    } else if (epochDay - nowEpochDay > 0 && epochDay - nowEpochDay <= 7) {
      return `${epochDay - nowEpochDay}天后 ${date.toLocaleTimeString()}`;
    } else if (epochDay - nowEpochDay < 0 && epochDay - nowEpochDay >= -7) {
      return `${epochDay - nowEpochDay}天前 ${date.toLocaleTimeString()}`;
    } else {
      return date.toLocaleString();
    }
  };
}
