"use client";
import Select from "@/components/shared/Select";
import Modal from "@/components/shared/Modal";
import Image from "next/image";
import { useState } from "react";

// User's cards data
const userCards = [
  { id: 1, name: "Shopping Card (**** 4821)", value: "shopping-4821" },
  { id: 2, name: "Travel Card (**** 3967)", value: "travel-3967" },
  { id: 3, name: "Business Card (**** 5234)", value: "business-5234" },
];

const cardDetails = {
  "Card Type": "Visa",
  "Card Holder": "Felecia Brown",
  Expires: "12/27",
  "Card Number": "**** **** **** 4821",
  "Total Spent": "99,245.54 USD",
  "Current Balance": "9,546.45 USD",
};

interface CardDetailsProps {
  isDetailsRevealed: boolean;
  setIsDetailsRevealed: (value: boolean) => void;
}

const CardDetails = ({ isDetailsRevealed, setIsDetailsRevealed }: CardDetailsProps) => {
  const [selectedCard, setSelectedCard] = useState(userCards[0].name);
  const [isCardModalOpen, setIsCardModalOpen] = useState(false);
  
  // Card creation form state
  const [newCardData, setNewCardData] = useState({
    cardName: "",
    bin: "",
    cardLimit: "",
    firstName: "",
    lastName: "",
    address: "",
    city: "",
    state: "",
    zip: "",
    country: "US",
    expiryMonth: "",
    expiryYear: "",
    phoneNumber: ""
  });
  
  const binOptions = ["485932", "486895", "483928", "556677", "440066", "471110", "535316", "414709"];
  
  const toggleCardModal = () => {
    setIsCardModalOpen(!isCardModalOpen);
    // Reset card form when closing
    if (isCardModalOpen) {
      setNewCardData({
        cardName: "",
        bin: "",
        cardLimit: "",
        firstName: "",
        lastName: "",
        address: "",
        city: "",
        state: "",
        zip: "",
        country: "US",
        expiryMonth: "",
        expiryYear: "",
        phoneNumber: ""
      });
    }
  };

  const handleCreateCard = () => {
    // Here you would handle the card creation logic
    // Close modal after submission
    toggleCardModal();
  };
  return (
    <div className="box mb-4 xxl:mb-6">
      <div className="bb-dashed pb-4 mb-4 lg:mb-6 lg:pb-6 flex justify-between items-center">
        <h4 className="h4">Choose Card</h4>
        <Select 
          items={userCards.map(card => card.name)} 
          setSelected={setSelectedCard} 
          selected={selectedCard} 
          btnClass="rounded-[30px] min-w-[200px]" 
          contentClass="w-full min-w-max" 
          img={<Image src="/images/visa.png" width={20} height={20} alt="card" />} 
        />
      </div>
      <div className="bb-dashed pb-4 mb-4 lg:mb-6 lg:pb-6 flex flex-col">
        {/* Glassmorphism Credit Card - Standard proportions */}
        <div className="relative w-full mb-6 lg:mb-8">
          <div className="relative overflow-hidden rounded-2xl h-[300px]">
            {/* Background geometric pattern */}
            <div className="absolute inset-0 bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-black">
              {/* Floating geometric shapes */}
              <div className="absolute top-10 left-10 w-24 h-24 bg-gradient-to-br from-cyan-400 to-blue-500 rotate-45 opacity-90"></div>
              <div className="absolute top-1/3 right-20 w-32 h-32 bg-gradient-to-br from-purple-400 to-pink-500 rotate-12 opacity-80"></div>
              <div className="absolute bottom-20 left-1/4 w-20 h-20 bg-gradient-to-br from-green-400 to-emerald-500 -rotate-30 opacity-85"></div>
              <div className="absolute bottom-10 right-10 w-28 h-28 bg-gradient-to-br from-orange-400 to-red-500 rotate-60 opacity-90"></div>
              
              {/* Hexagon pattern */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-40 h-40">
                <div className="absolute inset-0 bg-gradient-to-br from-indigo-400 to-purple-500 opacity-70" style={{clipPath: 'polygon(30% 0%, 70% 0%, 100% 30%, 100% 70%, 70% 100%, 30% 100%, 0% 70%, 0% 30%)'}}></div>
              </div>
            </div>
            
            <div className="relative h-full">
              {/* Shapes touching the card border for 3D effect */}
              <div className="absolute -top-4 left-1/4 w-8 h-8 bg-gradient-to-br from-cyan-400 to-blue-500 rotate-45 z-20"></div>
              <div className="absolute -bottom-3 right-1/3 w-6 h-6 bg-gradient-to-br from-purple-400 to-pink-500 rotate-12 z-20"></div>
              <div className="absolute top-1/2 -left-3 w-6 h-12 bg-gradient-to-br from-green-400 to-emerald-500 rounded-r-lg z-20"></div>
              <div className="absolute top-1/3 -right-4 w-10 h-10 bg-gradient-to-br from-orange-400 to-yellow-500 rounded-l-full z-20"></div>
              
              {/* Main card */}
              <div className="relative h-full rounded-2xl overflow-hidden bg-gradient-to-br from-white/30 to-white/10 dark:from-gray-800/30 dark:to-gray-800/10 backdrop-blur-sm p-8 flex flex-col justify-between border-2 border-white/50 dark:border-gray-600/50 shadow-2xl">
              {/* Glass effect overlay with highlights */}
              <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-white/5 dark:from-gray-700/10 dark:to-gray-700/5"></div>
              <div className="absolute inset-x-0 top-0 h-[2px] bg-gradient-to-r from-transparent via-white/80 to-transparent dark:via-white/40"></div>
              <div className="absolute inset-y-0 left-0 w-[2px] bg-gradient-to-b from-transparent via-white/60 to-transparent dark:via-white/30"></div>
              <div className="absolute inset-x-0 bottom-0 h-[2px] bg-gradient-to-r from-transparent via-black/10 to-transparent dark:via-black/30"></div>
              <div className="absolute inset-y-0 right-0 w-[2px] bg-gradient-to-b from-transparent via-black/10 to-transparent dark:via-black/30"></div>
              
              {/* Card content */}
              <div className="relative z-10">
                <div className="flex justify-between items-start mb-6">
                  <div>
                    <p className="text-gray-600 dark:text-gray-400 text-sm mb-1">Current Balance</p>
                    <h4 className="text-gray-900 dark:text-gray-100 font-bold text-2xl">80,700.00 USD</h4>
                  </div>
                  <Image src="/images/visa-sm.png" width={48} height={17} alt="visa icon" />
                </div>
              </div>
              
              <div className="relative z-10">
                <div className="flex justify-between items-end">
                  <div className="space-y-3">
                    <Image src="/images/mastercard.png" width={40} height={40} alt="mastercard icon" />
                    <div>
                      <p className="text-gray-900 dark:text-gray-100 font-semibold">Felecia Brown</p>
                      <p className="text-gray-600 dark:text-gray-400 text-sm font-mono">
                        {isDetailsRevealed ? "4532 1234 5678 8854" : "•••• •••• •••• 8854"}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-gray-900 dark:text-gray-100 font-mono mb-3">12/27</p>
                    {/* Reveal Button */}
                    <button
                      onClick={() => setIsDetailsRevealed(!isDetailsRevealed)}
                      className="bg-white/20 hover:bg-white/30 dark:bg-gray-800/20 dark:hover:bg-gray-800/30 backdrop-blur-sm px-4 py-2 rounded-full text-sm font-medium transition-all flex items-center gap-2 text-gray-900 dark:text-gray-100 border border-white/30 dark:border-gray-600/30"
                    >
                      <i className={`las ${isDetailsRevealed ? 'la-eye-slash' : 'la-eye'} text-lg`}></i>
                      <span>{isDetailsRevealed ? 'Hide Number' : 'Reveal Number'}</span>
                    </button>
                  </div>
                </div>
              </div>
              
              {/* Card design elements */}
              <div className="absolute -right-20 -top-20 w-40 h-40 bg-white/10 rounded-full blur-3xl"></div>
              <div className="absolute -left-20 -bottom-20 w-40 h-40 bg-white/10 rounded-full blur-3xl"></div>
            </div>
            </div>
          </div>
        </div>
        <ul className="flex flex-col gap-4">
          {Object.entries(cardDetails).map(([key, value]) => {
            let displayValue = value;
            
            if (key === "Card Number") {
              displayValue = isDetailsRevealed ? "4532 1234 5678 4821" : "**** **** **** 4821";
            }
            
            return (
              <li key={key} className="flex justify-between items-center">
                <span>{key}:</span>
                <span className={`font-medium ${key === "Card Number" ? "font-mono" : ""}`}>{displayValue}</span>
              </li>
            );
          })}
        </ul>
      </div>
      <div>
        <h5 className="h5 mb-4">Card Controls</h5>
        <div className="flex flex-col gap-4 mb-6">
          <div className="flex justify-between items-center p-4 bg-n10 dark:bg-n900 rounded-lg">
            <div>
              <p className="font-semibold mb-1">Freeze Card</p>
              <p className="text-sm text-n500 dark:text-n400">Temporarily disable this card</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input type="checkbox" className="sr-only peer" />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary/20 dark:peer-focus:ring-primary/20 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-primary"></div>
            </label>
          </div>
          
          <div className="flex justify-between items-center p-4 bg-n10 dark:bg-n900 rounded-lg">
            <div>
              <p className="font-semibold mb-1">Update Limit</p>
              <p className="text-sm text-n500 dark:text-n400">Modify spending limit for this card</p>
            </div>
            <button className="text-primary hover:bg-primary/10 px-4 py-1.5 rounded-full text-sm font-medium transition-colors">
              Edit
            </button>
          </div>
          
          <div className="flex justify-between items-center p-4 bg-n10 dark:bg-n900 rounded-lg">
            <div>
              <p className="font-semibold mb-1">Delete Card</p>
              <p className="text-sm text-n500 dark:text-n400">Permanently remove this card</p>
            </div>
            <button className="text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 px-4 py-1.5 rounded-full text-sm font-medium transition-colors">
              Delete
            </button>
          </div>
        </div>
        
        <button 
          onClick={toggleCardModal}
          className="w-full flex items-center justify-center gap-1 bg-primary text-white hover:bg-primary/90 px-3 py-1.5 rounded-full text-xs font-medium transition-colors shadow-sm"
        >
          <i className="las la-plus text-sm"></i>
          <span>Add New Card</span>
        </button>
      </div>

      {/* Add New Card Modal */}
      <Modal toggleOpen={toggleCardModal} open={isCardModalOpen} width="max-w-[600px] lg:top-24">
        <div className="mb-4 pb-4 bb-dashed lg:mb-6 lg:pb-6">
          <h4 className="h4">Add New Card</h4>
        </div>
        
        <form>
          <div className="mt-6 xl:mt-8 grid grid-cols-2 gap-4 xxxl:gap-6 max-h-[60vh] overflow-y-auto pr-2">
            {/* Card Name */}
            <div className="col-span-2">
              <label htmlFor="card-name-details" className="md:text-lg font-medium block mb-4">Card Name</label>
              <input
                type="text"
                value={newCardData.cardName}
                onChange={(e) => setNewCardData({...newCardData, cardName: e.target.value})}
                placeholder="e.g., Shopping Card"
                className="w-full text-sm bg-secondary/5 dark:bg-bg3 border border-n30 dark:border-n500 rounded-3xl px-6 py-2.5 md:py-3"
                id="card-name-details"
                required
              />
            </div>

            {/* BIN */}
            <div className="col-span-2 md:col-span-1">
              <label className="md:text-lg font-medium block mb-4">BIN</label>
              <div className="bg-secondary/5 dark:bg-bg3 border border-n30 dark:border-n500 rounded-3xl">
                <Select
                  items={binOptions}
                  selected={newCardData.bin}
                  setSelected={(value) => setNewCardData({...newCardData, bin: value})}
                  btnClass="w-full justify-between rounded-3xl py-2.5 md:py-3"
                  contentClass="w-full"
                />
              </div>
            </div>

            {/* Card Limit */}
            <div className="col-span-2 md:col-span-1">
              <label htmlFor="card-limit-details" className="md:text-lg font-medium block mb-4">Card Limit (USD)</label>
              <input
                type="number"
                value={newCardData.cardLimit}
                onChange={(e) => setNewCardData({...newCardData, cardLimit: e.target.value})}
                placeholder="5000"
                className="w-full text-sm bg-secondary/5 dark:bg-bg3 border border-n30 dark:border-n500 rounded-3xl px-6 py-2.5 md:py-3"
                id="card-limit-details"
                min="0"
                step="100"
                required
              />
            </div>

            {/* First Name */}
            <div className="col-span-2 md:col-span-1">
              <label htmlFor="first-name-details" className="md:text-lg font-medium block mb-4">First Name</label>
              <input
                type="text"
                value={newCardData.firstName}
                onChange={(e) => setNewCardData({...newCardData, firstName: e.target.value})}
                placeholder="John"
                className="w-full text-sm bg-secondary/5 dark:bg-bg3 border border-n30 dark:border-n500 rounded-3xl px-6 py-2.5 md:py-3"
                id="first-name-details"
                required
              />
            </div>

            {/* Last Name */}
            <div className="col-span-2 md:col-span-1">
              <label htmlFor="last-name-details" className="md:text-lg font-medium block mb-4">Last Name</label>
              <input
                type="text"
                value={newCardData.lastName}
                onChange={(e) => setNewCardData({...newCardData, lastName: e.target.value})}
                placeholder="Doe"
                className="w-full text-sm bg-secondary/5 dark:bg-bg3 border border-n30 dark:border-n500 rounded-3xl px-6 py-2.5 md:py-3"
                id="last-name-details"
                required
              />
            </div>

            {/* Address */}
            <div className="col-span-2">
              <label htmlFor="address-details" className="md:text-lg font-medium block mb-4">Address</label>
              <input
                type="text"
                value={newCardData.address}
                onChange={(e) => setNewCardData({...newCardData, address: e.target.value})}
                placeholder="123 Main Street"
                className="w-full text-sm bg-secondary/5 dark:bg-bg3 border border-n30 dark:border-n500 rounded-3xl px-6 py-2.5 md:py-3"
                id="address-details"
                required
              />
            </div>

            {/* City */}
            <div className="col-span-2 md:col-span-1">
              <label htmlFor="city-details" className="md:text-lg font-medium block mb-4">City</label>
              <input
                type="text"
                value={newCardData.city}
                onChange={(e) => setNewCardData({...newCardData, city: e.target.value})}
                placeholder="New York"
                className="w-full text-sm bg-secondary/5 dark:bg-bg3 border border-n30 dark:border-n500 rounded-3xl px-6 py-2.5 md:py-3"
                id="city-details"
                required
              />
            </div>

            {/* State */}
            <div className="col-span-2 md:col-span-1">
              <label htmlFor="state-details" className="md:text-lg font-medium block mb-4">State</label>
              <input
                type="text"
                value={newCardData.state}
                onChange={(e) => setNewCardData({...newCardData, state: e.target.value})}
                placeholder="NY"
                maxLength={2}
                className="w-full text-sm bg-secondary/5 dark:bg-bg3 border border-n30 dark:border-n500 rounded-3xl px-6 py-2.5 md:py-3"
                id="state-details"
                required
              />
            </div>

            {/* Zip */}
            <div className="col-span-2 md:col-span-1">
              <label htmlFor="zip-details" className="md:text-lg font-medium block mb-4">ZIP Code</label>
              <input
                type="text"
                value={newCardData.zip}
                onChange={(e) => setNewCardData({...newCardData, zip: e.target.value})}
                placeholder="10001"
                maxLength={10}
                className="w-full text-sm bg-secondary/5 dark:bg-bg3 border border-n30 dark:border-n500 rounded-3xl px-6 py-2.5 md:py-3"
                id="zip-details"
                required
              />
            </div>

            {/* Country */}
            <div className="col-span-2 md:col-span-1">
              <label htmlFor="country-details" className="md:text-lg font-medium block mb-4">Country</label>
              <input
                type="text"
                value={newCardData.country}
                readOnly
                className="w-full text-sm bg-gray-100 dark:bg-gray-800 border border-n30 dark:border-n500 rounded-3xl px-6 py-2.5 md:py-3 cursor-not-allowed"
                id="country-details"
              />
            </div>

            {/* Expiry Month */}
            <div className="col-span-2 md:col-span-1">
              <label htmlFor="expiry-month-details" className="md:text-lg font-medium block mb-4">Expiry Month</label>
              <input
                type="text"
                value={newCardData.expiryMonth}
                onChange={(e) => setNewCardData({...newCardData, expiryMonth: e.target.value})}
                placeholder="MM"
                maxLength={2}
                className="w-full text-sm bg-secondary/5 dark:bg-bg3 border border-n30 dark:border-n500 rounded-3xl px-6 py-2.5 md:py-3"
                id="expiry-month-details"
                required
              />
            </div>

            {/* Expiry Year */}
            <div className="col-span-2 md:col-span-1">
              <label htmlFor="expiry-year-details" className="md:text-lg font-medium block mb-4">Expiry Year</label>
              <input
                type="text"
                value={newCardData.expiryYear}
                onChange={(e) => setNewCardData({...newCardData, expiryYear: e.target.value})}
                placeholder="YYYY"
                maxLength={4}
                className="w-full text-sm bg-secondary/5 dark:bg-bg3 border border-n30 dark:border-n500 rounded-3xl px-6 py-2.5 md:py-3"
                id="expiry-year-details"
                required
              />
            </div>

            {/* Phone Number */}
            <div className="col-span-2">
              <label htmlFor="phone-number-details" className="md:text-lg font-medium block mb-4">Phone Number</label>
              <input
                type="tel"
                value={newCardData.phoneNumber}
                onChange={(e) => setNewCardData({...newCardData, phoneNumber: e.target.value})}
                placeholder="+1 (555) 123-4567"
                className="w-full text-sm bg-secondary/5 dark:bg-bg3 border border-n30 dark:border-n500 rounded-3xl px-6 py-2.5 md:py-3"
                id="phone-number-details"
                required
              />
            </div>
          </div>

          {/* Add New Card Button */}
          <div className="col-span-2 mt-6 sticky bottom-0 bg-n0 dark:bg-bg4 pt-4 border-t dark:border-n500">
            <button
              type="submit"
              onClick={(e) => {
                e.preventDefault();
                handleCreateCard();
              }}
              disabled={!newCardData.cardName || !newCardData.bin || !newCardData.cardLimit}
              className="w-full bg-primary text-white hover:bg-primary/90 px-6 py-3 rounded-full font-medium transition-colors flex justify-center items-center disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Add New Card
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default CardDetails;
