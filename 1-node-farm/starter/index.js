const fs = require('fs');
const http = require('http');
const url = require('url');
const replaceTemplate = require('./modules/replaceTemplate.js');


// const textIn = fs.readFileSync('./txt/input.txt', 'utf-8');
// console.log(textIn);

// const textOut = `This is what we know about avocado: ${textIn}.\nCreated on ${Date.now()}`;
// fs.writeFileSync('./txt/output.txt', textOut);

// fs.readFile('./txt/start.txt', 'utf-8', (err, data1) => {
//     fs.readFile(`./txt/${data1}.txt`, 'utf-8', (err, data2) => {
//         console.log(data2);
//     });
// });
// console.log('Will read file!');


/////////////////////create a server/////////////////////

const tempOverview = fs.readFileSync(`${__dirname}/templates/template-overview.html`, 'utf-8');
const tempCard = fs.readFileSync(`${__dirname}/templates/template-card.html`, 'utf-8');
const tempProduct = fs.readFileSync(`${__dirname}/templates/template-product.html`, 'utf-8');

const data = fs.readFileSync(`${__dirname}/dev-data/data.json`, 'utf-8');
const dataObject = JSON.parse(data);

const server = http.createServer((req, res) => {

    const { query, pathname } = url.parse(req.url, true);
    

    // Overview page
    if (pathname === '/' || pathname === '/overview') {
        
        res.writeHead(200, {
            'Content-Type': 'text/html'})

        const cardsHtml = dataObject.map(el => replaceTemplate(tempCard, el)).join('');
        const output = tempOverview.replace('{%PRODUCT_CARDS%}', cardsHtml);
        res.end(output);

    // Product page
    } else if (pathname === '/product') {
         res.writeHead(200, {
            'Content-Type': 'text/html'})
        const product = dataObject[query.id];
        output = replaceTemplate(tempProduct, product);
        res.end(output);

    // API
    } else if (pathname === '/api') {
        fs.readFile(`${__dirname}/dev-data/data.json`, 'utf-8', (err, data) => {
            const productData = JSON.parse(data);
            res.writeHead(200, {
                'Content-Type': 'application/json',
                'Custom-Header': 'MyCustomHeader'
            });
            res.end(data);
        });

    // if Not found
    } else {
        res.writeHead(404, {
            'Content-Type': 'text/html',
            'Custom-Header': 'MyCustomHeader'
        });
        res.end('<h1>404 Not Found</h1><p>The page you are looking for does not exist.</p>');
    }

});

server.listen(8000, `127.0.0.1`, () => {
    console.log('Listening to requests on port 8000');
})
