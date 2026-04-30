const express = require("express");
const router = express.Router();

const normalizeString =(s) => {
    const trimmed = s.trim();
    const reg = trimmed.replace(/[^a-zA-Z ]/g, "")
    const formatted = reg.charAt(0).toUpperCase() + reg.slice(1).toLowerCase();
    return formatted;
}

router.post("/", async (req, res) => {
    try{
        const topicNormalized = normalizeString(req.body.topic)

        if (topicNormalized === ""){
            res.json({error: "no topic given"})
            return
        }

        let allLinks = [];
        let plcontinue = null;

        do{
            const resp = await fetch(
                `https://en.wikipedia.org/w/api.php?action=query&format=json&titles=${encodeURIComponent(topicNormalized)}&prop=links&pllimit=500&origin=*${plcontinue ? `&plcontinue=${plcontinue}` : "" }`,
                { headers: {
                    "User-Agent": "InfiniteJustice/1.0 (infinitejustice.org)"
                }}
            )

            const data = await resp.json();

            const page = Object.values(data.query.pages)[0]

            if(page.links) {
                allLinks.push(...page.links)
            }

            plcontinue = data.continue?.plcontinue || null;

        }while(plcontinue);

        const links = allLinks
                       .map(l => l.title)
                       .filter(t => {
                        const lower = t.toLowerCase();
                        return(
                            !/^\d+$/.test(t) && 
                            t.length > 5 &&
                            t.length < 20 && 
                            !t.includes(":") &&
                            !lower.includes("list of") &&
                            !lower.includes("template") &&
                            !lower.includes("help") &&
                            !lower.includes("file") &&
                            !lower.includes("(")
                        )})
                        .sort(() => Math.random() - 0.5)
                        .slice(0,50);

        res.json(links);
    }
    catch(error){
        res.status(500).json({ err: error.message });
    }
})

module.exports = router;