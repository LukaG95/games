const express = require('express');
const matchController = require('../Controllers/matchController');

const router = express.Router();

router.post('/create', matchController.createMatch);
router.post('/newMove/:matchID', matchController.newMove);

router.put('/player1/join/:matchID', matchController.joinPlayer1);
router.put('/player2/join/:matchID', matchController.joinPlayer2);
router.put('/player2/username/:matchID', matchController.editPlayer2Username);
router.put('/abort/:matchID', matchController.abortMatch);
router.put('/end/:matchID', matchController.endMatch);

router.get('/getMatch/:matchID', matchController.getMatch);

module.exports = router;
