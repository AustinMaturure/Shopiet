import { useState, useEffect, useContext } from 'react';
import AuthContext from './context/AuthContext';
import { useParams, Link } from 'react-router-dom';
import Map from './utils/Map';
import './css/itemdetail.css';
import delivery from './assets/delivery.svg'
import linkExt from './assets/link-ext.svg'
import errorPage from './assets/no-item-404.svg'
import Chat from './Chat';

function ItemDetail() {
  const [data, setData] = useState(null);
  const [profile, setProfile] = useState(null);
  const [thumbnail, setThumbnail] = useState(null);
  const [additionalImages, setAdditionalImages] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaveLoading, setIsSaveLoading] = useState(false);
  const [addText, setAddText] = useState("ADD TO CART");
  const { user } = useContext(AuthContext);
  const [imageLoaded, setImageLoaded] = useState(false);

  const handleImageLoad = () => {
      setImageLoaded(true);
  };

  const { slug } = useParams();

  useEffect(() => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const response = await fetch(`${import.meta.env.VITE_API_URL}/api/item/${slug}`);

        if (!response.ok) {
          throw new Error('Network response was not ok');
        }

        const jsonData = await response.json();
        setData(jsonData);
        setThumbnail(jsonData.item_thumbnail);  // Initialize thumbnail here

        if (jsonData && jsonData.item_username) {
          const profileResponse = await fetch(`${import.meta.env.VITE_API_URL}/api/profile/${jsonData.item_username}`);

          if (!profileResponse.ok) {
            throw new Error('Network response was not ok');
          }

          const profileData = await profileResponse.json();
          setProfile(profileData.profile);
        }

        if (jsonData) {
          const imagesResponse = await fetch(`${import.meta.env.VITE_API_URL}/api/item-images/${slug}`);

          if (!imagesResponse.ok) {
            throw new Error('Network response was not ok');
          }

          const additionalImagesData = await imagesResponse.json();
          setAdditionalImages(additionalImagesData);
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [slug]);

  if (isLoading) {
    return (
      <div className="item-detail-skel flex-col">
        <div className="item-detail-img-skel bg-skel grad-animation"></div>
        <div className="item-detail-name-skel pd-1-al-l bg-skel flex-col grad-animation"></div>
        <div className="skel-det">
          <div className="item-detail-name-skel pd-1-al-l bg-skel flex-col grad-animation"></div>
          <div className="item-detail-name-skel pd-1-al-l bg-skel grad-animation "></div>
        </div>
        <div className="item-detail-img-skel bg-skel grad-animation"></div>
      </div>
    );
  }

  const handleSave = async () => {
    setIsSaveLoading(true); 
    if (user){ 
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/save/${user.username}/${slug}/`, {
        method: 'POST', 
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({})  
      });
  
      
  
      const result = await response.json();
      if (response.ok) {
        setIsSaveLoading(false);
        setAddText('ADDED');
        console.log('Item saved successfully:', result);
      } else {
        const errorMessage = await response.text();
        throw new Error(errorMessage || 'Network response was not ok');
      }
    } catch (error) {
      console.error('Error saving item:', error.message);
      setAddText('Item Already Saved');
      if (error.status === 500){
        setAddText('Login to Save');
      }
    } finally {
      setIsSaveLoading(false);
    } } else {
      setIsSaveLoading(false)
      setAddText("Login To Save")}
  };

  

  const handleImageClick = (image) => {
  
    setAdditionalImages((prevImages) => [
      ...prevImages.filter((img) => img.image !== image.image),
      { image: thumbnail }, 
    ]);
    
    setThumbnail(image.image);
  };


  if (!data) {
    return <div className='error-div flex-col'>
       <div className="eimg-cnt">
        <img loading='lazy' onLoad={handleImageLoad} src={errorPage} id='error-404' className="item-detail-image" /> 
        </div>{imageLoaded && (<p>Couldn't Find This Item :-/</p>)}</div>;
  }

  
 
  return (
    <>
     
      <div className="item-detail-cnt">
        <div className="item-images">

       
        <div className="item-detail-img-cnt">
          <img loading="lazy" alt={data.item_name} src={thumbnail} className="item-detail-image" />
        </div>
        {additionalImages.length > 0 && (
          <div className="additional-images">
            {additionalImages.map((image) => (
              <div className="add-img-cnt" key={image.id}>
                <img
                  src={image.image}
                  key={image.id}
                  alt="Additional"
                  onClick={() => handleImageClick(image)}
                  className="additional-image"
                />
              </div>
            ))}
          </div>
        )} </div>
         <div className="item-details flex-col">

      
        <h1 className="item-detail-name pd-1-al-l">{data.item_name}</h1>
        <p className="item-detail-cat pd-1-al-l">/{data.item_category_name}</p>
        <div className="cat-price-cnt">
          <Link to={`/profile/${data.item_username}`}>
            <h2 className="item-detail-user">{data.item_username} <img className='delivery-img'src={linkExt}></img></h2>
          </Link>
          <h2 className="item-detail-price">R {data.item_price}</h2>
        </div>
        <div className="item-desc-cnt pd-1-al-l">
          <h3>Condition</h3>
          <p>{data.item_condition}</p>
          <br />
          <h3>Description</h3>
          <p>{data.item_description}</p>
        </div><div className="cart-btn-cnt">
      <button className='cart-btn' onClick={handleSave} disabled={isSaveLoading}>
        {isSaveLoading ? "ADDING..." : addText}
      </button>
      </div> 
      </div>
       </div>
       <div className="meta-details">
      {data.address && (
      <div className="location-map">
        <h1>{data.address}</h1>
        {<Map latitude={parseFloat(data.latitude)} longitude={parseFloat(data.longitude)} />}
      </div>)}
      <div className='contact'>

     
      {<div className="delivery">
      <img className='delivery-img'src={delivery}></img><h2> Delivery: </h2>
      <h2>{data.delivery===true ? "  Available":"  Collection"}</h2>
      </div>}
      {profile && (
        <div className="detail-contact">
          
          <div className="contact-details"><h2>How to Contact Me:</h2>
            <h3>Phone: {profile.number}</h3>
            {profile.whatsapp_number && <h3>Whatsapp: {profile.whatsapp_number}</h3>}
          
            <Link to={`/chat/${data.item_username}`}><button className='btn-chat' >Message
             </button></Link> 

          </div>
         
          
        </div>
      )} </div></div>
    </>
  );
}

export default ItemDetail;
