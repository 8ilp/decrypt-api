const express = require('express');
const cors = require('cors');
const { exec } = require('child_process');
const fs = require('fs');
const app = express();

app.use(cors());
app.use(express.json({ limit: '50mb' }));

app.post('/decrypt', async (req, res) => {
    const { code } = req.body;
    if (!code) return res.status(400).json({ error: 'No code' });

    try {
        const input = 'input.lua';
        fs.writeFileSync(input, code);
        const output = await new Promise((resolve, reject) => {
            exec(`luadec ${input}`, (err, stdout) => {
                if (err) reject(err);
                else resolve(stdout);
            });
        });
        res.json({ success: true, result: output });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
