const express = require('express');
const app = express();

// PORT Variable declaration
const PORT = process.env.PORT || 5000;

// Connect Database
const connectDB = require('./config/db');
connectDB();

//INIT Middleware
app.use(express.json({
    extended: false
}));

app.listen(PORT, () => {
    console.log(`Server started at PORT : ${PORT}`);
});

app.get('/', (req, res) => {
    res.send('Application is up');
});

app.use('/api/users', require('./routes/api/user'));
app.use('/api/auth', require('./routes/api/auth'));
app.use('/api/profile', require('./routes/api/profile'));
app.use('/api/posts', require('./routes/api/posts'));