const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config();

const app = express();
const port = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

// MongoDB Connection
const uri = process.env.MONGODB_URI;
if (!uri) {
    console.error("MongoDB URI is not defined in .env file.");
    process.exit(1); // Exit if URI is not defined
}

mongoose.connect(uri)
    .then(() => console.log('Connected to MongoDB'))
    .catch(err => {
        console.error('Could not connect to MongoDB:', err);
        process.exit(1); // Exit if connection fails
    });

// --- Doctor Schema and Model ---
const doctorSchema = new mongoose.Schema({
    name: { type: String, required: true },
    specialty: { type: String, required: true },
    experience: { type: Number, required: true },
    location: { type: String, required: true },
    rating: { type: Number, required: true },
    reviews: { type: Number, required: true },
    imageUrl: { type: String, required: true },
    hospital: { type: String, required: true },
    available: { type: Boolean, required: true },
    fees: { type: Number, required: true },
});

const Doctor = mongoose.model('Doctor', doctorSchema);

// --- API Endpoints ---

// 1. Add a new doctor
app.post('/api/doctors/add-doctor', async (req, res) => {
    try {
        const newDoctor = new Doctor(req.body);
        await newDoctor.save();
        res.status(201).json({ message: 'Doctor added successfully', doctor: newDoctor });
    } catch (error) {
        console.error('Error adding doctor:', error);
        res.status(500).json({ error: 'Failed to add doctor', details: error });
    }
});

// 2. List doctors with filters and pagination
app.get('/api/doctors', async (req, res) => {
    try {
        const { page = 1, pageSize = 10, specialty, location, availability, rating, sort } = req.query;
        const pageNumber = parseInt(page as string);
        const pageSizeNumber = parseInt(pageSize as string);

        // Build filter object
        const filters: any = {};
        if (specialty) filters.specialty = specialty;
        if (location) filters.location = location;
        if (availability) filters.available = availability === 'true'; // Convert to boolean
        if (rating) filters.rating = { $gte: parseFloat(rating as string) };

        // Build sort object
        let sortOptions: any = {};
        if (sort === 'rating') sortOptions = { rating: -1 };
        else if (sort === 'experience') sortOptions = { experience: -1 };
        else if (sort === 'fees-asc') sortOptions = { fees: 1 };
        else if (sort === 'fees-desc') sortOptions = { fees: -1 };

        const skip = (pageNumber - 1) * pageSizeNumber;

        const doctors = await Doctor.find(filters)
            .sort(sortOptions)
            .skip(skip)
            .limit(pageSizeNumber);

        const total = await Doctor.countDocuments(filters);

        res.json({ doctors, total });
    } catch (error: any) {
        console.error('Error fetching doctors:', error);
        res.status(500).json({ error: 'Failed to fetch doctors', details: error.message });
    }
});

// --- Start the server ---
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
