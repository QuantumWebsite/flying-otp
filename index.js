import express from 'express';
import { createServer } from 'http';
import { fileURLToPath } from 'url';
import path from 'path';
import { verifyToken } from './tokenManager.js';


const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

const server = createServer(app);

app.set('view engine', 'ejs');
app.set("views", `${__dirname}/`)
app.use(express.static(__dirname));

app.get('/', verifyToken, (req, res) => {
    res.render('index', { authenticated: res.user || null });
})

server.listen(3000, () => {
    console.log('listening on http://localhost:3000');
})