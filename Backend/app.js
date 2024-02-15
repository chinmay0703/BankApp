import express from 'express';
import mongoose from 'mongoose';
import bodyParser from 'body-parser';
import dotenv from 'dotenv';
import cors from 'cors';
import router from './routes/userRoute.js';
dotenv.config();
const app = express();
const port = process.env.PORT || 3001;
const mongodbURL = process.env.MONGODB_URL;
mongoose.connect(mongodbURL, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log('Connected to MongoDB');
  })
  .catch((err) => {
    console.error('Error connecting to MongoDB:', err);
  });
app.use(cors());
app.use(bodyParser.json());
app.use(router);
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
