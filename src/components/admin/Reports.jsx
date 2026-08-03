import React from 'react'

const Reports = () => {
  const HandleExport = async () => {
    try {
      const response = await api.get(
        "sales/export/",
        {
          responseType: "blob"
        }
      )
      const url = window.URL.createObjectURL(
        new Blob([response.data])
      )
      const link = document.createElement("a")
      link.href = url
      link.setAttribute(
        "download",
        "sales_report.csv"
      )
      document.body.appendChild(link)
      link.click()
      link.remove()
    } catch (error) {
      console.error(error)
    }
  }
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
  )
}

export default Reports
