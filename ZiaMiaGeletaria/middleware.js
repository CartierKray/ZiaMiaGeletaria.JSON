/*
All POST, PUT, PATCH requests need to be authorized with an Authorization header
containing the "Bearer Vz2FpaZAXr0hu9EJP70X".
*/
const API_KEY = "Vz2FpaZAXr0hu9EJP70X";
module.exports = (req, res, next) => {
    if (req.method === "GET") return next();

    const authorizationHeader = req.header("Authorization");

    if (!authorizationHeader)
        return res.status(401).send('No "Authorization" header found.');

    if (!authorizationHeader.startsWith("Bearer "))
        return res.status(401).send('"Authorization" header has wrong value.');

    const apiKey = authorizationHeader.slice("Bearer ".length);
    if (apiKey !== API_KEY) return res.status(401).send("Incorrect API key");

    next();
};