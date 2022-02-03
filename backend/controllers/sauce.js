const Sauce = require('../models/Sauce');
const fs = require('fs');

exports.createSauce = (req, res, next) => {
    const sauceObject = JSON.parse(req.body.sauce);
    delete sauceObject._id;

    const sauce = new Sauce({
        ...sauceObject,
        imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
    });
    sauce.save()
        .then(() => res.status(201).json({ message: 'Objet enregistré !'}))
        .catch(error => res.status(400).json({ error }));
};

exports.getOneSauce = (req, res, next) => {
    Sauce.findOne({
        _id: req.params.id
    }).then(
        (sauce) => {
            res.status(200).json(sauce);
        }
    ).catch(
        (error) => {
            res.status(404).json({
                error: error
            });
        }
    );
};

exports.modifySauce = (req, res, next) => {
    const sauceObject = req.file ?
        {
            ...JSON.parse(req.body.sauce),
            imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
        } : { ...req.body };
    Sauce.updateOne({ _id: req.params.id }, { ...sauceObject, _id: req.params.id })
        .then(() => res.status(200).json({ message: 'Objet modifié !'}))
        .catch(error => res.status(400).json({ error }));
};

exports.deleteSauce = (req, res, next) => {
    Sauce.findOne({ _id: req.params.id })
        .then(sauce => {
            const filename = sauce.imageUrl.split('/images/')[1];
            fs.unlink(`images/${filename}`, () => {
                Sauce.deleteOne({ _id: req.params.id })
                    .then(() => res.status(200).json({ message: 'Objet supprimé !'}))
                    .catch(error => res.status(400).json({ error }));
            });
        })
        .catch(error => res.status(500).json({ error }));
};

exports.getAllSauce = (req, res, next) => {
    Sauce.find().then(
        (sauces) => {
            res.status(200).json(sauces);
        }
    ).catch(
        (error) => {
            res.status(400).json({
                error: error
            });
        }
    );
};

exports.likeAndDislikeSauce = (req, res, next) => {
    const userId = req.body.userId;
    const likeAndDislike = req.body.like;
    Sauce.findOne({ _id: req.params.id })
        .then((sauce) => {
            console.log(sauce)
            switch (likeAndDislike) {
                case 1:
                    if (!sauce.usersLiked.includes(userId)) {
                        sauce.likes++;
                        sauce.usersLiked.push(userId);
                    }
                    break;
                case -1:
                    if (!sauce.usersDisliked.includes(userId)) {
                        sauce.dislikes++;
                        sauce.usersDisliked.push(userId);
                    }
                    break;
                case 0:
                    if (sauce.usersLiked.includes(userId)) {
                        const index = sauce.usersLiked.findIndex((userLiked) => userLiked === userId);
                        sauce.usersLiked.splice(index);
                        sauce.likes--;
                    } else if (sauce.usersDisliked.includes(userId)) {
                        const index = sauce.usersDisliked.findIndex((userDisliked) => userDisliked === userId);
                        sauce.usersDisliked.splice(index);
                        sauce.dislikes--;
                    }
                    break;
                default:
                    break;
            }
            sauce.save()
                .then(() => res.status(200).json())
                .catch(error => res.status(400).json({ error }));
        });
};
