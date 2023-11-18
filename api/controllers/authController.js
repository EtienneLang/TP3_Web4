const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const config = require("../config");
const User = require("../models/user");
const voiture = require("../models/voiture");

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
            const error = new Error("Le nom est requis");
            error.statusCode = 400;
            throw error;
        }
        // On regarde si l'email est fourni
        else if (!email) {
            const error = new Error("Le email est requis");
            error.statusCode = 400;
            throw error;
        }
        // On regarde les mots de passe concordent
        else if (password !== confirmPassword) {
            const error = new Error("Le mot de passe ne correspond pas");
            error.statusCode = 400;
            throw error;
        }
        // On regarde si le nom est entre 3 et 50 caractères
        else if (username.length < 3 || username.length > 50) {
            const error = new Error("Le nom doit être entre 3 et 50 caractères");
            error.statusCode = 400;
            throw error;
        }
        else if (password.length < 6) {
            const error = new Error("Le mot de passe doit être au moins 6 caractères");
            error.statusCode = 400;
            throw error;
        }

        // On regarde si le courriel est déjà utilisé
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            const error = new Error("Ce courriel est déjà utilisé");
            error.statusCode = 400;
            throw error;
        }
        console.log(password)
        // On hash le mot de passe
        const hashedPassword = await bcrypt.hash(password, 15);

        // Création de l'utilisateur
        const user = new User({
            email,
            username,
            password: hashedPassword,
            isValet: false,
            voiture: null,
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
