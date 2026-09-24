const multer = require('multer');
const path = require('path');

// Dosyanın nereye ve hangi isimle kaydedileceğini ayarlıyoruz
const storage = multer.diskStorage({
  destination(req, file, cb) {
    cb(null, 'uploads/'); // Dosyalar ana dizindeki 'uploads' klasörüne kaydedilecek
  },
  filename(req, file, cb) {
    // Dosya adının başına benzersiz bir zaman damgası ekliyoruz ki aynı isimli dosyalar çakışmasın
    cb(null, `${file.fieldname}-${Date.now()}${path.extname(file.originalname)}`);
  }
});

// Sadece resim dosyalarına izin vermek için filtre (File Filter)
const fileFilter = (req, file, cb) => {
  const filetypes = /jpe?g|png|webp/;
  const mimetypes = /image\/jpeg|image\/png|image\/webp/;

  const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = mimetypes.test(file.mimetype);

  if (extname && mimetype) {
    return cb(null, true);
  } else {
    cb(new Error('Sadece resim dosyaları (jpg, jpeg, png, webp) yüklenebilir!'));
  }
};

const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 } // Maksimum 5 MB boyut sınırı
});

module.exports = upload;