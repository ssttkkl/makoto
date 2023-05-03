import { request } from '@/utils/request';
import { plainToInstance } from 'class-transformer';
import { Chat } from './entities';

export async function getChat(params: {
  room: string;
  before?: Date;
  after?: Date;
  limit?: number;
  reversed?: boolean;
}): Promise<Chat[]> {
  return plainToInstance(
    Chat,
    (await request(`/api/v1/chat`, {
      method: 'GET',
      params: {
        room: params.room,
        before: params?.before?.getTime(),
        after: params?.after?.getTime(),
        limit: params?.limit,
        reversed: params?.reversed?.toString(),
      },
    })) as [],
  );
}

export async function postChat({
  room,
  content,
}: {
  room: string;
  content: string;
}): Promise<Chat> {
  return plainToInstance(
    Chat,
    await request(`/api/v1/chat`, {
      method: 'POST',
      params: { room },
      data: { content },
    }),
  );
}

export function createChatEventSource(params: { room: string; after?: Date }) {
  const urlParams = new URLSearchParams({ room: params.room });
  if (params.after) {
    urlParams.set('after', params.after?.getTime()?.toString());
  }

  const url = `/api/v1/chat/sse?${urlParams.toString()}`;
  return new EventSource(url);
}
