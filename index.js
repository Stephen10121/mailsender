require('dotenv').config();
const express = require('express');
const app = express();
const nodeMailer = require("nodemailer");

const PORT = process.env.PORT || 4000;
app.use(express.json())

async function sendForm(from, name, about) {
    let transporter = nodeMailer.createTransport({
        service: "gmail",
        auth: {
            type: "OAUTH2",
            user: process.env.VITE_USER_EMAIL,
            clientId: process.env.VITE_CLIENT_ID,
            clientSecret: process.env.VITE_CLIENT_SECRET,
            refreshToken: process.env.VITE_REFRESH_TOKEN
        }
    });

    let info;
    try {
        info = await transporter.sendMail({
            from: "Local Fence Co Email <test@thelocalfenceco.com>",
            to: "lbrandon10121@gmail.com",
            subject: `Message from ${name}`,
            html: `
                <h1>${from}</h1>
                <p>${about}</p>
            `
        });
    } catch (err) {
        console.log(err);
        return false;
    }
    console.log(`Message sent: ${info.messageId}.`);

    return true;
}

app.post('/sendMail', async (req, res) => {
    if (!req.body["from"] || !req.body["name"] || !req.body["about"] || !req.body["password"]) {
        res.json({ sent: false });
        return
    }
    if (req.body.password !== process.env.PASSWORD) {
        res.json({sent: false});
        return
    }
    res.json({sent: await sendForm(req.body.from, req.body.name, req.body.about)})
})

app.listen(PORT, () => {
    console.log(`Running on port: ${PORT}`);
});