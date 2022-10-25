import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

function ProductList() {
    const [products, setProducts] = useState([]);

    useEffect(() => {
        getProducts();
    }, []);

    const getProducts = async () => {
        const result = await fetch("http://localhost:3100/products", {
            headers:{
                authorization: `bearer ${JSON.parse(localStorage.getItem('token'))}`
            }
        });

        let data = await result.json();
        setProducts(data);
    };
    
    const deleteProduct = async (id) => {
        const result = await fetch('http://localhost:3100/product/'+id, {
            method: 'DELETE',
            headers:{
                authorization: `bearer ${JSON.parse(localStorage.getItem('token'))}`
            }
        });
        let data = await result.json();
        if(data){
            getProducts()
            console.log('data deleted')
        }
    }

    const searchHandle = async (e) => {
        let key = e.target.value;
        if(key){
            const result = await fetch("http://localhost:3100/search/"+key , {
                headers:{
                    authorization: `bearer ${JSON.parse(localStorage.getItem('token'))}`
                }
            });

            let data = await result.json();
            if(data){
                setProducts(data)
            }
            else{
                setProducts()
            }
        }
        else{
            getProducts()
        }
        
    };
    


    let index = 1
    return (
        <div className="product-list">
            <h1>Product list </h1>
            <input className="searchBox" type="text" placeholder="Search Products" onChange={searchHandle} />

            <ul>
                <li><strong>S.no</strong></li>
                <li><strong>Name</strong></li>
                <li><strong>Price</strong></li>
                <li><strong>Category</strong></li>
                <li><strong>Company</strong></li>
                <li ><strong>Operations</strong></li>
                {/* <li className="operationBox">Operations</li> */}
            </ul>

            {products.length > 0 ? products.map((product) => (
                <ul key={product._id}>
                    <li>{index++}</li>
                    <li>{product.name}</li>
                    <li>${product.price}</li>
                    <li>{product.category}</li>
                    <li>{product.company}</li>

                    <li>
                        <button className="deleteButton" onClick={()=> deleteProduct(product._id)}>Delete</button>

                        <button className="updateButton"><Link to={"/update/"+product._id} >Update</Link></button>
                    </li>

                    {/* <li className="updateButton"><Link to="/update" onClick={()=> updateProduct(product._id)}>Update</Link></li> */}
                </ul>
            )) : <h1>No Products Found</h1>}
        </div>
    );
}

export default ProductList;
