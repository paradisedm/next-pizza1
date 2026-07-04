export interface WayForPayCallbackData {
  orderReference: string;
  transactionStatus: string;
  reason?: string;
  reasonCode?: number;
  merchantSignature: string;
}