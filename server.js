const express = require('express');
const multer = require('multer');
const { v4: uuidv4 } = require('uuid');
const path = require('path');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 8000;

console.log('Attempting to start server on port:', PORT);

// Connect to MongoDB
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log('MongoDB connected successfully'))
  .catch((err) => console.error('MongoDB connection error:', err));

// Your middleware and routes go here

app.listen(PORT, (err) => {
  if (err) {
    console.error('Error starting server:', err);
  } else {
    console.log(`Server is running on port ${PORT}`);
  }
});

// Close the Mongoose connection if the Node process ends
process.on('SIGINT', () => {
  mongoose.connection.close(() => {
    console.log('Mongoose connection disconnected through app termination');
    process.exit(0);
  });
});
app.use(bodyParser.json());
app.use(cors());

const userSchema = new mongoose.Schema(
  {
    fullName: {
      type: String,
      required: true,
      trim: true
    },
    username: {
      type: String,
      required: true,
      unique: true,
      trim: true
    },
    password: {
      type: String,
      required: true
    },
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true
    },
    balance: {
      type: Number,
      default: 0
    },
    totalPoints: {
      type: Number,
      default: 0
    },
    directPoints: {
      type: Number,
      default: 0
    },
    indirectPoints: {
      type: Number,
      default: 0
    },
    trainingBonusBalance: {
      type: Number,
      default: 0
    },
    plan: {
      type: String,
      required: true
    },
    rank: {
      type: String,
      required: true
    },
    parent: {
      type: Number,
      required: true
    },
    grandParent: {
      type: Number,
      required: true
    }
  },
  {
    timestamps: true // Automatically adds createdAt and updatedAt timestamps
  }
);

const User = mongoose.model('User', userSchema);

// -----------------------||Get full name of user||---------------------------
app.get('/api/users/fullname/:username', async (req, res) => {
  try {
    const user = await User.findOne({ username: req.params.username });
    if (!user) {
      return res.status(404).send('User not found');
    }
    res.send({ fullName: user.fullName });
  } catch (err) {
    res.status(500).send(err);
  }
});

// ]----------------------||Authentication Endpoint||--------------------------------[

app.post('/api/authenticate', async (req, res) => {
  const { usernameOrEmail, password } = req.body;

  try {
    const user = await User.findOne({
      $or: [{ username: usernameOrEmail }, { email: usernameOrEmail }],
      password: password
    });

    if (user) {
      res.json({ success: true, username: user.username });
    } else {
      res.json({ success: false });
    }
  } catch (error) {
    console.error('Error during authentication:', error);
    res.status(500).json({ success: false, error: 'Server error' });
  }
});

// ]-------------------------||Registration Endpoint||---------------------------[

app.post('/api/signup', async (req, res) => {
  const formData = req.body;

  try {
    // Check if the user already exists based on some unique identifier (e.g., username)
    const existingUser = await User.findOne({ username: formData.username });

    if (existingUser) {
      // User with this username already exists
      return res.json({ success: false, message: 'User with this username already exists.' });
    }

    // Check the authenticationPin against the sellerPin from the Admin model
    const admin = await Admin.findOne({ authenticationPin: formData.authenticationPin });

    if (admin) {
      // If the authenticationPin matches, create a new user record and save it to the database
      const newUser = new User({
        username: formData.username,
        email: formData.email,
        cnicNumber: formData.cnicNumber,
        accountNumber: formData.accountNumber,
        bankName: formData.bankName,
        authenticationPin: formData.authenticationPin,
        password: formData.password
      });
      await newUser.save();
      return res.json({ success: true, message: 'User registered successfully.' });
    } else {
      // AuthenticationPin does not match any authenticationPin in the Admin model
      return res.json({ success: false, message: 'Authentication failed. Please check your pin.' });
    }
  } catch (error) {
    console.error('Error during registration:', error);
    return res.status(500).json({ success: false, error: 'Server error' });
  }
});

//------------------------||Training Bonus Approval Queue||--------------------------

const TrainingBonusApprovalSchema = new mongoose.Schema(
  {
    username: { type: String, required: true },
    transactionId: { type: String, required: true },
    transactionAmount: { type: Number, required: true },
    gateway: { type: String, required: true },
    image: { type: String, required: true },
    status: { type: String, default: 'pending' }
  },
  {
    timestamps: true // Automatically adds createdAt and updatedAt timestamps
  }
);

const TrainingBonusApproval = mongoose.model('TrainingBonusApproval', TrainingBonusApprovalSchema);

// Multer storage configuration
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/'); // Uploads folder where files will be stored
  },
  filename: function (req, file, cb) {
    const ext = path.extname(file.originalname);
    cb(null, file.fieldname + '-' + Date.now() + ext);
  }
});

// Multer file filter
const fileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith('image/')) {
    cb(null, true);
  } else {
    cb(new Error('Only image files are allowed!'), false);
  }
};

// Multer upload instance
const upload = multer({ storage: storage, fileFilter: fileFilter });

app.use(express.json());

// -----------||POST route for uploading training bonus data||---------------

app.post('/api/training-bonus/upload', upload.single('image'), async (req, res) => {
  try {
    const { username, transactionId, transactionAmount, gateway } = req.body;

    // Construct the file path for the uploaded image
    const imagePath = req.file.path;

    // Create new TrainingBonusApproval document
    const newApproval = new TrainingBonusApproval({
      username,
      transactionId,
      transactionAmount: Number(transactionAmount),
      gateway,
      image: imagePath
    });

    // Save the new document to MongoDB
    await newApproval.save();

    res.status(201).json({ message: 'Training bonus approval data uploaded successfully.' });
  } catch (err) {
    console.error('Error uploading training bonus data:', err);
    res.status(500).json({ error: 'Internal server error.' });
  }
});
//       ]------------------------||Investment Plans Model||----------------------------[

const planSchema = new mongoose.Schema({
  name: { type: String, required: true },
  price: { type: Number, required: true },
  advancePoints: { type: Number, required: true },
  DirectPoint: { type: Number, required: true },
  IndirectPoint: { type: Number, required: true },
  parent: { type: Number, required: true },
  grandParent: { type: Number, required: true }
});
const Plan = mongoose.model('Plan', planSchema);

//      ]---------------------GET all Plans Documents-----------------------[

app.get('/api/plans', async (req, res) => {
  try {
    const plans = await Plan.find();
    res.json(plans);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ]-------------------||Get Profile Data by username from User Model||-------------------------[

app.get('/api/users/:username', async (req, res) => {
  try {
    const user = await User.findOne({ username: req.params.username });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json({
      fullName: user.fullName,
      rank: user.rank,
      plan: user.plan,
      parent: user.parent,
      grandParent: user.grandParent
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Define schema for ReferralPaymentVerification
const referralPaymentSchema = new mongoose.Schema(
  {
    username: { type: String, required: true },
    transactionId: { type: String, required: true },
    transactionAmount: { type: Number, required: true },
    gateway: { type: String, required: true },
    planName: { type: String, required: true },
    planPRICE: { type: Number, required: true },
    advancePoints: { type: Number, required: true },
    DirectPoint: { type: Number, required: true },
    IndirectPoint: { type: Number, required: true },
    parent: { type: String, required: true },
    grandParent: { type: String, required: true },
    imagePath: { type: String, required: true }
  },
  { timestamps: true }
);
const ReferralPaymentVerification = mongoose.model('ReferralPaymentVerification', referralPaymentSchema);

// Multer storage configuration
const referralStorage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, 'uploads/referral')); // Upload directory for referral payments
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}${path.extname(file.originalname)}`;
    cb(null, `${uuidv4()}-${uniqueSuffix}`);
  }
});

const uploadReferral = multer({ storage: referralStorage });

// POST route to handle payment verification upload
app.post('/api/referral-payment/upload', uploadReferral.single('image'), async (req, res) => {
  try {
    // Create a new ReferralPaymentVerification instance
    const newPayment = new ReferralPaymentVerification({
      username: req.body.username,
      transactionId: req.body.transactionId,
      transactionAmount: req.body.transactionAmount,
      gateway: req.body.gateway,
      planName: req.body.planName,
      planPRICE: req.body.planPRICE,
      advancePoints: req.body.advancePoints,
      DirectPoint: req.body.DirectPoint,
      IndirectPoint: req.body.IndirectPoint,
      parent: req.body.parent,
      grandParent: req.body.grandParent,
      imagePath: req.file.path // Store path to uploaded image
    });

    // Save to MongoDB
    await newPayment.save();

    // Respond with success message
    res.status(201).json({ message: 'Payment verification details saved successfully.' });
  } catch (error) {
    console.error('Error saving payment verification:', error);
    res.status(500).json({ error: 'Failed to save payment verification details.' });
  }
});
// User Accounts Model
const userAccountsSchema = new mongoose.Schema(
  {
    username: { type: String, required: true },
    gateway: { type: String, required: true },
    accountNumber: { type: String, required: true },
    accountTitle: { type: String, required: true }
  },
  { timestamps: true }
);

const UserAccounts = mongoose.model('UserAccounts', userAccountsSchema);

// ------------------||POST route to add user payment account||------------------------

app.post('/api/user-accounts/add', async (req, res) => {
  const { username, gateway, accountNumber, accountTitle } = req.body;

  try {
    // Create a new UserAccounts instance
    const newUserAccount = new UserAccounts({
      username,
      gateway,
      accountNumber,
      accountTitle
    });

    // Save to MongoDB
    await newUserAccount.save();

    // Respond with success message
    res.status(201).json({ message: 'Account added successfully.' });
  } catch (error) {
    console.error('Error adding account:', error);
    res.status(500).json({ error: 'Failed to add account.' });
  }
});

// ]-------------------||GET route to fetch user accounts by username||----------------------[

app.get('/api/user-accounts/:username', async (req, res) => {
  const { username } = req.params;

  try {
    const accounts = await UserAccounts.find({ username });
    res.status(200).json(accounts);
  } catch (error) {
    console.error('Error fetching accounts:', error);
    res.status(500).json({ error: 'Failed to fetch accounts.' });
  }
});
