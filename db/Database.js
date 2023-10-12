const { default: mongoose } = require("mongoose");

const connectDatabase = () => {
  try {
    const conn= mongoose.connect(process.env.MONGODB_URL);
    console.log("Database Connected Successfully");
} catch (error) {
    console.log("DAtabase error");
}
};

module.exports = connectDatabase;
