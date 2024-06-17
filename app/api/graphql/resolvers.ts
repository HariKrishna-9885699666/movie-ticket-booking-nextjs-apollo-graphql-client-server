const db1 = require('../db');

const resolvers = {
  Query: {
    movies: async () => {
      const [rows] = await db1.execute('SELECT * FROM movies');
      return rows;
    },
    movie: async (_parent: any, { id }: { id: number }) => {
      const [rows] = await db1.execute("SELECT * FROM movies WHERE id =?", [
        id,
      ]);
      return rows[0];
    },
    topMovies: async (_parent: any, { limit }: { limit: number }) => {
      const [rows] = await db1.query('SELECT * FROM movies ORDER BY releaseDate DESC LIMIT ?', [limit]);
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
  },
};

export default resolvers;