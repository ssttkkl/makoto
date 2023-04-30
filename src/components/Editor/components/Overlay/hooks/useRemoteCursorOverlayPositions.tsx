// copied from @slate-yjs/react

import { CursorState } from '@slate-yjs/core';
import {
  RefObject,
  useCallback,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { BaseRange, NodeMatch, Text } from 'slate';
import { useModel } from '@umijs/max';
import { CursorData } from '../../../types';
import { useRemoteCursorStates, getCursorRange } from '@slate-yjs/react';

import { useRemoteCursorEditor } from './useRemoteCursorEditor';
import { useOnResize, useRequestRerender } from './utils';
import {
  CaretPosition,
  getOverlayPosition,
  OverlayPosition,
  SelectionRect,
} from '../getOverlayPosition';

const FROZEN_EMPTY_ARRAY = Object.freeze([]);

export type UseRemoteCursorOverlayPositionsOptions<T extends HTMLElement> = {
  shouldGenerateOverlay?: NodeMatch<Text>;
} & (
  | {
      // Container the overlay will be rendered in. If set, all returned overlay positions
      // will be relative to this container and the cursor positions will be automatically
      // updated on container resize.
      containerRef?: undefined;
    }
  | {
      containerRef: RefObject<T>;

      // Whether to refresh the cursor overlay positions on container resize. Defaults
      // to true. If set to 'debounced', the remote cursor positions will be updated
      // each animation frame.
      refreshOnResize?: boolean | 'debounced';
    }
);

export type CursorOverlayData<TCursorData extends Record<string, unknown>> =
  CursorState<TCursorData> & {
    range: BaseRange | null;
    caretPosition: CaretPosition | null;
    selectionRects: SelectionRect[];
  };

export function useRemoteCursorOverlayPositions<
  TContainer extends HTMLElement = HTMLDivElement,
>({
  containerRef,
  shouldGenerateOverlay,
  ...opts
}: UseRemoteCursorOverlayPositionsOptions<TContainer> = {}) {
  const editor = useRemoteCursorEditor<CursorData>();
  let cursorStates = useRemoteCursorStates<CursorData>();
  const requestRerender = useRequestRerender();

  // 过滤掉自己（否则渲染时会出bug，不懂为啥）
  const { currentUser } = useModel('currentUser');
  cursorStates = Object.fromEntries(
    Object.entries(cursorStates).filter(([key, state]) => {
      return state.data?.uid !== currentUser?.uid;
    }),
  );

  const overlayPositionCache = useRef(
    new WeakMap<BaseRange, OverlayPosition>(),
  );
  const [overlayPositions, setOverlayPositions] = useState<
    Record<string, OverlayPosition>
  >({});

  const refreshOnResize =
    'refreshOnResize' in opts ? opts.refreshOnResize ?? true : true;

  useOnResize(refreshOnResize ? containerRef : undefined, () => {
    overlayPositionCache.current = new WeakMap();
    requestRerender(refreshOnResize !== 'debounced');
  });

  // Update selection rects after paint
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useLayoutEffect(() => {
    // We have a container ref but the ref is null => container
    // isn't mounted to we can't calculate the selection rects.
    if (containerRef && !containerRef.current) {
      return;
    }

    const containerRect = containerRef?.current?.getBoundingClientRect();
    const xOffset = containerRect?.x ?? 0;
    const yOffset = containerRect?.y ?? 0;

    let overlayPositionsChanged =
      Object.keys(overlayPositions).length !== Object.keys(cursorStates).length;

    const updated = Object.fromEntries(
      Object.entries(cursorStates).map(([key, state]) => {
        const range = state.relativeSelection && getCursorRange(editor, state);

        if (!range) {
          return [key, FROZEN_EMPTY_ARRAY];
        }

        const cached = overlayPositionCache.current.get(range);
        if (cached) {
          return [key, cached];
        }

        const overlayPosition = getOverlayPosition(editor, range, {
          xOffset,
          yOffset,
          shouldGenerateOverlay,
        });
        overlayPositionsChanged = true;
        overlayPositionCache.current.set(range, overlayPosition);
        return [key, overlayPosition];
      }),
    );

    if (overlayPositionsChanged) {
      setOverlayPositions(updated);
    }
  });

  const overlayData = useMemo<CursorOverlayData<CursorData>[]>(
    () =>
      Object.entries(cursorStates).map(([clientId, state]) => {
        const range = state.relativeSelection && getCursorRange(editor, state);
        const overlayPosition = overlayPositions[clientId];

        return {
          ...state,
          range,
          caretPosition: overlayPosition?.caretPosition ?? null,
          selectionRects: overlayPosition?.selectionRects ?? FROZEN_EMPTY_ARRAY,
        };
      }),
    [cursorStates, editor, overlayPositions],
  );

  const refresh = useCallback(() => {
    overlayPositionCache.current = new WeakMap();
    requestRerender(true);
  }, [requestRerender]);

  return [overlayData, refresh] as const;
}
