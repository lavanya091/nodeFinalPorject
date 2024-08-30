// // index.js
// const express = require('express');
// const db = require('./db');

// const app = express();
// const port = 3000;

// app.get('/airport/:iata_code', async (req, res) => {
//   const { iata_code } = req.params;

//   try {
//     // Query to fetch airport details with related city and country information
//     const [rows] = await db.query(`
//       SELECT
//         airport.id AS airport_id,
//         airport.icao_code,
//         airport.iata_code,
//         airport.name AS airport_name,
//         airport.type,
//         airport.latitude_deg,
//         airport.longitude_deg,
//         airport.elevation_ft,
//         city.id AS city_id,
//         city.name AS city_name,
//         city.country_id,
//         city.lat AS city_lat,
//         city.long AS city_long,
//         city.is_active AS city_is_active,
//         country.id AS country_id,
//         country.name AS country_name,
//         country.country_code_two,
//         country.country_code_three,
//         country.mobile_code,
//         country.continent_id
//       FROM Airport airport
//       LEFT JOIN City city ON airport.city_id = city.id
//       LEFT JOIN Country country ON city.country_id = country.id
//       WHERE airport.iata_code = ?
//     `, [iata_code]);

//     if (rows.length > 0) {
//       const airport = rows[0];
//       const response = {
//         airport: {
//           id: airport.airport_id,
//           icao_code: airport.icao_code,
//           iata_code: airport.iata_code,
//           name: airport.airport_name,
//           type: airport.type,
//           latitude_deg: airport.latitude_deg,
//           longitude_deg: airport.longitude_deg,
//           elevation_ft: airport.elevation_ft,
//           address: {
//             city: airport.city_id ? {
//               id: airport.city_id,
//               name: airport.city_name,
//               country_id: airport.country_id,
//               is_active: airport.city_is_active,
//               lat: airport.city_lat,
//               long: airport.city_long
//             } : null,
//             country: airport.country_id ? {
//               id: airport.country_id,
//               name: airport.country_name,
//               country_code_two: airport.country_code_two,
//               country_code_three: airport.country_code_three,
//               mobile_code: airport.mobile_code,
//               continent_id: airport.continent_id
//             } : null
//           }
//         }
//       };

//       res.json(response);
//     } else {
//       res.status(404).json({ message: 'Airport not found' });
//     }
//   } catch (error) {
//     res.status(500).json({ message: 'Internal server error' });
//   }
// });

// app.listen(port, () => {
//   console.log(`Server running at http://localhost:${port}`);
// });
