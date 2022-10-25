import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

function AddProduct() {
    const [name, setName] = useState("");
    const [price, setPrice] = useState("");
    const [category, setCategory] = useState("");
    const [company, setCompany] = useState("");
    const [error, setError] = useState(false);
    const navigate = useNavigate()


    const addProduct = async () => {

        if(!name || !price || !category || !company){
            setError(true)
            return false
        }

        // console.log(name, price , category, company )
        const userId = JSON.parse(localStorage.getItem('user'))._id;
        
        const result = await fetch('http://localhost:3100/add-product', {
            method: 'post',
            body: JSON.stringify({name,price,category,company}),
            headers: {
                'Content-Type': 'application/json',
                authorization: `bearer ${JSON.parse(localStorage.getItem('token'))}`
            }
        });

        let data = await result.json();
        navigate('/')

    }

    return (
        <div className="product">
            <h1>Add product</h1>

            <input
                type="text"
                value={name}
                placeholder="enter product name"
                className="inputBox"
                onChange={(e) => {
                    setName(e.target.value);
                }}
            />
            {error && !name && <span className="invalid_input">Enter valid name</span>}

            <input
                type="text"
                value={price}
                placeholder="enter product price"
                className="inputBox"
                onChange={(e) => {
                    setPrice(e.target.value);
                }}
            />
            {error && !price && <span className="invalid_input">Enter valid price</span>}

            <input
                type="text"
                value={category}
                placeholder="enter product category"
                className="inputBox"
                onChange={(e) => {
                    setCategory(e.target.value);
                }}
            />
            {error && !category && <span className="invalid_input">Enter valid category</span>}

            <input
                type="text"
                value={company}
                placeholder="enter product company"
                className="inputBox"
                onChange={(e) => {
                    setCompany(e.target.value);
                }}
            />
            {error && !company && <span className="invalid_input">Enter valid company</span>}

            <button className="appButton" onClick={addProduct}>Add Product</button>
        </div>
    );
}

export default AddProduct;
