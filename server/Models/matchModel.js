const mongoose = require('mongoose');
const Joi = require('joi');

const matchSchema = new mongoose.Schema({
    player1: {
      username: {
        type: String,
        maxlength: 20,
        default: "Guest"
      },
      color: {
        type: String,
        enum: ["white", "black"],
        required: true
      },
      hasJoined: {
        type: Boolean,
        default: false
      },/*
      castleLegaly: {
        kingHasMoved: {
          type: Boolean,
          default: false
        },
        kingSide: {
          rookMoved: {
            type: Boolean,
            default: false
          },
          compromised: { // either fields are attacked or king is in check
            type: Boolean,
            default: false
          }
        },
        queenSide: {
          rookMoved: {
            type: Boolean,
            default: false
          },
          compromised: { // either fields are attacked or king is in check
            type: Boolean,
            default: false
          }
        },
      }*/
    },
    player2: {
      username: {
        type: String,
        maxlength: 20,
        default: "Guest"
      },
      color: {
        type: String,
        enum: ["white", "black"],
      },
      hasJoined: {
        type: Boolean,
        default: false
      },
      /*
      castleLegaly: {
        kingHasMoved: {
          type: Boolean,
          default: false
        },
        kingSide: {
          rookMoved: {
            type: Boolean,
            default: false
          },
          compromised: { // either fields are attacked or king is in check
            type: Boolean,
            default: false
          }
        },
        queenSide: {
          rookMoved: {
            type: Boolean,
            default: false
          },
          compromised: { // either fields are attacked or king is in check
            type: Boolean,
            default: false
          }
        },
      }*/
    },
    time: {
      totalAmount: {
        type: Number,
        required: true
      },
      increment: {
        type: Number,
        default: 0
      }
    },
    gameStatus: {
      type: String,
      enum: ['live', 'ended', 'aborted', 'waiting'],
      default: 'waiting'
    }, 
    winner: {
      type: String,
      enum: ['white', 'black', 'draw'],
    }, 
    toMove: {
      type: String,
      enum: ['white', 'black'],
      default: 'white'
    }, 
    moveHistory: [
      {
        type: String,
        minlength: 5,
        maxlength: 10
      }
    ],
    board: {
      type: Object
    }
});

exports.Match = mongoose.model('match', matchSchema);