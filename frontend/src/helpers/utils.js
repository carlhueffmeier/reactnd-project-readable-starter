import React from 'react';
import moment from 'moment';
import { orderBy } from 'lodash';

export function formatTimestamp(timestamp) {
  return moment(Number(timestamp)).fromNow();
}

export function sortBy(entities, order) {
  if (order === `date`) {
    return sortByDate(entities);
  }
  return sortByScore(entities);
}

export function sortByDate(entities) {
  return orderBy(entities, [`timestamp`, `voteScore`], [`desc`, `desc`]);
}

export function sortByScore(entities) {
  return orderBy(entities, [`voteScore`, `timestamp`], [`desc`, `desc`]);
}

export function renderNewlines(text) {
  return text.split(`\n`).map((item, key) => (
    <span key={key}>
      {item}
      <br />
    </span>
  ));
}
