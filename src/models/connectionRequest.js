const mongoose= require('mongoose');
const connectionRequestSchema = new mongoose.Schema({
    fromUserId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    toUserId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    status: {
        type: String,
        enum: ['interested', 'accepted', 'rejected','ignored'],
        message: `Status can't be {VALUE}`,
        default: 'pending'
    }
}, 
{ 
  timestamps: true 
});

// 🚨 Prevent self-request at schema level
connectionRequestSchema.pre("save", function (next) {
  if (this.fromUserId.toString() === this.toUserId.toString()) {
    return next(new Error("You cannot send a request to yourself."));
  }
  next();
});

connectionRequestSchema.index({ 
    fromUserId: 1, 
    toUserId: 1 }, 
    { unique: true }
);
const ConnectionRequestModel = mongoose.model('ConnectionRequest', connectionRequestSchema);
module.exports = ConnectionRequestModel;


//after creating our connection schemma we are ready for making our api's....