const express = require("express");
const { Pool } = require("pg");

const app = express();

const pool = new Pool({
    host: "aws-0-ap-south-1.pooler.supabase.com",
    user: "postgres.bgaihiclkqqrfsvyfrmu",
    password: "Anusha092001@",
    database: "postgres",
    port: 6543,
});

pool.connect((err) => {
  if (err) {
    console.error("Error connecting to the database:", err.stack);
  } else {
    console.log("Connected to the database");
  }
});

const db = async (iata_code) => {
  const query = `
    SELECT 
      a.id AS airport_id, 
      a.icao_code, 
      a.iata_code, 
      a.name AS airport_name, 
      a.type,
      a.latitude_deg, 
      a.longitude_deg, 
      a.elevation_ft,
      c.id AS city_id, 
      c.name AS city_name, 
      c.country_id, 
      c.is_active,
      c.lat AS city_lat, 
      c.long AS city_long,
      co.id AS country_id, 
      co.name AS country_name, 
      co.country_code_two, 
      co.country_code_three, 
      co.mobile_code, 
      co.continent_id
    FROM 
      airport AS a
    LEFT JOIN 
      city AS c 
      ON a.city_id = c.id
    LEFT JOIN 
      country AS co 
      ON c.country_id = co.id
    WHERE 
      a.iata_code = $1;
  `;

  try {
    const result = await pool.query(query, [iata_code]);
    return result.rows;
  } catch (err) {
    console.log(err.message);
    throw new Error('Database query failed');
  }
};

app.get("/:iata_code", async (req, res) => {
  try {
    const rows = await db(req.params.iata_code);
    console.log(rows);
    if (rows.length === 0) {
      return res.status(404).json({
        status: "fail",
        message: "Airport not found",
      });
    }

    const airport = {
      id: rows[0].airport_id,
      icao_code: rows[0].icao_code,
      iata_code: rows[0].iata_code,
      name: rows[0].airport_name,
      type: rows[0].type,
      latitude_deg: rows[0].latitude_deg,
      longitude_deg: rows[0].longitude_deg,
      elevation_ft: rows[0].elevation_ft,
      address: {
        city: {
          id: rows[0].city_id,
          name: rows[0].city_name,
          country_id: rows[0].country_id,
          is_active: rows[0].is_active,
          lat: rows[0].city_lat,
          long: rows[0].city_long,
        },
        country: {
          id: rows[0].country_id,
          name: rows[0].country_name,
          country_code_two: rows[0].country_code_two,
          country_code_three: rows[0].country_code_three,
          mobile_code: rows[0].mobile_code,
          continent_id: rows[0].continent_id,
        }
      }
    };

    res.status(200).json({
      status: "success",
      airport,
    });
  } catch (err) {
    res.status(500).json({
      status: "fail",
      message: err.message,
    });
  }
});

app.listen(8080, () => {
  console.log("Server is running on port 8080...");
});
