import { getHomeContent } from '@/lib/content'

export default function Playbooks() {
  const homeContent = getHomeContent()
  const playbooks = (homeContent as any).playbooks || []
  return (
    <div className="overflow-x-auto pb-4">
      <div className="flex space-x-4 min-w-max">
        {playbooks.map((playbook: any, index: number) => (
          <div
            key={index}
            className="bg-white rounded-lg p-6 border border-navy/10 hover:border-violet/30 hover:shadow-lg transition-all duration-300 min-w-[300px]"
          >
            <h3 className="text-xl font-semibold text-navy mb-3">{playbook.title}</h3>
            <p className="text-navy/70 text-sm leading-relaxed">{playbook.description}</p>
          </div>
        ))}
      </div>
    </div>
  )
}

