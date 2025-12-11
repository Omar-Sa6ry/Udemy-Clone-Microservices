import { registerEnumType } from '@nestjs/graphql';

export enum PaymentStatus {
  PENDING = 'pending',
  COMPLETED = 'completed',
  FAILED = 'failed',
  CANCELLED = 'cancelled',
}

export enum PaymentGateway {
  STRIPE = 'stripe',
  PAYPAL = 'paypal',
  BANK_TRANSFER = 'bank_transfer',
}

export enum PaymentMethod {
  CREDIT_CARD = 'credit_card',
  DEBIT_CARD = 'debit_card',
  WALLET = 'wallet',
}

registerEnumType(PaymentMethod, {
  name: 'PaymentMethod',
  description: 'Detailed PaymentMethod in the system',
});

registerEnumType(PaymentStatus, {
  name: 'PaymentStatus',
  description: 'Detailed PaymentStatus in the system',
});

registerEnumType(PaymentGateway, {
  name: 'PaymentGateway',
  description: 'Detailed PaymentGateway in the system',
});
