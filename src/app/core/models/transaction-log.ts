import { EventLog } from './event-log';

export type TransactionLog = {
  transaction_id: string;
  last_updated: string;
  events: EventLog[];
};
