const mongoose = require("mongoose");
const bcrypt = require("bcrypt")

const UserShchema = new mongoose.Schema({
    name: { type: String, require },
    user: [
        {
            email: { type: String, require },
            number: { type: String }
        }
    ],
    phone: { type: String },
    password: { type: String, require },
    verify: {type: Boolean, default: false},
    Otpverify: {type: Boolean, default: false},
    avatar: { type: String },
    Otp: {type: Number}
},
    {
        timestamps: false,
        versionKey: false,
    });


UserShchema.pre("save", function (next) {
    const hash = bcrypt.hashSync(this.password, 6);
    this.password = hash;
    return next();
})

UserShchema.methods.matchPassword = async function (password) {
    return await bcrypt.compare(password, this.password)
}

module.exports = mongoose.model("users", UserShchema);