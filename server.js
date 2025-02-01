import express from 'express';
import cookieParser from 'cookie-parser';
import { fileURLToPath } from 'url';
import { createServer } from 'http';
import path from 'path';
import 'dotenv/config';
import User from './usermodel.js';
import { mongoDB, redisDB } from './db.js';
import { randomToken } from './utils.js';
import mailService from './mailer.js';
import { createToken, verifyToken } from './tokenManager.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PORT = process.env.PORT || 80;

const app = express();
const server = createServer(app);

// Setup view engine and static files
app.set("view engine", "ejs");
app.set("views", __dirname + '/');
app.use(express.static(__dirname));


// Middleware to parse request body
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser(process.env.COOKIE_SECRET));

// Root route
app.get("/", verifyToken, (req, res) => {
    res.render("index", { authenticated: res.jwt || null });
});

app.post('/register', async (req, res) => {
    const { fullname, email, password } = req.body;
    const otp = randomToken();

    const url = `${req.protocol}://${req.get('host')}/account-activation?token=${otp}&email=${email}`;


    try {
        const oldUser = await User.findOne({ email });
        
        
        if (oldUser && oldUser.active) {
            return res.status(401).send('User already exists')
        } else if (!oldUser) {
            const user = new User({ fullname, email, password });
            await user.save();
        }
        
        await redisDB.set(`token_${email}`, otp, 60);
        mailService.sendOTP(email, otp, url);
    } catch (error) {
        console.error(error);
        return res.status(401).send('Authentication failed')
    }

    res.send('User registered successfully. Please check your email for activation.');
});

// Account activation
app.post('/account-activation', async (req, res) => {
    let { token, email } = req.body;

    if (!token || !email) {
        token = req.params.token;
        email = req.params.email;
    }

    const extracted_token = await redisDB.get(`token_${email}`);

    if (!extracted_token) {
        return res.status(404).send('Token not found or expired');
    }

    if (extracted_token === token) {
        const user = await User.findOne({ email });

        if (!user) {
            return res.status(404).send('User not found');
        }

        user.active = true;
        await user.save();

        res.redirect('/login.html');
    } else {
        res.status(403).send('Invalid token');
    }
});

// User login
app.post('/login', async (req, res) => {
    const { email, password } = req.body;

    // Find user by email
    const user = await User.findOne({ email });

    if (!user || !user.active) {
        return res.status(401).send('User not found or account not activated');
    }

    if (user.password === password) {
        // Store user details in session (excluding password)
        const { password: userPassword, ...payload } = user.toObject();
        const token = createToken(payload, '7d');
        const expires = new Date();
        expires.setDate(expires.getDate() + 7);

        res.cookie('token', token, {
            secure: true,
            sameSite: "none",
            httpOnly: true,
            path: "/",
            domain: 'localhost',
            expires,
            signed: true
        });
        return res.send('Login successful');
    } else {
        return res.status(401).send('Invalid email or password');
    }
});

app.get('/logout', (req, res) => {
    res.clearCookie('token', {
        secure: true,
        sameSite: "none",
        httpOnly: true,
        path: "/",
        domain: 'localhost',
        signed: true
    });

    res.redirect('/');
});

// Start server and connect to databases
server.listen(PORT, async () => {
    try {
        await redisDB.run();
        await mongoDB.run();
        console.log(`Listening on http://localhost:${PORT}`);
    } catch (err) {
        console.error('Error starting server:', err);
    }
});
