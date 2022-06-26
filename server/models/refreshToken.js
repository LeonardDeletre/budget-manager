const { Schema, model } = require('mongoose')
const config = require("../auth.config");
const { v4: uuidv4 } = require('uuid');

const RefreshTokenSchema = new Schema({
    token: String,
    accountId: String,
    expiryDate: Date,
  });

RefreshTokenSchema.statics.createToken = async function (account) {
    let expiredAt = new Date();
    expiredAt.setSeconds(
        expiredAt.getSeconds() + config.jwtRefreshExpiration
    );
    let _token = uuidv4();
    let _object = new this({
        token: _token,
        accountId: account._id,
        expiryDate: expiredAt.getTime(),
    });
    let refreshToken = await _object.save();
    return refreshToken.token;
};

RefreshTokenSchema.statics.verifyExpiration = (token) => {
    return token.expiryDate.getTime() < new Date().getTime();
}
const RefreshToken = model("refreshToken", RefreshTokenSchema);

module.exports = RefreshToken;