import React from "react";

const BusinessHours: React.FC = () => (
  <div className="flex flex-col w-full text-gray-700">
    <div className="flex flex-col gap-1 text-sm text-gray-600">
      <div className="flex justify-between border-b pb-2 mb-2">
        <span>Monday - Friday</span>
        <span className="font-medium">9:00 AM - 5:00 PM</span>
      </div>
      <div className="flex justify-between border-b pb-2 mb-2">
        <span>Saturday</span>
        <span className="font-medium">10:00 AM - 2:00 PM</span>
      </div>
      <div className="flex justify-between border-b pb-2 mb-2">
        <span>Sunday</span>
        <span className="font-medium">Closed</span>
      </div>
    </div>
  </div>
);

export default BusinessHours;
