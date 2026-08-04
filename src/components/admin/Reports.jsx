import React from "react";
import api from "../context/api/api";

const Reports = () => {
  const HandleExport = async () => {
    try {
      const response = await api.get(
        "sales/exportsalescsv/",
        {
          responseType: "blob",
        }
      );

      const url = window.URL.createObjectURL(response.data);

      const link = document.createElement("a");
      link.href = url;
      link.download = "sales_report.csv";

      document.body.appendChild(link);
      link.click();

      link.remove();
      window.URL.revokeObjectURL(url);

    } catch (error) {
      console.error("Export failed:", error);
    }
  };

  return (
    <div>
      <button
        onClick={HandleExport}
        className="btn-primary"
      >
        <i className="bi bi-download mr-2"></i>
        Export Sales CSV
      </button>
    </div>
  );
};

export default Reports;