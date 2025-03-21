"use client";
import React, { useState, useEffect } from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

interface PriceInputProps {
  price: number;
  onPriceChange: (price: number) => void;
  onReset: () => void;
  t: (key: string) => string;
}

function PriceInput({ price, onPriceChange, t }: PriceInputProps) {
  const [editablePrice, setEditablePrice] = useState(price);

  useEffect(() => {
    setEditablePrice(price);
  }, [price]);

  const handlePriceInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newPrice = Number(e.target.value);
    setEditablePrice(newPrice);
    onPriceChange(newPrice);
  };

  return (
    <div className="space-y-2">
      <Label htmlFor="monthly-price">{t("calculator.montly_price")} (€)</Label>
      <div className="flex space-x-2">
        <Input
          id="monthly-price"
          type="number"
          min="0"
          value={editablePrice}
          onChange={handlePriceInputChange}
          className="w-full"
        />
      </div>
    </div>
  );
}

export default PriceInput;
