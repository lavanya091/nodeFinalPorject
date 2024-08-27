const express = require('express');
const mysql = require('mysql2');

// Create an Express application
const app = express();

// MySQL database connection
const connection = mysql.createConnection({
    host: '127.0.0.1',
    user: 'root',
    password: 'Anusha092001',
    database: 'finaldata',
});

// Connect to the database
connection.connect((err) => {
    if (err) {
        console.error('Error connecting to the database:', err.stack);
        return;
    }
    console.log('Connected to the database.');
});

// GET API to retrieve airport details by iata_code
app.get('/airport/:iata_code', (req, res) => {  // Corrected route path
    const iataCode = req.params.iata_code;
    console.log(iataCode);
    const query = `SELECT a.id AS airport_id, a.icao_code, a.iata_code, a.name AS airport_name, a.type,
      a.latitude_deg, a.longitude_deg, a.elevation_ft,
      c.id AS city_id, c.name AS city_name, c.country_id, c.is_active,
      c.lat AS city_lat, c.long AS city_long,
      co.id AS country_id, co.name AS country_name, co.country_code_two, 
      co.country_code_three, co.mobile_code, co.continent_id
    FROM finaldata.fairport a
    LEFT JOIN finaldata.city c ON a.city_id = c.id
    LEFT JOIN finaldata.country co ON c.country_id = co.id
    WHERE a.iata_code = ?`;

    connection.query(query, [iataCode], (err, results) => {
        console.log(results);
        if (err) {
            return res.status(500).json({ error: err.message });
        }

        if (results.length === 0) {
            return res.status(404).json({ message: 'Airport not found' });
        }

        const airport = results[0];
        const response = {
            airport: {
                id: airport.id,
                icao_code: airport.icao_code,
                iata_code: airport.iata_code,
                name: airport.name,
                type: airport.type,
                latitude_deg: airport.latitude_deg,
                longitude_deg: airport.longitude_deg,
                elevation_ft: airport.elevation_ft,
                address: {
                    city: {
                        id: airport.city_id,
                        name: airport.city_name,
                        country_id: airport.country_id,
                        is_active: airport.is_active,
                        lat: airport.city_lat,
                        long: airport.city_long
                    },
                    country: airport.country_id ? {
                        id: airport.country_id,
                        name: airport.country_name,
                        country_code_two: airport.country_code_two,
                        country_code_three: airport.country_code_three,
                        mobile_code: airport.mobile_code,
                        continent_id: airport.continent_id
                    } : null
                }
            }
        };

        res.json(response);
    });
});

// Start the server
const PORT = process.env.PORT || 3309;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
