import React, { useContext, useState } from 'react';
import AuthContext from './context/AuthContext';
import './css/signup.css'

export default function SignUp() {
    const { loginUser } = useContext(AuthContext);
    const [formData, setFormData] = useState({
        username: '',
        email: '',
        password: '',
        password2: ''
    });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
       
            if (formData.password !== formData.password2) {
                alert('Passwords do not match');
                return;
            }
    
           
            const response = await fetch('https://shopietbackend-wlzwbcznba-bq.a.run.app/api/signup/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(formData)
            });
    
            if (response.ok) {
             
                await loginUser(e);
                
                console.log('Sign-up successful');
                loginUser;
            } else {
            
                console.error('Sign-up failed:', response.statusText);
                
            }
        } catch (error) {
            console.error('Error:', error);
            
        }
    };
    return (
        <>
        <h1 className='signup-header'> Sign Up</h1>
            <form className='signup-form ' onSubmit={handleSubmit}>
                <input type="text" name="username" value={formData.username} onChange={handleChange} placeholder='Enter User Name' />
                <input type="email" name="email" value={formData.email} onChange={handleChange} placeholder='Enter Email' />
                <input type="password" name="password" value={formData.password} onChange={handleChange} placeholder='Enter Password' />
                <input type="password" name="password2" value={formData.password2} onChange={handleChange} placeholder='Enter Password Again' />
                <input type="submit" className="signup-submit"name='signup-submit' value="Sign Up" />
            </form>
        </>
    );
}
