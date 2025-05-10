const jwtConfig = {
"accessToken": {
    "secret": process.env.ACCESS_TOKEN_SECRET || "secret",
    "expiresIn": "15m"
},
"refreshToken": {
    "secret": process.env.REFRESH_TOKEN_SECRET || "secret",
    "expiresIn": "7d"
}
}

module.exports = jwtConfig;
