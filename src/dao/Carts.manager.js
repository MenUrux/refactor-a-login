import CartModel from '../models/cart.model.js';

export default class CartsManager {
  static async getCart(cid) {
    return await CartModel.findById(cid).populate('products.product');
  }

  static async getById(sid) {
    const cart = await CartModel.findById(sid);
    if (!cart) {
      throw new Error('Cart no encontrado.');
    }
    return cart;
  }

  static async create(data) {
    const cart = await CartModel.create(data);
    console.log(`Cart creado correctamente (${cart._id}).`);
    return cart;
  }

  static async updateById(cid, data) {
    await CartModel.updateOne({ _id: cid }, { $set: data });
    console.log(`Cart actualizado correctamente (${cid}).`);
  }

  static async deleteById(cid) {
    await CartModel.deleteOne({ _id: cid });
    console.log(`Cart eliminado correctamente (${cid}).`);
  }
}