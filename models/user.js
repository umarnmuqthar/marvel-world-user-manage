const { ObjectId } = require("mongodb");

const getDb = require("../util/database").getDb;

class User {
  constructor(name, email, password) {
    this.name = name;
    this.email = email;
    this.password = password;
  }

  save() {
    const db = getDb();
    return db
      .collection("users")
      .insertOne(this)
      .then((result) => {
        console.log(result);
      })
      .catch((err) => {
        console.log(err);
      });
  }

  static fetch() {
    const db = getDb();
    return db
      .collection("users")
      .find({ deleted: { $ne: true } })
      .toArray()
      .then((users) => users)
      .catch((err) => {
        console.log(err);
      });
  }

  static fetchByValue(value) {
    const db = getDb();
    return db
      .collection("users")
      .find({
        name: { $regex: `${value}`, $options: "i" },
        deleted: { $ne: true },
      })
      .toArray()
      .then((users) => users)
      .catch((err) => {
        console.log(err);
      });
  }

  static findById(id) {
    const db = getDb();
    return db
      .collection("users")
      .findOne({ _id: ObjectId(id) })
      .then((user) => {
        return user;
      })
      .catch((err) => {
        console.log(err);
      });
  }

  static findByEmail(email) {
    const db = getDb();
    return db
      .collection("users")
      .findOne({ email: email })
      .then((user) => {
        return user;
      })
      .catch((err) => {
        console.log(err);
      });
  }

  static update(id, userData) {
    const db = getDb();
    return db
      .collection("users")
      .updateOne(
        { _id: ObjectId(id) },
        {
          $set: userData,
        }
      )
      .then((result) => {
        console.log(result);
      })
      .catch((err) => {
        if (req.session.adminEmail) {
          req.session.userExist = true;
          return res.redirect(`/admin/edit-user/${id}`);
        }
      });
  }

  static deleteById(id) {
    const db = getDb();
    return db
      .collection("users")
      .updateOne({ _id: ObjectId(id) }, { $set: { deleted: true } })
      .then((result) => {
        console.log("User deleted");
      })
      .catch((err) => {
        console.log(err);
      });
  }
}
module.exports = User;
