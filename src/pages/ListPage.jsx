import { useState, useMemo, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { ChevronLeft, ChevronRight, RotateCw, Plus } from 'lucide-react'
import { findSection, detailMap, getDeleteTemplate } from '../config/sections'
import { getEditConfig } from '../config/editForms'
import { getCreateConfig } from '../config/createForms'
import { deleteItem } from '../api/crud'
import useFetch, { extractList } from '../api/useFetch'
import DataTable from '../components/DataTable'
import DetailModal from '../components/DetailModal'
import EditModal from '../components/EditModal'
import CreateModal from '../components/CreateModal'
import ConfirmModal from '../components/ConfirmModal'

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
  const [del, setDel] = useState(null) // { endpoint, title }
  const [creating, setCreating] = useState(false)
  const pageSize = 20

  const params = useMemo(() => {
    const p = { page, page_size: pageSize }
    if (query) p.search = query
    return p
  }, [page, query])

  const { data, loading, error, reload } = useFetch(view.endpoint, params)
  const { rows: allRows, count, totalKnown } = extractList(data)

  // Ba'zi endpointlar (masalan notif) `page` ni hurmat qilmay HAMMA yozuvni
  // bir martada qaytaradi. Bunday holda sahifalash VA qidiruvni o'zimiz qilamiz.
  const clientSide = !totalKnown && allRows.length > pageSize

  // Client-side: ID bo'yicha saralash + (qidiruv bo'lsa) matn bo'yicha filtrlash
  let pool = allRows
  if (clientSide) {
    pool = [...allRows].sort((a, b) => (Number(b?.id) || 0) - (Number(a?.id) || 0))
    if (query) {
      const q = query.toLowerCase()
      pool = pool.filter((r) =>
        Object.values(r).some(
          (v) => (typeof v === 'string' || typeof v === 'number') && String(v).toLowerCase().includes(q)
        )
      )
    }
  }

  const knownTotal = clientSide || totalKnown
  const totalCount = clientSide ? pool.length : count
  const totalPages = knownTotal
    ? Math.max(1, Math.ceil((totalCount || 0) / pageSize))
    : null
  const rows = clientSide ? pool.slice((page - 1) * pageSize, page * pageSize) : allRows

  const hasNext = knownTotal ? page < totalPages : allRows.length >= pageSize
  const hasPrev = page > 1
  const showPagination = hasNext || hasPrev

  const detailTemplate = detailMap[view.endpoint]
  const editConfig = getEditConfig(view.endpoint)
  const hasEdit = !!editConfig
  const deleteTemplate = getDeleteTemplate(view.endpoint)
  const createConfig = getCreateConfig(view.endpoint)

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
    // Har bir nishon manzilini {id} bilan to'ldiramiz.
    // patch=null bo'lsa — standart detail/{id}/ ishlatiladi.
    const targets = editConfig.targets.map((t) => ({
      patch: (t.patch || detailTemplate).replace('{id}', id),
      fields: t.fields,
    }))
    setEdit({
      endpoint: detailTemplate.replace('{id}', id), // GET prefill
      targets,
      title: `${view.label} — tahrirlash #${id}`,
    })
  }

  const openDelete = (row) => {
    const id = rowId(row)
    if (id === undefined || id === null) return
    setDel({
      endpoint: deleteTemplate.replace('{id}', id),
      title: `${view.label} #${id} — o'chirish`,
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
          <div className="toolbar-right">
            <span className="count-pill">
              {totalCount || 0} ta yozuv{knownTotal ? '' : ' (shu sahifa)'}
            </span>
            {createConfig && (
              <button className="btn-add" onClick={() => setCreating(true)}>
                <Plus size={16} /> Qo'shish
              </button>
            )}
          </div>
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
            onEdit={detailTemplate && hasEdit ? openEdit : undefined}
            onDelete={deleteTemplate ? openDelete : undefined}
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
            <span>{knownTotal ? `${page} / ${totalPages}` : `Sahifa ${page}`}</span>
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
          key={detail.endpoint}
          endpoint={detail.endpoint}
          title={detail.title}
          onClose={() => setDetail(null)}
        />
      )}

      {edit && (
        <EditModal
          key={edit.endpoint}
          endpoint={edit.endpoint}
          targets={edit.targets}
          title={edit.title}
          onClose={() => setEdit(null)}
          onSaved={reload}
        />
      )}

      {creating && createConfig && (
        <CreateModal
          url={createConfig.url}
          fields={createConfig.fields}
          title={`${section.title} — yangi qo'shish`}
          onClose={() => setCreating(false)}
          onSaved={reload}
        />
      )}

      {del && (
        <ConfirmModal
          title={del.title}
          message="Bu yozuvni o'chirmoqchimisiz? Bu amalni qaytarib bo'lmaydi."
          onConfirm={async () => {
            await deleteItem(del.endpoint)
            reload()
          }}
          onClose={() => setDel(null)}
        />
      )}
    </div>
  )
}
