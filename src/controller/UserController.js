import { db } from "../config/db.js"
import bcrypt from "bcryptjs"

const index = async (req, res)=>{
    try {
        db.query(`SELECT * FROM users WHERE role != 'admin'`, (errorQuery, successQuery)=>{
            if(successQuery.length > 0)
            {
                res.status(200).json({
                    message: "Users retrieved successfully",
                    users: successQuery
                })
            }else{
                res.status(200).json({
                    message: "No users found"
                })
            }
        })
    } catch (error) {
        res.status(401).json({
            message: "Error retrieving users"
        });
    }
}

const store = async (req, res)=>{
    const {name, email, password} = req.body;
    try {
        
        db.query('SELECT * FROM users WHERE email = ?',[email], async (errQuery, successQuery)=>{
            if(successQuery.length > 0)
            {
                res.status(400).json({message : 'Email sudah terdaftar'});
            }else{
                const salt = await bcrypt.genSalt(10);
                const hashedPassword = await bcrypt.hash(password, salt);
                db.query(`INSERT INTO users(name, email, password, role) VALUES('${name}', '${email}','${hashedPassword}','user')`, (errCreate, successCreate)=>{
                    if(successCreate)
                    {
                        res.status(200).json({
                            message: "User created successfully",
                            user: successCreate
                        });
                    }else{
                        res.status(400).json({
                            message: "Failed to create user",
                            detail : errCreate
                        });
                    }
                });
            }
        })

    } catch (error) {
        res.status(400).json({
            message: "Error creating user"
        });
    }
}
const destroy = async (req, res)=>{
    const id = req.params.id;
    db.query(`DELETE FROM users WHERE id = ${id}`, (req, result)=>{
        if(result){
            res.json({message : 'Data berhasil dihapus'});
        }else{
            res.json({message : 'Data gagal dihapus'});
        }
    });
}

const update = async (req, res)=>{
    const id = req.params.id;
    const {name, password} = req.body;
    try {
        
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);
            
            //check exist
            db.query(`SELECT * FROM users WHERE id = ${id}`, (err, result)=>{
                if(result.length > 0){
                    db.query(`UPDATE users SET name = '${name}', password = '${hashedPassword}' WHERE id = '${id}'`, (err2, result)=>{
                        if(result){
                            res.status(200).json({message : 'Data berhasil diupdate'});
                        }else{
                            res.status(400).json({message : 'Data gagal diupdate'});
                        }
                    })
                }else{
                    res.status(404).json({message : 'Data tidak ditemukan'});
                }
            });

    } catch (error) {
        res.status(400).json({
            message: "Error updating user"
        });
    }
}

export {
    index, store, update, destroy
}