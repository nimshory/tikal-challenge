import Mission from './mission.model';

function respondWithResult(res, entity, statusCode) {
  statusCode = statusCode || 200;
  return res.status(statusCode).json(entity);
}

function handleError(res, err, statusCode) {
  statusCode = statusCode || 500;
  res.status(statusCode).send(err);
}

export function countriesByIsolation(req, res) {
  Mission.aggregate(
    [
      {
        "$group": {
          "_id": {"agent": "$agent"},
          "missionCount": {"$sum": 1},
          "country": {"$first": "$country"}
        }
      },
      {
        "$match": {
          "missionCount": {"$eq": 1}
        }
      },
      {
        "$group": {
          "_id": {"country": "$country"},
          "isolation": {"$sum": 1}
        }
      },
      {
        "$sort": {"isolation": -1}
      }
    ])
    .limit(1)
    .exec()
    .then(doc => {
      respondWithResult(res, {country: doc[0]._id.country, isolation: doc[0].isolation});
    })
    .catch(err => {
      console.log('Error: ', err);
      handleError(res, err);
    });
}

export function closest(req, res) {

  var coords = req.body["target-location"];

  // skipping accepting addresses -
  // it will essentially work the same way as in the database seed phase
  // basic check for format - should be more robust
  if (!Array.isArray(coords) || coords.length != 2)
    return handleError(res, "Error: Unidentified coordinates format.", 400);

  Mission
    .find({
      location: {
        $nearSphere: coords
      }
    })
    .limit(1)
    .exec()
    .then(doc => {
      respondWithResult(res, doc);
    })
    .catch(err => {
      console.log('Error: ', err);
      handleError(res, err);
    });
}

export function farthest(req, res) {

  var coords = req.body["target-location"];

  // skipping accepting addresses -
  // it will essentially work the same way as in the database seed phase
  // basic check for format - should be more robust
  if (!Array.isArray(coords) || coords.length != 2)
    return handleError(res, "Error: Unidentified coordinates format.", 400);

  Mission.aggregate([
      {
        "$geoNear": {
          "near": {
            "type": "Point",
            "coordinates": coords
          },
          "spherical": true,
          "distanceField": "distance"
        }
      },
      {"$sort": {"distance": -1}},
      {"$limit": 1}
    ])
    .exec()
    .then(doc => {
      respondWithResult(res, doc);
    })
    .catch(err => {
      console.log('Error: ', err);
      handleError(res, err);
    });
}
