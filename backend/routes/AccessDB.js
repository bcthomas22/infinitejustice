const express = require("express");
const pool = require("../db")
const router = express.Router();

const normalizeString =(s) => {
    const trimmed = s.trim();
    const reg = trimmed.replace(/[^a-zA-Z ]/g, "")
    const formatted = reg.charAt(0).toUpperCase() + reg.slice(1).toLowerCase();
    return formatted;
}

router.post("/addLink", async (req, res) => {
    const {topic1, topic2, rating, isHuman} = req.body;

    const insertQuery = `
        INSERT INTO links (start_topic, end_topic, rating, is_human)
        VALUES ($1, $2, $3, $4)
        RETURNING *;
    `;

    const values = [normalizeString(topic1), normalizeString(topic2), rating, isHuman];

    try {
        const result = await pool.query(insertQuery, values);
        res.json(result.rows[0]);
    } catch (err) {
        console.error("Database error:", err);
        res.status(500).json({ error: err.message, detail: err.detail });
    }
})

router.post("/getLinks", async (req, res) => {
    const {topic, searchStartTopics} = req.body;

    const col = searchStartTopics ? "start_topic" : "end_topic";

    const selectQuery = `
        SELECT * FROM links 
        WHERE ${col} = $1
        ORDER BY rating DESC
        LIMIT 50
    `;

    try {
        const result = await pool.query(selectQuery, [normalizeString(topic)]);
        res.json(result.rows);
    } catch (err) {
        console.error("Database error:", err);
        res.status(500).json({ error: err.message, detail: err.detail });
    }
})

router.post("/addChain", async (req, res) => {
    const {topic1, topic2, rating, topic_chain} = req.body;

    const insertQuery = `
        INSERT INTO chains (start_topic, end_topic, rating, topic_chain)
        VALUES ($1, $2, $3, $4)
        RETURNING *;
    `;

    const values = [normalizeString(topic1), normalizeString(topic2), rating, topic_chain];

    try {
        const result = await pool.query(insertQuery, values);
        res.json(result.rows[0]);
    } catch (err) {
        console.error("Database error:", err);
        res.status(500).json({ error: err.message, detail: err.detail });
    }
})

router.post("/getChains", async (req, res) => {
    const {topic, searchStartTopics} = req.body;

    const col = searchStartTopics ? "start_topic" : "end_topic";

    const selectQuery = `
        SELECT * FROM chains 
        WHERE ${col} = $1
        ORDER BY rating DESC
        LIMIT 50
    `;

    try {
        const result = await pool.query(selectQuery, [normalizeString(topic)]);
        res.json(result.rows);
    } catch (err) {
        console.error("Database error:", err);
        res.status(500).json({ error: err.message, detail: err.detail });
    }
})


module.exports = router;