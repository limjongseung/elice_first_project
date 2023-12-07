class User {
    id = "";
    name = "";
    email = "";
    phone = "";
    mobile = "";
    zipcode = "";
    address = "";

    constructor() {}

    setUser(user) {
        if (user.name) this.name = user.name;
        if (user.id) this.id = user.id;
        if (user.email) this.email = user.email;
        if (user.phone) this.phone = user.phone;
        if (user.mobile) this.mobile = user.mobile;
        if (user.zipcode) this.zipcode = user.zipcode;
        if (user.address) this.address = user.address;
    }
}

const USER = new User();

export { USER };
