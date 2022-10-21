var MongoClient = require("mongodb").MongoClient;
const {ObjectId} = require('mongodb'); 
var mongoose = require("mongoose");
const File = require("../models/file.model");
var fs = require("fs");

function formatBytes(bytes, decimals = 2) {
  if (!+bytes) return "0 Bytes";
  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ["Bytes", "KB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(dm))} ${sizes[i]}`;
}

const extractFilename = function (str) {
  return str.split("\\").pop().split("/").pop();
};

const uploadGridFS = (res, filename, req) => {
  MongoClient.connect("mongodb://localhost:27017", async (err, client) => {
    const db = client.db("instashare");
    const bucket = new mongoose.mongo.GridFSBucket(db, {
      bucketName: "fs",
    });

    const uploadFile = fs.createReadStream(filename).pipe(
      bucket.openUploadStream(extractFilename(filename), {
        chunkSizeBytes: 1048576,
        metadata: { field: "myField", value: "myValue" },
        contentType: "application/zip",
      })
    );

    uploadFile.on("finish", async () => {
      const fileSize = formatBytes(fs.statSync(filename).size);
      fs.unlink(filename, (err) => {
        if (err) throw err;
      });
      await File.create({
        userId: req.user.userId,
        fileId: uploadFile.id,
        filename: extractFilename(filename), // sanitize: convert email to lowercase
        size: fileSize,
        public: req.body.public,
      });
      res.send("Finished!");
    });
  });
};

const downloadGridFS = (req, res) => {
  const fileid = req.params.fileid;

  MongoClient.connect("mongodb://localhost:27017", function (err, client) {
    var db = client.db("instashare");
    var bucket = new mongoose.mongo.GridFSBucket(db, {
      bucketName: "fs",
    });
    
    
    const file = new ObjectId(fileid);
    bucket.find({ _id: file }).toArray(function (err, files) {
      if (files.length > 0) {
        var filename = files[0].filename;
        res.set({
          "Content-Type": "application/zip",
          "Content-Disposition": "attachment; filename=" + filename,
        });
        bucket.openDownloadStreamByName(filename).pipe(res);
      } else {
        res.status(404).send({
          message: "FILE NOT FOUND!",
        });
      }
    });
  });
};

const deleteFileGridFS = (req, res) => {
  const fileid = req.params.fileid;
MongoClient.connect('mongodb://localhost:27017', function (err, client) {
      var db = client.db('instashare');
      var bucket = new mongoose.mongo.GridFSBucket(db, {
        bucketName: 'fs',
      });

      const file = new ObjectId(fileid);
      bucket.find({ _id: file }).toArray( function (err, files) {
        if (files.length > 0) {
          files.map((file) => {
            bucket.delete(file._id);
            return res.status(204).send();
          });
        } else {
          return res.status(404).send({
            message: 'FILE NOT FOUND!',
          });
        }
      });
    });
  } 

module.exports = {
  uploadGridFS,
  downloadGridFS,
  deleteFileGridFS
};
