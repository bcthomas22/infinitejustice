const express = require("express");
const router = express.Router();

router.post("/", async (req, res) => {

    const topic = req.body.topic.trim();
    const topicNormalized = topic.charAt(0).toUpperCase() + topic.slice(1);

    if (topicNormalized === ""){
        res.json({error: "no topic given"})
        return
    }

    let allLinks = [];
    let plcontinue = null;

    do{
        const resp = await fetch(
            `https://en.wikipedia.org/w/api.php?action=query&format=json&titles=${encodeURIComponent(topicNormalized)}&prop=links&pllimit=500&origin=*${plcontinue ? `&plcontinue=${plcontinue}` : "" }`
        )

        if(!resp.ok){
            res.json({error: "wiki fetch error"})
            return;
        }

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
                            t.length > 10 &&
                            t.length < 25 && 
                            !t.includes(":") &&
                            !lower.includes("list of") &&
                            !lower.includes("template") &&
                            !lower.includes("help") &&
                            !lower.includes("file")
                        )})
                        .sort((a,b) => a.length - b.length)
                        .slice(0,50);

    res.json(links);
})

module.exports = router;