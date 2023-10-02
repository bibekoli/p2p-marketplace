"use client";

import Image from "next/image";
import { useState } from "react";
import { Icon } from "@iconify/react";

const TextInput = ({ label, placeholder, required, disabled, error, setError, value, onChange, className }) => (
  <div className={`form-control w-full ${className}`}>
    <label className="label">
      <span className="label-text font-semibold required">{label} {required && "*"}</span>
    </label>
    <input type="text" disabled={disabled} placeholder={placeholder} value={value} onChange={onChange} className={`input input-bordered input-h w-full rounded-lg ${error && "input-error"}`} />
  </div>
);

const DropDown = ({ label, required, value, onChange, options, className }) => (
  <div className={`form-control w-full ${className}`}>
    <label className="label">
      <span className="label-text font-semibold required">{label} {required && "*"}</span>
    </label>
    <select value={value} onChange={onChange} className="select select-bordered w-full rounded-lg">
      {
        options.map((option, index) => (
          <option key={index} value={option}>{option}</option>
        ))
      }
    </select>
  </div>
);

/*
  Name: string -  e.g. "iPhone 12 Pro Max"
  Description: string - e.g. "Brand new iPhone 12 Pro Max with 128GB storage"
  Images: array of urls - e.g. ["https://example.com/image1.jpg", "https://example.com/image2.jpg"]

  Condition: string - e.g. "Brand New", "Like New", "Used", "Not Working"
  Category: string - e.g. "Electronics"
  Subcategory: string - e.g. "Mobile Phones"
  Adult Content: boolean - e.g. true, false

  Price: object - e .g. { type: "fixed", amount: 1000 } or { type: "negotiable", amount: 1000 } or { type: "free", amount: 0 }
  Delivery: object - e.g. { area: "", cost: ""}, area: "Within My Area", "Within My City", "Anywhere in Nepal"
  Delivery Type: Public Meetup, Door Pickup, Door Dropoff

  Ad Expiry: date - e.g. 2021-12-31
*/

export default function Form() {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState({ type: "fixed", amount: "" });
  const [images, setImages] = useState([]);
  const [selectedImage, setSelectedImage] = useState(null);
  const [myLocation, setMyLocation] = useState("");
  const [uploadingImage, setUploadingImage] = useState(false);
  const [condition, setCondition] = useState({});
  const [category, setCategory] = useState("");
  const [delivery, setDelivery] = useState({
    type: "",
    area: "",
    cost: ""
  });


  const [nameError, setNameError] = useState(false);
  const [priceError, setPriceError] = useState(false);
  const [imageError, setImageError] = useState(false);
  const [myLocationError, setMyLocationError] = useState(false);
  const [descriptionError, setDescriptionError] = useState(false);
  const [deliveryCostError, setDeliveryCostError] = useState(false);

  

  
  const handleImageUpload = (e) => {
    const files = e.target.files;
    
    // upload the file to /api/UplaodImage
    const formData = new FormData();
    formData.append("image", files[0]);
    formData.append("type", "marketplace");
    setUploadingImage(true);
    setImageError(false);
    fetch("/api/UploadImage", {
      method: "POST",
      body: formData
    })
    .then((res) => res.json())
    .then((data) => {
      setUploadingImage(false);
      setImages((prev) => [...prev, data.image]);
      // console.log(data);
    })
    .catch((error) => {
      setUploadingImage(false);
      console.log(error);
    });
  }

  const itemCategories = [
    "Electronics",
    "Mobile Phones",
    "Mobile Phone Accessories",
    "Computers",
    "Computer Accessories",
    "Vehicles",
    "Property",
    "Fashion",
    "Home Appliances",
    "Books",
    "Sports",
    "Others",
  ]

  const addItem = () => {
    let error = false;
    if (name.trim() === "") {
      setNameError(true);
      error = true;
    }

    if (description.trim() === "") {
      setDescriptionError(true);
      error = true;
    }

    if (price.amount.trim() === "") {
      setPriceError(true);
      error = true;
    }

    if (myLocation.trim() === "") {
      setMyLocationError(true);
      error = true;
    }

    if (images.length === 0) {
      setImageError(true);
      error = true;
    }

    if (delivery.type !== "Door Pickup" && delivery.cost.trim() === "") {
      setDeliveryCostError(true);
      error = true;
    }

    if (error) return;

    const item = {
      name,
      description,
      price,
      images,
      condition,
      category,
      delivery
    }

    // 
    
    fetch("/api/CreateAd", {
      method: "POST",
      body: JSON.stringify(item)
    })
    .then((res) => res.json())
    .then((data) => {
      console.log(data);
    })
    .catch((error) => {
      console.log(error);
    });
  }

  return (
    <div className="max-w-screen-xl mx-auto">
      <div className="m-4 p-4 rounded-md ">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex flex-col gap-4">
            <TextInput
              label="Name"
              placeholder="e.g. Google Pixel 8 Pro"
              required
              error={nameError}
              setError={setNameError}
              value={name}
              onChange={e => {
                setName(e.target.value);
                setNameError(false);
              }}
            />

            {/* Description */}
            <div className="form-control w-full">
              <label className="label">
                <span className="label-text font-semibold required">Description *</span>
              </label>
              <textarea
                className={`textarea textarea-bordered ${descriptionError && "textarea-error"} rounded-md h-[248px] resize-none`}
                placeholder="Description"
                rows={8}
                value={description}
                onChange={e => {
                  setDescription(e.target.value);
                  setDescriptionError(false);
                }}
              />
            </div>
            
            {/* Price */}
            <div className="flex flex-row gap-4">
              <TextInput
                label="Price"
                placeholder="e.g. 150000"
                required
                error={priceError}
                setError={setPriceError}
                value={price.amount}
                onChange={e => {
                  setPrice((prev) => ({ ...prev, amount: e.target.value }));
                  setPriceError(false);
                }} 
                className="w-[60%]"
              />
              <DropDown label="Price Type" required value={price.type} onChange={e => setPrice((prev) => ({ ...prev, type: e.target.value }))} options={["Fixed", "Negotiable", "Free"]} className="w-[40%]" />
            </div>

            {/* My Location */}
            <TextInput
              label="My Location"
              placeholder="e.g. Kathmandu, Nepal"
              required
              error={myLocationError}
              setError={setMyLocationError}
              value={myLocation}
              onChange={e => {
                setMyLocation(e.target.value);
                setMyLocationError(false);
              }}
            />
          </div>

          <div className="flex flex-col gap-4">
            <DropDown label="Condition" required value={condition} onChange={e => setCondition(e.target.value)} options={["Brand New", "Like New", "Good", "Not Working"]} />

              {/* Images */}
            <div className="form-control w-full">
              <label className="label">
                <span className="label-text font-semibold required">Images *</span>
              </label>
              <div className="flex flex-row items-start overflow-x-auto gap-4 no-scrollbar">
                <div className={`card h-[150px] ${images.length === 0 ? "w-full" : "w-[150px]"} rounded-md border-2 border-dashed ${imageError ? "border-red-500" : "border-gray-300"} flex flex-col justify-center items-center`}>
                  <label htmlFor="image-upload" className={`cursor-pointer text-4xl text-gray-300 ${images.length === 0 ? "w-full" : "w-[150px]"} h-full flex flex-col justify-center items-center gap-2`}>
                    {
                      uploadingImage ? (
                        <>
                          <Icon icon="line-md:uploading-loop" width={60} height={60} />
                        </>
                      ) : (
                        <>
                          <Icon icon="zondicons:add-outline" width={40} height={40} />
                          <span className="text-sm font-semibold text-gray-400">Add Images</span>
                        </>
                      )
                    }
                  </label>
                  <input
                    type="file"
                    id="image-upload"
                    accept="image/*"
                    className="hidden"
                    disabled={uploadingImage}
                    onChange={handleImageUpload}
                  />
                </div>
                {
                  images.map((image, index) => (
                    <div key={index} className="relative w-[150px] h-[150px] bg-white rounded-md border-2 border-gray-300 flex-shrink-0">
                      <Image src={image} className="w-full h-full rounded-md object-cover" alt={`Image ${index}`} width={150} height={150} />
                      <div className="absolute top-0 right-0 p-1">
                        <button className="btn btn-xs btn-circle text-white bg-red-500 hover:bg-red-600" onClick={() => setImages((prev) => prev.filter((_, i) => i !== index))}>
                          <Icon icon="maki:cross" width={14} height={14} />
                        </button>
                      </div>
                    </div>
                  ))
                }
              </div>
            </div>

            <DropDown label="Category" required value={category} onChange={e => setCategory(e.target.value)} options={itemCategories} />
            
            {/* div with 2 dropdowns, delivery type and delivery area */}
            <div className="flex flex-row gap-4">
              <DropDown label="Delivery Type" required value={delivery.type} onChange={e => setDelivery((prev) => ({ ...prev, type: e.target.value }))} options={["Public Meetup", "Door Pickup", "Door Dropoff"]} className="w-[60%]" />
              <DropDown label="Delivery Area" required value={delivery.area} onChange={e => setDelivery((prev) => ({ ...prev, area: e.target.value }))} options={["Within My Area", "Within My City", "Anywhere in Nepal"]} className="w-[40%]" />
            </div>

            {/* delivery cost */}
            <TextInput
              label="Delivery Cost"
              placeholder="e.g. 100"
              required
              error={deliveryCostError}
              setError={setPriceError}
              value={delivery.cost}
              disabled={delivery.type === "Door Pickup"}
              onChange={e => {
                setDelivery((prev) => ({ ...prev, cost: e.target.value }));
              }} 
              className="w-[60%]"
            />
          </div>
        </div>
        <div className="flex justify-end gap-4 mt-4">
          <button className="btn btn-primary rounded-lg" onClick={addItem}>
            <Icon icon="mingcute:add-fill" />
            Create
          </button>
        </div>
      </div>
    </div>
  )
}