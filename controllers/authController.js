const db = require("../config/db");
const nodemailer = require("nodemailer");

// ================= EMAIL TRANSPORTER =================

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "hansinimuraleedharanp@gmail.com",
    pass: "wvrgrxqfshtznbua "
  }
});
// ================= REGISTER =================
exports.register = (req, res) => {
  const { name, email, password } = req.body;

  const checkUser = "SELECT * FROM users WHERE email = ?";
  db.query(checkUser, [email], (err, result) => {
    if (err) return res.status(500).json({ message: "DB error" });

    if (result.length > 0) {
      return res.status(400).json({ message: "User already exists" });
    }

    const sql =
      "INSERT INTO users (name, email, password) VALUES (?, ?, ?)";

    db.query(sql, [name, email, password], (err) => {
      if (err) return res.status(500).json({ message: "Register error" });

      res.json({ message: "User registered successfully" });
    });
  });
};

// ================= LOGIN (SEND OTP) =================
exports.login = (req, res) => {
  const { email, password } = req.body;

  const sql = "SELECT * FROM users WHERE email = ?";
  db.query(sql, [email], (err, results) => {
    if (err) return res.status(500).json({ message: "Login error" });

    if (results.length === 0) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const user = results[0];

    if (user.password !== password) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    // Generate 6 digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    // Save OTP in database
    db.query(
      "UPDATE users SET otp=? WHERE email=?",
      [otp, email],
      async (err) => {
        if (err) {
          console.log(err);
          return res.status(500).json({ message: "OTP save error" });
        }

        console.log("OTP saved:", otp);

        try {
          await transporter.sendMail({
            from: process.env.EMAIL_USER,
            to: email,
            subject: "Your Login OTP",
            text: `Your OTP is ${otp}`,
          });

          res.json({ message: "OTP sent to email" });
        } catch (error) {
          console.log(error);
          res.status(500).json({ message: "Email sending failed" });
        }
      }
    );
  });
};

// ================= VERIFY OTP =================
exports.verifyOtp = (req, res) => {
  const { email, otp } = req.body;

  const sql = "SELECT * FROM users WHERE email=? AND otp=?";
  db.query(sql, [email, otp], (err, results) => {
    if (err) return res.status(500).json({ message: "OTP error" });

    if (results.length === 0) {
      return res.status(400).json({ message: "Invalid OTP" });
    }

    // Clear OTP after successful login
    db.query(
      "UPDATE users SET otp=NULL WHERE email=?",
      [email],
      (err) => {
        if (err)
          return res.status(500).json({ message: "OTP clear error" });

        res.json({ message: "Login successful" });
      }
    );
  });
};
exports.verifyOtp = (req, res) => {
  const { email, otp } = req.body;

  const checkOtpQuery = "SELECT * FROM users WHERE email = ? AND otp = ?";

  db.query(checkOtpQuery, [email, otp], (err, result) => {
    if (err) {
      return res.status(500).json({ message: "Database error" });
    }

    if (result.length === 0) {
      return res.status(400).json({ message: "Invalid OTP" });
    }

    // Clear OTP after successful verification
    const clearOtpQuery = "UPDATE users SET otp = NULL WHERE email = ?";

    db.query(clearOtpQuery, [email], (err2) => {
      if (err2) {
        return res.status(500).json({ message: "Error clearing OTP" });
      }

      res.json({ message: "Login successful" });
    });
  });
};