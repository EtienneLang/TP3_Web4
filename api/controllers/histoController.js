const Histo = require("../models/historique");
const Facture = require("../models/facture");

exports.getHistorique = async (req, res, next) => {
    console.log(req.userId);
    const userId = req.userId;
    console.log("userId", userId);
    try {
        const histo = await Histo.find({ userId: userId }).sort({
            createdAt: -1,
        });
        if (!histo) {
            const error = new Error("Aucun historique trouvé.");
            error.statusCode = 404;
            throw error;
        }

        res.status(200).json({
            histo: histo,
        });
    } catch (err) {
        next(err);
    }
};

exports.effectuerPaiement = async (req, res, next) => {
    const userId = req.userId;
    console.log("userId", userId);
    let prixTotal = 0;
    try {
        const histo = await Histo.find({ userId: userId });
        if (!histo) {
            const error = new Error("Aucun historique trouvé.");
            error.statusCode = 404;
            throw error;
        }
        histo.forEach((element) => {
            if (!element.isPaid) {
                prixTotal += element.price;
                element.isPaid = true;
                element.save();
            }
        });
        if (prixTotal === 0) {
            const error = new Error("Aucun paiement à effectuer.");
            error.statusCode = 404;
            throw error;
        }
        const facture = new Facture({
            userId: userId,
            price: prixTotal,
        });
        await facture.save();
        res.status(200).json({
            message: "Paiement effectué.",
        });
    } catch (err) {
        next(err);
    }
};

exports.getTotalAPayer = async (req, res, next) => {
    const userId = req.userId;
    let prixTotal = 0;
    try {
        const histo = await Histo.find({ userId: userId });
        if (!histo) {
            const error = new Error("Aucun historique trouvé.");
            error.statusCode = 404;
            throw error;
        }
        histo.forEach((element) => {
            if (!element.isPaid) {
                prixTotal += element.price;
            }
        });
        prixTotal = prixTotal/100
        res.status(200).json({
            prixTotal: prixTotal,
        });
    } catch (err) {
        next(err);
    }
}

exports.getFacture = async (req, res, next) => {
    console.log(req.userId);
    const userId = req.userId;
    console.log("userId", userId);
    try {
        const facture = await Facture.find({ userId: userId }).sort({
            createdAt: -1,
        });
        if (!facture) {
            const error = new Error("Aucune facture trouvé.");
            error.statusCode = 404;
            throw error;
        }

        res.status(200).json({
            facture: facture,
        });
    } catch (err) {
        next(err);
    }
};
