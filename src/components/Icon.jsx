import * as Lucide from 'lucide-react'

// Nomi bo'yicha lucide ikonkasini chiqaradi. Topilmasa — doira.
export default function Icon({ name, ...props }) {
  const Cmp = Lucide[name] || Lucide.Circle
  return <Cmp {...props} />
}
