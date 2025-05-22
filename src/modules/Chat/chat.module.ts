import { DrizzleClient } from '@database';
import { ChatController, ChatService, registerChatEvents, ChatRouter } from '.';

export const createChat = (db: DrizzleClient) => {
  const chatSrv = new ChatService(db);
  registerChatEvents(chatSrv);
  const c = new ChatController(chatSrv);
  return new ChatRouter(c).router;
};
