import { CartItem } from '../entities/cartItem.enitty';
import { ICartPricingStrategy } from '../interfaces/ICartPricingStrategy.interface';

export class DefaultCartPricingStrategy implements ICartPricingStrategy {
  calculate(items: CartItem[]): number {
    return items.reduce(
      (acc, item) => acc + parseFloat(item.totalPrice.toString()),
      0,
    );
  }
}
