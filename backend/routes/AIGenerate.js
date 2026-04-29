const express = require("express");
const router = express.Router();
const openai = require("../services/openai");

const openaiModel = "gpt-4.1-mini";

//This is used in GetTopic.js to gather the goal, null if error
const getGoalFromInitTopic = async (topic) => {
    try{
        const response = await openai.responses.create({
            model: openaiModel,
            input: [
                {
                    role: "system",
                    content: process.env.INFINITE_JUSTICE_PROMPT
                },
                {
                    role: "user",
                    content: topic
                }
            ],
            text: {
                format: {
                    type: "json_schema",
                    name: "structured_response",
                    schema: {
                        type: "object",
                        properties: {
                            goal: { 
                                type: "string",
                                description: process.env.INFINITE_JUSTICE_GOAL_PROMPT,
                                pattern: "^[A-Z][A-Za-z ]*$"
                            }
                        },
                        required: ["goal"],
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
                throw Error("Parsing error");
            }
        }

        return output.goal;

    } catch (err) {
        console.error("OPENAI ERROR:", err);
        return null;
    }
}

//this is for simple chatbot access (use as template)
router.post("/", async (req, res) => {
    try{
        const { prompt } = req.body

        const response = await openai.responses.create({
            model: openaiModel,
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
                throw Error("Parsing error");
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
            model: openaiModel,
            input: [
                {
                    role: "system",
                    content: process.env.INFINITE_JUSTICE_PROMPT
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
                                description: process.env.INFINITE_JUSTICE_SCORE_PROMPT
                            },
                            response: { 
                                type: "string",
                                description: process.env.INFINITE_JUSTICE_RETURN_PROMPT,
                                pattern: "^[A-Z][A-Za-z ]*$"
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
                throw Error("Parsing error");
            }
        }

        res.json(output);

    } catch (err) {
        console.error("OPENAI ERROR:", err);
        res.status(500).json({ error: err.message });
    }
})

router.post("/summarizeTopic", async (req, res) => {
    try{
        const { topic } = req.body

        const response = await openai.responses.create({
            model: openaiModel,
            input: [
                {
                    role: "system",
                    content: process.env.INFINITE_JUSTICE_PROMPT
                },
                {
                    role: "user",
                    content: topic
                }
            ],
            text: {
                format: {
                    type: "json_schema",
                    name: "structured_response",
                    schema: {
                        type: "object",
                        properties: {
                            summary: { 
                                type: "string",
                                description: process.env.INFINITE_JUSTICE_SUMMARIZE_PROMPT
                            }
                        },
                        required: ["summary"],
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
                throw Error("Parsing error");
            }
        }

        res.json(output);

    } catch (err) {
        console.error("OPENAI ERROR:", err);
        res.status(500).json({ error: err.message });
    }
})

router.post("/getHintsFromTopic", async (req, res) => {
    try{
        const { topic } = req.body

        const response = await openai.responses.create({
            model: openaiModel,
            input: [
                {
                    role: "system",
                    content: process.env.INFINITE_JUSTICE_PROMPT
                },
                {
                    role: "user",
                    content: topic
                }
            ],
            text: {
                format: {
                    type: "json_schema",
                    name: "structured_response",
                    schema: {
                        type: "object",
                        properties: {
                            hints: { 
                                type: "array",
                                description: process.env.INFINITE_JUSTICE_HINTS_PROMPT,
                                items: {
                                    type: "string",
                                    pattern: "^[A-Z][A-Za-z ]*$"
                                }
                            }
                        },
                        required: ["hints"],
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
                throw Error("Parsing error");
            }
        }

        res.json(output);

    } catch (err) {
        console.error("OPENAI ERROR:", err);
        res.status(500).json({ error: err.message });
    }
})

router.post("/getProgress", async (req, res) => {
    try{
        const { prompt } = req.body

        const response = await openai.responses.create({
            model: openaiModel,
            input: [
                {
                    role: "system",
                    content: process.env.INFINITE_JUSTICE_PROMPT
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
                                description: process.env.INFINITE_JUSTICE_PROGRESS_PROMPT
                            }
                        },
                        required: ["score"],
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
                throw Error("Parsing error");
            }
        }

        res.json(output);

    } catch (err) {
        console.error("OPENAI ERROR:", err);
        res.status(500).json({ error: err.message });
    }
})


module.exports = {
    router, 
    getGoalFromInitTopic
};