const express = require("express");
const router = express.Router();
const openai = require("../services/openai");

router.post("/", async (req, res) => {
    try{
        const { prompt } = req.body

        const response = await openai.responses.create({
            model: "gpt-4.1-mini",
            input: prompt,
            text: {
                format: {
                    type: "json_schema",
                    json_schema: {
                        name: "structured_response",
                        schema: {
                            type: "object",
                            properties: {
                                response: { type: "string" }
                            },
                            required: ["response"]
                        }
                    }
                }
            }
        })

        const output = response.output_parsed;
        res.json(output);

    } catch (err) {
        console.error("OPENAI ERROR:", err);
        res.status(500).json({ error: err.message });
    }
})

module.exports = router;