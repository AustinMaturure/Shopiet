import { useState, useEffect} from 'react'
import exchangeImg from './assets/exchange.webp'
import ctaBussinesImg from './assets/cta-bussiness.webp'
import { Link } from 'react-router-dom'


import './css/App.css'

function App() {
  const [count, setCount] = useState(0)
  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  useEffect(() => {
    setIsLoading(true)
    const fetchData = async () => {
      try {
        const response = await fetch(`${import.meta.env.VITE_API_URL}/api/`);

        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const jsonData = await response.json();
   
        
        if (response.status === 200){
          setData(jsonData);
          console.log(jsonData);
        }else if(response.statusText === 'Error Fetching Data, please try again later :-/')
        console.log(jsonData)
      } catch (error) {
        console.error('Error fetching data:', error);
        setIsLoading(true)
      } finally {
        setIsLoading(false); 
        
      }
    };

    fetchData();
  }, []);

  const latestItems = data
  .slice(0, 20).reverse(); 

  return (
    <>
     
     <section className="section-items">
      <div className="cta-scroller">
      <div className="cta">
          <div className="cta-text">
            <div className="cta-text-head"> <h2>Give Your Preloved Items a New Home</h2></div>
           <div className="cta-text-btn">
           <Link to ={'/upload'}> <button>Sell an Item</button> </Link>
           </div>
           
          </div>
          <div className="cta-image">
            <img loading='lazy' src={exchangeImg} alt="couple-exchanging-items" />
          </div>
        </div>
        <div className="cta">
          <div className="cta-text">
            <div className="cta-text-head"> <h2>Or Run Your Business Right Here</h2></div>
           <div className="cta-text-btn">
           <Link to ={'/upload'}> <button>Business Page</button></Link>
           </div>
           
          </div>
          <div className="cta-image">
            <img loading='lazy' src={ctaBussinesImg} alt="couple-exchanging-items" />
          </div>
        </div>
      </div>
        
        <div className="items-section">
          <div className="section-header-cnt">
          <h1 className='section-item-header'>Latest </h1>
        <h3 className='section-item-sub-header'>All the newest stuff</h3>
        <hr align='left' className='section-divider'/>
        </div>
{isLoading ? (
  <div className="skeleton" >
    <div className="skel skel-1 grad-animation"></div>
    <div className="skel skel-2 grad-animation"></div>
    <div className="skel skel-3 grad-animation"></div>
    <div className="skel skel-4 grad-animation"></div>
  </div>
) : (
  <section className="items-container">
    {latestItems.map((item) => (
      <Link to={`/item/${item.slug}`}key={item.id}>
      <div className='item-card' >
        <div className="item-card-img-cnt" >
          <img loading="lazy" alt={item.item_thumbnail} src={`${item.item_thumbnail}`} className="item-image" srcSet="" />
        </div>
        <div className="item-card-desc">
          <h3 className='item-card-name'>{item.item_name.substring(0,26)}</h3>
          <div className="item-info">
            <p className='item-card-price'>R {parseInt(item.item_price).toFixed(0)}</p>
            <p className='item-card-condition'>{item.item_condition}</p>
          </div>
        </div>
      </div>
      </Link>
    ))}
  </section>
)}
</div>

        
      
    </section> 
    
    </>
  )
}

export default App
