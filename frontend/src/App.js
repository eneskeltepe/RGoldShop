import React, { useEffect, useState } from 'react';
import axios from 'axios';
import styled from 'styled-components';
import { FaStar } from 'react-icons/fa';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import './fonts.css';

const COLORS = [
  { key: 'yellow', label: 'Yellow Gold', color: '#E6CA97' },
  { key: 'white', label: 'White Gold', color: '#D9D9D9' },
  { key: 'rose', label: 'Rose Gold', color: '#E1A4A9' },
];

const Container = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 24px;
`;
const Title = styled.h1`
  font-size: 2.5rem;
  margin-bottom: 8px;
  font-family: 'Avenir', 'Montserrat', Arial, sans-serif;
  font-weight: 600;
  letter-spacing: 0.5px;
`;
const CarouselWrapper = styled.div`
  .slick-slide > div {
    display: flex;
    justify-content: center;
  }
  .slick-arrow {
    z-index: 2;
  }
`;
const Card = styled.div`
  background: #fff;
  border-radius: 18px;
  box-shadow: 0 2px 12px #0001;
  padding: 24px 18px 18px 18px;
  width: 260px;
  display: flex;
  flex-direction: column;
  align-items: center;
`;
const ProductImg = styled.img`
  width: 180px;
  height: 140px;
  object-fit: contain;
  border-radius: 12px;
  background: #faf9f7;
  margin-bottom: 18px;
`;
const ProductName = styled.h3`
  font-size: 1.15rem;
  font-weight: 700;
  margin: 0 0 8px 0;
`;
const Price = styled.p`
  font-size: 1.1rem;
  font-weight: 500;
  margin: 0 0 4px 0;
`;
const ColorPicker = styled.div`
  display: flex;
  gap: 10px;
  margin: 10px 0 8px 0;
`;
const ColorDot = styled.button`
  width: 22px;
  height: 22px;
  border-radius: 50%;
  border: 2px solid ${props => (props.selected ? '#222' : '#ccc')};
  background: ${props => props.color};
  cursor: pointer;
  outline: none;
  display: flex;
  align-items: center;
  justify-content: center;
`;
const ColorLabel = styled.span`
  font-size: 0.9rem;
  color: #666;
  margin-left: 6px;
`;
const Stars = styled.div`
  display: flex;
  align-items: center;
  margin: 8px 0 0 0;
`;
const Star = styled(FaStar)`
  color: #FFD700;
  margin-right: 2px;
`;
const FilterBar = styled.form`
  display: flex;
  gap: 18px;
  align-items: flex-end;
  margin-bottom: 32px;
  flex-wrap: wrap;
`;
const FilterGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
`;
const FilterLabel = styled.label`
  font-size: 0.98rem;
  color: #555;
`;
const FilterInput = styled.input`
  padding: 6px 10px;
  border-radius: 6px;
  border: 1px solid #ccc;
  font-size: 1rem;
  width: 110px;
`;
const FilterButton = styled.button`
  padding: 8px 18px;
  border-radius: 8px;
  background: #222;
  color: #fff;
  font-size: 1rem;
  border: none;
  cursor: pointer;
  transition: background 0.2s;
  &:hover { background: #444; }
`;
const ArrowButton = styled.button`
  background: none;
  border: none;
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  position: absolute;
  top: 50%;
  z-index: 3;
  transform: translateY(-50%);
  cursor: pointer;
  font-size: 2.8rem;
  color: #222;
  font-weight: 700;
  opacity: 0.85;
  transition: color 0.18s, opacity 0.18s;
  &:hover { color: #E6CA97; opacity: 1; }
`;
const LeftArrow = styled(ArrowButton)`
  left: -18px;
`;
const RightArrow = styled(ArrowButton)`
  right: -18px;
`;
const ProgressBarWrapper = styled.div`
  width: 100%;
  margin: 24px 0 0 0;
  display: flex;
  align-items: center;
  justify-content: center;
`;
const ProgressBar = styled.div`
  width: 60%;
  height: 6px;
  background: #eee;
  border-radius: 4px;
  overflow: hidden;
  position: relative;
`;
const ProgressFill = styled.div`
  height: 100%;
  background: #E6CA97;
  border-radius: 4px;
  transition: width 0.3s;
`;
const ProductGrid = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 32px;
  justify-content: flex-start;
  margin-top: 24px;
`;

function ProductCard({ product }) {
  const [selectedColor, setSelectedColor] = useState('yellow');
  const popularity = (product.popularityScore * 5).toFixed(1);
  const fullStars = Math.floor(popularity);
  const halfStar = popularity - fullStars >= 0.5;

  return (
    <Card>
      <ProductImg src={product.images[selectedColor]} alt={product.name} />
      <ProductName>{product.name}</ProductName>
      <Price>${product.price} {product.priceCurrency}</Price>
      <ColorPicker>
        {COLORS.map((col) => (
          <ColorDot
            key={col.key}
            color={col.color}
            selected={selectedColor === col.key}
            onClick={() => setSelectedColor(col.key)}
            title={col.label}
          />
        ))}
      </ColorPicker>
      <ColorLabel>{COLORS.find(c => c.key === selectedColor).label}</ColorLabel>
      <Stars>
        {[...Array(fullStars)].map((_, i) => <Star key={i} />)}
        {halfStar && <Star style={{ opacity: 0.5 }} />}
        <span style={{ marginLeft: 6, color: '#444', fontWeight: 500 }}>{popularity}/5</span>
      </Stars>
    </Card>
  );
}

function CustomPrevArrow(props) {
  const { className, style, onClick } = props;
  return (
    <LeftArrow className={className} style={style} onClick={onClick} aria-label="Geri">
      {'<'}
    </LeftArrow>
  );
}

function CustomNextArrow(props) {
  const { className, style, onClick } = props;
  return (
    <RightArrow className={className} style={style} onClick={onClick} aria-label="İleri">
      {'>'}
    </RightArrow>
  );
}

function App() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState({ minPrice: '', maxPrice: '', minPopularity: '', maxPopularity: '' });
  const [currentSlide, setCurrentSlide] = useState(0);
  const sliderRef = React.useRef();
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);

  const fetchProducts = async (params = {}) => {
    setLoading(true);
    setError(null);
    try {
      const apiUrl = process.env.REACT_APP_API_URL || '';
      const res = await axios.get(`${apiUrl}/api/products`, { params });
      setProducts(res.data);
    } catch (err) {
      setError('Failed to load products.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleFilterChange = (e) => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
  };

  const handleFilterSubmit = (e) => {
    e.preventDefault();
    // Boş olanları göndermiyoruz
    const params = {};
    Object.entries(filters).forEach(([k, v]) => { if (v) params[k] = v; });
    fetchProducts(params);
  };

  const sliderSettings = {
    dots: false,
    infinite: true,
    speed: 500,
    slidesToShow: 4,
    slidesToScroll: 1,
    arrows: true,
    prevArrow: <CustomPrevArrow />,
    nextArrow: <CustomNextArrow />,
    beforeChange: (oldIndex, newIndex) => setCurrentSlide(newIndex),
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 3,
        },
      },
      {
        breakpoint: 768,
        settings: {
          slidesToShow: 2,
        },
      },
      {
        breakpoint: 480,
        settings: {
          slidesToShow: 1,
        },
      },
    ],
  };

  // Responsive slidesToShow hesaplama
  let slidesToShow = 4;
  if (windowWidth < 1024) slidesToShow = 3;
  if (windowWidth < 768) slidesToShow = 2;
  if (windowWidth < 480) slidesToShow = 1;

  // Progress bar hesaplama
  let progress = 0;
  let totalSlides = products.length - slidesToShow + 1;
  if (totalSlides < 1) totalSlides = 1;
  if (products.length <= slidesToShow) {
    progress = 100;
  } else {
    progress = ((currentSlide % totalSlides) / (totalSlides - 1)) * 100;
    if (progress < 0) progress = 0;
    if (progress > 100) progress = 100;
  }

  const handleClearFilters = () => {
    setFilters({ minPrice: '', maxPrice: '', minPopularity: '', maxPopularity: '' });
    fetchProducts();
  };

  if (loading) return <div>Yükleniyor...</div>;
  if (error) return <div>{error}</div>;

  return (
    <Container>
      <Title>Product List</Title>
      <FilterBar onSubmit={handleFilterSubmit}>
        <FilterGroup>
          <FilterLabel htmlFor="minPrice">Min Price ($)</FilterLabel>
          <FilterInput type="number" name="minPrice" id="minPrice" value={filters.minPrice} onChange={handleFilterChange} min={0} />
        </FilterGroup>
        <FilterGroup>
          <FilterLabel htmlFor="maxPrice">Max Price ($)</FilterLabel>
          <FilterInput type="number" name="maxPrice" id="maxPrice" value={filters.maxPrice} onChange={handleFilterChange} min={0} />
        </FilterGroup>
        <FilterGroup>
          <FilterLabel htmlFor="minPopularity">Min Rating (1-5)</FilterLabel>
          <FilterInput type="number" name="minPopularity" id="minPopularity" value={filters.minPopularity} onChange={handleFilterChange} min={1} max={5} step={0.1} />
        </FilterGroup>
        <FilterGroup>
          <FilterLabel htmlFor="maxPopularity">Max Rating (1-5)</FilterLabel>
          <FilterInput type="number" name="maxPopularity" id="maxPopularity" value={filters.maxPopularity} onChange={handleFilterChange} min={1} max={5} step={0.1} />
        </FilterGroup>
        <FilterButton type="submit">Filter</FilterButton>
        <FilterButton type="button" style={{ background: '#eee', color: '#222', marginLeft: 8 }} onClick={handleClearFilters}>Clear Filters</FilterButton>
      </FilterBar>
      {products.length === 0 ? (
        <div style={{ margin: '48px 0', fontSize: '1.2rem', color: '#888' }}>No products found.</div>
      ) : products.length <= slidesToShow ? (
        <ProductGrid>
          {products.map((product, idx) => (
            <ProductCard key={idx} product={product} />
          ))}
        </ProductGrid>
      ) : (
        <>
          <CarouselWrapper>
            <Slider ref={sliderRef} {...sliderSettings} slidesToShow={slidesToShow}>
              {products.map((product, idx) => (
                <ProductCard key={idx} product={product} />
              ))}
            </Slider>
          </CarouselWrapper>
          <ProgressBarWrapper>
            <ProgressBar>
              <ProgressFill style={{ width: `${progress}%` }} />
            </ProgressBar>
          </ProgressBarWrapper>
        </>
      )}
    </Container>
  );
}

export default App;
