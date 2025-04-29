// webhook.js
const express = require('express');
const bodyParser = require('body-parser');
const { exec } = require('child_process');
const app = express();
const PORT = 3088;

app.use(bodyParser.json());

app.post('/github-webhook', (req, res) => {
    const payload = req.body;

    if (payload.ref === 'refs/heads/main') {
        res.status(200).send('Webhook received. Deploying...');

        // Loyihangiz joylashgan katalog
        const projectDir = '/home/root/kurslar-algoritmedu';

        // Ketma-ket buyruqlar
        const commands = `
            cd ${projectDir} &&
            git pull &&
            npm install &&
            npm run build &&
            rm -rf /var/www/kurslar-algoritmedu/* &&
            cp -r dist/* /var/www/kurslar-algoritmedu/
        `;

        exec(commands, (err, stdout, stderr) => {
            if (err) {
                console.error(`Xatolik yuz berdi:\n${stderr}`);
                return;
            }
            console.log(`Muvaffaqiyatli:\n${stdout}`);
        });
    } else {
        res.status(200).send('Boshqa branch — hech narsa qilinmadi.');
    }
});

app.listen(PORT, () => {
    console.log(`Webhook server ${PORT}-portda ishlayapti`);
});
