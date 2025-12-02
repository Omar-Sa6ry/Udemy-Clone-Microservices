import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { CartItemsResponse } from './dtos/cartItem.dto';
import { TotalCartsResponse } from './dtos/totalCarts.dto';
import { CartItem } from './entities/cartItem.enitty';
import { CartResponse } from './dtos/cartResponse';
import { CartProxy } from './proxy/Cart.proxy';
import { CartFascade } from './fascade/cart.fascade';
import { CartIdInput } from './inputs/cartId.input';
import { CourseIdInput } from './dtos/courseId.input';

@Injectable()
export class CartService {
  constructor(
    private readonly cartProxy: CartProxy,
    private readonly cartFascade: CartFascade,

    @InjectRepository(CartItem)
    private readonly cartItemRepository: Repository<CartItem>,
  ) {}

  async addToCart(
    userId: string,
    courseIdInput: CourseIdInput,
  ): Promise<CartResponse> {
    return this.cartFascade.addToCart(userId, courseIdInput);
  }

  async deleteCart(
    userId: string,
    cartIdInput: CartIdInput,
  ): Promise<CartResponse> {
    return this.cartFascade.deleteCart(userId, cartIdInput);
  }

  async emptyCart(userId: string): Promise<CartResponse> {
    return this.cartFascade.emptyCart(userId);
  }

  async checkTotalCart(userId: string): Promise<TotalCartsResponse> {
    return this.cartProxy.checkTotalCart(userId);
  }

  async findCart(userId: string): Promise<CartResponse> {
    return this.cartProxy.findCart(userId);
  }

  async findCartItems(
    cartIdInput: CartIdInput,
    userId: string,
  ): Promise<CartItemsResponse> {
    return this.cartProxy.findCartItems(cartIdInput, userId);
  }

  // ========== RESOLVER FIELD ==========

  async getCartItemsByCartId(cartId: string): Promise<CartItem[]> {
    const cartItems = await this.cartItemRepository.find({
      where: { cartId },
      relations: ['product', 'details'],
    });

    return cartItems;
  }
}
