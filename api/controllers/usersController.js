const User = require('../models/user');
const Voiture = require('../models/voiture');
const Histo = require('../models/historique');
const config = require('../config');
const url_base = config.URL + ":" + config.PORT;


exports.getUsers = async (req, res, next) => {
  try {
    const users = await User.find({ isValet: false }).populate({
      path: 'voiture',
      match: { isParked: true }
    });

    const filteredUsers = users.filter(user => user.voiture != null);
    if (!filteredUsers.length) {
      const error = new Error('Aucun utilisateur trouvé.');
      error.statusCode = 404;
      throw error;
    }

    res.status(200).json({
      users: filteredUsers
    });
  } catch (err) {
    next(err);
  }
};

exports.getUser = async (req, res, next) => {
  try {
    const userId = req.userId;
    console.log("userId", userId);
    const user = await checkUserExists(userId);
    res.status(200).json({
      user: user
    });
  } catch (err) {
    next(err);
  }
};

exports.getUserById = async (req, res, next) => {
  try {
    const userId = req.params.id;
    const user = await checkUserExists(userId);
    res.status(200).json({
      user: user
    });
  } catch (err) {
    next(err);
  }
};

exports.updateUser = async (req, res, next) => { 
  try {
    const userId = req.params.userId;
    const user = await checkUserExists(userId);
    const { email, username, price } = req.body;
    if (email) {
      user.email = email;
    }
    if (username) {
      user.username = username;
    }
    if (price) {
      user.price = price;
    }
    await user.save();
    res.status(200).json({
      user: user,
      token: req.token
    });
  } catch (err) {
    next(err);
  }
}

exports.updateCar = async (req, res, next) => {
  try {
    const userId = req.params.userId;
    const user = await User.findById(userId).populate('voiture');
    if (!user) {
      const error = new Error('L\'utilisateur n\'existe pas.');
      error.statusCode = 404;
      throw error;
    }
    const { marque, modele, couleur, plaque, latitude, longitude, isParked } = req.body;
    console.log("plaques", plaque);
    if (!user.voiture) {
      const voiture = new Voiture({
        marque: marque,
        modele: modele,
        couleur: couleur,
        plaque: plaque,
        latitude: latitude,
        longitude: longitude,
        isParked: isParked,
      });
      await voiture.save();
      user.voiture = voiture._id;
    } else {
      const voiture = user.voiture;
      voiture.marque = marque || voiture.marque;
      voiture.modele = modele || voiture.modele;
      voiture.couleur = couleur || voiture.couleur;
      voiture.plaque = plaque || voiture.plaque;
      voiture.latitude = latitude || voiture.latitude;
      voiture.longitude = longitude || voiture.longitude;
      voiture.isParked = isParked || voiture.isParked;
      await voiture.save();
    }
    await user.save();
    res.status(200).json({
      user: user,
      voiture: user.voiture
    });
  } catch (err) {
    next(err);
  }
}



exports.deleteUser = async (req, res, next) => {
  try {
    const userId = req.userId;
    const user = await checkUserExists(userId);
    //JE VAIS DEVOIR REGARDER SI C'EST OK, METHODE DE BASE ÉTAIT .REMOVE MAIS CA NE MARCHAIT PAS
    await User.deleteOne({ _id: userId });
    if (user.voiture) {
     await Voiture.deleteOne({ _id:user.voiture._id });
    }
    res.status(204).send();
  } catch (err) {
    next(err);
  }
}

// Fonction pour vérifier si un utilisateur existe
async function checkUserExists(userId) {
  const user = await User.findById(userId).populate('voiture');
  if (!user) {
    const error = new Error('L\'utilisateur n\'existe pas.');
    error.statusCode = 404;
    throw error;
  }
  return user;
}