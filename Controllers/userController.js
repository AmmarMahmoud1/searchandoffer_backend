const User = require("../Models/User");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const config = require("../config");

const signUp = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      throw new Error("Please add all fields");
    }
    const existUser = await User.findOne({ email });

    if (existUser) {
      res.status(400);
      throw new Error("Profile already exists");
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create user
    const user = await User.create({
      name,
      email,
      password: hashedPassword,
    });
    let token = jwt.sign({ userId: user._id }, config.secretKey);
    res
      .cookie("token", token, {
        httpOnly: true,
        maxAge: 1000 * 60 * 60,
        sameSite: "none",
        secure: true,
      })
      .sendStatus(201);
  } catch (error) {
    next(error);
  }
};

updateUser = async (req, res) => {
  const body = req.body;
  if (!body) {
    return res.status(400).json({
      success: false,
      message: "Please choose a profile to update",
    });
  }

  User.findOne({ _id: req.params.id }, (err, user) => {
    if (err) {
      return res.status(404).json({
        err,
        message: "Profile not found!",
      });
    }
    user.name = body.name;
    user.email = body.email;
    user.password = body.password;
    user
      .save()
      .then(() => {
        return res.status(200).json({
          success: true,
          id: user._id,
          message: "User updated!",
        });
      })
      .catch((error) => {
        return res.status(404).json({
          error,
          message: "Profile not updated!",
        });
      });
  });
};

deleteUser = async (req, res) => {
  await User.findOneAndDelete({ _id: req.params.id }, (err, user) => {
    if (err) {
      return res.status(400).json({ success: false, error: err });
    }

    if (!user) {
      return res
        .status(404)
        .json({ success: false, error: `Profile not found` });
    }

    return res.status(200).json({ success: true, data: profile });
  }).catch((err) => console.log(err));
};

const login = async (req, res, next) => {
  const { email, password } = req.body;
  

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }
    console.log(user);
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: "Invalid password." });
    }

   let token = jwt.sign({ userId: user._id }, config.secretKey);
   // Set the appropriate CORS headers
  res.setHeader('Access-Control-Allow-Credentials', 'true');

  res.cookie("token", token, {
        maxAge: 1000 * 60 * 60,
        secure: true,
        sameSite: 'None',
        httpOnly:true,

        
      }).sendStatus(200);
  } catch (error) {
    next(error);
  }
};

const getMe = async (req, res, next) => {
  try {
    const findUser = await User.findById(req.userId);
    res.status(200).json(findUser);
  } catch (error) {
    next(error);
  }
};

const getOneUser = async (req, res, next) => {
  const id = req.params.id;
  try {
    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({ success: false, error: 'User not found' });
    }
    res.status(200).json(user);
  } catch (error) {
    if (error.name === 'CastError') {
      return res.status(400).json({ success: false, error: 'Invalid user ID' });
    }
    next(error);
  }
};

const logout = (req, res, next) => {
  try {
    res
      .clearCookie("token", { path: "/", sameSite: "none", secure: true })
      .sendStatus(200);
  } catch (error) {
    next(error);
  }
};

// Generate JWT
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: "30d",
  });
};

module.exports = {
  signUp,
  getMe,
  getOneUser,
  login,
  logout,
};
