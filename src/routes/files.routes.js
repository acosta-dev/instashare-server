const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth.middleware");

const fileCtrl = require("../controllers/file.controller");
const gridfs = require('../utils/gridfs')
const multer = require('multer')

const upload = multer({

  storage: multer.diskStorage({
    destination: './tmp',
    filename: function (res, file, cb) {
      cb(null, file.originalname);
    },
  })

});

router.post("/", auth,upload.single('file'),async (req, res) => {
  
  return fileCtrl.uploadFile(req,res)
});

router.get("/:fileid", auth,async (req, res) => {
  //return res.send(req.params.fileid)
  return fileCtrl.downloadFile(req,res);
});

router.delete("/:fileid", auth,async (req, res) => {
  //return res.send(req.params.fileid)
  return fileCtrl.deleteFile(req,res);
});

router.get("/", auth,async (req, res) => {
  const publicFiles = await fileCtrl.getAllPublicFiles()
  return res.status(200).send(publicFiles)
});

router.get("/mojon", auth,async (req, res) => {
  
  return res.send('kk')
});

router.patch("/myfiles", auth,async (req, res) => {
  const myFiles = await fileCtrl.getMyFiles(req, res)
  return res.status(200).send(myFiles)
});


module.exports=router;