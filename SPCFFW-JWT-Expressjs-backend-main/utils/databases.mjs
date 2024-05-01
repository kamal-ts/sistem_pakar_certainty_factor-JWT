import mongoose from 'mongoose'

const dbUri = `mongodb+srv://kamal:23032000@cluster0.gingob6.mongodb.net/makanan-sistem-pakar?retryWrites=true&w=majority`;
mongoose.connect(dbUri, {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

// tes koneksi
const db = mongoose.connection;
db.on('error', (error) => console.info(error));
db.once('open', () => console.info("Database Connection ... "));
