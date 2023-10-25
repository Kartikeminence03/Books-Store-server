const express =  require('express');
const connectDatabase = require('./db/Database');
const app = express();
const dotenv = require('dotenv').config()
const authRouter = require("./routes/authRoute.js");
const productRouter = require('./routes/productRoute.js');
const cartRoute = require('./routes/cartRoute');
const bodyParser = require('body-parser');
const { notFound, errorHandler } = require('./middleware/errorHandler');
const cookieParser = require("cookie-parser");
const morgan = require("morgan");
const cors = require("cors");

connectDatabase();

app.use(morgan("dev"));
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use(cookieParser());
app.use('/api/user', authRouter);
app.use('/api/product', productRouter);
app.use('/api/cart', cartRoute);

app.use(notFound);
app.use(errorHandler);


app.listen(process.env.PORT, ()=>{
    console.log(`Server is running at PORT ${process.env.PORT}`);
})