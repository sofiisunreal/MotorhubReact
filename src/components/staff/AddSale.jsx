import React, { useState } from 'react'
import { useParams } from 'react-router-dom'

const AddSale = () => {
    const {id}=useParams()
    const [form,setForm]=useState({

    })
    const[loading,setLoading]=useState(false)
  return (
    <div>AddSale</div>
  )
}

export default AddSale