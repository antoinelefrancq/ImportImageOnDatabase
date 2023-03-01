const pool = require("./../pg/pg")
module.exports = {
  async getImage(_,{id}){
    const preparedQuery = {
      text: `
          SELECT * FROM "image"
          WHERE id=$1;
      `,
      values:[id]
    };
    const result = await pool.query(preparedQuery);
    const imageBytea = result.rows[0].data;
    const imageBase64 = Buffer.from(imageBytea).toString('base64'); 
    const imageUrl = `data:image/png;base64,${imageBase64}`; 
    const preparedResponse = {...result.rows[0], file:imageUrl}
    return preparedResponse;    
  }
}