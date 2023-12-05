const express = require('express');
const router = express.Router();
const usersController = require('../controllers/usersController');
const authMiddleware = require('../middleware/is-auth');

// router.use('/user/', authMiddleware);

// /user/ => GET
router.get('/users/', usersController.getUsers);

// L'utilisateur actuellement connecté /user/ (profil utilisateur)
router.get('/user/', authMiddleware, usersController.getUser);

// un utilisateur avec son id /user/:id
router.get('/user/:id', usersController.getUserById);

// Mise à jour d'un utilisateur
router.put('/user/:userId', authMiddleware, usersController.updateUser);

// Suppression de l'utilisateur actuellement connecté
router.delete('/user/', authMiddleware, usersController.deleteUser);

// Mise à jour d'une voiture
router.put('/car/:userId', authMiddleware, usersController.updateCar);

rou

module.exports = router;

