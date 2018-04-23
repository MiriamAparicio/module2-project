'use strict';

const express = require('express');
const mongoose = require('mongoose');
const router = express.Router();

const User = require('../models/user');
const Event = require('../models/event');

router.get('/new', (req, res, next) => {
  res.render('pages/event/event-create');
});

router.post('/', (req, res, next) => {
  const userId = req.session.user._id;
  req.body.owner = userId;
  const location = {
    type: 'Point',
    coordinates: [req.body.longitude, req.body.latitude]
  };
  req.body.location = location;
  // req.body.date = new Date(req.body.date);

  const event = new Event(req.body);
  event.save()
    .then(() => {
      res.redirect(`/users/${userId}`);
    })
    .catch(next);
});

module.exports = router;
