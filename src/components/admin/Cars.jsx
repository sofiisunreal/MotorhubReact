import React, { useState, useEffect, useRef } from 'react'
import api from '../context/api/api'

const PLACEHOLDER_IMAGE = "https://placehold.co/400x250?text=No+Image"

const Cars = () => {
  const [cars, setCars] = useState([])
  const [suppliers, setSuppliers] = useState([])
  const [supplierId, setSupplierId] = useState("")
  const [brand, setBrand] = useState("")
  const [vin_number, setVinNumber] = useState("")
  const [year, setYear] = useState("")
  const [buying_price, setBuyingPrice] = useState("")
  const [status, setStatus] = useState("available")
  const [image, setImage] = useState(null)

  const [editingId, setEditingId] = useState(null)
  const [showForm, setShowForm] = useState(false)
  const [message, setMessage] = useState('')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")

  const formRef = useRef(null)

  const FetchCars = async () => {
    setLoading(true)
    try {
      const { data } = await api.get("cars/view_cars/")
      setCars(data)
    } catch (error) {
      console.log(error)
    } finally {
      setLoading(false)
    }
  }

  const FetchSuppliers = async () => {
    try {
      const { data } = await api.get("suppliers/viewsuppliers/")
      setSuppliers(data)
    } catch (error) {
      console.log(error)
    }
  }

  useEffect(() => {
    FetchCars()
    FetchSuppliers()
  }, [])

  // scroll the form into view whenever it opens (Add or Edit)
  useEffect(() => {
    if (showForm && formRef.current) {
      formRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }
  }, [showForm])

  const HandleEdit = (car) => {
    setEditingId(car.id)
    setSupplierId(car.supplier_id)
    setBrand(car.brand)
    setVinNumber(car.vin_number)
    setYear(car.year)
    setBuyingPrice(car.buying_price)
    setStatus(car.status)
    setShowForm(true)
  }

  const HandleCancel = () => {
    setEditingId(null)
    setSupplierId("")
    setBrand("")
    setVinNumber("")
    setYear("")
    setBuyingPrice("")
    setStatus("available")
    setImage(null)
    setShowForm(false)
  }

  const HandleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setMessage('')

    const formData = new FormData()
    formData.append("supplier_id", supplierId)
    formData.append("brand", brand)
    formData.append("vin_number", vin_number)
    formData.append("year", year)
    formData.append("buying_price", buying_price)
    formData.append("status", status)

    if (image) {
      formData.append("image", image)
    }

    try {
      if (editingId) {
        await api.patch(`cars/updatecar/${editingId}/`, formData)
        setMessage("Car updated successfully")
      } else {
        await api.post("cars/addcar/", formData)
        setMessage("Car added successfully")
      }

      setSupplierId("")
      setBrand("")
      setVinNumber("")
      setYear("")
      setBuyingPrice("")
      setStatus("available")
      setImage(null)
      setEditingId(null)
      setShowForm(false)
      FetchCars()
    } catch (error) {
      const data = error.response?.data
      console.log(data || error.message)
      setError(data ? JSON.stringify(data) : error.message)
    }
  }

  const StatusBadge = ({ status }) => {
    const styles = {
      available: "bg-green-100 text-green-700",
      sold: "bg-red-100 text-red-700",
      reserved: "bg-yellow-100 text-yellow-700"
    }

    return (
      <span className={`px-3 py-1 rounded-full text-sm font-semibold ${styles[status]}`}>
        {status}
      </span>
    )
  }

  const filteredCars = cars.filter((car) => {
    const term = searchTerm.trim().toLowerCase()
    const matchesSearch =
      !term ||
      car.brand?.toLowerCase().includes(term) ||
      car.vin_number?.toLowerCase().includes(term) ||
      car.supplier_name?.toLowerCase().includes(term)

    const matchesStatus = statusFilter === "all" || car.status === statusFilter

    return matchesSearch && matchesStatus
  })

  if (loading) {
    return <p className='p-6 text-gray-500'>Loading Cars...</p>
  }

  return (
    <div className='p-4 md:p-4 space-y-6'>
      <div className='flex justify-between items-center'>
        <div>
          <h1 className='text-2xl font-bold mb-4'>Cars</h1>
          <p className='text-gray-600'>Manage your car inventory</p>
        </div>
        <button
          onClick={() => setShowForm(!showForm)}
          className='btn-primary hover:bg-blue-700 text-white font-bold py-2 px-4 rounded'
        >
          <i className={`bi ${showForm ? "bi-x-lg" : "bi-plus-lg"} mr-2`}></i>

          {showForm ? "Close Form" : "Add Car"}
        </button>
      </div>

      {showForm && (
        <div ref={formRef} className="form-card gap-2 max-w-full">
          <h2>{editingId ? "Editing" : "Add Car"}</h2>
          <form onSubmit={HandleSubmit} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div>
              <label className="form-label" htmlFor="supplier">Supplier</label>
              <select
                className="form-input"
                id="supplier"
                value={supplierId}
                onChange={(e) => setSupplierId(e.target.value)}
              >
                <option value="">Select Supplier</option>
                {suppliers.map((supplier) => (
                  <option key={supplier.id} value={supplier.id}>
                    {supplier.company_name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="form-label" htmlFor="brand">Brand</label>
              <input
                className="form-input"
                id="brand"
                type="text"
                value={brand}
                onChange={(e) => setBrand(e.target.value)}
              />
            </div>

            <div>
              <label className="form-label" htmlFor="vin_number">VIN Number</label>
              <input
                className="form-input"
                id="vin_number"
                type="text"
                value={vin_number}
                onChange={(e) => setVinNumber(e.target.value)}
              />
            </div>

            <div>
              <label className="form-label" htmlFor="year">Year</label>
              <input
                className="form-input"
                id="year"
                type="number"
                value={year}
                onChange={(e) => setYear(e.target.value)}
              />
            </div>

            <div>
              <label className="form-label" htmlFor="buying_price">Buying Price</label>
              <input
                className="form-input"
                id="buying_price"
                type="number"
                value={buying_price}
                onChange={(e) => setBuyingPrice(e.target.value)}
              />
            </div>

            <div>
              <label className="form-label" htmlFor="status">Status</label>
              <select
                className="form-input"
                id="status"
                value={status}
                onChange={(e) => setStatus(e.target.value)}
              >
                <option value="available">Available</option>
                <option value="sold">Sold</option>
                <option value="reserved">Reserved</option>
              </select>
            </div>

            <div>
              <label className="form-label" htmlFor="image">Image</label>
              <input
                className="form-input"
                id="image"
                type="file"
                onChange={(e) => setImage(e.target.files[0])}
              />
            </div>

            <div className="lg:col-span-3 flex gap-3 mt-4">
              <button type="submit" className="btn-primary">
                {editingId ? "Update Car" : "Add Car"}
              </button>
              <button type="button" onClick={HandleCancel} className="btn-secondary ml-2">
                Cancel
              </button>
            </div>

            {message && <div className="alert-success lg:col-span-3">{message}</div>}
            {error && <div className="alert-error lg:col-span-3">{error}</div>}
          </form>
        </div>
      )}

      <div className="flex flex-col md:flex-row gap-3">
        <input
          type="text"
          placeholder="Search by brand, VIN, or supplier..."
          className="form-input flex-1"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <select
          className="form-input md:w-48"
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
        >
          <option value="all">All Statuses</option>
          <option value="available">Available</option>
          <option value="reserved">Reserved</option>
          <option value="sold">Sold</option>
        </select>
      </div>

      {cars.length === 0 ? (
        <p className='text-gray-500'>No cars available</p>
      ) : filteredCars.length === 0 ? (
        <p className='text-gray-500'>No cars match your search</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {filteredCars.map((car) => (
            <div key={car.id} className="bg-white rounded-xl shadow overflow-hidden">
              <img
                src={car.image || PLACEHOLDER_IMAGE}
                alt={car.brand}
                className="w-full h-52 object-cover"
                onError={(e) => {
                  e.target.onerror = null
                  e.target.src = PLACEHOLDER_IMAGE
                }}
              />
              <div className="p-5">
                <h3 className="text-xl font-bold">{car.brand}</h3>
                <p>VIN: {car.vin_number}</p>
                <p>Year: {car.year}</p>
                <p className="mt-2 text-sm text-gray-500">{car.supplier_name}</p>
                <p className="font-semibold text-lg mt-2 mb-2">
                  Price: Ksh {Number(car.buying_price).toLocaleString()}
                </p>
                <StatusBadge status={car.status} />
                <button
                  className="mt-4 text-blue-600 block"
                  onClick={() => HandleEdit(car)}
                >
                  <i className="bi bi-pencil-square"></i>

                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default Cars
