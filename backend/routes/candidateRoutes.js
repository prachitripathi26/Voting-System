// const router =
// require("express").Router();

// const multer =
// require("multer");

// const path =
// require("path");

// const fs =
// require("fs");

// const Candidate =
// require("../models/Candidate");

// const authMiddleware =
// require("../middleware/authMiddleware");


// // 🔥 STORAGE CONFIG

// const storage =
// multer.diskStorage({

//   destination:
//   (req, file, cb) => {

//     // 🔥 CREATE UPLOADS FOLDER

//     if (
//       !fs.existsSync("uploads")
//     ) {

//       fs.mkdirSync(
//         "uploads"
//       );

//     }

//     cb(null, "uploads");

//   },

//   filename:
//   (req, file, cb) => {

//     cb(

//       null,

//       Date.now() +
//       path.extname(
//         file.originalname
//       )

//     );

//   },

// });


// // 🔥 FILE FILTER

// const fileFilter =
// (req, file, cb) => {

//   const allowedTypes = [

//     "image/jpeg",

//     "image/png",

//     "image/jpg",

//     "image/webp",

//   ];

//   if (
//     allowedTypes.includes(
//       file.mimetype
//     )
//   ) {

//     cb(null, true);

//   } else {

//     cb(

//       new Error(
//         "Only image files allowed"
//       ),

//       false

//     );

//   }

// };


// // 🔥 MULTER

// const upload = multer({

//   storage,

//   fileFilter,

//   limits: {

//     fileSize:
//     5 * 1024 * 1024,

//   },

// });


// // ======================================================
// // 🔥 GET ALL CANDIDATES
// // ======================================================

// router.get(
//   "/",
//   async (req, res) => {

//     try {

//       const candidates =
//       await Candidate.find()
//       .sort({
//         votes: -1,
//       });

//       res.status(200).json(
//         candidates
//       );

//     } catch (err) {

//       console.log(err);

//       res.status(500).json({

//         message:
//         "Failed to fetch candidates",

//       });

//     }

//   }
// );


// // ======================================================
// // 🔥 ADD CANDIDATE
// // ======================================================

// router.post(

//   "/",

//   authMiddleware,

//   upload.single("image"),

//   async (req, res) => {

//     try {

//       const {
//         name,
//         party,
//       } = req.body;

//       // 🔥 VALIDATION

//       if (
//         !name?.trim() ||
//         !party?.trim()
//       ) {

//         return res.status(400).json({

//           message:
//           "All fields required",

//         });

//       }

//       // 🔥 CHECK DUPLICATE

//       const existingCandidate =
//       await Candidate.findOne({

//         name,

//       });

//       if (
//         existingCandidate
//       ) {

//         return res.status(400).json({

//           message:
//           "Candidate already exists",

//         });

//       }

//       // 🔥 CREATE CANDIDATE

//       const candidate =
//       await Candidate.create({

//         name,

//         party,

//         image:
//         req.file
//         ? req.file.filename
//         : "",

//         votes: 0,

//       });

//       res.status(201).json({

//         message:
//         "Candidate Added Successfully",

//         candidate,

//       });

//     } catch (err) {

//       console.log(err);

//       res.status(500).json({

//         message:
//         "Failed to add candidate",

//       });

//     }

//   }

// );


// // ======================================================
// // 🔥 DELETE CANDIDATE
// // ======================================================

// router.delete(

//   "/:id",

//   authMiddleware,

//   async (req, res) => {

//     try {

//       const candidate =
//       await Candidate.findById(
//         req.params.id
//       );

//       // 🔥 CHECK EXISTS

//       if (!candidate) {

//         return res.status(404).json({

//           message:
//           "Candidate not found",

//         });

//       }

//       // 🔥 DELETE IMAGE

//       if (
//         candidate.image
//       ) {

//         const imagePath =
//         `uploads/${candidate.image}`;

//         if (
//           fs.existsSync(
//             imagePath
//           )
//         ) {

//           fs.unlinkSync(
//             imagePath
//           );

//         }

//       }

//       // 🔥 DELETE DATA

//       await Candidate.findByIdAndDelete(
//         req.params.id
//       );

//       res.status(200).json({

//         message:
//         "Candidate Deleted Successfully",

//       });

//     } catch (err) {

//       console.log(err);

//       res.status(500).json({

//         message:
//         "Failed to delete candidate",

//       });

//     }

//   }

// );

// module.exports = router;




const router =
require("express").Router();

const multer =
require("multer");

const path =
require("path");

const fs =
require("fs");

const Candidate =
require("../models/Candidate");

const authMiddleware =
require("../middleware/authMiddleware");

// ======================================================
// 🔥 CREATE UPLOADS FOLDER IF NOT EXISTS
// ======================================================

const uploadDir =
path.join(
  __dirname,
  "../uploads"
);

if (
  !fs.existsSync(uploadDir)
) {

  fs.mkdirSync(
    uploadDir,
    {
      recursive: true,
    }
  );

}

// ======================================================
// 🔥 MULTER STORAGE CONFIG
// ======================================================

const storage =
multer.diskStorage({

  // DESTINATION

  destination:
  (
    req,
    file,
    cb
  ) => {

    cb(
      null,
      uploadDir
    );

  },

  // FILE NAME

  filename:
  (
    req,
    file,
    cb
  ) => {

    const uniqueName =

      Date.now() +

      "-" +

      Math.round(
        Math.random() * 1e9
      ) +

      path.extname(
        file.originalname
      );

    cb(
      null,
      uniqueName
    );

  },

});

// ======================================================
// 🔥 FILE FILTER
// ======================================================

const fileFilter =
(
  req,
  file,
  cb
) => {

  const allowedTypes = [

    "image/jpeg",

    "image/png",

    "image/jpg",

    "image/webp",

  ];

  // VALIDATE TYPE

  if (

    allowedTypes.includes(
      file.mimetype
    )

  ) {

    cb(
      null,
      true
    );

  } else {

    cb(

      new Error(
        "Only JPG, PNG & WEBP images are allowed"
      ),

      false

    );

  }

};

// ======================================================
// 🔥 MULTER CONFIG
// ======================================================

const upload =
multer({

  storage,

  fileFilter,

  limits: {

    fileSize:
    5 * 1024 * 1024,

  },

});

// ======================================================
// 🔥 GET ALL CANDIDATES
// ======================================================

router.get(
  "/",

  async (
    req,
    res
  ) => {

    try {

      const candidates =

      await Candidate.find()

      .sort({
        votes: -1,
      });

      res
      .status(200)
      .json(candidates);

    } catch (err) {

      console.log(err);

      res
      .status(500)
      .json({

        message:
        "Failed to fetch candidates",

      });

    }

  }
);

// ======================================================
// 🔥 GET SINGLE CANDIDATE
// ======================================================

router.get(
  "/:id",

  async (
    req,
    res
  ) => {

    try {

      const candidate =

      await Candidate.findById(
        req.params.id
      );

      if (
        !candidate
      ) {

        return res
        .status(404)
        .json({

          message:
          "Candidate not found",

        });

      }

      res
      .status(200)
      .json(candidate);

    } catch (err) {

      console.log(err);

      res
      .status(500)
      .json({

        message:
        "Failed to fetch candidate",

      });

    }

  }
);

// ======================================================
// 🔥 ADD CANDIDATE
// ======================================================

router.post(

  "/",

  authMiddleware,

  upload.single("image"),

  async (
    req,
    res
  ) => {

    try {

      const {
        name,
        party,
      } = req.body;

      // VALIDATION

      if (

        !name?.trim() ||

        !party?.trim()

      ) {

        return res
        .status(400)
        .json({

          message:
          "All fields are required",

        });

      }

      // CHECK DUPLICATE

      const existingCandidate =

      await Candidate.findOne({

        name:
        name.trim(),

      });

      if (
        existingCandidate
      ) {

        return res
        .status(400)
        .json({

          message:
          "Candidate already exists",

        });

      }

      // CREATE

      const candidate =

      await Candidate.create({

        name:
        name.trim(),

        party:
        party.trim(),

        image:
        req.file
        ? req.file.filename
        : "",

        votes: 0,

      });

      res
      .status(201)
      .json({

        success: true,

        message:
        "Candidate added successfully",

        candidate,

      });

    } catch (err) {

      console.log(err);

      res
      .status(500)
      .json({

        success: false,

        message:
        "Failed to add candidate",

      });

    }

  }

);

// ======================================================
// 🔥 UPDATE CANDIDATE
// ======================================================

router.put(

  "/:id",

  authMiddleware,

  upload.single("image"),

  async (
    req,
    res
  ) => {

    try {

      const {
        name,
        party,
      } = req.body;

      const candidate =

      await Candidate.findById(
        req.params.id
      );

      if (
        !candidate
      ) {

        return res
        .status(404)
        .json({

          message:
          "Candidate not found",

        });

      }

      // DELETE OLD IMAGE

      if (

        req.file &&

        candidate.image

      ) {

        const oldImagePath =

        path.join(
          uploadDir,
          candidate.image
        );

        if (
          fs.existsSync(
            oldImagePath
          )
        ) {

          fs.unlinkSync(
            oldImagePath
          );

        }

      }

      // UPDATE DATA

      candidate.name =
      name || candidate.name;

      candidate.party =
      party || candidate.party;

      candidate.image =

      req.file
      ? req.file.filename
      : candidate.image;

      await candidate.save();

      res
      .status(200)
      .json({

        success: true,

        message:
        "Candidate updated successfully",

        candidate,

      });

    } catch (err) {

      console.log(err);

      res
      .status(500)
      .json({

        success: false,

        message:
        "Failed to update candidate",

      });

    }

  }

);

// ======================================================
// 🔥 DELETE CANDIDATE
// ======================================================

router.delete(

  "/:id",

  authMiddleware,

  async (
    req,
    res
  ) => {

    try {

      const candidate =

      await Candidate.findById(
        req.params.id
      );

      // CHECK EXISTS

      if (
        !candidate
      ) {

        return res
        .status(404)
        .json({

          message:
          "Candidate not found",

        });

      }

      // DELETE IMAGE

      if (
        candidate.image
      ) {

        const imagePath =

        path.join(
          uploadDir,
          candidate.image
        );

        if (
          fs.existsSync(
            imagePath
          )
        ) {

          fs.unlinkSync(
            imagePath
          );

        }

      }

      // DELETE DATABASE DATA

      await Candidate.findByIdAndDelete(
        req.params.id
      );

      res
      .status(200)
      .json({

        success: true,

        message:
        "Candidate deleted successfully",

      });

    } catch (err) {

      console.log(err);

      res
      .status(500)
      .json({

        success: false,

        message:
        "Failed to delete candidate",

      });

    }

  }

);

// ======================================================
// 🔥 EXPORT ROUTER
// ======================================================

module.exports =
router;