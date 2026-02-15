const express = require("express");
const router = express.Router();
const openai = require("../services/openai");

router.get("/", async (req, res) => {
    try{
        const { prompt } = req.body

        const responce = await openai.responces.create({
            model: "gpt-4.1",
            input: prompt,
            response_format: {
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
        })

        const output = responce.output_parsed;
        res.json(output);

    } catch (err) {
        res.status(500).json({ error: "OpenAI request failed" });
    }
})

module.exports = router;