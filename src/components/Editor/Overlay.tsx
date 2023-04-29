import {
  CursorOverlayData,
  useRemoteCursorOverlayPositions,
} from '@slate-yjs/react';
import { CaretPosition } from '@slate-yjs/react/dist/utils/getOverlayPosition';
import React, { CSSProperties, PropsWithChildren, useRef } from 'react';
import UserNickname from '../Username';
import './index.css';
import { CursorData } from './types';

function addAlpha(hexColor: string, opacity: number): string {
  const normalized = Math.round(Math.min(Math.max(opacity, 0), 1) * 255);
  return hexColor + normalized.toString(16).toUpperCase();
}

type CaretProps = {
  caretPosition: CaretPosition | null;
  data: CursorData;
};

function Caret({ caretPosition, data }: CaretProps) {
  const caretStyle: CSSProperties = {
    ...caretPosition,
    background: data.color,
  };

  const labelStyle: CSSProperties = {
    transform: 'translateY(-100%)',
    background: data.color,
  };

  return (
    <div style={caretStyle} className="editor-cursor-caret">
      <div className="editor-cursor-nameplate" style={labelStyle}>
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
  if (!data) {
    return null;
  }

  const selectionStyle: CSSProperties = {
    // Add a opacity to the background color
    backgroundColor: addAlpha(data.color, 0.5),
  };

  return (
    <React.Fragment>
      {selectionRects.map((position, i) => (
        <div
          style={{ ...selectionStyle, ...position }}
          className="editor-remote-selection"
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

export function RemoteCursorOverlay({ children }: RemoteCursorsProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [cursors] = useRemoteCursorOverlayPositions<CursorData>({
    containerRef,
  });

  return (
    <div className="editor-remote-cursor-overlay" ref={containerRef}>
      {children}
      {cursors.map((cursor) => (
        <RemoteSelection key={cursor.clientId} {...cursor} />
      ))}
    </div>
  );
}
