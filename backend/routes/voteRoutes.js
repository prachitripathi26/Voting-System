const router = require("express").Router();

const User = require("../models/User");

const Candidate = require("../models/Candidate");

const Election = require("../models/Election");


// 🔥 VOTE ROUTE

router.post("/:candidateId", async (req, res) => {

  try {

    const { userId } = req.body;

    // 🔥 CHECK USER ID

    if (!userId) {

      return res.status(400).json({

        message: "User ID is required"

      });

    }

    // 🔥 FIND USER

    const user =
    await User.findById(userId);

    if (!user) {

      return res.status(404).json({

        message: "User not found"

      });

    }

    // 🔥 CHECK ELECTION STATUS

    const election =
    await Election.findOne();

    if (!election?.isActive) {

      return res.status(400).json({

        message:
        "Election is currently stopped"

      });

    }

    // 🔥 CHECK ALREADY VOTED

    if (user.hasVoted) {

      return res.status(400).json({

        message:
        "You already voted"

      });

    }

    // 🔥 FIND CANDIDATE

    const candidate =
    await Candidate.findById(
      req.params.candidateId
    );

    if (!candidate) {

      return res.status(404).json({

        message:
        "Candidate not found"

      });

    }

    // 🔥 INCREASE VOTE

    candidate.votes += 1;

    await candidate.save();

    // 🔥 UPDATE USER

    user.hasVoted = true;

    await user.save();

    // 🔥 SUCCESS

    res.status(200).json({

      message:
      "Vote Successful",

      candidate,

    });

  } catch (err) {

    console.log(err);

    res.status(500).json({

      message:
      "Server Error"

    });

  }

});

module.exports = router;