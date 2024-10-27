const fetchData = require('../Utils/Data');

//filter transactions by month
const filterByMonth = (transactions, month) => {
  return transactions.filter(transaction => {
    const transactionDate = new Date(transaction.dateOfSale);
    return transactionDate.toLocaleString('default', { month: 'long' }) === month;
  });
};

//search and pagination
exports.getTransactions = async (req, res) => {
  const { month = 'All', page = 1, perPage = 10, search = '' } = req.query;
  const data = await fetchData();

  // filter by month
  const filteredData = month === 'All' ? data : filterByMonth(data, month);
  const searchedData = search
    ? filteredData.filter(
      (transaction) =>
        transaction.title.includes(search) ||
        transaction.description.includes(search) ||
        transaction.price.toString().includes(search)
    )
    : filteredData;

  const paginate = searchedData.slice((page - 1) * perPage, page * perPage);
  res.json(paginate);
};

// statistics for selected month
exports.getStatistics = async (req, res) => {
  const { month = 'All' } = req.query;
  const data = await fetchData();
  const filteredData = filterByMonth(data, month);

  const totalAmount = filteredData.reduce((sum, transaction) =>
    sum + (transaction.sold ? transaction.price : 0), 0);
  const soldItems = filteredData.filter(transaction => transaction.sold).length;
  const notSoldItems = filteredData.length - soldItems;

  res.json({ totalAmount, soldItems, notSoldItems });
};

//price range statistics
exports.getPriceRange = async (req, res) => {
  const { month = 'Select-Month' } = req.query;
  const data = await fetchData();
  const filteredData = filterByMonth(data, month);

  const priceRanges = {
    '0-100': 0,
    '101-200': 0,
    '201-300': 0,
    '301-400': 0,
    '401-500': 0,
    '501-600': 0,
    '601-700': 0,
    '701-800': 0,
    '801-900': 0,
    '901-above': 0,
  };

  filteredData.forEach((transaction) => {
    const price = transaction.price;
    if (price <= 100) priceRanges['0-100']++;
    else if (price <= 200)priceRanges['101-200']++;
    else if (price <= 300) priceRanges['201-300']++;
    else if (price <= 400) priceRanges['301-400']++;
    else if(price <= 500) priceRanges['401-500']++;
    else if (price <= 600) priceRanges['501-600']++;
    else if(price <= 700)priceRanges['601-700']++;
    else if(price <= 800) priceRanges['701-800']++;
    else if(price <= 900)priceRanges['801-900']++;

    else priceRanges['901-above']++;
  });

  //priceRanges object to array
  const priceRangeArray = Object.keys(priceRanges).map((range) => ({
    range,
    count: priceRanges[range],
  }));

  res.json(priceRangeArray);
};
//category counts for pie chart
exports.getCategory = async (req, res) => {
  const { month = 'All' } = req.query;
  const data = await fetchData();
  const filteredData = filterByMonth(data, month);

  const categoryCounts = {};
  filteredData.forEach((transaction) => {
    if (categoryCounts[transaction.category]) {
      categoryCounts[transaction.category]++;
    } else {
      categoryCounts[transaction.category] = 1;
    }
  });

  res.json(categoryCounts);
};

//combined data from other APIs
exports.getCombined = async (req, res) => {
  const { month = 'March' } = req.query;

  const transactions = await this.getTransactions({ query: { month } });
  const statistics = await this.getStatistics({ query: { month } });
  const priceRange = await this.getPriceRange({ query: { month } });
  const category = await this.getCategory({ query: { month } });

  res.json({
    transactions: transactions.json,
    statistics: statistics.json,
    priceRange: priceRange.json,
    category: category.json
  });
};
