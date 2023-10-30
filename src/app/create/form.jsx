"use client";

import Image from "next/image";
import { useState } from "react";
import { Icon } from "@iconify/react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";

const TextInput = ({ type, label, placeholder, required, disabled, error, setError, value, onChange, className }) => (
  <div className={`form-control w-full ${className}`}>
    <label className="label">
      <span className="label-text font-semibold required">{label} {required && "*"}</span>
    </label>
    <input type={type} disabled={disabled} placeholder={placeholder} value={value} onChange={onChange} className={`input input-bordered input-h w-full rounded-lg ${error && "input-error"}`} />
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
  const [tempKeywords, setTempKeywords] = useState("");
  const [price, setPrice] = useState({
    type: "Fixed",
    amount: 0
  });
  const [delivery, setDelivery] = useState({
    type: "AnywherePublicMeetup",
    cost: 0
  });

  const [nameError, setNameError] = useState(false);
  const [priceError, setPriceError] = useState(false);
  const [imageError, setImageError] = useState(false);
  const [myLocationError, setMyLocationError] = useState(false);
  const [descriptionError, setDescriptionError] = useState(false);
  const [deliveryCostError, setDeliveryCostError] = useState(false);
  const [keywordsError, setKeywordsError] = useState(false);
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
    "General",
    "Baby and Maternity",
    "Beauty and Health",
    "Books and Stationary",
    "Business and Industrial Equipment",
    "Collectibles and Art",
    "Computer and Accessories",
    "Craft and DIY Supplies",
    "Electronics and Appliances",
    "Electronics Repair and Services",
    "Event Tickets",
    "Fashion and Clothing",
    "Food and Beverages",
    "Furniture and Decor",
    "Gaming and Consoles",
    "Gardening and Plants",
    "Health and Wellness Services",
    "Home Appliances",
    "Home and Garden",
    "Home Renovation and Repair",
    "Household Items",
    "Hobbies and Leisure Activities",
    "Jewelry and Watches",
    "Jobs and Services",
    "Mobile and Accessories",
    "Music and Musical Instruments",
    "Outdoor and Adventure Gear",
    "Party and Event Supplies",
    "Pets and Pet Supplies",
    "Photography and Videography Services",
    "Sports and Fitness",
    "Tools and Equipment",
    "Toys",
    "Travel and Experiences",
    "Vehicles and Accessories",
    "Other",
  ];

  const addItem = () => {
    let error = false;
    const keywords = tempKeywords.split(",").map((keyword) => keyword.trim()).filter((keyword) => keyword !== "").filter((keyword, index, self) => self.indexOf(keyword) === index).sort();
    
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

    if (delivery.cost === 0 && delivery.type !== "AnywhereDoorPickup" && delivery.type !== "CityDoorPickup" && delivery.type !== "AreaDoorPickup") {
      setDeliveryCostError(true);
      error = true;
    }

    if (keywords.length === 0) {
      setKeywordsError(true);
      error = true;
    }

    if (error) return;
    
    price.amount = parseInt(price.amount);
    if (delivery.type === "AnywhereDoorPickup" || delivery.type === "CityDoorPickup" || delivery.type === "AreaDoorPickup") {
      delivery.cost = 0;
    }
    else {
      delivery.cost = parseInt(delivery.cost);
    }
    
    const item = {
      name,
      description,
      images,
      condition,
      category,
      price,
      delivery,
      my_location: myLocation,
      status: "available",
      visibility: "public",
      views: 0,
      keywords,
      created_at: new Date(),
      seller: null,
      tempSellerRef: data.user.email
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
    <div className="max-w-screen-xl mx-auto mt-[80px]">
      <div className="m-4 rounded-md">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex flex-col gap-4">
            {/* Name */}
            <TextInput
              required
              type="text"
              label="Name"
              placeholder="e.g. Google Pixel 8 Pro"
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
                required
                type="number"
                label="Price"
                placeholder="e.g. 150000"
                error={priceError}
                setError={setPriceError}
                value={price.amount === 0 ? "" : price.amount}
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
              required
              type="text"
              label="My Location"
              placeholder="e.g. Birtamod, Jhapa"
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
            
            {/* Category */}
            <DropDown label="Category" required value={category} onChange={e => setCategory(e.target.value)} options={itemCategories} />
            
            {/* Delivery */}
            <div className="flex flex-row gap-4">
              <div className={`form-control flex-1`}>
                <label className="label">
                  <span className="label-text font-semibold required">Delivery Type *</span>
                </label>
                <select
                  value={delivery.type}
                  className="select select-bordered rounded-lg"
                  onChange={e => {
                    setDelivery((prev) => ({ ...prev, type: e.target.value }));
                    if (e.target.value === "AnywhereDoorPickup" || e.target.value === "CityDoorPickup" || e.target.value === "AreaDoorPickup") {
                      setDeliveryCostError(false);
                    }
                  }}>
                  <optgroup label="Anywhere in Nepal">
                    <option value="AnywherePublicMeetup">Public Meetup</option>
                    <option value="AnywhereDoorPickup">Door Pickup</option>
                    <option value="AnywhereDoorDropoff">Door Dropoff</option>
                  </optgroup>
                  <optgroup disabled></optgroup>
                  <optgroup label="Within My City">
                    <option value="CityPublicMeetup">Public Meetup</option>
                    <option value="CityDoorPickup">Door Pickup</option>
                    <option value="CityDoorDropoff">Door Dropoff</option>
                  </optgroup>
                  <optgroup disabled></optgroup>
                  <optgroup label="Within My Area">
                    <option value="AreaPublicMeetup">Public Meetup</option>
                    <option value="AreaDoorPickup">Door Pickup</option>
                    <option value="AreaDoorDropoff">Door Dropoff</option>
                  </optgroup>
                </select>
              </div>
              <TextInput
                required
                type="number"
                label="Delivery Cost"
                placeholder="e.g. 100"
                error={deliveryCostError}
                setError={setDeliveryCostError}
                value={delivery.cost === 0 ? "" : delivery.cost}
                disabled={delivery.type === "AnywhereDoorPickup" || delivery.type === "CityDoorPickup" || delivery.type === "AreaDoorPickup"}
                className="flex-1"
                onChange={e => {
                  setDelivery((prev) => ({ ...prev, cost: e.target.value }));
                  setDeliveryCostError(false);
                }}
              />
            </div>

            {/* Keywords */}
            <TextInput
              required
              type="text"
              label="Keywords"
              placeholder="e.g. google, google pixel, android, phone"
              error={keywordsError}
              setError={setNameError}
              value={tempKeywords}
              onChange={e => {
                setTempKeywords(e.target.value);
                setKeywordsError(false);
              }}
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