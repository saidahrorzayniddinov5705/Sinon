import { useState, useMemo, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { ChevronLeft, ChevronRight, RotateCw, Plus, SlidersHorizontal } from 'lucide-react'
import { findSection, getDeleteTemplate } from '../config/sections'
import { getCreateConfig } from '../config/createForms'
import { getFilters } from '../config/filters'
import useFetch, { extractList } from '../api/useFetch'
import DataTable from '../components/DataTable'
import CreateModal from '../components/CreateModal'
import FilterPanel from '../components/FilterPanel'

export default function ListPage() {
  const { key } = useParams()
  const section = findSection(key)
  const [tab, setTab] = useState(0)

  // Bo'lim (key) almashganda tabni 0 ga qaytaramiz
  useEffect(() => {
    setTab(0)
  }, [key])

  if (!section) return <div className="empty">Bo'lim topilmadi</div>

  const view = section.views[tab] || section.views[0]

  return (
    <SectionContent
      key={key + tab}
      section={section}
      view={view}
      tab={tab}
      setTab={setTab}
    />
  )
}

function SectionContent({ section, view, tab, setTab }) {
  const navigate = useNavigate()
  const [page, setPage] = useState(1)
  const [creating, setCreating] = useState(false)
  const [filterParams, setFilterParams] = useState({}) // qo'llangan filtr query params
  const filterDefs = getFilters(view.endpoint)
  const [filterOpen, setFilterOpen] = useState(filterDefs.length > 0) // default OCHIQ
  const pageSize = 20

  const filterKey = JSON.stringify(filterParams)

  // Filtr o'zgarsa sahifani 1 ga qaytaramiz
  useEffect(() => {
    setPage(1)
  }, [filterKey])

  const params = useMemo(() => {
    return { page, page_size: pageSize, ...filterParams }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, filterKey])

  const { data, loading, error, reload } = useFetch(view.endpoint, params)
  // Backend natija bo'lmasa 404 "...topilmadi" qaytaradi — buni xato emas, "bo'sh" deb hisoblaymiz
  const notFound = error && /^404\b/.test(error)
  const realError = error && !notFound
  const { rows: allRows, count, totalKnown } = extractList(data)

  // Hammasini birdan qaytaradigan endpointlar uchun client-side sahifalash
  const clientSide = !totalKnown && allRows.length > pageSize
  let pool = allRows
  if (clientSide) {
    pool = [...allRows].sort((a, b) => (Number(b?.id) || 0) - (Number(a?.id) || 0))
  }
  const knownTotal = clientSide || totalKnown
  const totalCount = clientSide ? pool.length : count
  const totalPages = knownTotal ? Math.max(1, Math.ceil((totalCount || 0) / pageSize)) : null
  const rows = clientSide ? pool.slice((page - 1) * pageSize, page * pageSize) : allRows

  const hasNext = knownTotal ? page < totalPages : allRows.length >= pageSize
  const hasPrev = page > 1
  const showPagination = hasNext || hasPrev

  const deleteTemplate = getDeleteTemplate(view.endpoint)
  const createConfig = getCreateConfig(view.endpoint)

  const rowId = (row) => row.id ?? row.device_id ?? row.pk

  // "Ko'rish" — alohida sahifaga o'tadi (qaysi view ekani ?ep= orqali)
  const openDetail = (row) => {
    const id = rowId(row)
    if (id === undefined || id === null) return
    navigate(`/section/${section.key}/${id}?ep=${encodeURIComponent(view.endpoint)}`)
  }

  return (
    <div className="page">
      <div className="page-head">
        <div>
          <h1>{section.title}</h1>
          <p className="breadcrumb">Super Admin / {section.title}</p>
        </div>
        <button className="btn-ghost" onClick={reload}>
          <RotateCw size={16} /> Yangilash
        </button>
      </div>

      {section.views.length > 1 && (
        <div className="tabs">
          {section.views.map((v, i) => (
            <button
              key={i}
              className={`tab ${i === tab ? 'active' : ''}`}
              onClick={() => setTab(i)}
            >
              {v.label}
            </button>
          ))}
        </div>
      )}

      <div className="card">
        <div className="card-toolbar">
          <div className="toolbar-right" style={{ marginLeft: 'auto' }}>
            <span className="count-pill">
              {totalCount || 0} ta yozuv{knownTotal ? '' : ' (shu sahifa)'}
            </span>
            {filterDefs.length > 0 && (
              <button
                className={`btn-filter ${filterOpen ? 'on' : ''}`}
                onClick={() => setFilterOpen((o) => !o)}
              >
                <SlidersHorizontal size={15} /> Filtr
                {Object.keys(filterParams).length > 0 && (
                  <span className="filter-badge">{Object.keys(filterParams).length}</span>
                )}
              </button>
            )}
            {createConfig && (
              <button className="btn-add" onClick={() => setCreating(true)}>
                <Plus size={16} /> Qo'shish
              </button>
            )}
          </div>
        </div>

        {filterOpen && filterDefs.length > 0 && (
          <FilterPanel
            filters={filterDefs}
            applied={filterParams}
            onApply={(p) => setFilterParams(p)}
            onClose={() => setFilterOpen(false)}
          />
        )}

        {loading && <div className="empty">Yuklanmoqda...</div>}
        {realError && (
          <div className="error-box">
            Xatolik: {error}
            <div className="error-hint">
              Agar 401/403 bo'lsa — qaytadan login qiling. Token muddati tugagan bo'lishi mumkin.
            </div>
          </div>
        )}
        {!loading && !realError && (
          <DataTable
            columns={view.columns}
            rows={notFound ? [] : rows}
            onView={openDetail}
          />
        )}

        {showPagination && !loading && !error && (
          <div className="pagination">
            <button className="btn-mini" disabled={!hasPrev} onClick={() => setPage((p) => p - 1)}>
              <ChevronLeft size={16} /> Oldingi
            </button>
            <span>{knownTotal ? `${page} / ${totalPages}` : `Sahifa ${page}`}</span>
            <button className="btn-mini" disabled={!hasNext} onClick={() => setPage((p) => p + 1)}>
              Keyingi <ChevronRight size={16} />
            </button>
          </div>
        )}
      </div>

      {creating && createConfig && (
        <CreateModal
          url={createConfig.url}
          fields={createConfig.fields}
          title={`${section.title} — yangi qo'shish`}
          onClose={() => setCreating(false)}
          onSaved={reload}
        />
      )}
    </div>
  )
}
