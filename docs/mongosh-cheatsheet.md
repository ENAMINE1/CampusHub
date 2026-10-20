# mongosh cheat sheet

The MongoDB shell commands used in Video 58. Run them against your Atlas cluster or a local
MongoDB, before any app code touches the database.

## Connect

```bash
# Atlas (copy the string from Atlas: Connect → Shell). You will be asked for the password.
mongosh "mongodb+srv://cluster0.xxxxx.mongodb.net/" --username campushub

# Local MongoDB or Docker (docker run -d -p 27017:27017 --name campushub-mongo mongo:8)
mongosh "mongodb://localhost:27017"
```

## Look around

```js
show dbs                 // list databases
use campushub            // switch to (and lazily create) the campushub database
show collections         // list collections in it
db.events.countDocuments()
```

## Insert

```js
db.events.insertOne({
  title: 'Intro to Git Workshop',
  category: 'workshop',
  venue: 'Lab 2, CS Block',
  startsAt: ISODate('2026-11-10T10:30:00Z'),
  capacity: 40,
  seatsTaken: 0,
});

db.events.insertMany([
  { title: 'Hack Night', category: 'tech', capacity: 30, seatsTaken: 30 },
  { title: 'Football Final', category: 'sports', capacity: 500, seatsTaken: 97 },
]);
```

Every document gets an `_id` (an `ObjectId`) automatically.

## Find

```js
db.events.find(); // everything
db.events.find({ category: 'tech' }); // exact match
db.events.findOne({ title: 'Hack Night' }); // first match or null
db.events.find({ capacity: { $gte: 100 } }); // comparison: $gt $gte $lt $lte $ne $in
db.events.find({ $expr: { $lt: ['$seatsTaken', '$capacity'] } }); // compare two fields: not full
db.events.find({}, { title: 1, startsAt: 1, _id: 0 }); // projection: only some fields
db.events.find().sort({ startsAt: 1 }).limit(5); // sort ascending, first 5
db.events.find().skip(5).limit(5); // page 2 of 5 per page
```

## Update

```js
db.events.updateOne({ title: 'Hack Night' }, { $set: { venue: 'Innovation Hub' } });
db.events.updateOne({ title: 'Football Final' }, { $inc: { seatsTaken: 1 } }); // add 1
db.events.updateMany({ category: 'tech' }, { $set: { featured: true } });
db.events.updateMany({}, { $unset: { featured: '' } }); // remove a field
```

Without an operator like `$set`, `updateOne` would refuse (MongoDB 5+): replacing a whole
document is `replaceOne`.

## Delete

```js
db.events.deleteOne({ title: 'Hack Night' });
db.events.deleteMany({ category: 'sports' });
db.events.drop(); // the whole collection. There is no undo.
```

## Indexes and explain

```js
db.events.createIndex({ startsAt: 1 });
db.events.getIndexes();
db.events.find({ startsAt: { $gte: new Date() } }).explain('executionStats');
// Look for IXSCAN (used an index) instead of COLLSCAN (read every document).
```

## The connection string for the app

The API reads it from `MONGODB_URI` in `server/.env`:

```bash
# Atlas: Database → Connect → Drivers. Add the database name (campushub) before the "?".
MONGODB_URI=mongodb+srv://campushub:<password>@cluster0.xxxxx.mongodb.net/campushub?retryWrites=true&w=majority

# Local MongoDB or Docker
MONGODB_URI=mongodb://localhost:27017/campushub
```

If Atlas refuses the connection, add your current IP under **Network Access**.
