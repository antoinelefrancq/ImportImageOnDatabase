
const Query =require('./query');
const { GraphQLScalarType } = require('graphql');
const { Kind } = require('graphql/language');


module.exports = {
  Buffer: new GraphQLScalarType({
    name: 'Buffer',
    description: 'Binary data',
    serialize: value => Buffer.from(value),
    parseValue: value => Buffer.from(value),
    parseLiteral: ast => {
      if (ast.kind === Kind.STRING) {
        return Buffer.from(ast.value, 'base8');
      }
      return null;
    },
  }),
  Query,
};
