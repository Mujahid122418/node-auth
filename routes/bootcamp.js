const express = require("express");
const Bootcamp = require("../models/bootcamp");
const geocoder = require("../utils/geocoder");
let router = express.Router();
const path = require("path");
const {protect} = require('../middleware/auth')
const courseRouter = require('./courses');
router.use('/:bootcampId/courses', courseRouter);
// get all bootcamp
router.get("/", async (req, res) => {
  let query;

  // Copy req.query
  const reqQuery = { ...req.query };

  // Fields to exclude
  const removeFields = ['select', 'sort', 'page', 'limit'];
  // Loop over removeFields and delete them from reqQuery
  removeFields.forEach(param => delete reqQuery[param]);


  // Create query string
  let queryStr = JSON.stringify(reqQuery);
  // Create operators ($gt, $gte, etc)
  queryStr = queryStr.replace(/\b(gt|gte|lt|lte|in)\b/g, match => `$${match}`);
  
  // Finding resource
  query = Bootcamp.find(JSON.parse(queryStr));
   // Select Fields
   if (req.query.select) {
    const fields = req.query.select.split(',').join(' ');
    query = query.select(fields);
  }

  // Sort
  if (req.query.sort) {
    const sortBy = req.query.sort.split(',').join(' ');
    query = query.sort(sortBy);
  } else {
    query = query.sort('-createdAt');
  }
  const page = parseInt(req.query.page, 10) || 1;
  const limit = parseInt(req.query.limit, 10) || 10;
  const startIndex = (page - 1) * limit;
  const endIndex = page * limit;
  const total = await Bootcamp.countDocuments();
  
  const pagination = {};
  if (endIndex < total) {
    pagination.next = {
      page: page + 1,
      limit,
    };
  }
  if (startIndex > 0) {
    pagination.prev = {
      page: page - 1,
      limit,
    };
  }
  try {
    let bootcamp = await query;
    res.status(201).json({
      success: true,
      data: bootcamp,
      count: bootcamp.length,
      pagination,
    });
  } catch (err) {
    res.status(400).json({ success: false });
  }
});
// get single bootcamp
router.get("/:id", async (req, res) => {
  try {
    let bootcamp = await Bootcamp.findById(req.params.id);
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
router.post("/",protect ,  function (req, res) {
  // console.log('req body', req.body)
  try {
    let bootcamp = Bootcamp.create(req.body);
    res.status(201).json({
      success: true,
      data: bootcamp,
    });
    // res.status(200).json({success:true, msg:'post data'})
  } catch (err) {
    console.log("err");
    res.status(400).json({ success: false });
  }
});

// update the bootcamp
router.put("/:id", async (req, res) => {
  try {
    let bootcamp = await Bootcamp.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
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
// delete the bootcamp
router.delete("/:id", async (req, res) => {
  try {
    let bootcamp = await Bootcamp.findByIdAndUpdate(req.params.id);
    if (!bootcamp) {
      res.status(400).json({ success: false });
    }
    res.status(201).json({
      success: true,
      data: {},
    });
  } catch (err) {
    res.status(400).json({ success: false });
  }
});

router.get("/radius/:zip/:distance", async (req, res) => {
  const { zip, distance } = req.params;
  let loc = await geocoder.geocode(zip);
  const lat = loc[0].latitude;
  const lng = loc[0].longitude;

  // get radius
  const radius = distance / 3936;

  const bootcamps = await Bootcamp.find({
    location: { $geoWithin: { $centerSphere: [[lng, lat], radius] } },
  });
  res.status(200).json({
    success: true,
    count: bootcamps.length,
    data: bootcamps,
  });
});

router.put("/file:id", async (req, res) => {
    console.log('file' ,req.files.file)
  const bootcamp = await Bootcamp.findById(req.params.id);
  if (!bootcamp) {
    return next(
      new ErrorResponse(`Bootcamp not found with id of ${req.params.id}`, 404)
    );
  }
  if (!req.files) {
    return next(new ErrorResponse(`Please upload a file`, 400));
  }

  const file = req.files.file;

  // Make sure the image is a photo
  if (!file.mimetype.startsWith("image")) {
    return next(new ErrorResponse(`Please upload an image file`, 400));
  }

  // Check filesize
  if (file.size > process.env.MAX_FILE_UPLOAD) {
    return next(
      new ErrorResponse(
        `Please upload an image less than ${process.env.MAX_FILE_UPLOAD}`,
        400
      )
    );
  }
  // Create custom filename
  file.name = `photo_${bootcamp._id}${path.parse(file.name).ext}`;

  file.mv(`${process.env.FILE_UPLOAD_PATH}/${file.name}`, async (err) => {
    if (err) {
      console.error(err);
      return next(new ErrorResponse(`Problem with file upload`, 500));
    }

    await Bootcamp.findByIdAndUpdate(req.params.id, { photo: file.name });

    res.status(200).json({
      success: true,
      data: file.name,
    });
  });
});
module.exports = router;
