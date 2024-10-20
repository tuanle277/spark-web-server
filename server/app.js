const path = require('path');
const cors = require('cors');
const express = require('express');
const multer = require('multer');
const pdfParse = require('pdf-parse');
const app = express();
const port = 8000;

app.use(cors());

// Set up multer for file uploads
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/');
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname)); // Append file extension
    },
});

const upload = multer({ dest: 'uploads/' });

// Route to upload syllabus
app.post('/upload-syllabus', upload.single('syllabus'), (req, res) => {
    res.json({ message: 'Syllabus uploaded', file: req.file });
});

// Route to upload files for each week
app.post('/upload-week/:week', upload.array('files', 30), (req, res) => {
    res.json({ message: `Files uploaded for ${req.params.week}`, files: req.files });
});


// Set up multer for file uploads

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Endpoint to handle PDF upload and text extraction
app.post('/extract-pdf-text', upload.single('file'), async (req, res) => {
    try {
        const file = req.file;
        if (!file) {
            return res.status(400).send('No file uploaded.');
        }

        // Read the file using pdf-parse
        const dataBuffer = fs.readFileSync(file.path);
        const pdfData = await pdfParse(dataBuffer);

        // Extracted text
        const extractedText = pdfData.text;

        res.json({ text: extractedText });
    } catch (error) {
        console.error('Error extracting text from PDF:', error);
        res.status(500).send('Failed to extract text');
    }
});

app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});