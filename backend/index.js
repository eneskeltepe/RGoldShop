const express = require('express');
const cors = require('cors');
const axios = require('axios');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

const corsOptions = {
  origin: process.env.NODE_ENV === 'production' 
    ? [process.env.FRONTEND_URL, 'https://r-gold-shop.vercel.app']
    : ['http://localhost:3000'],
  credentials: true
};

app.use(cors(corsOptions));

async function getGoldPrice() {
  try {
    const response = await axios.get('https://www.goldapi.io/api/XAU/USD', {
      headers: {
        'x-access-token': process.env.GOLDAPI_KEY,
        'Content-Type': 'application/json',
      },
    });
    return response.data.price_gram_24k;
  } catch (error) {
    console.error('Gold price fetch failed:', error.response?.data || error.message);
    // API başarısız olduğunda varsayılan fiyat döndür
    return 65.50; // Varsayılan altın fiyatı (USD/gram)
  }
}

app.get('/api/products', async (req, res) => {
  try {
    const goldPrice = await getGoldPrice();
    const productsRaw = fs.readFileSync(path.join(__dirname, 'products.json'), 'utf-8');
    const products = JSON.parse(productsRaw);
    
    let productsWithPrice = products.map((product) => {
      const price = (product.popularityScore + 1) * product.weight * goldPrice;
      return {
        ...product,
        price: Math.round(price * 100) / 100,
        priceCurrency: 'USD',
      };
    });

    const { minPrice, maxPrice, minPopularity, maxPopularity } = req.query;
    if (minPrice) {
      productsWithPrice = productsWithPrice.filter(p => p.price >= Number(minPrice));
    }
    if (maxPrice) {
      productsWithPrice = productsWithPrice.filter(p => p.price <= Number(maxPrice));
    }
    if (minPopularity) {
      productsWithPrice = productsWithPrice.filter(p => p.popularityScore * 5 >= Number(minPopularity));
    }
    if (maxPopularity) {
      productsWithPrice = productsWithPrice.filter(p => p.popularityScore * 5 <= Number(maxPopularity));
    }

    res.json(productsWithPrice);
  } catch (err) {
    console.error('Error fetching products:', err);
    res.status(500).json({ error: 'Failed to fetch products' });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
}); 