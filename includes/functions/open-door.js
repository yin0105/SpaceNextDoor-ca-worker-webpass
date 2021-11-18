const axios = require("./../connectors/targetApi");
const cheerio = require('cheerio');
const logger = require("./../logging/main");

const openDoor = (provider_id, door_id) => {
  return new Promise(async (resolve, reject) => {
    await axios
      .get(
        "man.cgi?redirect=scrt.htm&failure=fail.htm&type=door_on&securitystate=1",
      )
      .then((success) => {
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
        
        logger.info("Door opened successfully (door id: " + door_id + " state: "+state+")");
        resolve(true);
      })
      .catch((error) => {
        console.log(error);
        logger.error("Failed to open door (door id: " + door_id + ")");
        reject(false);
      });
  });
};

module.exports = openDoor;
