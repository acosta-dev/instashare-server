const gridfs = require("../utils/gridfs");
const AdmZip = require("adm-zip");
const path = require("path");
var fs = require("fs");
const File = require("../models/file.model");

const extractFilename = function (str) {
  return str.split("\\").pop().split("/").pop();
};

const uploadFile = async (req, res) => {
  async function createZipArchive() {
    const zip = new AdmZip();
    const outputFile = `./tmp/${
      path.parse(extractFilename(req.file.path)).name + ".zip"
    }`;
    zip.addLocalFile(req.file.path);
    zip.writeZip(outputFile);
  }
  createZipArchive();
  fs.unlink(req.file.path, (err) => {
    if (err) throw err;
  });
  const result = gridfs.uploadGridFS(res,
    `./tmp/${path.parse(extractFilename(req.file.path)).name + ".zip"}`,
    req
  );
};

const downloadFile = async (req, res) => {
  gridfs.downloadGridFS(req,res);
}

const deleteFile = async (req, res) => {
  await File.findOneAndDelete({fileId:req.params.fileid});
  gridfs.deleteFileGridFS(req,res);
}

const getAllPublicFiles = async (req, res) => {
  return await File.find({public:true});
}

const getMyFiles = async (req, res) => {
  return await File.find({userId:req.user.userId});
}




module.exports = { uploadFile, downloadFile, deleteFile, getAllPublicFiles, getMyFiles };
