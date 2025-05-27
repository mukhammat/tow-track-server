import { Request, Response } from 'express';
import { IChatService } from '.';
import { ControllerMethod } from '@dto';

export interface IChatController {
  sendMessage: ControllerMethod;
  getMessages: ControllerMethod;
}

export class ChatController {
  constructor(private chatService: IChatService) {}

  public async sendMessage(req: Request, res: Response) {
    const { chatId, message, isClient } = req.body;

    const result = await this.chatService.sendMessage({
      chatId: chatId,
      message,
      isClient: isClient,
    });

    res.status(201).send({ data: { result }, message: 'Message sent!' });
  }

  public async getMessages(req: Request, res: Response) {
    const { chatId } = req.params;

    const result = await this.chatService.getMessages(chatId);

    res.send({ data: { result }, message: 'Messages received!' });
  }
}
