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
	const userId = req.user.userId;
};

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
