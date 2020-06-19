const express = require("express");
const Course = require("../models/Course");
const geocoder = require("../utils/geocoder");
let router = express.Router();
const path = require("path");

router.post("/", function (req, res) {
  try {
    let course = Course.create(req.body);
    res.status(201).json({
      success: true,
      data: course,
    });
  } catch (err) {
    console.log("err");
    res.status(400).json({ success: false });
  }
});

// get single object
router.get("/:id", async (req, res) => {
  try {
    let bootcamp = await Course.findById(req.params.id);
    if (!bootcamp) {
      res.status(400).json({ success: false });
    }
    res.status(201).json({
      success: true,
      data: bootcamp,
    });
  } catch (err) {
    res.status(400).json({ success: false });
  }
});
router.get("/", async (req, res) => {
  try {
    const posts = await Course.find().sort({ date: -1 });
    res.json({ success: true, data: posts });
  } catch (err) {
    // try {
    //   let bootcamp = await Course.find();
    //   if (!bootcamp) {
    //     res.status(400).json({ success: false });
    //   }
    //   res.status(201).json({
    //     success: true,
    //     data: bootcamp,
    //   });
    // }
    res.status(400).json({ success: false });
  }
});

router.put("/:id", async (req, res) => {

  try {
    let bootcamp = await Course.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
   
    // if (!bootcamp) {
    //   res.status(400).json({ success: false });
    // }
    res.status(201).json({
      success: true,
      data: bootcamp,
    });
  } catch (err) {
    res.status(400).json({ success: false });
  }
});
//   get all object
module.exports = router;
