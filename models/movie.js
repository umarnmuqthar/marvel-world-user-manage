const getDb = require("../util/database").getDb;

class Movie {
  constructor(title, releaseDate, thumbnailUrl) {
    this.title = title;
    this.releaseDate = releaseDate;
    this.thumbnailUrl = thumbnailUrl;
  }
  save() {
    const db = getDb;
    db.collection("movies")
      .insertOne(this)
      .then((result) => {
        console.log(result);
      })
      .catch((err) => {
        console.log(err);
      });
  }
}

module.exports = Movie;
