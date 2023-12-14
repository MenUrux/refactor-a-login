import { Router } from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import ProductsManager from '../../dao/Products.manager.js';
import { __dirname } from '../../utils.js';

const router = Router();

// Verifica si la carpeta 'uploads/' existe, si no, la crea
const uploadsDir = path.join(__dirname, '../public/uploads/');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// Configuración de Multer
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadsDir); // Usa la ruta verificada y creada para Multer
  },
  filename: function (req, file, cb) {
    cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
  }
});

const upload = multer({ storage: storage });


// Ruta POST para agregar un nuevo producto
router.post('/products', upload.single('thumbnail'), async (req, res) => {
  try {
    let relativePath = '';

    // Verificar si se cargó un archivo
    if (req.file) {
      relativePath = path.relative(path.join(__dirname, '../public'), req.file.path);
    }

    const newProductData = {
      title: req.body.title,
      description: req.body.description,
      category: req.body.category,
      price: req.body.price,
      code: req.body.code,
      stock: req.body.stock,
      thumbnail: relativePath
    };

    const newProduct = await ProductsManager.create(newProductData);
    res.redirect('/products');
  } catch (error) {
    res.status(500).send(error.message);
  }
});


export default router;
