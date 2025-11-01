import React, { useState, useContext } from 'react';
import axios from 'axios';
import AuthContext from './context/AuthContext';
import './css/upload.css';
import photoupload from './assets/photo-upload.svg';
import photomulti from './assets/photo-multi.svg';
import LocationAutocomplete from './utils/LocationAutoComplete';
import { Link } from 'react-router-dom';
import linkExt from './assets/link-ext.svg'
const UploadItem = () => {
    const { user } = useContext(AuthContext);
    const [formData, setFormData] = useState({
        item_name: '',
        item_price: '',
        item_description: '',
        item_condition: 'used',
        category: 960732137074130945,
        item_username: user.username,
        delivery: false,
        item_thumbnail: null,
        additional_images: [],
        address: '',
        

    });
    const [imagePreview, setImagePreview] = useState(null);
    const [additionalPreviews, setAdditionalPreviews] = useState([]); 
    const [loading, setLoading] = useState(false); // State to track loading status
    const [message, setMessage] = useState(null); // State to track messages
    const [errorBorder, setErrorBorder] = useState(''); // State to track border color for error
    const handleLocationSelected = (location) => {
        setFormData({
            ...formData,
            address: location.address,
            latitude: location.lat,
            longitude: location.lng
        });
      
    };

    const handleChange = (e) => {
        setErrorBorder('')
        const { id, value, type, checked } = e.target;
        if (type === 'radio') {
            setFormData({ ...formData, item_condition: value });
        } else if (type === 'checkbox') {
            setFormData({ ...formData, [id]: checked });
        } else {
            setFormData({ ...formData, [id]: value });
        }
    };

    const handleFileChange = (e) => {
        setFormData({ ...formData, item_thumbnail: e.target.files[0] });
        const file = e.target.files[0];
        const reader = new FileReader();
        reader.onloadend = () => {
            setImagePreview(reader.result);
        };
        if (file) {
            reader.readAsDataURL(file);
        } else {
            setImagePreview(null);
        }
    };

    const handleAdditionalFileChange = (e) => {
        const files = Array.from(e.target.files);
        const newFiles = [...formData.additional_images, ...files]; // Combine new and existing files
    
        // Process previews
        let previews = [];
        newFiles.forEach(file => {
            const reader = new FileReader();
            reader.onloadend = () => {
                previews.push(reader.result);
                if (previews.length === newFiles.length) {
                    setAdditionalPreviews(previews);
                }
            };
            reader.readAsDataURL(file);
        });
    
        // Update form data
        setFormData({ ...formData, additional_images: newFiles });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        setMessage(null);
        setErrorBorder('');
        if (!formData.item_name || !formData.item_price || !formData.item_description || !formData.item_thumbnail || !formData.address) {
            setMessage('Please fill in all required fields.'); 
            setErrorBorder('errorb');
            return;
        }
        if (!/^\d+$/.test(formData.item_price)){
            setMessage('Please enter a valid number.');
            setErrorBorder('errorb');
            return;
        }

        if (!formData.address){
            setMessage('Please select a City');
            setErrorBorder('errorb');
            return;
        }

        setLoading(true);
        let form_data = new FormData();
  
        const additionalImages = formData.additional_images.flat();
        for (let key in formData) {
            form_data.append(key, formData[key]);
        }
        
        additionalImages.forEach(file => {
            form_data.append('additional_images', file);
        });
        let formDataObject = {};
        form_data.forEach((value, key) => {
            formDataObject[key] = value;
        });
        
        console.log(formDataObject);
        let url = `${import.meta.env.VITE_API_URL}/api/upload/`;
        const response = axios.post(url, form_data, {
                headers: {
                    'content-type': 'multipart/form-data',
                },
            })
            .then((response) => {
                setLoading(false);
                console.log(response.data)
                setMessage( <span>
                    Upload Successful! View your{' '}
                    <Link style={{textDecoration:'underline 2px #8dc572'}}to={'/item/'+response.data.slug}>Item <img className='delivery-img'src={linkExt}></img></Link>
                </span>);
                setFormData({
                    item_name: '',
                    item_price: '',
                    item_description: '',
                    item_condition: 'used',
                    category: 960732137074130945,
                    item_username: user.username,
                    item_thumbnail: null,
                    address: '',
                    
                });
                setImagePreview(null);
                setAdditionalPreviews([]);
            })
            .catch((err) => {
                setLoading(false); 
                if (err.response && err.response.data) {
                    setMessage(`Upload failed: ${err.response.data}`); 
                } else {
                    setMessage('Upload failed: Network error'); 
                }
                setErrorBorder('errorb'); 
            });
    };

    const suspenseLoad = () =>{
        return ( <div style={{height:'100svh', justifyContent:'center'}} className='flex-col'><span className="cssload-loader"><span className="cssload-loader-inner"></span></span></div>);
      }
    
    return (
        <div className='upload-cnt flex-col '>
           
            <form className="upload-form flex-col" onSubmit={handleSubmit}> <h1>Say Goodbye</h1>
            {message && <div className={`upload-message ${errorBorder}`}>{message}</div>} 
                <input type="text" id="item_name" className={`prevent-zoom ${errorBorder}`} value={formData.item_name} onChange={handleChange} placeholder="Enter Item Name" required />
                <div >R <input type="number" id="item_price"  className={`prevent-zoom ${errorBorder}`} value={formData.item_price} onChange={handleChange} placeholder="Enter Item Price" required /></div>
                <textarea name="description" id="item_description" className={`input-desc prevent-zoom ${errorBorder}`} value={formData.item_description} onChange={handleChange} placeholder='Enter Description'></textarea> {/* Description textarea */}
                <div className='condition-picker'>
                    <label>
                        <input
                            type="radio"
                            name="item_condition"
                            value="Love"
                            checked={formData.item_condition === 'Love'}
                            onChange={handleChange}
                        />
                        <span className="chip">Needs Love</span>
                    </label>
                    <label>
                        <input
                            type="radio"
                            name="item_condition"
                            value="Used"
                            checked={formData.item_condition === 'Used'}
                            onChange={handleChange}
                        />
                        <span className="chip">Used</span>
                    </label>
                    <label >
                        <input
                            type="radio"
                            name="item_condition"
                            value="L-New"
                            checked={formData.item_condition === 'L-New'}
                            onChange={handleChange}
                        />
                        <span className="chip">Like New</span>
                    </label>
                    <label>
                        <input
                            type="radio"
                            name="item_condition"
                            value="New"
                            checked={formData.item_condition === 'New'}
                            onChange={handleChange}
                        />
                        <span className="chip">New</span>
                    </label>
                </div>
                <div className="local">
                <LocationAutocomplete onLocationSelected={handleLocationSelected} /> <div className="slider-container">
                    <label htmlFor="delivery" className="slider-label">Delivery:</label>
                    <label className="switch">
                        <input
                            type="checkbox"
                            id="delivery"
                            checked={formData.delivery}
                            onChange={handleChange}
                        />
                        <span className="slider round"></span>
                    </label>
                </div></div>
                <select id="category"  className={`prevent-zoom ${errorBorder}`} value={formData.category} onChange={handleChange}>
                <option value="">Select Category</option>
                    <option value="960732137074130945">Tech</option>
                    <option value="960807240398831617">Furniture</option>
                    <option value="960807346087755777">Car Parts</option>
                    <option value="960807528684290049">Gardening</option>
                    <option value="963308098083192833">Books</option>
                    <option value="963308226167734273">Gym Equipment</option>
                    <option value="963308337627725825">Toys</option>
                    <option value="963308422799785985">Kids</option>
                    <option value="964962577645404161">Audio</option>
                    <option value="972393953879326721">Clothing</option>
                    <option value="972394645469528065">Entertainment</option>
                    <option value="972395005943316481">Office Supplies</option>
                    <option value="972395196896116737">Kitchen</option>
                    <option value="972395352387420161">Crafts</option>
                    
                </select>
               
                <input type="file" className={`input-thumb ${errorBorder}`} id="item_thumbnail" onChange={handleFileChange} accept="image/webp,image/jpeg,image/png" required />
                <label htmlFor="item_thumbnail" className="lbl-add-photo">
                        Add Item Image <img src={photoupload} alt="" />
                </label>
                {imagePreview && (
                    <div className="image-preview">
                        <img src={imagePreview} alt="Selected" />
                    </div>
                )}

                <input type="file" multiple className={`input-thumb ${errorBorder}`} id="additional_images" onChange={handleAdditionalFileChange} accept="image/webp,image/jpeg,image/png" />
                <label htmlFor="additional_images" className="lbl-add-photo">Add Additional Images  <img src={photomulti} alt="" /></label>

                {additionalPreviews.length > 0 && (
                    <div className="additional-previews">
                        {additionalPreviews.map((preview, index) => (
                            <div key={index} className="image-preview">
                                <img src={preview} alt={`Selected ${index}`} />
                            </div>
                        ))}
                    </div>
                )}
               
                {loading ? (
                    suspenseLoad()
                ) : (<>
                  
                    <input type="submit" className="input-sub shd-press-eff" value="Post" /></>
                )}
            </form>
        </div>
    );
};

export default UploadItem;
