var dbcon = require("../event_db");
var connection = dbcon.getConnection();

connection.connect();

var express = require('express');
var router = express.Router();

router.get("/events", (req, res) => {
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

// get event detail and registrations
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
            console.error("Error while get the event detail data");
        } else {
            const eventDetail = records[0];
            connection.query(`
                SELECT * FROM registrations 
                WHERE event_id = ?
                ORDER BY registration_date DESC
                `, eventId, (err, registrationRecords, fields) => {

                if (err) {
                    console.error("Error while get registrations");
                }

                eventDetail.registrations = registrationRecords;
                res.json(eventDetail);
            });
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

// add registration by event id
router.post("/registration/:id", (req, res) => {
    const eventId = req.params.id;
    const { user_name, user_email, ticket_count } = req.body;

    // check ticket count
    if (!Number.isInteger(ticket_count) || ticket_count <= 0) {
        return res.status(400).json({ error: "Ticket count must be a positive integer" });
    }

    // check email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(user_email)) {
        return res.status(400).json({ error: "Invalid email format" });
    }

    // ban status cannot register
    connection.query(`
        SELECT * FROM events 
        WHERE id = ? AND ban_status = 1
    `, eventId, (err, eventRecords) => {

        if (eventRecords.length === 0) {
            return res.status(404).json({ error: "Event not available for registration" });
        }

        const event = eventRecords[0];


        // format date
        const registrationDate = new Date().toISOString().slice(0, 19).replace('T', ' ');

        connection.query(`
                INSERT INTO registrations (event_id, user_name, user_email, registration_date, ticket_count)
                VALUES (?, ?, ?, ?, ?)
            `, [eventId, user_name, user_email, registrationDate, ticket_count], (err, result) => {
            if (err) {
                console.error("create registration error:", err);
            }

            // update current price
            const totalAmount = ticket_count * (event.ticket_price || 0);
            const newCurrentPrice = (event.current_price || 0) + totalAmount;

            connection.query(`
                    UPDATE events SET current_price = ? WHERE id = ?
                `, [newCurrentPrice, eventId], (err, updateResult) => {
                if (err) {
                    console.error(" update event current price error:", err);
                }

                res.status(201).json({
                    message: "Registration created successful",
                    registrationId: result.insertId,
                });
            });
        });

    });
});


//-------------------admin------------------------------------------------
//add event
router.post("/event", (req, res) => {

    console.log(req.body)
    // get data by request body
    const { name, date, location, detail, organizer_id, category_id, target_price, ticket_price } = req.body;

    // insert sql
    connection.query(`
        INSERT INTO events (name, date, location, detail, organizer_id, category_id, target_price, ticket_price)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `, [name, date, location, detail, organizer_id, category_id, target_price || null, ticket_price || null], (err, result) => {
        if (err) {
            console.error("Error while inserting event:", err);
        }

        // insert successful
        res.status(201).json({
            message: "Event created successful",
            eventId: result.insertId
        });
    });
});


// update event by id
router.put("/:id", (req, res) => {
    const eventId = req.params.id;
    // get data by request body
    const { name, date, location, detail, organizer_id, category_id, target_price, ticket_price } = req.body;

    // update sql
    connection.query(`
            UPDATE events 
            SET name = ?, date = ?, location = ?, detail = ?, organizer_id = ?, category_id = ?, target_price = ?, ticket_price = ?
            WHERE id = ?
        `, [name, date, location, detail, organizer_id, category_id, target_price, ticket_price, eventId], (err, result) => {
        if (err) {
            console.error("update error", err);
        }

        res.json({ message: "Event updated successful" });
    });

});

//delete event by id
router.delete("/:id", (req, res) => {
    const eventId = req.params.id;

    // check registrations
    connection.query(`SELECT COUNT(*) as count FROM registrations WHERE event_id = ?`, eventId, (err, records) => {

        const registrationCount = records[0].count;

        //has registrations
        if (registrationCount > 0) {
            return res.status(400).json({ error: "Cannot delete event because it has registrations" });
        }

        // delete sql
        connection.query(`DELETE FROM events WHERE id = ?`, eventId, (err, result) => {
            if (err) {
                console.error("delete event error:", err);
            }

            res.json({ message: "Event deleted successful" });
        });
    });
});


router.get("/organization", (req, res) => {
    connection.query(`
        SELECT * FROM organization
    `, (err, records, fields) => {
        if (err) {
            console.error("Error while retrieve the category data:", err);
        } else {
            res.json(records);
        }
    });
});

module.exports = router;
