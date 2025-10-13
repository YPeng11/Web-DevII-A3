var dbcon = require("../event_db");
var connection = dbcon.getConnection();

connection.connect();

var express = require('express');
var router = express.Router();

router.get("/", (req, res) => {
	connection.query(`
		SELECT events.*, 
            organization.name as organization_name,
            organization.email as organization_email,
			categories.name as category_name
        FROM events 
        LEFT JOIN organization ON events.organizer_id = organization.id
		LEFT JOIN categories ON events.category_id = categories.id
		`, (err, records, fields) => {
			if (err) {
				console.error("Error while retrieve the data");
			} else {
				res.json(records);
			}
		})
})

router.get("/detail/:id", (req, res) => {
	const eventId = req.params.id;

	connection.query(`
		SELECT events.*, 
            organization.name as organization_name,
            organization.email as organization_email,
			categories.name as category_name
        FROM events 
        LEFT JOIN organization ON events.organizer_id = organization.id
		LEFT JOIN categories ON events.category_id = categories.id
		WHERE events.id = ?
		`, eventId, (err, records, fields) => {
			if (err) {
				console.error("Error while retrieve the event detail data");
			} else {
				res.json(records[0]);
			}
		})
})

router.get("/search", (req, res) => {
    const { date, location, category_id } = req.query;
    
    let sqlQuery = `
        SELECT events.*, 
            organization.name as organization_name,
            organization.email as organization_email,
            categories.name as category_name
        FROM events 
        LEFT JOIN organization ON events.organizer_id = organization.id
        LEFT JOIN categories ON events.category_id = categories.id
        WHERE events.ban_status = 1
    `;
    
    const queryParams = [];
    
    if (date) {
        sqlQuery += ` AND events.date = ?`;
        queryParams.push(date);
    }
    
    if (location) {
        sqlQuery += ` AND events.Location LIKE ?`;
        queryParams.push(`%${location}%`);
    }
    
    if (category_id) {
        sqlQuery += ` AND events.category_id = ?`;
        queryParams.push(category_id);
    }
    
    connection.query(sqlQuery, queryParams, (err, records, fields) => {
        if (err) {
			console.error("Error while search");
        } else {
           res.json(records);
        }
    });
});



router.get("/categories", (req, res) => {
    connection.query(`
        SELECT * FROM categories
    `, (err, records, fields) => {
        if (err) {
            console.error("Error while retrieve the category data:", err);
        } else {
            res.json(records);
        }
    });
});



module.exports = router;
