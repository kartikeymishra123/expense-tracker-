let { Router } = require("express");
let transaction = require("../models/transaction");
let { validateToken } = require("../auth/userAuth");
let router = Router();
router.post("/add", validateToken, async (req, res) => {
  try {
    let { tittle, amount, type } = req.body;
    let expense = await transaction.create({
      tittle,
      amount,
      type,
      userId: req.user._id,
    });
    res.status(201).json(expense);
  } catch (err) {
    return res.status(400).json({ message: err.message });
  }
});
router.get("/", validateToken, async (req, res) => {
  try {
    let userId = req.user._id;
    let all = await transaction
      .find({ userId: userId })
      .select("tittle amount type createdAt _id");
    return res.status(200).json(all);
  } catch (err) {
    res.status(400).json(err);
  }
});
router.get("/:id", validateToken, async (req, res) => {
  try {
    let id = req.params.id;
    let userId = req.user._id;
    let all = await transaction
      .findOne({ _id: id, userId: userId })
      .select("tittle amount type createdAt _id");
    return res.status(200).json(all);
  } catch (err) {
    return res.status(400).json(err);
  }
});

router.put("/:id", validateToken, async (req, res) => {
  try {
    let id = req.params.id;
    let { tittle, amount, type } = req.body;
    let updated = await transaction.findOneAndUpdate(
      { _id: id, userId: req.user._id },
      { tittle, amount, type },
      { new: true, select: "tittle amount type _id" }
    );
    if (!updated) {
      return res.status(400).json({ message: "some error occured" });
    }
    return res.status(200).json(updated);
  } catch (err) {
    return res.status(400).json(err);
  }
});

router.delete("/:id", validateToken, async (req, res) => {
  try {
    let id = req.params.id;
    let deleted = await transaction.findOneAndDelete({
      _id: id,
      userId: req.user._id,
    });
    return res
      .status(200)
      .json({ message: "transaction deleted successfully" });
  } catch (err) {
    return res.status(400).json({ message: "some error occured" });
  }
});
module.exports = router;
