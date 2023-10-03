"use client";

import Image from "next/image";
import { useState } from "react";
import { Icon } from "@iconify/react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";

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

export default function Form() {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [images, setImages] = useState([]);
  const [myLocation, setMyLocation] = useState("");
  const [uploadingImage, setUploadingImage] = useState(false);
  const [condition, setCondition] = useState("Good");
  const [category, setCategory] = useState("Others");
  const [price, setPrice] = useState({
    type: "Fixed",
    amount: 0
  });
  const [delivery, setDelivery] = useState({
    type: "Public Meetup",
    area: "Within My Area",
    cost: 0
  });

  const [nameError, setNameError] = useState(false);
  const [priceError, setPriceError] = useState(false);
  const [imageError, setImageError] = useState(false);
  const [myLocationError, setMyLocationError] = useState(false);
  const [descriptionError, setDescriptionError] = useState(false);
  const [deliveryCostError, setDeliveryCostError] = useState(false);
  const [saving, setSaving] = useState(false);

  const router = useRouter();
  const { data } = useSession();

  const handleImageUpload = (e) => {
    const files = e.target.files;
    if (files.length === 0) return;

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
    })
    .catch((error) => {
      setUploadingImage(false);
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

    if (price.amount === 0) {
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

    if (delivery.type !== "Door Pickup" && delivery.cost === 0) {
      setDeliveryCostError(true);
      error = true;
    }

    if (error) return;

    price.amount = parseInt(price.amount);
    delivery.cost = parseInt(delivery.cost);
    
    const item = {
      name,
      description,
      images,
      condition,
      category,
      price,
      delivery,
      myLocation,
      status: "available",
      visibility: "public",
      seller: data.user.email,
      sellerName: data.user.name,
      createdAt: new Date(),
    }

    setSaving(true);

    fetch("/api/CreateAd", {
      method: "POST",
      body: JSON.stringify(item)
    })
    .then((res) => res.json())
    .then((data) => {
      router.push(`/item/${data.id}`);
    })
    .catch((error) => {
      setSaving(false);
    });
  }

  return (
    <div className="max-w-screen-xl mx-auto">
      <div className="m-4 p-4 rounded-md">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex flex-col gap-4">
            {/* Name */}
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
            
            {/* Delivery */}
            <div className="flex flex-row gap-4">
              <DropDown label="Delivery Type" required value={delivery.type} onChange={e => setDelivery((prev) => ({ ...prev, type: e.target.value }))} options={["Public Meetup", "Door Pickup", "Door Dropoff"]} className="w-[60%]" />
              <DropDown label="Delivery Area" required value={delivery.area} onChange={e => setDelivery((prev) => ({ ...prev, area: e.target.value }))} options={["Within My Area", "Within My City", "Anywhere in Nepal"]} className="w-[40%]" />
            </div>

            {/* Delivery Cost */}
            <TextInput
              label="Delivery Cost"
              placeholder="e.g. 100"
              required
              error={deliveryCostError}
              setError={setDeliveryCostError}
              value={delivery.cost}
              disabled={delivery.type === "Door Pickup"}
              onChange={e => {
                setDelivery((prev) => ({ ...prev, cost: e.target.value }));
                setDeliveryCostError(false);
              }} 
              className="w-[60%]"
            />
          </div>
        </div>
        <div className="flex justify-end gap-4 mt-4">
          <button className="btn btn-primary rounded-lg" onClick={addItem} disabled={saving}>
            {
              saving ? (
                <>
                  <Icon icon="gg:spinner-two-alt" width={20} height={20} className="animate-spin" />
                  <span>Posting</span>
                </>
              ) : (
                <>
                  <Icon icon="ant-design:plus-outlined" width={20} height={20} />
                  <span>Post</span>
                </>
              )
            }
          </button>
        </div>
      </div>
    </div>
  )
}