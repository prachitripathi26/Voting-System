// const express = require("express");

// const mongoose = require("mongoose");

// const cors = require("cors");
// const path = require("path");
// const electionRoutes =require("./routes/electionRoutes");
// require("dotenv").config();


// // 🔥 IMPORT ROUTES

// const authRoutes =
// require("./routes/authRoutes");

// const voteRoutes =
// require("./routes/voteRoutes");

// const candidateRoutes =
// require("./routes/candidateRoutes");


// const app = express();


// // 🔥 MIDDLEWARES

// app.use(cors());

// app.use(express.json());

// app.use(
//   "/uploads",
//   express.static(
//     path.join(__dirname, "uploads")
//   )
// );
// // 🔥 API ROUTES

// app.use(
//   "/api/auth",
//   authRoutes
// );

// app.use(
//   "/api/vote",
//   voteRoutes
// );

// app.use(
//   "/api/candidates",
//   candidateRoutes
// );
// app.use(
//   "/api/election",
//   electionRoutes
// );


// // 🔥 HOME ROUTE

// app.get("/", (req, res) => {

//   res.send("Voting API Running");

// });


// // 🔥 DATABASE CONNECTION

// mongoose.connect(process.env.MONGO_URI)

// .then(() => {

//   console.log("✅ MongoDB Connected");

// })

// .catch((err) => {

//   console.log(
//     "❌ Database Error:",
//     err
//   );

// });


// // 🔥 SERVER PORT

// const PORT =
// process.env.PORT || 5000;


// // 🔥 START SERVER

// app.listen(PORT, () => {

//   console.log(
//     `🚀 Server running on port ${PORT}`
//   );

// });


const express = require("express");

const mongoose = require("mongoose");

const cors = require("cors");

const path = require("path");

const fs = require("fs");

require("dotenv").config();

// =====================================================
// 🔥 IMPORT ROUTES
// =====================================================

const authRoutes =
require("./routes/authRoutes");

const voteRoutes =
require("./routes/voteRoutes");

const candidateRoutes =
require("./routes/candidateRoutes");

const electionRoutes =
require("./routes/electionRoutes");

// =====================================================
// 🔥 APP
// =====================================================

const app = express();

// =====================================================
// 🔥 CREATE UPLOADS FOLDER
// =====================================================

const uploadsPath =
path.join(__dirname, "uploads");

if (
  !fs.existsSync(uploadsPath)
) {

  fs.mkdirSync(uploadsPath);

  console.log(
    "✅ uploads folder created"
  );

}

// =====================================================
// 🔥 MIDDLEWARES
// =====================================================

app.use(cors());

app.use(express.json());

app.use(express.urlencoded({
  extended: true,
}));

// =====================================================
// 🔥 STATIC IMAGE FOLDER
// =====================================================

app.use(
  "/uploads",

  express.static(
    path.join(__dirname, "uploads")
  )
);

// =====================================================
// 🔥 API ROUTES
// =====================================================

app.use(
  "/api/auth",
  authRoutes
);

app.use(
  "/api/vote",
  voteRoutes
);

app.use(
  "/api/candidates",
  candidateRoutes
);

app.use(
  "/api/election",
  electionRoutes
);

// =====================================================
// 🔥 HOME ROUTE
// =====================================================

app.get("/", (req, res) => {

  res.send("🚀 Voting API Running");

});

// =====================================================
// 🔥 TEST IMAGE ROUTE
// =====================================================

app.get(
  "/test-image",
  (req, res) => {

    res.json({

      imageURL:
      "http://localhost:5000/uploads",

      message:
      "Image route working properly",

    });

  }
);

// =====================================================
// 🔥 DATABASE CONNECTION
// =====================================================

mongoose.connect(
  process.env.MONGO_URI
)

.then(() => {

  console.log(
    "✅ MongoDB Connected"
  );

})

.catch((err) => {

  console.log(
    "❌ Database Error:",
    err
  );

});

// =====================================================
// 🔥 PORT
// =====================================================

const PORT =
process.env.PORT || 5000;

// =====================================================
// 🔥 START SERVER
// =====================================================

app.listen(PORT, () => {

  console.log(
    `🚀 Server running on port ${PORT}`
  );

  console.log(
    `🌍 http://localhost:${PORT}`
  );

  console.log(
    `🖼️ Images URL: http://localhost:${PORT}/uploads`
  );

});