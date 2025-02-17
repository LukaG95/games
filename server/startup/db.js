const mongoose = require('mongoose');

module.exports = function () {
    let DB = "mongodb+srv://Lux:P4Tj81QRHb79TrTY@card-game.mme0uri.mongodb.net/CardGame?retryWrites=true&w=majority&appName=Card-Game";

    mongoose.connect(DB, {
        useNewUrlParser: true
    })
        .then(() => console.log(`Connected to database`));
        
};
