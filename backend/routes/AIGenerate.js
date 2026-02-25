const express = require("express");
const router = express.Router();
const openai = require("../services/openai");

router.post("/", async (req, res) => {
    try{
        const { prompt } = req.body

        const response = await openai.responses.create({
            model: "gpt-4.1-mini",
            input: [
                {
                    role: "system",
                    content: ""
                },
                {
                    role: "user",
                    content: prompt
                }
            ],
            text: {
                format: {
                    type: "json_schema",
                    name: "structured_response",
                    schema: {
                        type: "object",
                        properties: {
                            response: { type: "string" }
                        },
                        required: ["response"],
                        additionalProperties: false
                    }
                }
            }
        })

        let output = response.output_parsed;

        if(!output){
            const rawText = response.output?.[0]?.content?.[0]?.text;
            try{
                output = JSON.parse(rawText);
            } catch (e) {
                output = {response: rawText}
            }
        }

        res.json(output);

    } catch (err) {
        console.error("OPENAI ERROR:", err);
        res.status(500).json({ error: err.message });
    }
})

module.exports = router;