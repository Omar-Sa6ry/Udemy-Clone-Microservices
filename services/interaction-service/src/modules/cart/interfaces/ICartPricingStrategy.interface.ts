import { CartItem } from '../entities/cartItem.enitty';

export interface ICartPricingStrategy {
  calculate(items: CartItem[]): number;
}
