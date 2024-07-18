const express = require('express');
const multer = require('multer');
const path = require('path');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 8000;

// ------------||Serve static files from the 'uploads' directory||----------------------
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

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
    phoneNumber: {
      type: String,
      required: true
    },
    balance: {
      type: Number,
      default: 0
    },
    advancePoints: {
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
      default: 'Buisness Member'
    },
    parent: {
      type: mongoose.Schema.Types.ObjectId,
      default: null
    }, // Reference to the parent (referrer)
    refPer: {
      type: Number,
      required: true
    },
    refParentPer: {
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

//------------------------||Training Bonus Approval Queue||--------------------------

const TrainingBonusApprovalSchema = new mongoose.Schema(
  {
    username: { type: String, required: true },
    transactionId: { type: String, required: true },
    transactionAmount: { type: Number, required: true },
    gateway: { type: String, required: true },
    imagePath: { type: String, required: true },
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
    cb(null, '../uploads/training-bonus'); // Uploads folder where files will be stored
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
      imagePath: imagePath
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
      refPer: user.refPer,
      refParentPer: user.refParentPer
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
    refPer: { type: Number, required: true },
    refParentPer: { type: Number, required: true },
    referrerPin: { type: String, required: true, unique: true },
    imagePath: { type: String, required: true },
    status: { type: String, default: 'pending' }
  },
  { timestamps: true }
);
const ReferralPaymentVerification = mongoose.model('ReferralPaymentVerification', referralPaymentSchema);

// Multer storage configuration
const referralStorage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, '../uploads/referral-plan-payment'); // Upload directory for referral payments
  },
  filename: function (req, file, cb) {
    const ext = path.extname(file.originalname);
    cb(null, file.fieldname + '-' + Date.now() + ext);
  }
});

const uploadReferral = multer({ storage: referralStorage });

//----------------------|| POST route to handle payment verification upload||-------------------

// Function to generate a unique pin
const generateUniquePin = async () => {
  let pin;
  let isUnique = false;

  while (!isUnique) {
    pin = Math.random().toString(36).substring(2, 12); // Generate a random 10-character string
    const existingPin = await ReferralPaymentVerification.findOne({ referrerPin: pin });
    if (!existingPin) {
      isUnique = true;
    }
  }

  return pin;
};

app.post('/api/referral-payment/upload', uploadReferral.single('image'), async (req, res) => {
  try {
    // Generate a unique referrer pin
    const referrerPin = await generateUniquePin();
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
      refPer: req.body.parent,
      refParentPer: req.body.grandParent,
      referrerPin: referrerPin, // Add referrer pin
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

const userPendingSchema = new mongoose.Schema(
  {
    planName: { type: String, required: true },
    planPRICE: { type: Number, required: true },
    advancePoints: { type: Number, required: true },
    DirectPoint: { type: Number, required: true },
    IndirectPoint: { type: Number, required: true },
    refPer: { type: Number, required: true },
    refParentPer: { type: Number, required: true },
    referrerPin: { type: String, required: true, unique: true },
    referrerId: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'User' }
  },
  { timestamps: true }
);

const UserPending = mongoose.model('UserPending', userPendingSchema);

// ]-----------------------||Endpoint for user signup||------------------------[

app.post('/api/signup', async (req, res) => {
  const { fullName, username, email, password, phoneNumber, referrerPin } = req.body;

  try {
    // Check if referrerPin exists in UserPending
    const userPending = await UserPending.findOne({ referrerPin });
    if (!userPending) {
      return res.status(400).json({ success: false, message: 'Invalid referrer PIN' });
    }

    // Check if the email or username already exists in the User model
    const existingUser = await User.findOne({ $or: [{ email }, { username }] });
    if (existingUser) {
      return res.status(400).json({ success: false, message: 'Email or username already taken' });
    }

    // Create a new user based on the form data and UserPending document
    const newUser = new User({
      fullName,
      username,
      email,
      password,
      phoneNumber,
      plan: userPending.planName,
      rank: '',
      refPer: userPending.refPer,
      refParentPer: userPending.refParentPer,
      parent: userPending.referrerId,
      advancePoints: userPending.advancePoints,
      // Initialize other fields as needed
      balance: 0,
      totalPoints: 0,
      directPoints: 0,
      indirectPoints: 0,
      trainingBonusBalance: 0
    });

    // Save the new user to the database
    await newUser.save();
    await UserPending.findByIdAndRemove(userPending.id);

    // Respond with success
    res.status(201).json({ success: true, message: 'User registered successfully!' });
  } catch (error) {
    console.error('Error during registration:', error);
    res.status(500).json({ success: false, message: 'Server error. Please try again later.' });
  }
});

// ]----------------------------||Get Total Balance||-----------------------------[

app.get('/api/user/:username', async (req, res) => {
  try {
    const username = req.params.username;
    const user = await User.findOne({ username }).exec();

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.status(200).json({ balance: user.balance });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
});