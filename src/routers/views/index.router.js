import { Router } from 'express';
import { buildResponsePaginated } from '../../utils.js';
import ProductModel from '../../models/product.model.js';

const baseUrl = 'http://localhost:8080';
const router = Router();
router.get('/products', async (req, res) => {
  const { limit = 8, page = 1, sort, search } = req.query;

  const criteria = {};
  const options = { limit, page };

  if (sort) {
    options.sort = { price: sort };
  }

  if (search) {
    criteria.category = search;
  }

  try {
    const result = await ProductModel.paginate(criteria, options);
    const data = buildResponsePaginated({ ...result, search, sort }, baseUrl, search);
    res.render('products', { title: 'Productos | Ecommerce', ...data, user: res.user });
  } catch (error) {
    console.error(error);
    res.status(500).send('Error interno del servidor');
  }
});


router.get('/', (req, res) => {
  res.render('index', { title: 'Inicio | Ecommerce', user: res.user });
});

router.get('/chat', async (req, res) => {
  res.render('chat', { title: 'Chat | Ecommerce', user: res.user })
});


router.get('/add-product', (req, res) => {
  if (!req.session.user) {
    return res.redirect('login');
  }
  res.render('addProduct', { title: 'Agregar Producto', user: res.user });
});


export default router;