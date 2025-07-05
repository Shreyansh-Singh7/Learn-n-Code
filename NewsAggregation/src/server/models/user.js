"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var User = /** @class */ (function () {
    function User(userId, username, email, hashedPassword, role_id) {
        this.userId = userId;
        this.username = username;
        this.email = email;
        this.hashedPassword = hashedPassword;
        this.role_id = role_id;
    }
    User.prototype.getUserId = function () {
        return this.userId;
    };
    User.prototype.getUsername = function () {
        return this.username;
    };
    User.prototype.getEmail = function () {
        return this.email;
    };
    User.prototype.getHashedPassword = function () {
        return this.hashedPassword;
    };
    User.prototype.getRoleId = function () {
        return this.role_id;
    };
    return User;
}());
exports.default = User;
