import { useState, useMemo, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { ChevronLeft, ChevronRight, RotateCw } from 'lucide-react'
import { findSection, detailMap } from '../config/sections'
import { editForms } from '../config/editForms'
import useFetch, { extractList } from '../api/useFetch'
import DataTable from '../components/DataTable'
import DetailModal from '../components/DetailModal'
import EditModal from '../components/EditModal'

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
  const [page, setPage] = useState(1)
  const [search, setSearch] = useState('')
  const [query, setQuery] = useState('')
  const [detail, setDetail] = useState(null) // { endpoint, title }
  const [edit, setEdit] = useState(null) // { endpoint, title }
  const pageSize = 20

  const params = useMemo(() => {
    const p = { page, page_size: pageSize }
    if (query) p.search = query
    return p
  }, [page, query])

  const { data, loading, error, reload } = useFetch(view.endpoint, params)
  const { rows, count, totalKnown } = extractList(data)
  const totalPages = totalKnown ? Math.max(1, Math.ceil((count || 0) / pageSize)) : null
  // Backend umumiy sonni bermasa: sahifa to'la bo'lsa "keyingi" bor deb hisoblaymiz
  const hasNext = totalKnown ? page < totalPages : rows.length >= pageSize
  const hasPrev = page > 1
  const showPagination = hasNext || hasPrev

  const detailTemplate = detailMap[view.endpoint]
  const editFields = editForms[view.endpoint]

  const rowId = (row) => row.id ?? row.device_id ?? row.pk

  const openDetail = (row) => {
    const id = rowId(row)
    if (id === undefined || id === null) return
    setDetail({
      endpoint: detailTemplate.replace('{id}', id),
      title: `${view.label} — #${id}`,
    })
  }

  const openEdit = (row) => {
    const id = rowId(row)
    if (id === undefined || id === null) return
    setEdit({
      endpoint: detailTemplate.replace('{id}', id),
      title: `${view.label} — tahrirlash #${id}`,
    })
  }

  const submitSearch = (e) => {
    e.preventDefault()
    setPage(1)
    setQuery(search)
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
              onClick={() => {
                setTab(i)
                setPage(1)
                setQuery('')
                setSearch('')
              }}
            >
              {v.label}
            </button>
          ))}
        </div>
      )}

      <div className="card">
        <div className="card-toolbar">
          <form className="search-box small" onSubmit={submitSearch}>
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Qidirish..."
            />
            <button type="submit" className="btn-mini">Izlash</button>
          </form>
          <span className="count-pill">
            {count || 0} ta yozuv{totalKnown ? '' : ' (shu sahifa)'}
          </span>
        </div>

        {loading && <div className="empty">Yuklanmoqda...</div>}
        {error && (
          <div className="error-box">
            Xatolik: {error}
            <div className="error-hint">
              Agar 401/403 bo'lsa — qaytadan login qiling. Token muddati tugagan bo'lishi mumkin.
            </div>
          </div>
        )}
        {!loading && !error && (
          <DataTable
            columns={view.columns}
            rows={rows}
            onView={detailTemplate ? openDetail : undefined}
            onEdit={detailTemplate && editFields ? openEdit : undefined}
          />
        )}

        {showPagination && !loading && !error && (
          <div className="pagination">
            <button
              className="btn-mini"
              disabled={!hasPrev}
              onClick={() => setPage((p) => p - 1)}
            >
              <ChevronLeft size={16} /> Oldingi
            </button>
            <span>{totalKnown ? `${page} / ${totalPages}` : `Sahifa ${page}`}</span>
            <button
              className="btn-mini"
              disabled={!hasNext}
              onClick={() => setPage((p) => p + 1)}
            >
              Keyingi <ChevronRight size={16} />
            </button>
          </div>
        )}
      </div>

      {detail && (
        <DetailModal
          endpoint={detail.endpoint}
          title={detail.title}
          onClose={() => setDetail(null)}
        />
      )}

      {edit && (
        <EditModal
          endpoint={edit.endpoint}
          fields={editFields}
          title={edit.title}
          onClose={() => setEdit(null)}
          onSaved={reload}
        />
      )}
    </div>
  )
}
