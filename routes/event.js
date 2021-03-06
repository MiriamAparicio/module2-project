'use strict';

const express = require('express');
const mongoose = require('mongoose');
const router = express.Router();

const Event = require('../models/event');
const Utils = require('../utils');

const utils = new Utils();

router.get('/new', (req, res, next) => {
  if (req.session.user) {
    const data = { errorMessage: req.flash('create-error') };
    res.render('pages/event/event-create', data);
  } else {
    res.redirect('/auth/login');
  }
});

router.post('/', (req, res, next) => {
  const name = req.body.name;
  const description = req.body.description;
  const date = req.body.date;
  const longitude = req.body.longitude;
  const latitude = req.body.latitude;

  // check if the form is empty
  if (name === '' || description === '' || date === '' || longitude === '' || latitude === '') {
    req.flash('create-error', 'You have to fill all the fields');
    res.redirect('/event/new');
    return;
  }

  const owner = req.session.user._id;
  const location = {
    type: 'Point',
    coordinates: [req.body.longitude, req.body.latitude]
  };

  const data = {
    name,
    description,
    date,
    owner,
    location
  };

  const event = new Event(data);
  event.save()
    .then(() => {
      res.redirect(`/users/${event.owner}`);
    })
    .catch(next);
});

router.get('/:id', (req, res, next) => {
  if (!req.session.user) {
    res.redirect('/auth/login');
    return;
  }

  const eventId = req.params.id;

  // validate mongo id and send 404 if invalid
  if (!mongoose.Types.ObjectId.isValid(eventId)) {
    next();
    return;
  }

  Event.findById(eventId)
    .populate('attendants')
    .populate('owner')
    .then((result) => {
      const userId = req.session.user._id;
      let userEqualsCreator = result.owner._id.equals(userId);
      let joinedEvent = false;
      for (let i = 0; i < result.attendants.length; i++) {
        if (result.attendants[i].equals(userId)) {
          joinedEvent = true;
        }
      }

      const data = {
        event: result,
        buttonPermission: userEqualsCreator,
        joinedEvent: joinedEvent
      };
      data.event.formattedDate = utils.formatDatePartials(result.date);
      res.render('pages/event/event-detail', data);
    })
    .catch(next);
});

router.get('/:id/json', (req, res, next) => {
  Event.findById(req.params.id)
    .then((results) => {
      res.json(results);
    })
    .catch(next);
});

router.post('/:id/delete', (req, res, next) => {
  if (!req.session.user) {
    res.redirect('/auth/login');
    return;
  }
  const userId = req.session.user._id;
  const eventId = req.params.id;

  // validate mongo id and send 404 if invalid
  if (!mongoose.Types.ObjectId.isValid(eventId)) {
    next();
    return;
  }

  Event.findByIdAndRemove(eventId)
    .then(() => {
      res.redirect(`/users/${userId}`);
    })
    .catch(next);
});

router.post('/:id/join', (req, res, next) => {
  if (!req.session.user) {
    res.redirect('/auth/login');
    return;
  }

  const userId = req.session.user._id;
  const eventId = req.params.id;

  // validate mongo id and send 404 if invalid
  if (!mongoose.Types.ObjectId.isValid(eventId)) {
    next();
    return;
  }

  Event.findByIdAndUpdate(eventId, {$addToSet: { attendants: userId }})
    .then(() => {
      res.redirect(`/users/${userId}`);
    })
    .catch(next);
});

router.post('/:id/unjoin', (req, res, next) => {
  if (!req.session.user) {
    res.redirect('/auth/login');
    return;
  }

  const userId = req.session.user._id;
  const eventId = req.params.id;

  // validate mongo id and send 404 if invalid
  if (!mongoose.Types.ObjectId.isValid(eventId)) {
    next();
    return;
  }

  Event.findByIdAndUpdate(eventId, { $pull: { attendants: userId } })
    .then(() => {
      res.redirect(`/users/${userId}`);
    })
    .catch(next);
});

router.get('/:id/update', (req, res, next) => {
  if (!req.session.user) {
    res.redirect('/auth/login');
    return;
  }
  const eventId = req.params.id;

  // validate mongo id and send 404 if invalid
  if (!mongoose.Types.ObjectId.isValid(eventId)) {
    next();
    return;
  }

  Event.findById(eventId)
    .then((result) => {
      const data = {
        event: result
      };
      data.event.formattedDate = utils.formatDateForms(result.date);
      res.render('pages/event/event-edit', data);
    })
    .catch(next);
});

router.post('/:id/update', (req, res, next) => {
  if (!req.session.user) {
    res.redirect('/auth/login');
    return;
  }

  const userId = req.session.user._id;
  const eventId = req.params.id;

  // validate mongo id and send 404 if invalid
  if (!mongoose.Types.ObjectId.isValid(eventId)) {
    next();
    return;
  }

  Event.findById(eventId)
    .then((event) => {
      const location = {
        type: 'Point',
        coordinates: [req.body.longitude, req.body.latitude]
      };
      req.body.location = location;

      event.name = req.body.name;
      event.date = req.body.date;
      event.description = req.body.description;
      event.location = location;

      return event.save();
    })
    .then(() => {
      res.redirect(`/users/${userId}`);
    })
    .catch(next);
});

module.exports = router;
