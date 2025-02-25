// const express = require('express');
// const router = require('./routes/api')
// require('dotenv').config();
import express from 'express';
import { router } from './routes/api.js';
import cookieParser from 'cookie-parser';


const app = express();

app.use(express.json());
app.use(express.urlencoded({extended : true}));
app.use(cookieParser());
app.use((req, res, next) => {
    res.setHeader("Access-Control-Allow-Origin", "http://localhost:5173");
    res.setHeader("Access-Control-Allow-Methods", "GET,POST,PUT,DELETE");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type");
    res.setHeader("Access-Control-Allow-Credentials", "true");
    next();
  });
  

app.use('/', router);

const PORT = process.env.PORT || 3000;
app.listen(PORT, ()=> console.log(`Running in Port ${PORT}`));