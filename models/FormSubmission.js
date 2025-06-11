const mongoose = require('mongoose');

const FormSchema = new mongoose.Schema({
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
}, { timestamps: true });

module.exports = mongoose.model('FormSubmission', FormSchema);
