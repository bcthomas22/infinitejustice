const express = require("express");
const client = require("../db")
const router = express.Router();

router.post("/addLink", async (req, res) => {
    const {topic1, topic2, score, isHuman} = req.body;

    const insertQuery = `
        INSERT INTO links (start_topic, end_topic, rating, is_human)
        VALUES ($1, $2, $3, $4)
        RETURNING *;
    `;

    const values = [topic1, topic2, score, isHuman];

    try {
        const result = await client.query(insertQuery, values);
        res.json(result.rows[0]);
    } catch (err) {
        console.error("Database error:", err);
        res.status(500).json({ error: "Database query failed" });
    }
})

router.post("/getLinks", async (req, res) => {
    const {topic, searchStartTopics} = req.body;

    const selectQuery = `
        SELECT * FROM links 
        WHERE ${searchStartTopics ? "start_topic" : "end_topic"} = $1
        ORDER BY rating DESC
        LIMIT 50
    `;

    try {
        const result = await client.query(selectQuery, [topic]);
        res.json(result.rows);
    } catch (err) {
        console.error("Database error:", err);
        res.status(500).json({ error: "Database query failed" });
    }
})

router.post("/addChain", async (req, res) => {
    const {topic1, topic2, topic_chain, score} = req.body;

    const insertQuery = `
        INSERT INTO chains (start_topic, end_topic, all_topics, rating)
        VALUES ($1, $2, $3, $4)
        RETURNING *;
    `;

    const values = [topic1, topic2, topic_chain, score];

    try {
        const result = await client.query(insertQuery, values);
        res.json(result.rows[0]);
    } catch (err) {
        console.error("Database error:", err);
        res.status(500).json({ error: "Database query failed" });
    }
})

router.post("/getChains", async (req, res) => {
    const {topic, searchStartTopics} = req.body;

    const selectQuery = `
        SELECT * FROM chains 
        WHERE ${searchStartTopics ? "start_topic" : "end_topic"} = $1
        ORDER BY rating DESC
        LIMIT 50
    `;

    try {
        const result = await client.query(selectQuery, [topic]);
        res.json(result.rows);
    } catch (err) {
        console.error("Database error:", err);
        res.status(500).json({ error: "Database query failed" });
    }
})


module.exports = router;