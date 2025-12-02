import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { I18nService } from 'nestjs-i18n';
import { CartResponse } from './../dtos/cartResponse';
import { Repository } from 'typeorm';
import { CartItem } from '../entities/cartItem.enitty';
import { Cart } from '../entities/cart.entity';
import { Transactional } from 'typeorm-transactional';
import { DefaultCartPricingStrategy } from '../strategy/cart.strategy';
import { CartItemFactory } from '../factories/cartItem.factory';
import { CartFactory } from '../factories/cart.factory';
import { CartIdInput } from '../inputs/cartId.input';
import { CourseClientService } from 'src/modules/course/courseClient.service';
import { CourseIdInput } from '../dtos/courseId.input';

@Injectable()
export class CartFascade {
  constructor(
    private readonly i18n: I18nService,
    private readonly courseProxy: CourseClientService,
    private readonly pricingStrategy: DefaultCartPricingStrategy,
    @InjectRepository(Cart)
    private readonly cartRepository: Repository<Cart>,
    @InjectRepository(CartItem)
    private readonly cartItemRepository: Repository<CartItem>,
  ) {}

  @Transactional()
  async addToCart(
    userId: string,
    courseIdInput: CourseIdInput,
  ): Promise<CartResponse> {
    const courseId = courseIdInput.courseId;

    const course = await this.courseProxy.findById(courseId);

    let userCart = await this.getOrCreateUserCart(userId);

    const existingItem = userCart.cartItems?.find(
      (item) => item.courseId === courseId,
    );

    if (existingItem) {
      throw new BadRequestException(
        await this.i18n.t('cart.ALREADY_IN_CART', {
          args: { title: course.title },
        }),
      );
    }

    const newItem = CartItemFactory.create(userCart.id, courseId, course.price);
    await this.cartItemRepository.save(newItem);

    userCart.cartItems.push(newItem);

    await this.recalculateCartTotal(userCart);

    return {
      data: await this.getFullCart(userId),
      statusCode: 201,
      message: await this.i18n.t('cart.ITEM_ADDED'),
    };
  }

  @Transactional()
  async deleteCart(
    userId: string,
    cartIdInput: CartIdInput,
  ): Promise<CartResponse> {
    const { cartId } = cartIdInput;

    const cart = await this.cartRepository.findOne({
      where: { id: cartId, userId },
      relations: ['cartItems'],
    });

    if (!cart) throw new NotFoundException(await this.i18n.t('cart.NOT_FOUND'));

    await this.cartItemRepository.remove(cart.cartItems);
    await this.cartRepository.remove(cart);

    return {
      data: null,
      message: await this.i18n.t('cart.DELETED_CART', {
        args: { id: cartId },
      }),
    };
  }

  @Transactional()
  async emptyCart(userId: string): Promise<CartResponse> {
    const userCart = await this.getUserCartWithItems(userId);
    await this.cartItemRepository.remove(userCart.cartItems);
    userCart.totalPrice = 0;
    await this.cartRepository.save(userCart);

    return {
      data: userCart,
      message: await this.i18n.t('cart.EMPTY'),
    };
  }

  // Private Methods

  private async getUserCartWithItems(userId: string): Promise<Cart> {
    const cart = await this.cartRepository.findOne({
      where: { userId },
      relations: ['cartItems'],
    });

    if (!cart) throw new NotFoundException(await this.i18n.t('cart.NOT_FOUND'));

    return cart;
  }

  private async getFullCart(userId: string): Promise<Cart> {
    return this.cartRepository.findOne({
      where: { userId },
      relations: ['cartItems', 'cartItems.course'],
    });
  }

  private async recalculateCartTotal(cart: Cart): Promise<void> {
    const items = await this.cartItemRepository.find({
      where: { cartId: cart.id },
    });
    cart.totalPrice = this.pricingStrategy.calculate(items);
    await this.cartRepository.save(cart);
  }

  private async getOrCreateUserCart(userId: string): Promise<Cart> {
    let cart = await this.cartRepository.findOne({
      where: { userId },
      relations: ['cartItems'],
    });

    if (!cart) {
      cart = CartFactory.create(userId);
      await this.cartRepository.save(cart);
    }

    return cart;
  }
}
