import { getExperiments } from '@/lib/content'

export default async function ExperimentsPage() {
  const experiments = await getExperiments()

  return (
    <div className="min-h-screen bg-navy text-offwhite">
      <div className="max-w-7xl mx-auto px-6 sm:px-8 py-16">
        <div className="mb-16">
          <h1 className="text-4xl md:text-5xl font-semibold mb-4">Experiments</h1>
          <p className="text-xl text-offwhite/70 max-w-2xl">
            Prototypes, tools, and experiments exploring the frontiers of technology and strategy.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {experiments.map((experiment, index) => (
            <div
              key={index}
              className="bg-navy/50 backdrop-blur-sm rounded-lg p-6 border border-violet/20 hover:border-violet/40 hover:shadow-lg hover:shadow-violet/10 transition-all duration-300"
            >
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold">{experiment.title}</h2>
                <span className={`text-xs font-medium px-2 py-1 rounded ${
                  experiment.status === 'Active'
                    ? 'bg-green-500/20 text-green-400'
                    : 'bg-blue-500/20 text-blue-400'
                }`}>
                  {experiment.status}
                </span>
              </div>
              <p className="text-offwhite/70 text-sm mb-4 leading-relaxed">
                {experiment.description}
              </p>
              <div className="flex flex-wrap gap-2">
                {experiment.tags?.map((tag) => (
                  <span
                    key={tag}
                    className="text-xs font-medium text-violet bg-violet/10 px-2 py-1 rounded"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
