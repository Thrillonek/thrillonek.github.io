import { load } from 'cheerio';
import cors from 'cors';
import express from 'express';
import fs from 'fs';

const app = express();

const path = './public/test';

app.use(express.static('./dist'));
app.use(cors());
app.use(express.json());

// let files = fs.readdirSync(path);
// let plus = 0;
// let arr = [];
// for (const file of files.sort((a, b) => a.replaceAll(/\D/g, '') - b.replaceAll(/\D/g, ''))) {
// 	let content = fs.readFileSync(path + '/' + file);
// 	let $ = load(content, { xml: true });
// 	let num = file.replaceAll(/\D/g, '');
// 	$(`a\\:t`).each((idx, item) => {
// 		item.children.forEach((el) => {
// 			let { data } = el;
// 			if (idx > 0) plus += 1;
// 			arr.push(data);
// 		});
// 	});
// }
// fs.writeFileSync('./public/text.txt', `${arr}`, 'utf8');

let content = fs.readFileSync('./public/text.txt', 'utf-8');
let arr = content.split(',\n');

let first = [];
let used = [];

// for (const i of arr) {
// 	if (first.includes(i)) {
// 		used.push(i);
// 		continue;
// 	}
// 	first.push(i);
// }

// console.log(used);

// let files = fs.readdirSync('./public/assets/media').sort((a, b) => a.replaceAll(/\D/g, '') - b.replaceAll(/\D/g, ''));
// console.log(files.length);
// let newFiles = files.map((f) => f.replaceAll(/\d/g, ''));
// for (const idx in files) {
// 	fs.rename('./public/assets/media/' + files[idx], './public/assets/media/' + arr[idx] + '.jpg', (err) => err && console.log(err));
// }

let myfiles = fs.readFileSync('./public/moje.txt', 'utf-8').split('\n');
let files = fs.readFileSync('./public/test.txt', 'utf-8').split('\n');

for (const file of files) {
	if (myfiles.includes(file)) continue;
	console.log(file);
}

app.get('/', (req, res) => {
	res.sendFile('./dist/index.html');
});

app.post('/test', (req, res) => {
	console.log(req.body);
	res.send('ok');
});

//app.listen(process.env.PORT || 3000, () => console.log('http://localhost:3000'));
