const express = require("express");
const router = express.Router();
const openai = require("../services/openai");

const openaiModel = "gpt-4.1-mini";

const normalizeString =(s) => {
    const trimmed = s.trim();
    const reg = trimmed.replace(/[^a-zA-Z ]/g, "")
    const formatted = reg.charAt(0).toUpperCase() + reg.slice(1).toLowerCase();
    return formatted;
}

//made a global schema to make sure prompt caching works for all API calls
const GLOBAL_SCHEMA = {
    type: "object",
    properties: {
        goal: { 
            type: ["string", "null"],
            description: process.env.INFINITE_JUSTICE_GOAL_PROMPT,
            pattern: "^[A-Z][a-z ]*$"
        },
        score: { 
            type: ["number", "null"],
            description: process.env.INFINITE_JUSTICE_SCORE_PROMPT
        },
        response: { 
            type: ["string", "null"],
            description: process.env.INFINITE_JUSTICE_RETURN_PROMPT,
            pattern: "^[A-Z][a-z ]*$"
        },
        summary: { 
            type: ["string", "null"],
            description: process.env.INFINITE_JUSTICE_SUMMARIZE_PROMPT
        },
        hints: { 
            type: ["array", "null"],
            description: process.env.INFINITE_JUSTICE_HINTS_PROMPT,
            items: {
                type: "string",
                pattern: "^[A-Z][a-z ]*$"
            }
        },
        progress: { 
            type: ["number", "null"],
            description: process.env.INFINITE_JUSTICE_PROGRESS_PROMPT
        }
    },
    required: ["goal", "score", "response", "summary", "hints", "progress"],
    additionalProperties: false
};

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
                    content: `Only fill out the goal property, all other properties should be null. Topic given: ${normalizeString(topic)}`
                }
            ],
            text: {
                format: {
                    type: "json_schema",
                    name: "structured_response",
                    schema: GLOBAL_SCHEMA
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
                    content: `Only fill out the score and response properties, all other properties should be null. Prompt given: ${prompt}`
                }
            ],
            text: {
                format: {
                    type: "json_schema",
                    name: "structured_response",
                    schema: GLOBAL_SCHEMA
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
                    content: `Only fill out the summary property, all other properties should be null. Topic given: ${normalizeString(topic)}`
                }
            ],
            text: {
                format: {
                    type: "json_schema",
                    name: "structured_response",
                    schema: GLOBAL_SCHEMA
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
                    content: `Only fill out the hints property, all other properties should be null. Topic given: ${normalizeString(topic)}`
                }
            ],
            text: {
                format: {
                    type: "json_schema",
                    name: "structured_response",
                    schema: GLOBAL_SCHEMA
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
                    content: `Only fill out the progress property, all other properties should be null. Prompt given: ${prompt}`
                }
            ],
            text: {
                format: {
                    type: "json_schema",
                    name: "structured_response",
                    schema: GLOBAL_SCHEMA
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