const db1 = require("../db");

const resolvers = {
  Query: {
    movies: async () => {
      const [rows] = await db1.execute("SELECT * FROM movies");
      return rows;
    },
    movie: async (_parent: any, { id }: { id: number }) => {
      console.log('++++++++++++++++++++++++++++', id)
      const [rows] = await db1.execute("SELECT * FROM movies WHERE id =?", [
        id,
      ]);
      return rows[0];
    },
    topMovies: async (_parent: any, { limit }: { limit: number }) => {
      const [rows] = await db1.query(
        "SELECT * FROM movies ORDER BY releaseDate DESC LIMIT ?",
        [limit]
      );
      return rows;
    },
    getRandomMovies: async (
      _parent: any,
      { limit = 20 }: { limit?: number }
    ) => {
      // Get the total number of movies
      const [[{ count }]] = await db1.query(
        "SELECT COUNT(*) as count FROM movies"
      );

      // Calculate a random offset
      const randomOffset = Math.floor(Math.random() * count);

      // Fetch the movies starting from the random offset
      const [rows] = await db1.query("SELECT * FROM movies LIMIT ?, ?", [
        randomOffset,
        limit,
      ]);

      return rows;
    },
    credits: async (
      parent: { id: number },
      { movieID }: { movieID: number }
    ) => {
      const [rows] = await db1.execute(
        "SELECT * FROM credits WHERE movieID =?",
        [movieID]
      );
      return rows;
    },
  },
  Movie: {
    credits: async (parent: { id: number }) => {
      const [rows] = await db1.execute(
        "SELECT * FROM credits WHERE movieID =?",
        [parent.id]
      );
      return rows;
    },
    theaters: async (
      parent: { id: number },
      _args: any
    ) => {
      const [theaters] = await db1.query(
        `SELECT t.*, GROUP_CONCAT(t.timings SEPARATOR ',') AS timings
         FROM theaters t
         JOIN movie_theater mt ON t.id = mt.theaterId
         WHERE mt.movieId = ?
         GROUP BY t.id`, [parent.id]
      );
      theaters.forEach((theater: any) => {
        if (theater.timings) {
          theater.timings = theater.timings.split(',') as string[];
        } else {
          theater.timings = []; // handle case where timings are null or undefined
        }
      });


      return theaters as any[];
    },
  },
};

export default resolvers;
