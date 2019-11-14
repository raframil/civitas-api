const express = require('express');
const uuidv4 = require('uuid/v4');
const Report = require('../models/report');
const router = express.Router();

router.post('/', async (req, res) => {
  try {
    if (!req.files) {
      return res.status(400).json({ message: 'You must upload a photo' });
    } else {
      var localObject = {
        latitude: req.body.latitude,
        longitude: req.body.longitude,
        address: req.body.address
      };

      let reportPhoto = req.files.photo;
      let randomName = uuidv4();
      let ext = reportPhoto.mimetype.split('/');

      reportPhoto.mv('./uploads/' + randomName + '.' + ext[1]);

      const report = new Report({
        description: req.body.description,
        location: localObject,
        photo: 'uploads/' + randomName + '.' + ext[1],
        reportType: req.body.reportType
      });
      try {
        const newReport = await report.save();
        return res.status(201).json(report);
      } catch (err) {
        return res.status(400).json({ message: err.message });
      }
    }
  } catch (err) {
    res.status(500).json(err);
  }
});

router.get('/', async (req, res) => {
  try {
    const reports = await Report.find();
    return res.status(200).json(reports);
  } catch (err) {
    return res.status(400).json({ message: err.message });
  }
});

router.get('/:reportId', async (req, res) => {
  try {
    const report = await Report.findById(req.params.reportId);
    return res.status(200).send({ report });
  } catch (err) {
    return res.status(400).send({ error: err });
  }
});

module.exports = router;
