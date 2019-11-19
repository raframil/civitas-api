const express = require('express');
const uuidv4 = require('uuid/v4');
const Report = require('../models/report');
const router = express.Router();
const fs = require('fs');

// Create report
router.post('/', async (req, res) => {
  try {
    if (!req.files) {
      return res.status(400).json({ message: 'Você precisa enviar uma foto' });
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

// Return all reports
router.get('/', async (req, res) => {
  try {
    const reports = await Report.find();
    return res.status(200).json(reports);
  } catch (err) {
    return res.status(400).json({ message: err.message });
  }
});

// Return one report
router.get('/:reportId', async (req, res) => {
  try {
    const report = await Report.findById({ _id: req.params.reportId });
    return res.status(200).send({ report });
  } catch (err) {
    return res.status(400).send({ error: err });
  }
});

// Delete report
router.delete('/:reportId', async (req, res) => {
  try {
    const report = await Report.findById({ _id: req.params.reportId });
    if (report) {
      await Report.deleteOne({ _id: req.params.reportId });

      fs.unlink(report.photo, err => {
        if (err) return res.status(400).json({ error: err });
      });

      return res.status(200).json({ message: 'Ocorrência deletada com sucesso', report: report });
    } else {
      return res.status(404).json({ message: 'Ocorrência não encontrada' });
    }
  } catch (err) {
    return res.status(400).json({ error: err });
  }
});

module.exports = router;
