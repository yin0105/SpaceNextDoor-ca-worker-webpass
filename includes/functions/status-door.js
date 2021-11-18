const axios = require("./../connectors/targetApi");
const cheerio = require('cheerio');
const logger = require('./../logging/main');

const checkDoorStatus = (provider_id, door_id) => {
  return new Promise(async(resolve, reject) => {
    await axios.get(
      "/Scrt.htm"
    ).then((success)=>{
        logger.info('Getting door status (door id: '+door_id+')')
        const $ = cheerio.load(success.data)
        const color = $("#Door_staus img").eq(-1).attr('src');
        let state = '';
        switch(color){
          case 'v.gif':
            state = 'closed';
            break;
          case 'yellow.gif':
            state = 'opened';
            break;
          case 'red.gif':
            state = 'short circuit';
            break;
        }
        resolve(state);
    }).catch((error)=>{
        logger.error('Failed to get door status (door id: '+door_id+')')
        reject('issue with connecting')
    })
  });
};

module.exports = checkDoorStatus;