/**
 * Populate DB with sample data on server start
 * to disable, edit config/environment/index.js, and set `seedDB: false`
 */

'use strict';
import Mission from '../api/mission/mission.model';
import config from './environment/';
import NodeGeocoder from 'node-geocoder';

import eachLimit from 'async/eachLimit';
import series from 'async/series';

export default function seedDatabaseIfNeeded() {
  if (config.seedDB) {

    var data = [
      {
        agent: '007', country: 'Brazil',
        address: 'Avenida Vieira Souto 168 Ipanema, Rio de Janeiro',
        date: 'Dec 17, 1995, 9:45:17 PM'
      },
      {
        agent: '005', country: 'Poland',
        address: 'Rynek Glowny 12, Krakow',
        date: 'Apr 5, 2011, 5:05:12 PM'
      },
      {
        agent: '007', country: 'Morocco',
        address: '27 Derb Lferrane, Marrakech',
        date: 'Jan 1, 2001, 12:00:00 AM'
      },
      {
        agent: '005', country: 'Brazil',
        address: 'Rua Roberto Simonsen 122, Sao Paulo',
        date: 'May 5, 1986, 8:40:23 AM'
      },
      {
        agent: '011', country: 'Poland',
        address: 'swietego Tomasza 35, Krakow',
        date: 'Sep 7, 1997, 7:12:53 PM'
      },
      {
        agent: '003', country: 'Morocco',
        address: 'Rue Al-Aidi Ali Al-Maaroufi, Casablanca',
        date: 'Aug 29, 2012, 10:17:05 AM'
      },
      {
        agent: '008', country: 'Brazil',
        address: 'Rua tamoana 418, tefe',
        date: 'Nov 10, 2005, 1:25:13 PM'
      },
      {
        agent: '013', country: 'Poland',
        address: 'Zlota 9, Lublin',
        date: 'Oct 17, 2002, 10:52:19 AM'
      },
      {
        agent: '002', country: 'Morocco',
        address: 'Riad Sultan 19, Tangier',
        date: 'Jan 1, 2017, 5:00:00 PM'
      },
      {
        agent: '009', country: 'Morocco',
        address: 'atlas marina beach, agadir',
        date: 'Dec 1, 2016, 9:21:21 PM'
      }
    ];

    var options = {
      provider: 'google'
    };

    var geocoder = NodeGeocoder(options);

    eachLimit(data, 3, (mission, callback)=> {
      geocoder.geocode(mission.address + ', ' + mission.country)
        .then(function (res) {
          if (res.length != 1) return console.log('Error geocoding address: ', mission.address);
          res = res[0];
          mission.location = [res.longitude, res.latitude];
          callback();
        })
        .catch(function (err) {
          console.log(err);
          callback(err)
        });

    }, (err)=> {
      if (err)
        return console.error('error geocoding missions', err);

      Mission.find({}).remove()
        .then(() => {
          return Mission.create(data);
        })
        .then(() => console.log('finished populating missions'))
        .catch(err => console.log('error populating missions', err));
    });
  }
}
