import { eq } from 'drizzle-orm';
import { NotAvailableException, NotFoundException } from '@exceptions';
import { DrizzleClient, messages, offers, chats } from '@database';
import { CreateMessageDto, GetMesssageType } from '.';

export interface IChatService {
  createChat(offerId: string): Promise<string>;
  sendMessage(data: CreateMessageDto): Promise<GetMesssageType>;
  deleteMessage(messageId: string): Promise<string>;
  updateMessage(messageId: string, message: string): Promise<string>;
  getMessages(chatId: string): Promise<GetMesssageType>;
}

export class ChatService implements IChatService {
  constructor(private db: DrizzleClient) {}

  async createChat(offerId: string) {
    console.log('Create chat...');

    const offer = await this.db.query.offers.findFirst({
      where: eq(offers.id, offerId),
    });

    if (!offer) {
      throw new NotFoundException(`Offer with id ${offerId} not found`);
    }

    console.log('Checking: is status accepted before...');
    if (offer.status !== 'accepted') {
      throw new NotAvailableException(`You can not create chat without accept status offer`);
    }

    const chat = await this.db
      .insert(chats)
      .values({
        offerId: offer.id,
      })
      .returning();
    console.log('Chat is created');

    return chat[0].id;
  }

  async sendMessage(data: CreateMessageDto) {
    const result = await this.db.insert(messages).values(data).returning();
    return result[0];
  }

  async deleteMessage(messageId: string) {
    const result = await this.db.delete(messages).where(eq(messages.id, messageId)).returning();
    return result[0].id;
  }

  async updateMessage(messageId: string, message: string) {
    const result = await this.db
      .update(messages)
      .set({
        message,
      })
      .where(eq(messages.id, messageId))
      .returning();
    return result[0].id;
  }

  async getMessages(chatId: string) {
    const result = await this.db.query.messages.findMany({
      where: eq(messages.chatId, chatId),
    });

    if (result.length === 0) {
      throw new NotFoundException(`Not found any meesges for chat by id: ${chatId}`);
    }

    return result[0];
  }
}
