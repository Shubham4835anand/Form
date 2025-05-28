const mongoose = require('mongoose');

const userProfileSchema = new mongoose.Schema({
  photo: String,
  username: String,
  currentPassword: String,
  newPassword: String,
  profession: String,
  companyName: String,
  addressLine1: String,
  country: String,
  state: String,
  city: String,
  subscriptionPlan: String,
  newsletter: Boolean,
});

module.exports = mongoose.model('UserProfile', userProfileSchema);
