import React from 'react'
import { useState, useEffect } from 'react'
import api from '../context/api/api'

const Sales = () => {
  const [sales, setSales] = useState([])
  const [loading, setLoading] = useState(true)

  const FetchSales = async () => {
    setLoading(true)
    try {
      const { data } = await api.get("sales/viewsales/")
      setSales(data)
    } catch (error) {
      console.log(error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    FetchSales()
  }, [])

  return (
    <div className='p-4 md:p-4 space-y-6'>
      <div>
        <h1 className='text-2xl font-bold mb-4'>Sales</h1>
        <p className='text-gray-600'>All recorded sales</p>
      </div>

      {loading ? (
        <p className="text-gray-500">Loading sales...</p>
      ) : sales.length === 0 ? (
        <p className="text-gray-500">No sales recorded yet</p>
      ) : (
        <div className="bg-white rounded-xl shadow overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-gray-50 text-gray-600 text-xs uppercase tracking-wide">
              <tr>
                <th className="p-4">ID</th>
                <th className="p-4">VIN Number</th>
                <th className="p-4">Brand</th>
                <th className="p-4">Customer</th>
                <th className="p-4 text-right">Selling Price</th>
                <th className="p-4 text-right">Buying Price</th>
                <th className="p-4 text-right">Profit</th>
                <th className="p-4">Staff</th>
                <th className="p-4">Sale Date</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {sales.map((sale) => {
                const profit = Number(sale.profit)
                return (
                  <tr key={sale.id} className="hover:bg-gray-50">
                    <td className="p-4">{sale.sale_id}</td>
                    <td className="p-4">{sale.vin_number}</td>
                    <td className="p-4 font-semibold">{sale.brand}</td>
                    <td className="p-4">
                      <p>{sale.customer_name}</p>
                      <p className="text-sm text-gray-500">{sale.customer_phone}</p>
                    </td>
                    <td className="p-4 text-right">Ksh {Number(sale.selling_price).toLocaleString()}</td>
                    <td className="p-4 text-right">Ksh {Number(sale.buying_price).toLocaleString()}</td>
                    <td className={`p-4 text-right font-semibold ${profit >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                      Ksh {profit.toLocaleString()}
                    </td>
                    <td className="p-4">{sale.sold_by}</td>
                    <td className="p-4">{new Date(sale.sale_date).toLocaleDateString()}</td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}

export default Sales
