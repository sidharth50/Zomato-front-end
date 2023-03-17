import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { BASE_URL, checkLogin } from "./base_url";
import Header from "./Header";
import "react-responsive-carousel/lib/styles/carousel.min.css"; // requires a loader
import { Carousel } from 'react-responsive-carousel';

const Restaurant = () => {
  const navigate = useNavigate();
  const {id} = useParams();
  let [isLogin, setIsLogin] = useState(checkLogin());
  let [toggle, setToggle] = useState(true);
  let [totalPrice, setTotalPrice] = useState(0);
  let [orderUser, setOrderUser] = useState({
    username : "",
    email : '',
    mobile : '',
    address : '',
    
  });
  useEffect(()=> {
    if(isLogin){
      setOrderUser({
        username : isLogin.name,
        email : isLogin.email,
        mobile : "",
        address : ""
      })
    }
  },[isLogin]);
  let initRestaurant = {
    "_id": 0,
    "name": "",
    "city": "",
    "location_id": 0,
    "city_id": 0,
    "locality": "",
    "thumb": [],
    "aggregate_rating": 0,
    "rating_text": "",
    "min_price": 0,
    "contact_number": "",
    "cuisine_id": [],
    "cuisine": [],
    "image": "",
    "mealtype_id": 0
  };
  let [restaurantDetails, setRestaurantDetails] = useState({...initRestaurant,});
  let getRestaurantDetails = async ()=> {
    let url = `${BASE_URL}get-restaurant-details-by-id/${id}`;
      let  {data} = await axios.get(url);
      if (data.status === true){
        setRestaurantDetails({...data.result});
      }else{
        setRestaurantDetails({...initRestaurant});
      }
    
  };
  let [restaurantMenu, setRestaurantMenu] = useState([]);
  let manageIncQty = (index) => {
    let _restaurantMenu = [...restaurantMenu];
    _restaurantMenu[index].qty += 1;
    let newTotal = totalPrice + _restaurantMenu[index].price;
    setTotalPrice(newTotal);
    setRestaurantMenu(_restaurantMenu);
  };
  let manageDecQty = (index) => {
    let _restaurantMenu = [...restaurantMenu];
    _restaurantMenu[index].qty -= 1;
    let newTotal = totalPrice - _restaurantMenu[index].price;
    setTotalPrice(newTotal);
    setRestaurantMenu(_restaurantMenu);
  }
  let getMenuItemsList = async () => {
    let url = `${BASE_URL}get-menu-items-by-restaurant-id/${id}`;
    let {data} = await axios.get(url);
    if(data.status === true){
      setRestaurantMenu([...data.result]);
    }else{
      setRestaurantMenu([]);
    }
  }
  useEffect(()=> {
    getRestaurantDetails();
    getMenuItemsList();
  },[]);
  let loadScript = async () => {
    let script = document.createElement('script')
  script.src = 'https://checkout.razorpay.com/v1/checkout.js' 
  document.body.appendChild(script);
  return true;
  }
  let makePayment = async () => {
   
/*<script src="https://checkout.razorpay.com/v1/checkout.js"></script>*/
  //await loadScript();
  try{
  let {data} = await axios.post(`${BASE_URL}create-order`, {
    amount : totalPrice,
  });
  let {order} = data;
var options = {
    key: "rzp_test_RB0WElnRLezVJ5", // Enter the Key ID generated from the Dashboard
    amount: order.amount, // Amount is in currency subunits. Default currency is INR. Hence, 50000 refers to 50000 paise
    currency: order.currency,
    name: "Zomato Clone",
    description: "Online Payment",
    image: "https://upload.wikimedia.org/wikipedia/commons/7/75/Zomato_logo.png",
    order_id: order.id, //This is a sample Order ID. Pass the `id` obtained in the response of Step 1
    handler: async (response) => {
      let {  
      razorpay_payment_id,
        razorpay_order_id,
        razorpay_signature,
      } = response;
      let userOrders = restaurantMenu.filter((menu) => {
        return menu.qty > 0;
      });
       let sendData ={
        payment_id :  razorpay_payment_id,
        order_id :  razorpay_order_id,
        signature :  razorpay_signature,
        order_list : userOrders,
        total : totalPrice,
        user_email : orderUser.email,
        mobile : orderUser.mobile,
        username : orderUser.username,
        address : orderUser.address,
        };
      let {data} = await axios.post(BASE_URL + 'verify-payment', sendData);
      if(data.status === true){
        alert('Payment done successfully');
        window.location.assign('/');
      }else{
        alert('Payment Fail, Try again');
      }
    },
    prefill: {
        name: orderUser.username,
        email: orderUser.email,
        contact: orderUser.mobile,
    },
    
};
try{
  var rzp1 = new window.Razorpay(options);
  rzp1.open();
}catch(error){
  alert('Unable to load try again');
} 
  }catch(error){
    alert('Server Error');
    console.log(error);
  }

  }; 
  let inputChange = (event) => {
    let {value, name} = event.target;
    orderUser[name] = value;
    setOrderUser({...orderUser});
  };
    return (<>
    
<div className="modal fades" id="galleryModal" tabIndex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
  <div className="modal-dialog modal-lg">
    <div className="modal-content">
      <div className="modal-body">
  <Carousel infiniteLoop={true} showThumbs={false} interval={2000} autoPlay={true}>
    { 
    restaurantDetails.thumb.map((value, index) => {
     return(
      <div 
      key={index}>
      <img src={"/images/" + value} className="d-block w-100" alt="..."/>
    </div>
     );
    })
    
}
</Carousel>
  
  

      </div>
      
    </div>
  </div>
</div>

    <div className="modal fade" id="modalAccount" aria-hidden="true" aria-labelledby="exampleModalToggleLabel2" tabIndex="-1">
  <div className="modal-dialog modal-dialog-centered">
    <div className="modal-content p-3">
      <div className="modal-header">
        <h1 className="modal-title fs-5" id="exampleModalToggleLabel2">User Details</h1>
        <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
      </div>
      <div className="modal-body">
      <div className="mb-3">
    <label htmlFor="user-name" className="form-label">User Name</label>
    <input type="text" className="form-control" aria-describedby="emailHelp" value={orderUser.username} onChange={() => {}} disabled/>
    <div className="mb-3">
    <label htmlFor="email" className="form-label">Email address</label>
    <input type="email" className="form-control" aria-describedby="emailHelp" value={orderUser.email} onChange={() => {}} disabled/>
    </div>
    <div className="mb-3">
    <label htmlFor="user-name" className="form-label">Mobile.No</label>
    <input type="text" className="form-control" aria-describedby="emailHelp" name="mobile" value={orderUser.mobile} onChange={inputChange}/>
    </div>
  </div>
  <div className="mb-3">
    <label htmlFor="exampleInputPassword1" className="form-label">Address</label>
    <textarea type="text" className="form-control" name="address" value={orderUser.address} onChange={inputChange}></textarea>
  </div>
  <button type="submit" className="btn btn-primary">Submit</button>
      </div>
      <div className="d-flex justify-content-between">
        <button className="btn btn-primary" data-bs-target="#restMenuModal" data-bs-toggle="modal">Back to Menu</button>
        <button className="btn btn-success" onClick={makePayment}>Pay Now</button>
      </div>
    </div>
  </div>
</div>
    <div className="modal fade" id="restMenuModal" data-bs-backdrop="static" data-bs-keyboard="false" tabIndex="-1" aria-labelledby="staticBackdropLabel" aria-hidden="true">
  <div className="modal-dialog modal-dialog-centered modal-dialog-scrollable">
    <div className="modal-content">
      <div className="modal-header">
        <h1 className="modal-title fs-5" id="staticBackdropLabel">{restaurantDetails.name}</h1>
        <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
      </div>
      <div className="modal-body">
      { 
          restaurantMenu.map((menuItem, index)=> {
           return( <div className="row p-2" key={index}>
                    <div className="col-8">
                      <p className="mb-1 h6">{menuItem.name}</p>
                      <p className="mb-1">₹ {menuItem.price} Only</p>
                      <p className="small text-muted">{menuItem.description}</p>
                    </div>
                    <div className="col-4 d-flex justify-content-end">
                      <div className="menu-food-item">
                        <img src={"/images/" + menuItem.image} alt="" />
                        {menuItem.qty <= 0 ? <button
                            className="btn btn-primary btn-sm add"
                           onClick={()=> manageIncQty(index)}
                          >
                            Add
                          </button> : <div className="order-item-count section">
                            <span
                              className="hand btn btn btn-outline-primary"
                             onClick={() => manageDecQty(index)}
                            >
                              -
                            </span>
                            <span>{menuItem.qty}</span>
                            <span
                              className="hand btn btn-outline-primary"
                              onClick={()=> manageIncQty(index)}
                            >
                              +
                            </span>
                          </div>}
                        
                       
                          
                     
                      </div>
                    </div>
                    <hr className=" p-0 my-2" />
                  </div>
           );
          })
      
      }         
      </div>
     <div className=" modal-footer d-flex justify-content-between p-3 pt-0">
      <h3>Total: {totalPrice}</h3>
      {
        totalPrice > 0 ? (<button className="btn btn-success" data-bs-toggle ="modal" data-bs-target ="#modalAccount">Process</button>) : null
      }
      
     </div>
    </div>
  </div>
  </div>
    <main className="container-fluid">
    <div className="row bg-danger justify-content-center">
    <p className="m-0 brand mt-2" onClick={() => {
              navigate("/");}}>e!</p>
    <Header/>
      
    </div>
    
    
    <div className="row justify-content-center">
      <div className="col-10">
        <div className="row">
          <div className="col-12 mt-5">
            <div className="restaurant-main-image position-relative">
            <img src={"/images/" + restaurantDetails.image}   alt="" className="" />
            
              <button
                className="btn btn-outline-light position-absolute btn-gallery"
                data-bs-toggle="modal"
                data-bs-target="#galleryModal"
              >
                Click To Get Image Gallery
              </button>
            </div>
          </div>
          <div className="col-12">
            <h3 className="mt-4">{restaurantDetails.name}</h3>
            <div className="d-flex justify-content-between">
              <ul className="list-unstyled d-flex gap-3">
                <li
                 onClick={() => setToggle(true)}
                 className = { toggle ? "border-bottom border-5 border-danger" : null}
                >
                  Overview
                </li>
                <li
                 onClick={() => setToggle(false)}
                 className = { !toggle ? "border-bottom border-5 border-danger" : null}
                >
                  Contact
                </li>
              </ul>
              {
                isLogin ? (<button
                  className="btn btn-success align-self-start"
                  data-bs-toggle="modal" data-bs-target="#restMenuModal"
            
                >
                  Place Online Order
                </button>) : (<button
                className="btn btn-danger align-self-start"
                
          
              >
                Please Login
              </button>)
              }
              
            </div>
            <hr className="mt-0" />
               {
                toggle ? (<div className="over-view">
                <p className="h5 mb-4">About this place</p>

                <p className="mb-0 fw-bold">Cuisine</p>
                <p>
                {restaurantDetails.cuisine.map((cuisine_name)=> cuisine_name.name).join(", ")}
                </p>

                <p className="mb-0 fw-bold">Average Cost</p>
                <p>₹ {restaurantDetails.min_price} for two people (approx.)</p>
              </div>) : (<div className="over-view">
              <p className="h5 mb-4">About this place</p>
                <p className="mb-0 fw-bold">Phone Number</p>
                <p>+{restaurantDetails.contact_number}</p>

                <p className="mb-0 fw-bold">Address</p>
                <p>
                {restaurantDetails.locality}, {restaurantDetails.city}
                </p>
              </div>)
               }
              
          
              
         
          </div>
        </div>
      </div>
    </div>
   
    </main>
    
  </>);
}

export default Restaurant;