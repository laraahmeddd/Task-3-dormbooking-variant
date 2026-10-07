import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { api } from '../api'

const defaults = {
  roomNumber: '',
  startDate: '',
  endDate: '',
  purpose: ''
}

export default function BookingForm() {
  const nav = useNavigate()
  const { id } = useParams()
  const [form, setForm] = useState(defaults)
  const [error, setError] = useState('')

  // Load booking when editing
  useEffect(() => {
    if (!id) return

    async function loadBooking() {
      try {
        const response = await api.get(`/bookings/${id}`)
        const booking = response.data.booking

        setForm({
          roomNumber: booking.roomNumber,
          startDate: booking.startDate.slice(0, 10),
          endDate: booking.endDate.slice(0, 10),
          purpose: booking.purpose || ''
        })
      } catch (err) {
        setError(err.response?.data?.message || err.message)
      }
    }

    loadBooking()
  }, [id])

  // Update form
  function onChange(e) {
    const { name, value } = e.target

    setForm(prev => ({
      ...prev,
      [name]: value
    }))
  }

  // Create or update booking
  async function onSubmit(e) {
    e.preventDefault()
    setError('')

    try {
      if (id) {
        await api.patch(`/bookings/${id}`, form)
      } else {
        await api.post('/bookings', form)
      }

      nav('/bookings')
    } catch (err) {
      setError(err.response?.data?.message || err.message)
    }
  }

  return (
    <div className="max-w-lg mx-auto card">
      <h1 className="text-xl font-semibold mb-4">
        {id ? 'Edit' : 'New'} Booking
      </h1>

      <form onSubmit={onSubmit} className="space-y-3">

        <input
          className="input"
          name="roomNumber"
          placeholder="Room number"
          value={form.roomNumber}
          onChange={onChange}
          required
        />

        <input
          className="input"
          type="date"
          name="startDate"
          value={form.startDate}
          onChange={onChange}
          required
        />

        <input
          className="input"
          type="date"
          name="endDate"
          value={form.endDate}
          onChange={onChange}
          required
        />

        <textarea
          className="input"
          name="purpose"
          placeholder="Purpose (optional)"
          value={form.purpose}
          onChange={onChange}
        />

        {error && (
          <div className="text-red-600 text-sm">
            {error}
          </div>
        )}

        <button className="btn" type="submit">
          Save
        </button>

      </form>
    </div>
  )
}