"use client";

import Image from "next/image";
import { useState } from "react";
import { Icon } from "@iconify/react";

const TextInput = ({ label, required, value, onChange, className }) => (
  <div className={`form-control w-full ${className}`}>
    <label className="label">
      <span className="label-text font-semibold required">{label} {required && "*"}</span>
    </label>
    <input type="text" value={value} onChange={onChange} className="input input-bordered w-full rounded-lg" />
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

  Price: object - e.g. { type: "fixed", amount: 1000 } or { type: "negotiable", amount: 1000 } or { type: "free", amount: 0 }
  Delivery: object - e.g. { area: "", cost: ""}, area: "Within My Area", "Within My City", "Anywhere in Nepal"
  Delivery Type: Public Meetup, Door Pickup, Door Dropoff

  Ad Expiry: date - e.g. 2021-12-31
*/

export default function Form() {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState({ type: "fixed", amount: 0 });
  const [images, setImages] = useState([]);
  const [selectedImage, setSelectedImage] = useState(null);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [condition, setCondition] = useState({});
  const [category, setCategory] = useState("");
  const [delivery, setDelivery] = useState({});
  
  const handleImageUpload = (e) => {
    const files = e.target.files;
    
    // upload the file to /api/UplaodImage
    const formData = new FormData();
    formData.append("image", files[0]);
    formData.append("type", "marketplace");
    setUploadingImage(true);
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

  return (
    <div className="max-w-screen-xl mx-auto">
      <div className="m-4 p-4 rounded-md ">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex flex-col gap-4">
            <TextInput label="Name" required value={name} onChange={e => setName(e.target.value)} />

            {/* Description */}
            <div className="form-control w-full">
              <label className="label">
                <span className="label-text font-semibold required">Description *</span>
              </label>
              <textarea className="textarea textarea-bordered rounded-md h-[248px] resize-none" placeholder="Description" rows={8} value={description} onChange={e => setDescription(e.target.value)} />
            </div>
            
            {/* Price */}
            <div className="flex flex-row gap-4">
              <TextInput label="Price" required value={price.amount} onChange={e => setPrice((prev) => ({ ...prev, amount: e.target.value }))} className="w-[60%]" />
              <DropDown label="Price Type" required value={price.type} onChange={e => setPrice((prev) => ({ ...prev, type: e.target.value }))} options={["Fixed", "Negotiable", "Free"]} className="w-[40%]" />
            </div>
          </div>

          <div className="flex flex-col gap-4">
            <DropDown label="Condition" required value={condition} onChange={e => setCondition(e.target.value)} options={["Brand New", "Like New", "Good", "Not Working"]} />

              {/* Images */}
            <div className="form-control w-full">
              <label className="label">
                <span className="label-text font-semibold required">Images *</span>
              </label>
              <div className="flex flex-row items-start overflow-x-auto gap-4 no-scrollbar">
                <div className={`card h-[150px] ${images.length === 0 ? "w-full" : "w-[150px]"} rounded-md border-2 border-dashed border-gray-300 flex flex-col justify-center items-center`}>
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
            <TextInput label="Delivery" value={delivery} onChange={e => setDelivery(e.target.value)} />
            <TextInput label="Delivery" value={delivery} onChange={e => setDelivery(e.target.value)} />
            <TextInput label="Delivery" value={delivery} onChange={e => setDelivery(e.target.value)} />
          </div>
        </div>
      </div>
    </div>
  )
}