const { gql } =require('apollo-server-express');
const { readFileSync } = require('fs');
const path = require('path');

const query = readFileSync(path.join(__dirname,"./query.gql"));
const image = readFileSync(path.join(__dirname,"./image.gql"));



const schema = gql`
scalar Buffer
${image}
${query}
`;


module.exports = schema;