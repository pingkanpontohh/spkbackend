const db = require("../config/db");

const getJurusan = (req,res) => {

  const sql = `
    SELECT *
    FROM jurusan
  `;

  db.query(sql,(err,result)=>{

    if(err){

      return res.status(500).json(err);

    }

    res.json(result);

  });

};

module.exports = {

  getJurusan

};