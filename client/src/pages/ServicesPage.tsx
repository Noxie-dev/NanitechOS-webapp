import React from "react";
import Services from "@/apps/Services";

const ServicesPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-dark text-white p-6">
      <div className="max-w-6xl mx-auto">
        <Services />
      </div>
    </div>
  );
};

export default ServicesPage;
