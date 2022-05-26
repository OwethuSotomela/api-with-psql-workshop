const supertest = require('supertest');
const PgPromise = require("pg-promise")
const express = require('express');
const assert = require('assert');
const fs = require('fs');
const cors = require('cors');
require('dotenv').config()

const API = require('./api');
const { default: axios } = require('axios');
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static("public"))

app.use(cors());

const DATABASE_URL = process.env.DATABASE_URL || 'postgresql://owethusotomela:owethusotomela@localhost:5432/garment_app';
const pgp = PgPromise({});

// Start here 

const config = {
    connectionString: DATABASE_URL,
    
    ssl: true
};
const db = pgp(config);

// end here 

API(app, db);

app.get('/', function (req, res) {
    res.render('index.html')
})

app.post('/api/login', function (req, res) {

    const { username } = req.body;

    if (username !== 'OwethuSotomela')
        return res.json({
            success: false,
            user: null,
            access_token: null
        });

    return res.json({
        success: true,
        user: {
            name: 'Owethu',
            surname: 'Sotomela',
        },
        access_token: 'test_token'
    });
})

const PORT = process.env.PORT || 4009;
app.listen(PORT, function () {
    console.log(`App started on port ${PORT}`);
});