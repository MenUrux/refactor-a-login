import mongoose from 'mongoose';

export const URI = 'mongodb+srv://developer:PcjZOTpc57vyPSMa@cluster0.qajemn6.mongodb.net/ecommerce?retryWrites=true&w=majority';
// const URI = 'mongodb://localhost:27017/school';

export const init = async () => {
  try {
    await mongoose.connect(URI);
    console.log('Database connected sucessfully 🚀');
  } catch (error) {
    console.error('Ocurrio un error al intenter conectarnos a la base de datos 😨');
  }
}
