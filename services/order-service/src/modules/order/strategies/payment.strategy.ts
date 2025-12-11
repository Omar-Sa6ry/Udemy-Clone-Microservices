import { PaymentGateway } from "../enum/order.enum";

export interface PaymentStrategy {
  processPayment(amount: number, currency: string, orderData: any): Promise<PaymentResult>;
  refundPayment(paymentId: string, amount: number): Promise<RefundResult>;
}

export interface PaymentResult {
  success: boolean;
  paymentId: string;
  status: string;
  message?: string;
}

export interface RefundResult {
  success: boolean;
  refundId: string;
  amount: number;
}

export class StripePaymentStrategy implements PaymentStrategy {
  async processPayment(amount: number, currency: string, orderData: any): Promise<PaymentResult> {
    console.log(`Processing Stripe payment: ${amount} ${currency}`);
    
    return {
      success: true,
      paymentId: `stripe_${Date.now()}`,
      status: 'succeeded'
    };
  }

  async refundPayment(paymentId: string, amount: number): Promise<RefundResult> {
    console.log(`Processing Stripe refund: ${paymentId}, amount: ${amount}`);
    
    return {
      success: true,
      refundId: `refund_${Date.now()}`,
      amount
    };
  }
}

export class BankTransferStrategy implements PaymentStrategy {
  async processPayment(amount: number, currency: string, orderData: any): Promise<PaymentResult> {
    console.log(`Processing BankTransferStrategy payment: ${amount} ${currency}`);
    
    return {
      success: true,
      paymentId: `BankTransfer_${Date.now()}`,
      status: 'completed'
    };
  }

  async refundPayment(paymentId: string, amount: number): Promise<RefundResult> {
    console.log(`Processing PayPal refund: ${paymentId}, amount: ${amount}`);
    
    return {
      success: true,
      refundId: `paypal_refund_${Date.now()}`,
      amount
    };
  }
}

// Context class that uses the strategy
export class PaymentProcessor {
  private strategy: PaymentStrategy;

  constructor(strategy: PaymentStrategy) {
    this.strategy = strategy;
  }

  setStrategy(strategy: PaymentStrategy): void {
    this.strategy = strategy;
  }

  async process(amount: number, currency: string, orderData: any): Promise<PaymentResult> {
    return await this.strategy.processPayment(amount, currency, orderData);
  }

  async refund(paymentId: string, amount: number): Promise<RefundResult> {
    return await this.strategy.refundPayment(paymentId, amount);
  }
}

export class PaymentStrategyFactory {
  static create(gateway: string): PaymentStrategy {
    switch (gateway.toLowerCase()) {
      case PaymentGateway.STRIPE:
        return new StripePaymentStrategy();
      case PaymentGateway.BANK_TRANSFER:
        return new BankTransferStrategy();
      default:
        throw new Error(`Unsupported payment gateway: ${gateway}`);
    }
  }
}