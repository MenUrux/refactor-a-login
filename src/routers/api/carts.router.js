import { Router } from 'express';
import CartModel from '../../models/cart.model.js';


const router = Router();

router.post('/carts', async (req, res) => {
  try {
    const newCart = new CartModel({
      products: []
    });

    await newCart.save();
    res.status(201).json({ cart: newCart });
  } catch (error) {
    res.status(500).json({ message: 'Error al crear el carrito', error: error.message });
  }
});

router.get('/carts', async (req, res) => {
  try {
    const carts = await CartModel.find().populate('products.product');
    res.status(200).json(carts);
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener los carritos', error: error.message });
  }
});

router.get('/carts/:cid', async (req, res) => {
  try {
    const cid = req.params.cid;
    const cart = await CartModel.findById(cid).populate('products.product');
    if (!cart) {
      return res.status(404).json({ message: 'Carrito no encontrado' });
    }
    res.json(cart);
  } catch (error) {
    res.status(500).json({ message: 'Error interno del servidor', error: error.message });
  }
});


router.put('/carts/:cid', async (req, res) => {
  try {
    const { cid } = req.params;
    const { productId, quantity } = req.body;

    const cart = await CartModel.findById(cid);
    if (!cart) {
      return res.status(404).json({ message: 'Carrito no encontrado' });
    }

    const productIndex = cart.products.findIndex(p => p.product && p.product.toString() === productId);

    if (productIndex >= 0) {
      const existingQuantity = cart.products[productIndex].quantity || 0;
      cart.products[productIndex].quantity = existingQuantity + quantity;
    } else {
      cart.products.push({ product: productId, quantity });
    }

    await cart.save();

    const carts = await CartModel.find().populate('products.product');

    res.status(200).json({ cart });
  } catch (error) {
    console.error('Error al agregar producto al carrito:', error);
    res.status(500).json({ message: 'Error al agregar producto al carrito', error: error.message });
  }
});




router.delete('/carts/:cid/products/:pid', async (req, res) => {
  try {
    const { cid, pid } = req.params;
    await CartModel.updateOne({ _id: cid }, { $pull: { products: { product: pid } } });
    res.status(200).json({ message: 'Producto eliminado del carrito' });
  } catch (error) {
    res.status(500).json({ message: 'Error al eliminar producto', error: error.message });
  }
});


router.delete('/carts/:cid', async (req, res) => {
  try {
    const { cid } = req.params;
    await CartModel.updateOne({ _id: cid }, { $set: { products: [] } });
    res.status(200).json({ message: 'Productos eliminados del carrito' });
  } catch (error) {
    res.status(500).json({ message: 'Error al eliminar productos', error: error.message });
  }
});

export default router;




