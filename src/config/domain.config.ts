import { dbConfig } from './db.config';

let domain;

switch(dbConfig.host) {
    case 'localhost': domain = `http://${dbConfig.host}`;
        break;
    default: domain = `https://${dbConfig.host}`
}


export default domain;
