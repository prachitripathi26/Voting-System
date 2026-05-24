const router =
require("express").Router();

const Election =
require("../models/Election");


// 🔥 GET STATUS

router.get("/", async (req, res) => {

  try {

    let election =
    await Election.findOne();

    // 🔥 CREATE DEFAULT

    if (!election) {

      election =
      await Election.create({
        isActive: true,
      });

    }

    res.json(election);

  } catch (err) {

    res.status(500).json(err);

  }

});


// 🔥 TOGGLE STATUS

router.put("/toggle", async (req, res) => {

  try {

    let election =
    await Election.findOne();

    if (!election) {

      election =
      await Election.create({
        isActive: true,
      });

    }

    election.isActive =
    !election.isActive;

    await election.save();

    res.json({
      message:
      election.isActive
      ? "Election Started"
      : "Election Stopped",

      isActive:
      election.isActive,
    });

  } catch (err) {

    res.status(500).json(err);

  }

});

module.exports = router;