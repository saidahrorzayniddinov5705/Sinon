import { useEffect, useRef, useState } from 'react'
import { LocateFixed } from 'lucide-react'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png'
import markerIcon from 'leaflet/dist/images/marker-icon.png'
import markerShadow from 'leaflet/dist/images/marker-shadow.png'

// Vite bundlerida Leaflet'ning standart marker rasm yo'llari buzilib qoladi — qo'lda tuzatamiz.
delete L.Icon.Default.prototype._getIconUrl
L.Icon.Default.mergeOptions({
  iconRetinaUrl: markerIcon2x,
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
})

const DEFAULT_CENTER = [41.311081, 69.240562] // Toshkent

// Xaritadan joylashuv tanlash: bosish/marker surish yoki manzilni so'z bilan qidirish.
export default function MapPicker({ latitude, longitude, onChange }) {
  const mapEl = useRef(null)
  const mapRef = useRef(null)
  const markerRef = useRef(null)
  const [search, setSearch] = useState('')
  const [searching, setSearching] = useState(false)
  const [searchErr, setSearchErr] = useState('')
  const [locating, setLocating] = useState(false)
  const [locateErr, setLocateErr] = useState('')

  useEffect(() => {
    const hasCoords = latitude !== '' && latitude != null && longitude !== '' && longitude != null
    const lat = hasCoords ? Number(latitude) : DEFAULT_CENTER[0]
    const lng = hasCoords ? Number(longitude) : DEFAULT_CENTER[1]

    const map = L.map(mapEl.current).setView([lat, lng], hasCoords ? 15 : 11)
    mapRef.current = map

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; OpenStreetMap',
      maxZoom: 19,
    }).addTo(map)

    const marker = L.marker([lat, lng], { draggable: true }).addTo(map)
    markerRef.current = marker

    const emit = (pos) => onChange({ lat: pos.lat.toFixed(6), lng: pos.lng.toFixed(6) })

    marker.on('dragend', () => emit(marker.getLatLng()))
    map.on('click', (e) => {
      marker.setLatLng(e.latlng)
      emit(e.latlng)
    })

    return () => map.remove()
    // Faqat birinchi render'da yaratamiz — keyingi lat/lng o'zgarishlari marker orqali ichkaridan boshqariladi
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const handleSearch = async (e) => {
    e.preventDefault()
    if (!search.trim()) return
    setSearching(true)
    setSearchErr('')
    try {
      const res = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&limit=1&q=${encodeURIComponent(search)}`
      )
      const results = await res.json()
      if (!results.length) {
        setSearchErr('Manzil topilmadi')
        return
      }
      const lat = Number(results[0].lat)
      const lng = Number(results[0].lon)
      mapRef.current.setView([lat, lng], 16)
      markerRef.current.setLatLng([lat, lng])
      onChange({ lat: lat.toFixed(6), lng: lng.toFixed(6) })
    } catch {
      setSearchErr('Qidirishda xatolik yuz berdi')
    } finally {
      setSearching(false)
    }
  }

  const handleLocate = () => {
    setLocateErr('')
    if (!navigator.geolocation) {
      setLocateErr('Brauzeringiz joylashuvni aniqlashni qo\'llab-quvvatlamaydi')
      return
    }
    setLocating(true)
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const { latitude: lat, longitude: lng } = pos.coords
        mapRef.current.setView([lat, lng], 16)
        markerRef.current.setLatLng([lat, lng])
        onChange({ lat: lat.toFixed(6), lng: lng.toFixed(6) })
        setLocating(false)
      },
      (err) => {
        const msg =
          err.code === err.PERMISSION_DENIED
            ? "Joylashuvga ruxsat berilmadi — brauzer sozlamalaridan ruxsat bering"
            : "Joylashuvni aniqlab bo'lmadi"
        setLocateErr(msg)
        setLocating(false)
      },
      { enableHighAccuracy: true, timeout: 10000 }
    )
  }

  return (
    <div className="map-picker">
      <div className="map-search">
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              e.preventDefault()
              handleSearch(e)
            }
          }}
          placeholder="Manzilni yozing (masalan: Toshkent, Chilonzor)"
        />
        <button type="button" className="btn-ghost slim" onClick={handleSearch} disabled={searching}>
          {searching ? 'Qidirilmoqda...' : 'Qidirish'}
        </button>
        <button
          type="button"
          className="btn-ghost slim"
          onClick={handleLocate}
          disabled={locating}
          title="Mening joylashuvim"
        >
          <LocateFixed size={15} /> {locating ? 'Aniqlanmoqda...' : 'Mening joylashuvim'}
        </button>
      </div>
      {searchErr && <div className="map-search-err">{searchErr}</div>}
      {locateErr && <div className="map-search-err">{locateErr}</div>}
      <div ref={mapEl} className="map-picker-canvas" />
      <p className="form-note">
        Xaritada bosing yoki markerni suring — koordinata avtomatik yoziladi.
        {latitude && longitude ? ` Tanlangan: ${Number(latitude).toFixed(6)}, ${Number(longitude).toFixed(6)}` : ''}
      </p>
    </div>
  )
}
