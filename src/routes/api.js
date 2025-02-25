import express from 'express';
import {  getUser, login, logout, tes } from "../controller/AuthController.js";
import { destroy, index, store, update } from '../controller/UserController.js';
import { authMiddleware } from '../middleware/AuthMiddleware.js';
import { checkRole } from '../middleware/roleMiddleware.js';


const router = express.Router();

router.post('/user/store', authMiddleware, checkRole(['admin']) ,store);

router.post('/user/update/:id', authMiddleware, checkRole(['admin']), update);

router.delete('/user/delete/:id', authMiddleware, checkRole(['admin']) , destroy);

router.get('/users', authMiddleware, checkRole(['admin']), index);

router.get('/profile', authMiddleware , checkRole(['admin','user']) , getUser);

router.post('/login', login);

router.post('/logout',logout);


router.get('/',tes);


export {
    router
}
