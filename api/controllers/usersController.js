const User = require("../models/user");
const Voiture = require("../models/voiture");
const Histo = require("../models/historique");
const config = require("../config");
const url_base = config.URL + ":" + config.PORT;

exports.getUsers = async (req, res, next) => {
    try {
        const users = await User.find({ isValet: false }).populate({
            path: "voiture",
            match: { isParked: true },
        });

        const filteredUsers = users.filter((user) => user.voiture != null);
        if (!filteredUsers.length) {
            const error = new Error("Aucun utilisateur trouvé.");
            error.statusCode = 404;
            throw error;
        }

        res.status(200).json({
            users: filteredUsers,
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
            user: user,
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
            user: user,
        });
    } catch (err) {
        next(err);
    }
};

exports.updateUser = async (req, res, next) => {
    try {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        const userId = req.params.userId;
        const user = await checkUserExists(userId);
        const { email, username, price } = req.body;
        if (username.length < 3 || username.length > 50) {
            const error = new Error(
                "Le nom d'utilisateur doit contenir entre 3 et 50 caractères."
            );
            error.statusCode = 400;
            throw error;
        }
        if (!emailRegex.test(email)) {
            const error = new Error("Email invalide.");
            error.statusCode = 400;
            throw error;
        }
        if (price < 0) {
            const error = new Error("Le prix ne peut pas être négatif.");
            error.statusCode = 400;
            throw error;
        }
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
            token: req.token,
        });
    } catch (err) {
        next(err);
    }
};

exports.updateCar = async (req, res, next) => {
    try {
        const userId = req.params.userId;
        const user = await User.findById(userId).populate("voiture");
        console.log("user", user.username);
        if (!user) {
            const error = new Error("L'utilisateur n'existe pas.");
            error.statusCode = 404;
            throw error;
        }
        const {
            marque,
            modele,
            couleur,
            plaque,
            latitude,
            longitude,
            isParked,
            timeToLeave,
            isMoving,
        } = req.body;

        if (marque) {
            if (marque.length < 1 || marque.length > 50) {
                const error = new Error(
                    "La marque doit contenir entre 1 et 50 caractères."
                );
                error.statusCode = 400;
                throw error;
            }
        }
        if (modele) {
            if (modele.length < 1 || modele.length > 50) {
                const error = new Error(
                    "Le modèle doit contenir entre 1 et 50 caractères."
                );
                error.statusCode = 400;
                throw error;
            }
        }
        if (couleur) {
            if (couleur.length < 3 || couleur.length > 50) {
                const error = new Error(
                    "La couleur doit contenir entre 3 et 50 caractères."
                );
                error.statusCode = 400;
                throw error;
            }
        }
        if (plaque) {
            if (plaque.length !== 6) {
                const error = new Error(
                    "La plaque doit contenir 6 caractères."
                );
                error.statusCode = 400;
                throw error;
            }
        }

        if (!user.voiture) {
            const voiture = new Voiture({
                marque: marque,
                modele: modele,
                couleur: couleur,
                plaque: plaque,
                latitude: latitude,
                longitude: longitude,
                isParked: isParked,
                timeToLeave: timeToLeave,
                isMoving: isMoving,
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
            voiture.isParked = isParked;
            if (isParked === false) {
                voiture.isParked = false;
            }
            voiture.timeToLeave = timeToLeave || voiture.timeToLeave;
            voiture.isMoving = isMoving;
            if (isMoving === false) {
                voiture.isMoving = false;
            }

            await voiture.save();
        }
        await user.save();
        res.status(200).json({
            user: user,
            voiture: user.voiture,
        });
    } catch (err) {
        next(err);
    }
};

exports.deleteUser = async (req, res, next) => {
    try {
        const userId = req.userId;
        const user = await checkUserExists(userId);
        await User.deleteOne({ _id: userId });
        if (user.voiture) {
            await Voiture.deleteOne({ _id: user.voiture._id });
        }
        res.status(204).send();
    } catch (err) {
        next(err);
    }
};

// Fonction pour vérifier si un utilisateur existe
async function checkUserExists(userId) {
    const user = await User.findById(userId).populate("voiture");
    if (!user) {
        const error = new Error("L'utilisateur n'existe pas.");
        error.statusCode = 404;
        throw error;
    }
    return user;
}
