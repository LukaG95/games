const catchAsync = require("../misc/catchAsync");
const { Match } = require('../Models/matchModel');

// create an instance in db and send back _id to redirect user
exports.createMatch = catchAsync(async (req, res, next) => {
  const match = await new Match(req.body).save();
  const matchID = match._id;

  console.log(match)

  return res.status(200).json({ status: 'success', message: 'created a new match', info: { matchID }});
});

exports.newMove = catchAsync(async (req, res, next) => {
  const { matchID } = req.params;
  if (!matchID) return res.status(400).json({ status: 'error', message: 'no matchID given'});

  const match = await Match.findById(matchID);
  if (!match) return res.status(400).json({ status: 'error', message: 'matchID not found in db'});

  const { move, board, timer } = req.body;
  if (move.color !== match.toMove) return res.status(400).json({ status: 'error', message: 'it is not your turn to move'});

  let matchDetails = match;
  matchDetails.board = board;
  matchDetails.moveHistory.push(move.text);
  if (matchDetails.toMove === "black")
    matchDetails.toMove = "white";
  else 
    matchDetails.toMove = "black";

  const updatedMatch = await Match.findOneAndUpdate({ _id: matchID }, matchDetails, { useFindAndModify: false });
  if (!updatedMatch) return res.status(400).json({ status: 'error', message: "couldn't update match with the new move"});

  const socket = req.app.get('socket');
  socket.newMove({ move, nextToMove: matchDetails.toMove , history: matchDetails.moveHistory, board, timer});

  return res.status(200).json({ status: 'success', message: 'new move sent'});
});

exports.getMatch = catchAsync(async (req, res, next) => {
  const { matchID } = req.params;
  if (!matchID) return res.status(400).json({ status: 'error', message: 'no matchID given'});

  const match = await Match.findById(matchID);
  if (!match) return res.status(400).json({ status: 'error', message: 'matchID not found in db'});

  return res.status(200).json({ status: 'success', message: 'returned requested match', match});
});

exports.joinPlayer1 = catchAsync(async (req, res, next) => {
  const { matchID } = req.params;
  if (!matchID) return res.status(400).json({ status: 'error', message: 'no matchID given'});

  const match = await Match.findById(matchID);
  if (!match) return res.status(400).json({ status: 'error', message: 'matchID not found in db'});
  
  let matchDetails = match;
  matchDetails.player1.hasJoined = true;

  const updatedMatch = await Match.findOneAndUpdate({ _id: matchID }, matchDetails, { useFindAndModify: false });
  if (!updatedMatch) return res.status(400).json({ status: 'error', message: "couldn't join/update player1"});

  return res.status(200).json({ status: 'success', message: 'player 1 has joined the match'});
});

exports.joinPlayer2 = catchAsync(async (req, res, next) => {
  const { matchID } = req.params;
  if (!matchID) return res.status(400).json({ status: 'error', message: 'no matchID given'});

  const match = await Match.findById(matchID);
  if (!match) return res.status(400).json({ status: 'error', message: 'matchID not found in db'});
  
  let matchDetails = match;
  matchDetails.player2.hasJoined = true;
  matchDetails.gameStatus = "live";

  const updatedMatch = await Match.findOneAndUpdate({ _id: matchID }, matchDetails, { useFindAndModify: false });
  if (!updatedMatch) return res.status(400).json({ status: 'error', message: "couldn't join/update player2"});

  return res.status(200).json({ status: 'success', message: 'player 2 has joined the match'});
});

exports.abortMatch = catchAsync(async (req, res, next) => {
  const { matchID } = req.params;
  if (!matchID) return res.status(400).json({ status: 'error', message: 'no matchID given'});

  const match = await Match.findById(matchID);
  if (!match) return res.status(400).json({ status: 'error', message: 'matchID not found in db'});
  
  let matchDetails = match;
  matchDetails.gameStatus = "aborted";

  const updatedMatch = await Match.findOneAndUpdate({ _id: matchID }, matchDetails, { useFindAndModify: false });
  if (!updatedMatch) return res.status(400).json({ status: 'error', message: "couldn't join/update gameStatus to aborted"});

  return res.status(200).json({ status: 'success', message: 'match aborted'});
});

exports.editPlayer2Username = catchAsync(async (req, res, next) => {
  const { matchID } = req.params;
  if (!matchID) return res.status(400).json({ status: 'error', message: 'no matchID given'});

  const match = await Match.findById(matchID);
  if (!match) return res.status(400).json({ status: 'error', message: 'matchID not found in db'});

  const { P2_username } = req.body

  let matchDetails = match;
  matchDetails.player2.username = P2_username;

  const updatedMatch = await Match.findOneAndUpdate({ _id: matchID }, matchDetails, { useFindAndModify: false });
  if (!updatedMatch) return res.status(400).json({ status: 'error', message: "couldn't update player 2 username"});

  const socket = req.app.get('socket');
  socket.player2HasJoined({ username: matchDetails.player2.username });

  return res.status(200).json({ status: 'success', message: 'player 2 username saved'});
});

exports.endMatch = catchAsync(async (req, res, next) => {
  const { matchID } = req.params;
  if (!matchID) return res.status(400).json({ status: 'error', message: 'no matchID given'});

  const match = await Match.findById(matchID);
  if (!match) return res.status(400).json({ status: 'error', message: 'matchID not found in db'});

  const { winner } = req.body;

  let matchDetails = match;
  matchDetails.gameStatus = "ended";
  matchDetails.winner = winner;

  const updatedMatch = await Match.findOneAndUpdate({ _id: matchID }, matchDetails, { useFindAndModify: false });
  if (!updatedMatch) return res.status(400).json({ status: 'error', message: "couldn't end the match"});

  const socket = req.app.get('socket');
  socket.gameEnded({ winner });

  return res.status(200).json({ status: 'success', message: 'the match has ended'});
});