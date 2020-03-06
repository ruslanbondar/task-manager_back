const express = require("express");
const multer = require("multer");
const sharp = require("sharp");
const User = require("../models/user");
const auth = require("../middleware/auth");
const router = new express.Router();

router.post("/users", async (req, res) => {
  const user = new User(req.body);

  try {
    await user.save();
    res.status(201).send({ user });
  } catch (e) {
    res.status(400).send(e);
  }
});

router.get("/users", async (req, res) => {
  try {
    const users = await User.find({});
    res.send(users);
  } catch (e) {
    res.status(500).send();
  }
});

router.post("/users/login", async (req, res) => {
  try {
    const user = await User.findByCredentials(
      req.body.email,
      req.body.password
    );
    const token = await user.generateAuthToken();
    res.send({ user, token });
  } catch (e) {
    res.status(400).send();
  }
});

router.post("/users/logout", auth, async (req, res) => {
  try {
    req.user.tokens = req.user.tokens.filter(token => {
      return token.token !== req.token;
    });
    await req.user.save();

    res.send();
  } catch (e) {
    res.status(500).send();
  }
});

router.post("/users/logoutAll", auth, async (req, res) => {
  try {
    req.user.tokens = [];
    await req.user.save();
    res.send();
  } catch (e) {
    res.status(500).send();
  }
});

router.get("/users/me", auth, async (req, res) => {
  res.send(req.user);
});

router.patch("/users/me", auth, async (req, res) => {
  const updates = Object.keys(req.body);
  const allowedUpdates = ["name", "email", "password", "age"];
  const isValidOperation = updates.every(update =>
    allowedUpdates.includes(update)
  );

  if (!isValidOperation) {
    return res.status(400).send({ error: "Invalid updates!" });
  }

  try {
    updates.forEach(update => (req.user[update] = req.body[update]));
    await req.user.save();
    res.send(req.user);
  } catch (e) {
    res.status(400).send(e);
  }
});

router.delete("/users/me", auth, async (req, res) => {
  try {
    await req.user.remove();
    res.send(req.user);
  } catch (e) {
    res.status(500).send();
  }
});

// const storage = multer.diskStorage({
//   destination: (req, file, cb) => {
//     if (fs.existsSync(pathRootDir)) {
//       cb(null, pathRootDir);
//     } else {
//       // { recursive: true }, - for create dir if it wasn't created
//       fs.mkdir(pathRootDir, function(err) {
//         if (err) {
//           cb(new Error('Some error when directory was creating'));
//         } else {
//           cb(null, pathRootDir);
//         }
//       });
//     }
//   },
//   filename: (req, file, cb) => {
//     const a = file.originalname.split('.');
//     cb(
//       null,
//       ${req.baseUrl.replace(/(\/api\/)([a-z]+)(\D*)/, '$2')}-${file.fieldname}-${Date.now()}.${a[a.length - 1]}
//     );
//   },
// });

// const upload = multer({
//   limits: {
//     fileSize: 1000000
//   },
//   fileFilter(req, file, cb) {
//     if (!file.originalname.match(/\.(jpg|jpeg|png)$/)) {
//       return cb(new Error("Please upload an image"));
//     }

//     cb(undefined, true);
//   }
// });

// router.post("/users/me/avatar", auth, upload.single("avatar"), async (req, res) => {
//   req.user.avatar = req.file.buffer;
//   await req.user.save();
//   res.send();
// }, (error, req, res, next) => {
//   res.status(400).send({ error: error.message })
// })

// router.post(
//   "/users/me/avatar",
//   auth,
//   upload.single("avatar"),
//   async (req, res) => {
//     const buffer = await sharp(req.file.buffer)
//       .resize({ width: 250, height: 250 })
//       .png()
//       .toBuffer();
//     req.user.avatar = buffer;
//     await req.user.save();
//     res.send();
//   },
//   (error, req, res, next) => {
//     res.status(400).send({ error: error.message });
//   }
// );

// router.get("/users/:id/avatar", async (req, res) => {
//   try {
//     const user = await User.findById(req.params.id);

//     if (!user || !user.avatar) {
//       throw new Error();
//     }

//     res.set("Content-Type", "image/png");
//     res.send(user.avatar);
//   } catch (e) {
//     res.status(404).send();
//   }
// });

module.exports = router;
