import fs from 'fs';
import mongoConnect from '../dbs/mongo';
import mongoose from 'mongoose';

function fixData(objs: any[]) {
  for (let i = 0; i < objs.length; i++) {
    let obj = objs[i];
    for (const key in obj) {
      // eslint-disable-next-line no-prototype-builtins
      if (
        Boolean(obj[key]) &&
        obj[key].constructor === Object &&
        Boolean(
          Object.prototype.hasOwnProperty.call(obj[key], '$oid')
        )
        //Boolean(obj[key].hasOwnProperty("$oid"))
      ) {
        //console.log(`found id ${key}`)
        obj[key] = new mongoose.Types.ObjectId(obj[key]['$oid']);
        // eslint-disable-next-line no-prototype-builtins
      }
      if (
        Boolean(obj[key]) &&
        obj[key].constructor === String &&
        key == '$oid'
      ) {
        //console.log(`found id ${key}`)
        obj = new mongoose.Types.ObjectId(obj[key].toString());
        // eslint-disable-next-line no-prototype-builtins
      } else if (
        Boolean(obj[key]) &&
        obj[key].constructor === Object &&
        Boolean(
          Object.prototype.hasOwnProperty.call(obj[key], '$date')
        )
        //Boolean(obj[key].hasOwnProperty("$date"))
      ) {
        obj[key] = new Date(Number(obj[key]['$date']['$numberLong']));
      } else if (
        Boolean(obj[key]) &&
        obj[key].constructor === Array
      ) {
        //console.log(`found array ${key}`)
        fixData(obj[key]);
      }
    }
    objs[i] = obj;
  }
  return objs;
}
async function addData() {
  try {
    const collections = ['roles', 'users'];

    // Mongo DB conncection
    await mongoConnect();

    for (let i = 0; i < collections.length; i++) {
      const table = collections[i];
      try {
        const data = await JSON.parse(
          fs.readFileSync(`${__dirname}/data/${table}.json`, 'utf8')
        );
        const collection = mongoose.connection.db!.collection(table);
        await collection.insertMany(fixData(data));
        console.log('Data successfully imported');
      } catch (e) {
        //detect duplicated entries means, data already in the database
        if (
          (e as Error).message.includes(
            'duplicate key error collection'
          )
        ) {
          console.log('Data already exists');
        } else {
          console.error('Unhandled error:', e);
        }
      }
    }
    // to exit the process
    process.exit();
  } catch (error) {
    console.log('error', error);
    process.exit();
  }
}

module.exports = addData;
