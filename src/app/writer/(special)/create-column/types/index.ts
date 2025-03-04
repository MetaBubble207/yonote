export interface PriceStrategy {
    id: number;
    timeLimit: number;
    price: number;
  }
  
  export type PaymentMode = 'permanent' | 'subscription';