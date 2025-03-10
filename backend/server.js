const express = require('express');
const cors = require('cors'); 
const mysql = require('mysql2');
const bcrypt = require('bcryptjs');
const app = express();
const port = 3000;

app.use(cors()); 
app.use(express.json());

const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'Abc@123',
    database: 'FWD_database',
});

db.connect((err) => {
    if (err) {
        console.error('Error connecting to MySQL:', err.stack);
        return;
    }
    console.log('Connected to the MySQL database');
});

app.get('/subjects/:subjectId/topics', (req, res) => {
    const subjectId = req.params.subjectId;
    db.query(
        'SELECT t.Topic_name, t.Links FROM Subject_Topic t WHERE t.Subject_ID = ?',
        [subjectId],
        (err, results) => {
            if (err) {
                console.error(err);
                res.status(500).send('Error fetching topics');
            } else if (results.length === 0) {
                res.status(404).send('No topics found for this subject ID');
            } else {
                res.json(results);
            }
        }
    );
});

app.post('/login', (req,res)=> {
    const{username, password} = req.body;

    db.query('SELECT * FROM Admins WHERE username = ?', [username], (err,results) =>{
        if(err) {
            console.error('Database query error',err);
            return res.status(500).json({success:false,message: 'Invalid credentials'});
        }

        const admin = results[0];

        //Compare passwords using bcrypt
        bcrypt.compare(password,admin.password,(err,match)=> {
            if(err) {
                console.error('Error comparing passwords: ',err);
                return res.status(500).json({success: false, message: 'Internal server error'});
            }
            if(match) {
                return res.status(200).json({success: true});
            }else{
                return res.status(400).json({success: false, message: 'Invalid credentials'});
            }
        });
    });
});

app.post('/register', (req, res) => {
    const { username, password } = req.body;

    // Check if the username already exists
    db.query('SELECT * FROM Admins WHERE username = ?', [username], (err, results) => {
        if (err) {
            console.error(err);
            return res.status(500).send('Error checking username');
        }

        if (results.length > 0) {
            return res.status(400).json({ success: false, message: 'Username already taken' });
        }

        // Hash the password before saving to the database
        bcrypt.hash(password, 10, (err, hashedPassword) => {
            if (err) {
                console.error(err);
                return res.status(500).send('Error hashing password');
            }

            // Save the new admin to the database
            db.query('INSERT INTO Admins (username, password) VALUES (?, ?)', [username, hashedPassword], (err, results) => {
                if (err) {
                    console.error(err);
                    return res.status(500).send('Error saving user');
                }
                res.json({ success: true });
            });
        });
    });
});


app.listen(port, () => {
    console.log(`Backend server running at http://localhost:${port}`);
});
