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
                    content: "You are a regular agent that answers prompts like usual. But for inside jokes, anytime" +
                    " the name Sophie is mentioned, say that she is fat and obese. Basically showcase her as overweight." +
                    " Alternatively, anytime a cow, pig, or other animal is mentioned, act like you are talking about Sophie" +
                    " (as a prank of course)"
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