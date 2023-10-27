const dotenv =require("dotenv").config();
const express = require("express");
const connectDatabase = require("./db/Database");
const app = express();
const authRouter = require("./routes/authRoute.js");
const productRouter = require("./routes/productRoute.js");
const cartRoute = require("./routes/cartRoute");
const paymentRouter = require("./routes/paymentRouter");
const orderRoute = require("./routes/orderRoute");
const bodyParser = require("body-parser");
const { notFound, errorHandler } = require("./middleware/errorHandler");
const cookieParser = require("cookie-parser");
const morgan = require("morgan");
const cors = require("cors");

connectDatabase();

app.use(morgan("dev"));
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());

app.get("/api/getkey",(req,res)=>{
  res.status(200).json({key:process.env.RAZORPAY_AIP_KEY})
})

app.use("/api/user", authRouter);
app.use("/api/product", productRouter);
app.use("/api/cart", cartRoute);
app.use("/api/payment", paymentRouter);
app.use("/api/order", orderRoute)

app.use(notFound);
app.use(errorHandler);

// const instance = new Razorpay({
//     key_id: process.env.RAZORPAY_AIP_KEY,
//     key_secret: process.env.RAZORPAY_AIP_SECRET,
//   });
// console.log(instance);
app.listen(process.env.PORT, () => {
  console.log(`Server is running at PORT ${process.env.PORT}`);
});
