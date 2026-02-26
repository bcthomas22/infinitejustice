const express = require("express");
const router = express.Router();
const openai = require("../services/openai");

router.post("/", async (_req, res) => {
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

router.post("/compareTopics", async (req, res) => {
    try{
        const { prompt } = req.body

        const response = await openai.responses.create({
            model: "gpt-4.1-mini",
            input: [
                {
                    role: "system",
                    content: "You will be given two topics relating to ethical justice, positive or negative" +
                    " you must rate, on a scale from 1 to 10 (No decimals) how well these topics corelate." +
                    " The first topic must \"Lead to\" the second topic" +
                    " if the second topic makes no sence compared to the first, or is profane, sexual, offensive, out of pocket, non-ethical, rate it low (less than 3)" +
                    " if the second topic makes a drastic jump from something good to bad, or bad to good, these topics might not be related, so rank it mid to low (less than 7)" +
                    " if the second topic genuinely makes sence, and actually comes from the first topic, and is ethical, rate it highly (above 6)" 
                    
                    + "Finally, provide a topic in prefferably one word that the second topic LEADS to, " + 
                    "but also try to respond with a quality topic you would rate highly"
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
                            score: { 
                                type: "number",
                                description: "Enter your score here for does topic 1 lead to topic 2"
                            },
                            response: { 
                                type: "string",
                                description: "Enter your new topic, what does topic 1 lead to?"
                            }
                        },
                        required: ["score", "response"],
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