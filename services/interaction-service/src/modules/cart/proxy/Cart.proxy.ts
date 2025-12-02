import { Repository } from 'typeorm';
import { Cart } from '../entities/cart.entity';
import { TotalCartsResponse } from '../dtos/totalCarts.dto';
import { NotFoundException } from '@nestjs/common';
import { I18nService } from 'nestjs-i18n';
import { CartItemsResponse } from '../dtos/cartItem.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { CartItem } from '../entities/cartItem.enitty';
import { CartResponse } from '../dtos/cartResponse';
import { CartIdInput } from '../inputs/cartId.input';

export class CartProxy {
  constructor(
    private readonly i18n: I18nService,

    @InjectRepository(Cart)
    private readonly cartRepository: Repository<Cart>,
    @InjectRepository(CartItem)
    private readonly cartItemRepository: Repository<CartItem>,
  ) {}

  async checkTotalCart(userId: string): Promise<TotalCartsResponse> {
    const carts = await this.cartRepository.find({
      where: { userId },
      relations: ['cartItems'],
    });

    if (carts.length === 0) {
      throw new NotFoundException(
        await this.i18n.t('cart.NOT_FOUND', { args: { id: userId } }),
      );
    }

    const total = carts.reduce((acc, cart) => {
      const price =
        typeof cart.totalPrice === 'string'
          ? parseFloat(cart.totalPrice)
          : cart.totalPrice;
      return acc + price;
    }, 0);

    return { data: parseFloat(total.toFixed(2)) };
  }

  async findCart(userId: string): Promise<CartResponse> {
    const cart = await this.cartRepository.findOne({
      where: { userId },
      relations: ['cartItems', 'cartItems.course'],
    });

    return { data: cart };
  }

  async findCartItems(
    cartIdInput: CartIdInput,
    userId: string,
  ): Promise<CartItemsResponse> {
    const items = await this.cartItemRepository.find({
      where: { cartId: cartIdInput.cartId, cart: { userId } },
      relations: ['course'],
    });

    return { items: items || [] };
  }
}
