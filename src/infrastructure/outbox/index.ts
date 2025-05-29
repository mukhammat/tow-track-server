import { OutboxService } from "./service";
import { OutboxProcessor, EventHandlersMap } from "./processor";
import { DrizzleClient } from "@database"


export const createOutbox = (db: DrizzleClient) => {
    return new OutboxService(db);
};

export const createProcessor = (db: DrizzleClient, handlers: EventHandlersMap) => {
    return new OutboxProcessor(createOutbox(db), handlers);
};

export * from "./service";