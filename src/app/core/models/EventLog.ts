
export type EventLog = {
  timestamp: number;
  event: string;
  actor: string;
  data: {
    key: string;
    value: any;
  };
}
