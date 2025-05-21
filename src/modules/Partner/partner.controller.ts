import { Request, Response } from 'express';
import { PartnerService } from '.';

export interface IPartnerController {
  updatePhone(req: Request, res: Response): Promise<void>;
}

export class PartnerController {
  constructor(private partnerService: PartnerService) {}

  public async updatePhone(req: Request, res: Response) {
    const { partnerId } = res.locals;
    const { phone } = req.body;

    const id = await this.partnerService.updatePhone(partnerId, phone);

    res.status(200).send({ data: { id }, message: 'Phone updated' });
  }
}
