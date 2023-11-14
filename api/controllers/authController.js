const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const config = require("../config");
const User = require("../models/user");

exports.login = async (req, res, next) => {
  const { email, password } = req.body;

  try {
    // On regarde si l'email est fourni
    if (!email) {
      const error = new Error("Email is required");
      error.statusCode = 400;
      throw error;
    }

    // On regarde si le mot de passe est fourni
    if (!password) {
      const error = new Error("Password is required");
      error.statusCode = 400;
      throw error;
    }
    // On regarde si l'utilisateur existe
    const user = await User.findOne({ email });
    if (!user) {
      const error = new Error("User not found");
      error.statusCode = 401;
      throw error;
    }
    // On compare les mots de passe
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      const error = new Error("Incorrect password");
      error.statusCode = 401;
      throw error;
    }

    // On génère le token JWT
    const token = jwt.sign(
      {
        userId : user._id,
      },
      config.SECRET_JWT,
      { expiresIn: "24h" }
    );

    return res.status(200).json({ success: true, token: token });
  } catch (error) {
    if (!error.statusCode) {
      error.statusCode = 500;
    }
    next(error);
  }
};

exports.signup = async (req, res, next) => {
    const { email, username, password, confirmPassword } = req.body;

    try {
        // On regarde si le nom est fourni
        if (!username) {
            const error = new Error("Name is required");
            error.statusCode = 400;
            throw error;
        }
        // On regarde si l'email est fourni
        if (!email) {
            const error = new Error("Email is required");
            error.statusCode = 400;
            throw error;
        }
        // On regarde les mots de passe concordent
        if (password !== confirmPassword) {
            const error = new Error("Passwords do not match");
            error.statusCode = 400;
            throw error;
        }

        // On regarde si le courriel est déjà utilisé
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            const error = new Error("User already exists");
            error.statusCode = 400;
            throw error;
        }

        // On hash le mot de passe
        const hashedPassword = await bcrypt.hash(password);

        // Création de l'utilisateur
        const user = new User({
            email,
            username,
            password: hashedPassword,
        });

        // On sauvegarde l'utilisateur
        await user.save();

        const token = jwt.sign(
            {
              userId : user._id,
            },
            config.SECRET_JWT,
            { expiresIn: "24h" }
        );
        return res.status(200).json({ success: true, token : token });
    } catch (error) {
        if (!error.statusCode) {
            error.statusCode = 500;
        }
        next(error);
    }
};
