const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors')

const authRouter = require('./routers/AuthRouter.js');
const adminRouter = require('./routers/AdminRouter.js');

const PORT = process.env.PORT || 5000;
const DB_LOGIN = process.env.DB_LOGIN;
const DB_PASSWORD = process.env.DB_PASSWORD;

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());
app.use('/auth', authRouter);
app.use('/admin', adminRouter);

mongoose.connect(`mongodb+srv://${DB_LOGIN}:${DB_PASSWORD}@cluster0.qcvtuwy.mongodb.net/?retryWrites=true&w=majority`)
    .then(() => {
        console.log("Connected to the database.");
        app.listen(PORT, () => console.log(`Server started on port ${PORT}.`));
    })
    .catch((error) => console.error(error));


app.on('error', (err) => {
    console.error(`Server error: ${err}`);
});
