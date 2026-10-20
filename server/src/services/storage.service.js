// Picks the storage adapter from config, so the rest of the app only knows save() and remove().
import config from '../config/index.js';
import * as localDisk from './storage/localDisk.js';
import * as objectStorage from './storage/objectStorage.js';

const storage = config.storageDriver === 'object' ? objectStorage : localDisk;

export default storage;
