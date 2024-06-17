import { gql } from "graphql-tag";
const typeDefs = gql`
  type Movie {
    id: Int!
    title: String!
    budget: Int
    moviedbID: Int
    originalCountry: String
    originalLanguage: String
    overview: String
    posterPath1: String
    backdropPath1: String
    productionCompanyName: String
    productionCompanyImagePath1: String
    releaseDate: String
    runTime: Int
    spokenLanguages: String
    tagLine: String
    credits: [Credit]
  }

  type Credit {
    id: Int!
    movieID: Int!
    name: String!
    profilePath1: String
    characterName: String
    cast: Int!
  }

  type Query {
    movies: [Movie]
    movie(id: Int!): Movie
    credits(movieID: Int!): [Credit]
    topMovies(limit: Int!): [Movie!]!
  }
`;
export default typeDefs;
