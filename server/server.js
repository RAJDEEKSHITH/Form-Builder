import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import mongoose from 'mongoose';
import formRoutes from './routes/formRoutes.js';
import responseRoutes from './routes/responseRoutes.js';

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// --- Database Connection ---
mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log('MongoDB Connected'))
    .catch(err => console.error(err));

// --- API Routes ---
app.get("/", (req, res) => {
  res.send("API is running...");
});
app.use('/api/forms', formRoutes);
app.use('/api/responses', responseRoutes);


const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));