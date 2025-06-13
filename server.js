const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const multer = require('multer');
const fs = require('fs');
const path = require('path');
const saveToExcel = require('./saveToExcel');
require('dotenv').config();

const FormSubmission = require('./models/FormSubmission');

const app = express();

app.use(cors());
app.use(express.json());

const uploadsDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir);
}

const upload = require('./config/multer');

app.use('/uploads', express.static('uploads'));


// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => console.log("MongoDB connected"))
  .catch(err => console.error("Mongo Error:", err));

// POST endpoint to receive form data
app.post('/submit', upload.single('profileImage'), async (req, res) => {
  try {
    const formFields = JSON.parse(req.body.formData);

    const { firstName, lastName, email } = formFields;

    const existingUser = await FormSubmission.findOne({ email: email.toLowerCase().trim() });
    if (existingUser) {
      return res.status(409).json({ message: "User with this email already exists" });
    }

    // 1. Generate office email
    const base = `${firstName.toLowerCase()}.${lastName.toLowerCase()}`;
    const domain = "faucek.com";
    const count = await FormSubmission.countDocuments({
      firstName: new RegExp(`^${firstName}$`, 'i'),
      lastName: new RegExp(`^${lastName}$`, 'i')
    });

    let suffix = "";
    if (count > 1) {
      suffix = String(count).padStart(2, '0'); // e.g., 01, 02
    }

    suffix = String(count).padStart(2, '0');
    const officeEmail = `${base}${suffix}@${domain}`;

    // 2. Generate employee ID
    const totalUsers = await FormSubmission.countDocuments();
    const employeeId = `FAC-EMP-${String(totalUsers).padStart(3, '0')}`;

    // 3. Create new submission
    const newSubmission = new FormSubmission({
      ...formFields,
      profileImage: req.file?.path || "",
      officeEmail: officeEmail,
      employeeId: employeeId
    });

    await newSubmission.save();

    /*
    firstName: String,
    lastName: String,
    email: String,
    phone: String,
    city: String,
    profileImage: String, // You'll need to handle file uploads separately
    heardFrom: String,
    selectedRole: String,
    futureVision: String,
    onboardingExperience: String,
    officeEmail: String,
    employeeId: String,
    */

    saveToExcel({
      firstName,
      lastName,
      email,
      phone:formFields.phone,
      city:formFields.city,
      officeEmail: officeEmail,
      employeeId: employeeId,
      profileImage: req.file?.path || "",
      heardFrom:formFields.heardFrom,
      selectedRole:formFields.selectedRole,
      futureVision:formFields.futureVision,
      onboardingExperience:formFields.onboardingExperience,
      createdAt: new Date().toISOString()
    });

    res.status(200).json({ message: "Form submitted successfully!", officeEmail, employeeId });

  } catch (error) {
    console.error("Submit error:", error);
    res.status(500).json({ message: "Failed to submit form" });
  }
});


// Get all form submissions
// app.get('/submissions', async (req, res) => {
//   try {
//     const submissions = await FormSubmission.find().sort({ createdAt: -1 });
//     res.json(submissions);
//   } catch (error) {
//     console.error("Fetch error:", error);
//     res.status(500).json({ message: "Failed to fetch submissions" });
//   }
// });

app.post("/api/generate-email", async (req, res) => {
  const { firstName, lastName } = req.body;

  const base = `${firstName.toLowerCase()}.${lastName.toLowerCase()}`;
  const domain = "faucek.com";

  try {
    // Count how many users have the same first and last name
    const count = await FormSubmission.countDocuments({
      firstName: new RegExp(`^${firstName}$`, 'i'),
      lastName: new RegExp(`^${lastName}$`, 'i')
    });

    // Generate email with count + 1
    let suffix = "";
    if (count > 1) {
      suffix = String(count).padStart(2, '0'); // e.g., 01, 02
    }
    const finalEmail = `${base}${suffix}@${domain}`;

    res.json({ email: finalEmail, count });
  } catch (err) {
    console.error("Email generation error:", err);
    res.status(500).json({ error: "Failed to generate email" });
  }
});


app.get("/api/generate-empid", async (req, res) => {
  try {
    const count = await FormSubmission.countDocuments();
    const newId = `FAC-EMP-${String(count).padStart(3, '0')}`;
    res.json({ employeeId: newId });
  } catch (err) {
    console.error("Employee ID generation error:", err);
    res.status(500).json({ error: "Failed to generate employee ID" });
  }
});


const exportPath = path.join(__dirname, 'exports', 'form_submissions.xlsx');

app.get('/download-submissions', (req, res) => {
    if (fs.existsSync(exportPath)) {
        res.download(exportPath, 'form_submissions.xlsx', (err) => {
            if (err) {
                console.error("Download error:", err);
                res.status(500).send("Failed to download file");
            }
        });
    } else {
        res.status(404).send("File not found");
    }
});

app.get('/',(req,res)=>{
  res.send("Hello")
})


const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
