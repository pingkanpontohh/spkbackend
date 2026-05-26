const db = require("../config/db");

const loginAdmin = (req,res) => {

  const {
    username,
    password
  } = req.body;

  const sql = `

    SELECT *
    FROM admin

    WHERE username = ?
    AND password = ?

  `;

  db.query(

    sql,

    [username,password],

    (err,result) => {

      if(err){

        return res.status(500).json(err);

      }

      if(result.length > 0){

        res.json({

          success:true,

          admin:result[0]

        });

      }else{

        res.json({

          success:false,

          message:"Login gagal"

        });

      }

    }

  );

};

module.exports = {
  loginAdmin
};