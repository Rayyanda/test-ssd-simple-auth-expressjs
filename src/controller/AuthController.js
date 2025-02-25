import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import { db } from '../config/db.js';

dotenv.config();


const login = async (req, res) =>{

    const { email, password } = req.body;

    db.query('SELECT * FROM users WHERE email = ?',[email], (err, result)=>{
        try {
            if(result.length === 0) {
                res.status(401).json({ message: 'Email not found' });
            }else{
                bcrypt.compare(password, result[0].password, (err, isMatch) => {
                    if(isMatch) {
                        const token = jwt.sign({ id: result[0].id, email: result[0].email, role: result[0].role}, process.env.JWT_SECRET, { expiresIn: '1h' });
                        res.cookie('token',token,{
                            httpOnly : true,
                            secure : true,
                            sameSite : 'Strict'
                        });
                        res.json({message : 'Login Berhasil', token : token});
                    }else{
                        res.status(401).json({ message: 'Invalid password' });
                    }
                })
            }
        } catch (error) {
            console.log(err)
            res.json({error})
        }
    });
}

const tes = async (req, res)=>{
    res.json({message : 'Hello world'});
}

const logout = async (req, res)=>{
    const token = req.cookies.token;
    if(!token) {
        return res.status(401).json({ message: 'You are not logged in' });
    }
    res.clearCookie('token',{httpOnly:true, secure:true, sameSite:'Strict'});
    res.json({message : 'Logout Berhasil'});
}

const getUser = async (req, res)=>{
    const token = req.cookies.token;
    //console.log(token);
    if(!token) {
        res.status(401).json({ message: 'Unauthorized' });
    }else{
        try {
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            req.user = decoded;
            res.status(200).json({message:'get data', data: req.user});

        } catch (error) {
            res.status(400).json({message: error});
        }
    }
}

const destroy = async (req, res)=>{
    const id = req.body.id;
    db.query(`DELETE FROM users WHERE id = ${id}`, (req, result)=>{
        res.json({message : 'Data berhasil dihapus'});
    });
}

const update = async (req, res) =>{
    const id = req.body.id;
    const name = req.body.name;
    const email = req.body.email;
    const password = req.body.password;

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    
    //check exist
    db.query(`SELECT * FROM users WHERE id = ${id}`, (err, result)=>{
        if(result.length > 0){
            db.query(`UPDATE users SET name = ${name}, password = ${hashedPassword} WHERE id = ${id}`, (err2, result)=>{
                res.json({message : 'Data berhasil diupdate'});
            })
        }else{
            res.json({message : 'Data tidak ditemukan'});
        }
    });
}

export {
    tes, login, logout, getUser, destroy, update
}