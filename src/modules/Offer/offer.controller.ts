import { Request, Response } from "express";
import { IOfferService } from ".";

export interface IOfferController {
    acceptOfferThenOrder(req: Request, res: Response): Promise<void>
    createOffer(req: Request, res: Response): Promise<void>
    getOffersByOrderId(req: Request, res: Response): Promise<void>
    cancelOffer(req: Request, res: Response): Promise<void>
}

export class OfferController implements IOfferController {
    constructor(
        private offerService: IOfferService,
    ) {}

    public async acceptOfferThenOrder(req: Request, res: Response) {
        const { offerId } = req.params;

        const data = await this.offerService.acceptOffer(offerId);

        console.log("Datas:", data);

        res.status(200).send({ data: null, message: 'Offer then order accepted!' });
    } 

    public async createOffer(req: Request, res: Response) {
        const data = req.body;

        const offerId = await this.offerService.createOffer(data);

        res.status(201).send({ data: {offerId}, message: 'Offer created!' });
    }

    public async getOffersByOrderId(req: Request, res: Response) {
        const { orderId } = req.params;

        const offers = await this.offerService.getPendingOffersByOrderId(orderId);
        res.send({ data: {offers}, message: null });
    }

    public async cancelOffer(req: Request, res: Response) {
        const { offerId } = req.params;

        const offer = await this.offerService.cancelOffer(offerId);

        res.send({ data: {offerId: offer.id}, message: null });
    }
}