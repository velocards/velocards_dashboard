"use client";
import { useState } from "react";
import AddBalance from "@/components/shared/AddBalance";
import AvailableBalance from "@/components/shared/AvailableBalance";

const BalanceDisplay = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const toggleModal = () => {
    setIsModalOpen(!isModalOpen);
  };

  return (
    <>
      <AvailableBalance 
        variant="topbar"
        showLabel={true}
        showAddButton={true}
        onAddBalance={toggleModal}
      />

      {/* Add Balance Modal - Use shared AddBalance component */}
      <AddBalance open={isModalOpen} toggleOpen={toggleModal} />
    </>
  );
};

export default BalanceDisplay;