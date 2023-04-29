import UserNickname from '@/components/UserAvatar';
import { useEmotionCss } from '@ant-design/use-emotion-css';
import {
  CursorOverlayData,
  useRemoteCursorOverlayPositions,
} from '@slate-yjs/react';
import { CaretPosition } from '@slate-yjs/react/dist/utils/getOverlayPosition';
import React, { PropsWithChildren, useRef } from 'react';
import { CursorData } from '../../types';

function addAlpha(hexColor: string, opacity: number): string {
  const normalized = Math.round(Math.min(Math.max(opacity, 0), 1) * 255);
  return hexColor + normalized.toString(16).toUpperCase();
}

type CaretProps = {
  caretPosition: CaretPosition | null;
  data: CursorData;
};

function Caret({ caretPosition, data }: CaretProps) {
  const caretClassName = useEmotionCss(() => ({
    ...caretPosition,
    background: data.color,
    position: 'absolute',
    width: '0.125rem',
  }));

  const labelClassname = useEmotionCss(() => ({
    zIndex: 255,
    position: 'absolute',
    fontSize: ' 0.75rem',
    lineHeight: '1rem',
    color: 'rgba(255, 255, 255, 1)',
    whiteSpace: 'nowrap',
    top: 0,
    borderRadius: '0.25rem',
    borderBottomLeftRadius: 0,
    padding: '0.125rem 0.375rem',
    transform: 'translateY(-100%)',
    background: data.color,
  }));

  return (
    <div className={caretClassName}>
      <div className={labelClassname}>
        <UserNickname uid={data.uid} />
      </div>
    </div>
  );
}

function RemoteSelection({
  data,
  selectionRects,
  caretPosition,
}: CursorOverlayData<CursorData>) {
  const selectionClassname = useEmotionCss(() => ({
    // Add a opacity to the background color
    backgroundColor: data?.color ? addAlpha(data.color, 0.5) : undefined,
    position: 'absolute',
    pointerEvents: 'none',
  }));

  if (!data) {
    return null;
  }

  return (
    <React.Fragment>
      {selectionRects.map((position, i) => (
        <div
          style={position}
          className={selectionClassname}
          // eslint-disable-next-line react/no-array-index-key
          key={i}
        />
      ))}
      {caretPosition && <Caret caretPosition={caretPosition} data={data} />}
    </React.Fragment>
  );
}

type RemoteCursorsProps = PropsWithChildren<{
  className?: string;
}>;

export function RemoteCursorOverlay({
  className,
  children,
}: RemoteCursorsProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [cursors] = useRemoteCursorOverlayPositions<CursorData>({
    containerRef,
  });

  return (
    <div className={className} ref={containerRef}>
      {children}
      {cursors
        .filter((cursor) => cursor.data?.writeable === true)
        .map((cursor) => (
          <RemoteSelection key={cursor.clientId} {...cursor} />
        ))}
    </div>
  );
}
