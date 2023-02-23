const bcrypt = require('bcrypt');

class UserService {
    constructor(client) {
        this.User = client.db().collection('users');
    }

    async extractUserData(payload) {
        const hashedPass = await bcrypt.hash(payload.password, 10);
        const user = {
            name: payload.name,
            email: payload.email,
            password: hashedPass,
            
        };
        return user;
    }
        

    async create(payload) {
        const user = await this.extractUserData(payload);
        const result = await this.User.insertOne(user);
        return result;
    }


    
    async findByName(username) {
        return await this.User.findOne({ name: username});
    }

    async findByEmail(email) {
        return await this.User.findOne({email});
    }

}

module.exports = UserService;