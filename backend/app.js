const express = require("express");
const sqlite3 = require("sqlite3");
const { open } = require("sqlite");
const path = require("path");

const app = express();
app.use(express.json());
module.exports = app;

const dbPath = path.join(__dirname, "roxilerApp.db");

let db = null;

const initializeDbAndServer = async () => {
  try {
    db = await open({
      filename: dbPath,
      driver: sqlite3.Database,
    });
    app.listen(3001, () => {
      console.log("Server Running Successfully at http://localhost:3001");
    });
  } catch (e) {
    console.log(`Error ${e}`);
    process.exit(1);
  }
};

initializeDbAndServer();

const hasPriceProperty = (requestQuery) => {
  return requestQuery.price !== undefined;
};
const hasTitleProperty = (requestQuery) => {
  return requestQuery.title !== undefined;
};

const hasDescriptionProperty = (requestQuery) => {
  return requestQuery.description !== undefined;
};

const hasPriceAndTitleProperty = (requestQuery) => {
  return requestQuery.price !== undefined && requestQuery.title !== undefined;
};

const hasPriceAndDescriptionProperty = (requestQuery) => {
  return (
    requestQuery.price !== undefined && requestQuery.description !== undefined
  );
};

const hasDescriptionAndTitleProperty = (requestQuery) => {
  return (
    requestQuery.description !== undefined && requestQuery.title !== undefined
  );
};

//API 1
app.get("/home/", async (request, response) => {
  const { title, description, price, page_no, month } = request.query;
  const sampleResponseQuery = `SELECT * FROM product WHERE sold='${false}';`;

  let getResponseQuery;
  switch (true) {
    case hasPriceProperty(request.query):
      getResponseQuery = `
        SELECT * 
        FROM product 
        WHERE price LIKE '${price}'
        `;
      break;
    case hasDescriptionProperty(request.query):
      getResponseQuery = `
        SELECT * 
        FROM product 
        WHERE description LIKE '${description}'
        `;
      break;
    case hasTitleProperty(request.query):
      getResponseQuery = `
        SELECT * 
        FROM product 
        WHERE title LIKE '${title}'
        `;
      break;
    case hasPriceAndTitleProperty(request.query):
      getResponseQuery = `
        SELECT * 
        FROM todo 
        WHERE price LIKE '${price}'
        AND title LIKE '${title}'
        `;
      break;
    case hasPriceAndDescriptionProperty(request.query):
      getResponseQuery = `
        SELECT * 
        FROM product 
        WHERE price LIKE '${price}'
        AND description LIKE '${description}'
        `;
      break;
    case hasDescriptionAndTitleProperty(request.query):
      getResponseQuery = `
        SELECT * 
        FROM product
        WHERE description LIKE '${description}'
        AND title LIKE '${title}'
        `;
      break;
    default:
      getResponseQuery = `
        SELECT * FROM product WHERE todo LIKE '%${month}%'`;
      break;
  }
  const response = await db.all(sampleResponseQuery);
  console.log(response);
});

//API 2
app.get("/home/stats/", async (request, response) => {
  const { month } = request.query;

  const getSaleQuery = `SELECT sum(price) FROM product WHERE ;`;
  const salesResponse = await db.get(getSaleQuery);

  const getSoldQuery = `SELECT COUNT() FROM product WHERE sold = '${true};'`;
  const soldResponse = await db.get(getSoldQuery);

  const getNotSoldQuery = `SELECT COUNT() FROM product WHERE sold ='${false}'`;
  const notSoldResponse = await db.get(getNotSoldQuery);
});

//API 3
app.get("/home/barchart/", async (request, response) => {
  const getBarChartQuery1 = `SELECT COUNT() FROM product WHERE price BETWEEN '${0}' and '${100}';`;
  const response = await db.get(getBarChartQuery1);
  console.log(response);
});

//API 4
app.get("/home/piechart/", async (request, response) => {
  const getPieChartQuery = `;`;
});
