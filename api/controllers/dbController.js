const Voiture = require("../models/voiture");
const User = require("../models/user");
const Historique = require("../models/historique");
const Factures = require("../models/facture");

const dataVoiture = require("../seeds/voiture");
const dataUser = require("../seeds/user");
const dataHistorique = require("../seeds/historique");
const dataFactures = require("../seeds/facture");

exports.seed = async (req, res, next) => {
    const result = {};

    try {
        await Promise.all([
            Voiture.deleteMany(),
            User.deleteMany(),
            Historique.deleteMany(),
            Factures.deleteMany(),
        ]);

        const [voitureInsert, userInsert, historiqueInsert, facturesInsert] =
            await Promise.all([
                Voiture.insertMany(dataVoiture),
                User.insertMany(dataUser),
                Historique.insertMany(dataHistorique),
                Factures.insertMany(dataFactures),
            ]);

        if (voitureInsert.length > 0) {
            result.voiture = voitureInsert;
        }

        if (userInsert.length > 0) {
            result.user = userInsert;
        }

        if (historiqueInsert.length > 0) {
            result.historique = historiqueInsert;
        }

        if (facturesInsert.length > 0) {
            result.factures = facturesInsert;
        }

        return res.status(200).json(result);
    } catch (err) {
        if (!err.statusCode) {
            err.statusCode = 500;
        }
        next(err);
    }
};
