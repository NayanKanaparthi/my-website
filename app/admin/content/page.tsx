'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import ImageUpload from '@/components/admin/ImageUpload'

type ContentType = 'work' | 'ventures' | 'projects' | 'about' | 'home'

export default function ContentManagementPage() {
  const [activeTab, setActiveTab] = useState<ContentType>('work')
  const [loading, setLoading] = useState(false)
  const [saving, setSaving] = useState(false)
  const [data, setData] = useState<any>(null)

  const loadContent = async () => {
    setLoading(true)
    try {
      const response = await fetch(`/api/admin/content?type=${activeTab}`, {
        credentials: 'include',
      })
      if (!response.ok) {
        if (response.status === 401) {
          // Unauthorized - redirect to login
          window.location.href = '/admin-login'
          return
        }
        throw new Error(`Failed to load content: ${response.statusText}`)
      }
      const result = await response.json()
      // Ensure projects is always an array
      if (activeTab === 'projects' && !Array.isArray(result.data)) {
        setData([])
      } else {
        setData(result.data)
      }
    } catch (error) {
      console.error('Error loading content:', error)
      alert('Failed to load content. Please refresh the page.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadContent()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeTab])

  const saveContent = async () => {
    setSaving(true)
    try {
      const response = await fetch('/api/admin/content', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type: activeTab, data }),
        credentials: 'include',
      })
      if (!response.ok) {
        if (response.status === 401) {
          // Unauthorized - redirect to login
          window.location.href = '/admin-login'
          return
        }
        const errorData = await response.json().catch(() => ({}))
        throw new Error(errorData.error || `Failed to save content: ${response.statusText}`)
      }
      alert('Content saved successfully!')
    } catch (error) {
      console.error('Error saving content:', error)
      alert(error instanceof Error ? error.message : 'Failed to save content. Please try again.')
      alert('Error saving content')
    } finally {
      setSaving(false)
    }
  }

  const tabs = [
    { id: 'work' as ContentType, label: 'Work/Projects' },
    { id: 'ventures' as ContentType, label: 'Ventures' },
    { id: 'projects' as ContentType, label: 'Projects' },
    { id: 'about' as ContentType, label: 'About Page' },
    { id: 'home' as ContentType, label: 'Homepage' },
  ]

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-semibold text-navy mb-2">Content Management</h1>
        <p className="text-navy/70">Edit all website content from one place</p>
      </div>

      {/* Tabs */}
      <div className="border-b border-navy/10 mb-6">
        <div className="flex space-x-4">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-4 py-2 text-sm font-medium transition-colors ${
                activeTab === tab.id
                  ? 'text-violet border-b-2 border-violet'
                  : 'text-navy/70 hover:text-navy'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Content Editor */}
      {loading ? (
        <div className="text-center py-12">
          <p className="text-navy/60">Loading...</p>
        </div>
      ) : (
        <div className="space-y-6">
          <ContentEditor
            type={activeTab}
            data={data}
            onChange={setData}
          />
          <div className="flex justify-end">
            <button
              onClick={saveContent}
              disabled={saving}
              className="px-6 py-3 bg-violet text-white rounded-lg font-medium hover:bg-violet/90 transition-colors disabled:opacity-50"
            >
              {saving ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

function ContentEditor({ type, data, onChange }: { type: ContentType; data: any; onChange: (data: any) => void }) {
  if (!data) return null

  switch (type) {
    case 'work':
      return <WorkEditor data={data} onChange={onChange} />
    case 'ventures':
      return <VenturesEditor data={data} onChange={onChange} />
    case 'projects':
      return <ProjectsEditor data={data} onChange={onChange} />
    case 'about':
      return <AboutEditor data={data} onChange={onChange} />
    case 'home':
      return <HomeEditor data={data} onChange={onChange} />
    default:
      return null
  }
}

function WorkEditor({ data, onChange }: { data: any[]; onChange: (data: any[]) => void }) {
  const addItem = () => {
    onChange([...data, {
      slug: '',
      title: '',
      client: '',
      year: new Date().getFullYear().toString(),
      category: '',
      context: '',
      problem: '',
      approach: '',
      frameworks: [],
      implementation: [],
      outcomes: [],
      learnings: [],
    }])
  }

  const removeItem = (index: number) => {
    onChange(data.filter((_, i) => i !== index))
  }

  const updateItem = (index: number, field: string, value: any) => {
    const newData = [...data]
    newData[index] = { ...newData[index], [field]: value }
    onChange(newData)
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold text-navy">Work Items</h2>
        <button
          onClick={addItem}
          className="px-4 py-2 bg-violet text-white rounded-lg text-sm font-medium hover:bg-violet/90"
        >
          + Add Work Item
        </button>
      </div>
      {data.map((item, index) => (
        <div key={index} className="bg-offwhite p-6 rounded-lg border border-navy/10">
          <div className="flex justify-between items-start mb-4">
            <h3 className="text-lg font-semibold text-navy">Item {index + 1}</h3>
            <button
              onClick={() => removeItem(index)}
              className="text-red-600 hover:text-red-700 text-sm"
            >
              Delete
            </button>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-navy mb-1">Slug</label>
              <input
                type="text"
                value={item.slug || ''}
                onChange={(e) => updateItem(index, 'slug', e.target.value)}
                className="w-full px-3 py-2 border border-navy/20 rounded"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-navy mb-1">Title</label>
              <input
                type="text"
                value={item.title || ''}
                onChange={(e) => updateItem(index, 'title', e.target.value)}
                className="w-full px-3 py-2 border border-navy/20 rounded"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-navy mb-1">Client</label>
              <input
                type="text"
                value={item.client || ''}
                onChange={(e) => updateItem(index, 'client', e.target.value)}
                className="w-full px-3 py-2 border border-navy/20 rounded"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-navy mb-1">Year</label>
              <input
                type="text"
                value={item.year || ''}
                onChange={(e) => updateItem(index, 'year', e.target.value)}
                className="w-full px-3 py-2 border border-navy/20 rounded"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-navy mb-1">Category</label>
              <input
                type="text"
                value={item.category || ''}
                onChange={(e) => updateItem(index, 'category', e.target.value)}
                className="w-full px-3 py-2 border border-navy/20 rounded"
              />
            </div>
            <div className="col-span-2">
              <label className="block text-sm font-medium text-navy mb-1">Context</label>
              <textarea
                value={item.context || ''}
                onChange={(e) => updateItem(index, 'context', e.target.value)}
                rows={3}
                className="w-full px-3 py-2 border border-navy/20 rounded"
              />
            </div>
            <div className="col-span-2">
              <label className="block text-sm font-medium text-navy mb-1">Problem</label>
              <textarea
                value={item.problem || ''}
                onChange={(e) => updateItem(index, 'problem', e.target.value)}
                rows={3}
                className="w-full px-3 py-2 border border-navy/20 rounded"
              />
            </div>
            <div className="col-span-2">
              <label className="block text-sm font-medium text-navy mb-1">Approach</label>
              <textarea
                value={item.approach || ''}
                onChange={(e) => updateItem(index, 'approach', e.target.value)}
                rows={3}
                className="w-full px-3 py-2 border border-navy/20 rounded"
              />
            </div>
            <div className="col-span-2">
              <label className="block text-sm font-medium text-navy mb-1">Frameworks (comma-separated)</label>
              <input
                type="text"
                value={Array.isArray(item.frameworks) ? item.frameworks.join(', ') : ''}
                onChange={(e) => updateItem(index, 'frameworks', e.target.value.split(',').map(s => s.trim()).filter(Boolean))}
                className="w-full px-3 py-2 border border-navy/20 rounded"
              />
            </div>
            <div className="col-span-2">
              <label className="block text-sm font-medium text-navy mb-1">Implementation (one per line)</label>
              <textarea
                value={Array.isArray(item.implementation) ? item.implementation.join('\n') : ''}
                onChange={(e) => updateItem(index, 'implementation', e.target.value.split('\n').filter(Boolean))}
                rows={4}
                className="w-full px-3 py-2 border border-navy/20 rounded"
              />
            </div>
            <div className="col-span-2">
              <label className="block text-sm font-medium text-navy mb-1">Outcomes (one per line)</label>
              <textarea
                value={Array.isArray(item.outcomes) ? item.outcomes.join('\n') : ''}
                onChange={(e) => updateItem(index, 'outcomes', e.target.value.split('\n').filter(Boolean))}
                rows={4}
                className="w-full px-3 py-2 border border-navy/20 rounded"
              />
            </div>
            <div className="col-span-2">
              <label className="block text-sm font-medium text-navy mb-1">Learnings (one per line)</label>
              <textarea
                value={Array.isArray(item.learnings) ? item.learnings.join('\n') : ''}
                onChange={(e) => updateItem(index, 'learnings', e.target.value.split('\n').filter(Boolean))}
                rows={4}
                className="w-full px-3 py-2 border border-navy/20 rounded"
              />
            </div>
          </div>
        </div>
      ))}
      {data.length === 0 && (
        <div className="text-center py-12 text-navy/60">
          <p>No work items yet. Click &quot;Add Work Item&quot; to get started.</p>
        </div>
      )}
    </div>
  )
}

function VenturesEditor({ data, onChange }: { data: any[]; onChange: (data: any[]) => void }) {
  const addItem = () => {
    onChange([...data, { title: '', description: '', status: 'Active', year: new Date().getFullYear().toString(), link: '', image: '' }])
  }

  const removeItem = (index: number) => {
    onChange(data.filter((_, i) => i !== index))
  }

  const updateItem = (index: number, field: string, value: any) => {
    const newData = [...data]
    newData[index] = { ...newData[index], [field]: value }
    onChange(newData)
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold text-navy">Ventures</h2>
        <button onClick={addItem} className="px-4 py-2 bg-violet text-white rounded-lg text-sm font-medium hover:bg-violet/90">
          + Add Venture
        </button>
      </div>
      {data.map((item, index) => (
        <div key={index} className="bg-offwhite p-6 rounded-lg border border-navy/10">
          <div className="flex justify-between items-start mb-4">
            <h3 className="text-lg font-semibold text-navy">Venture {index + 1}</h3>
            <button onClick={() => removeItem(index)} className="text-red-600 hover:text-red-700 text-sm">Delete</button>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-navy mb-1">Title</label>
              <input type="text" value={item.title || ''} onChange={(e) => updateItem(index, 'title', e.target.value)} className="w-full px-3 py-2 border border-navy/20 rounded" />
            </div>
            <div>
              <label className="block text-sm font-medium text-navy mb-1">Status</label>
              <select value={item.status || 'Active'} onChange={(e) => updateItem(index, 'status', e.target.value)} className="w-full px-3 py-2 border border-navy/20 rounded">
                <option>Active</option>
                <option>Research</option>
                <option>Completed</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-navy mb-1">Year</label>
              <input type="text" value={item.year || ''} onChange={(e) => updateItem(index, 'year', e.target.value)} className="w-full px-3 py-2 border border-navy/20 rounded" />
            </div>
            <div>
              <label className="block text-sm font-medium text-navy mb-1">Venture Link (External URL)</label>
              <input 
                type="url" 
                value={item.link || ''} 
                onChange={(e) => updateItem(index, 'link', e.target.value)} 
                placeholder="https://example.com"
                className="w-full px-3 py-2 border border-navy/20 rounded" 
              />
            </div>
            <div className="col-span-2">
              <label className="block text-sm font-medium text-navy mb-1">Venture Image</label>
              <ImageUpload
                value={item.image || ''}
                onChange={(url) => updateItem(index, 'image', url)}
              />
            </div>
            <div className="col-span-2">
              <label className="block text-sm font-medium text-navy mb-1">Description</label>
              <textarea value={item.description || ''} onChange={(e) => updateItem(index, 'description', e.target.value)} rows={4} className="w-full px-3 py-2 border border-navy/20 rounded" />
            </div>
          </div>
        </div>
      ))}
      {data.length === 0 && <div className="text-center py-12 text-navy/60"><p>No ventures yet. Click &quot;Add Venture&quot; to get started.</p></div>}
    </div>
  )
}

function ProjectsEditor({ data, onChange }: { data: any[]; onChange: (data: any[]) => void }) {
  // Ensure data is always an array
  const projects = Array.isArray(data) ? data : []

  const addItem = () => {
    onChange([...projects, { title: '', description: '', image: '', githubLink: '', projectLink: '', type: 'project', category: '', date: '', tags: [] }])
  }

  const removeItem = (index: number) => {
    onChange(projects.filter((_, i) => i !== index))
  }

  const updateItem = (index: number, field: string, value: any) => {
    const newData = [...projects]
    newData[index] = { ...newData[index], [field]: value }
    onChange(newData)
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold text-navy">Projects</h2>
        <button
          onClick={addItem}
          className="px-4 py-2 bg-violet text-white rounded-lg text-sm font-medium hover:bg-violet/90"
        >
          + Add Project
        </button>
      </div>
      {projects.map((item, index) => (
        <div key={index} className="bg-offwhite p-6 rounded-lg border border-navy/10">
          <div className="flex justify-between items-start mb-4">
            <h3 className="text-lg font-semibold text-navy">Project {index + 1}</h3>
            <button
              onClick={() => removeItem(index)}
              className="text-red-600 hover:text-red-700 text-sm"
            >
              Delete
            </button>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-navy mb-1">Title</label>
              <input
                type="text"
                value={item.title || ''}
                onChange={(e) => updateItem(index, 'title', e.target.value)}
                className="w-full px-3 py-2 border border-navy/20 rounded"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-navy mb-1">Type</label>
              <select
                value={item.type || 'project'}
                onChange={(e) => updateItem(index, 'type', e.target.value)}
                className="w-full px-3 py-2 border border-navy/20 rounded"
              >
                <option value="project">Project</option>
                <option value="paper">Paper</option>
                <option value="website">Website</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-navy mb-1">Category</label>
              <input
                type="text"
                value={item.category || ''}
                onChange={(e) => updateItem(index, 'category', e.target.value)}
                placeholder="e.g., Research, Interactive, etc."
                className="w-full px-3 py-2 border border-navy/20 rounded"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-navy mb-1">Date</label>
              <input
                type="date"
                value={item.date || ''}
                onChange={(e) => updateItem(index, 'date', e.target.value)}
                className="w-full px-3 py-2 border border-navy/20 rounded"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-navy mb-1">Project Image</label>
              <ImageUpload
                value={item.image || ''}
                onChange={(url) => updateItem(index, 'image', url)}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-navy mb-1">Project Link (External URL)</label>
              <input
                type="url"
                value={item.projectLink || ''}
                onChange={(e) => updateItem(index, 'projectLink', e.target.value)}
                placeholder="https://example.com"
                className="w-full px-3 py-2 border border-navy/20 rounded"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-navy mb-1">GitHub Link (Optional)</label>
              <input
                type="url"
                value={item.githubLink || ''}
                onChange={(e) => updateItem(index, 'githubLink', e.target.value)}
                placeholder="https://github.com/..."
                className="w-full px-3 py-2 border border-navy/20 rounded"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-navy mb-1">Tags (comma-separated)</label>
              <input
                type="text"
                value={Array.isArray(item.tags) ? item.tags.join(', ') : (item.tags || '')}
                onChange={(e) => updateItem(index, 'tags', e.target.value.split(',').map((t: string) => t.trim()).filter(Boolean))}
                placeholder="research, interactive, paper"
                className="w-full px-3 py-2 border border-navy/20 rounded"
              />
            </div>
            <div className="col-span-2">
              <label className="block text-sm font-medium text-navy mb-1">Description</label>
              <textarea
                value={item.description || ''}
                onChange={(e) => updateItem(index, 'description', e.target.value)}
                rows={4}
                className="w-full px-3 py-2 border border-navy/20 rounded"
              />
            </div>
          </div>
        </div>
      ))}
      {projects.length === 0 && (
        <div className="text-center py-12 text-navy/60">
          <p>No projects yet. Click &quot;Add Project&quot; to get started.</p>
        </div>
      )}
    </div>
  )
}

function AboutEditor({ data, onChange }: { data: any; onChange: (data: any) => void }) {
  const updateField = (field: string, value: any) => {
    onChange({ ...data, [field]: value })
  }

  const addExperience = (type: 'professionalExperience' | 'leadershipExperience') => {
    const experiences = data[type] || []
    updateField(type, [...experiences, { title: '', company: '', location: '', startDate: '', endDate: '', description: '', companyImage: '' }])
  }

  const removeExperience = (type: 'professionalExperience' | 'leadershipExperience', index: number) => {
    const experiences = data[type] || []
    updateField(type, experiences.filter((_: any, i: number) => i !== index))
  }

  const updateExperience = (type: 'professionalExperience' | 'leadershipExperience', index: number, field: string, value: string) => {
    const experiences = [...(data[type] || [])]
    experiences[index] = { ...experiences[index], [field]: value }
    updateField(type, experiences)
  }

  const addEducation = () => {
    const education = data.education || []
    updateField('education', [...education, { university: '', major: '', relevantCoursework: '', location: '', year: '', universityLogo: '' }])
  }

  const removeEducation = (index: number) => {
    const education = data.education || []
    updateField('education', education.filter((_: any, i: number) => i !== index))
  }

  const updateEducation = (index: number, field: string, value: string) => {
    const education = [...(data.education || [])]
    education[index] = { ...education[index], [field]: value }
    updateField('education', education)
  }

  const updateSkill = (category: string, index: number, value: string) => {
    const skills = { ...data.skills }
    skills[category] = [...skills[category]]
    skills[category][index] = value
    updateField('skills', skills)
  }

  const addSkill = (category: string) => {
    const skills = { ...data.skills }
    skills[category] = [...(skills[category] || []), '']
    updateField('skills', skills)
  }

  const removeSkill = (category: string, index: number) => {
    const skills = { ...data.skills }
    skills[category] = skills[category].filter((_: any, i: number) => i !== index)
    updateField('skills', skills)
  }

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-xl font-semibold text-navy mb-4">Profile Image</h2>
        <ImageUpload
          value={data.image || ''}
          onChange={(url) => updateField('image', url)}
        />
      </div>

      <div>
        <h2 className="text-xl font-semibold text-navy mb-4">Bio</h2>
        <textarea
          value={data.bio || ''}
          onChange={(e) => updateField('bio', e.target.value)}
          rows={6}
          className="w-full px-4 py-3 border border-navy/20 rounded-lg"
          placeholder="Your bio text..."
        />
      </div>

      <div>
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold text-navy">Education</h2>
          <button onClick={addEducation} className="px-4 py-2 bg-violet text-white rounded-lg text-sm font-medium hover:bg-violet/90">
            + Add Education
          </button>
        </div>
        {(data.education || []).map((item: any, index: number) => (
          <div key={index} className="bg-offwhite p-4 rounded-lg border border-navy/10 mb-4">
            <div className="flex justify-between items-start mb-3">
              <h3 className="font-semibold text-navy">Education {index + 1}</h3>
              <button onClick={() => removeEducation(index)} className="text-red-600 hover:text-red-700 text-sm">Delete</button>
            </div>
            <div className="space-y-3">
              <div className="grid grid-cols-2 gap-4">
                <input type="text" value={item.university || ''} onChange={(e) => updateEducation(index, 'university', e.target.value)} placeholder="University" className="px-3 py-2 border border-navy/20 rounded" />
                <input type="text" value={item.major || ''} onChange={(e) => updateEducation(index, 'major', e.target.value)} placeholder="Major" className="px-3 py-2 border border-navy/20 rounded" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <input type="text" value={item.location || ''} onChange={(e) => updateEducation(index, 'location', e.target.value)} placeholder="Location" className="px-3 py-2 border border-navy/20 rounded" />
                <input type="text" value={item.year || ''} onChange={(e) => updateEducation(index, 'year', e.target.value)} placeholder="Year" className="px-3 py-2 border border-navy/20 rounded" />
              </div>
              <div>
                <label className="block text-sm font-medium text-navy mb-1">Relevant Coursework</label>
                <textarea value={item.relevantCoursework || ''} onChange={(e) => updateEducation(index, 'relevantCoursework', e.target.value)} placeholder="Relevant Coursework" rows={2} className="w-full px-3 py-2 border border-navy/20 rounded" />
              </div>
              <div>
                <label className="block text-sm font-medium text-navy mb-1">University Logo</label>
                <ImageUpload
                  value={item.universityLogo || ''}
                  onChange={(url) => updateEducation(index, 'universityLogo', url)}
                />
              </div>
            </div>
          </div>
        ))}
      </div>

      <div>
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold text-navy">Professional Experience</h2>
          <button onClick={() => addExperience('professionalExperience')} className="px-4 py-2 bg-violet text-white rounded-lg text-sm font-medium hover:bg-violet/90">
            + Add Experience
          </button>
        </div>
        {(data.professionalExperience || []).map((item: any, index: number) => (
          <div key={index} className="bg-offwhite p-4 rounded-lg border border-navy/10 mb-4">
            <div className="flex justify-between items-start mb-3">
              <h3 className="font-semibold text-navy">Experience {index + 1}</h3>
              <button onClick={() => removeExperience('professionalExperience', index)} className="text-red-600 hover:text-red-700 text-sm">Delete</button>
            </div>
            <div className="space-y-3">
              <div className="grid grid-cols-2 gap-4">
                <input type="text" value={item.title || ''} onChange={(e) => updateExperience('professionalExperience', index, 'title', e.target.value)} placeholder="Job Title" className="px-3 py-2 border border-navy/20 rounded" />
                <input type="text" value={item.company || ''} onChange={(e) => updateExperience('professionalExperience', index, 'company', e.target.value)} placeholder="Company" className="px-3 py-2 border border-navy/20 rounded" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <input type="text" value={item.location || ''} onChange={(e) => updateExperience('professionalExperience', index, 'location', e.target.value)} placeholder="Location" className="px-3 py-2 border border-navy/20 rounded" />
                <div className="grid grid-cols-2 gap-2">
                  <input type="text" value={item.startDate || ''} onChange={(e) => updateExperience('professionalExperience', index, 'startDate', e.target.value)} placeholder="Start Date" className="px-3 py-2 border border-navy/20 rounded" />
                  <input type="text" value={item.endDate || ''} onChange={(e) => updateExperience('professionalExperience', index, 'endDate', e.target.value)} placeholder="End Date (or leave blank)" className="px-3 py-2 border border-navy/20 rounded" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-navy mb-1">Company Logo</label>
                <ImageUpload
                  value={item.companyImage || ''}
                  onChange={(url) => updateExperience('professionalExperience', index, 'companyImage', url)}
                />
              </div>
              <textarea value={item.description || ''} onChange={(e) => updateExperience('professionalExperience', index, 'description', e.target.value)} placeholder="Description" rows={3} className="w-full px-3 py-2 border border-navy/20 rounded" />
            </div>
          </div>
        ))}
      </div>

      <div>
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold text-navy">Leadership Experience</h2>
          <button onClick={() => addExperience('leadershipExperience')} className="px-4 py-2 bg-violet text-white rounded-lg text-sm font-medium hover:bg-violet/90">
            + Add Experience
          </button>
        </div>
        {(data.leadershipExperience || []).map((item: any, index: number) => (
          <div key={index} className="bg-offwhite p-4 rounded-lg border border-navy/10 mb-4">
            <div className="flex justify-between items-start mb-3">
              <h3 className="font-semibold text-navy">Experience {index + 1}</h3>
              <button onClick={() => removeExperience('leadershipExperience', index)} className="text-red-600 hover:text-red-700 text-sm">Delete</button>
            </div>
            <div className="space-y-3">
              <div className="grid grid-cols-2 gap-4">
                <input type="text" value={item.title || ''} onChange={(e) => updateExperience('leadershipExperience', index, 'title', e.target.value)} placeholder="Role Title" className="px-3 py-2 border border-navy/20 rounded" />
                <input type="text" value={item.company || ''} onChange={(e) => updateExperience('leadershipExperience', index, 'company', e.target.value)} placeholder="Organization" className="px-3 py-2 border border-navy/20 rounded" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <input type="text" value={item.location || ''} onChange={(e) => updateExperience('leadershipExperience', index, 'location', e.target.value)} placeholder="Location" className="px-3 py-2 border border-navy/20 rounded" />
                <div className="grid grid-cols-2 gap-2">
                  <input type="text" value={item.startDate || ''} onChange={(e) => updateExperience('leadershipExperience', index, 'startDate', e.target.value)} placeholder="Start Date" className="px-3 py-2 border border-navy/20 rounded" />
                  <input type="text" value={item.endDate || ''} onChange={(e) => updateExperience('leadershipExperience', index, 'endDate', e.target.value)} placeholder="End Date (or leave blank)" className="px-3 py-2 border border-navy/20 rounded" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-navy mb-1">Organization Logo</label>
                <ImageUpload
                  value={item.companyImage || ''}
                  onChange={(url) => updateExperience('leadershipExperience', index, 'companyImage', url)}
                />
              </div>
              <textarea value={item.description || ''} onChange={(e) => updateExperience('leadershipExperience', index, 'description', e.target.value)} placeholder="Description" rows={3} className="w-full px-3 py-2 border border-navy/20 rounded" />
            </div>
          </div>
        ))}
      </div>

      <div>
        <h2 className="text-xl font-semibold text-navy mb-4">Skills</h2>
        {Object.keys(data.skills || {}).map((category) => (
          <div key={category} className="mb-6">
            <div className="flex justify-between items-center mb-2">
              <h3 className="font-semibold text-navy">{category}</h3>
              <button onClick={() => addSkill(category)} className="text-sm text-violet hover:text-violet/80">+ Add</button>
            </div>
            <div className="space-y-2">
              {(data.skills[category] || []).map((skill: string, index: number) => (
                <div key={index} className="flex items-center space-x-2">
                  <input
                    type="text"
                    value={skill}
                    onChange={(e) => updateSkill(category, index, e.target.value)}
                    className="flex-1 px-3 py-2 border border-navy/20 rounded"
                  />
                  <button onClick={() => removeSkill(category, index)} className="text-red-600 hover:text-red-700 text-sm">Delete</button>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

function LogoUpload({ onUpload }: { onUpload: (url: string) => void }) {
  const [uploading, setUploading] = useState(false)

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setUploading(true)
    try {
      const formData = new FormData()
      formData.append('file', file)

      const response = await fetch('/api/admin/upload', {
        method: 'POST',
        body: formData,
        credentials: 'include',
      })

      if (response.ok) {
        const data = await response.json()
        onUpload(data.url)
        // Reset input
        e.target.value = ''
      } else {
        alert('Failed to upload logo')
      }
    } catch (error) {
      console.error('Upload error:', error)
      alert('Error uploading logo')
    } finally {
      setUploading(false)
    }
  }

  return (
    <div className="text-center">
      <label className="cursor-pointer inline-flex flex-col items-center gap-2">
        <div className="w-12 h-12 rounded-lg bg-violet/10 flex items-center justify-center hover:bg-violet/20 transition-colors">
          <svg className="w-6 h-6 text-violet" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
        </div>
        <span className="text-sm font-medium text-navy">Upload Logo</span>
        <input
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          disabled={uploading}
          className="hidden"
        />
      </label>
      {uploading && <p className="text-sm text-navy/60 mt-2">Uploading...</p>}
    </div>
  )
}

function HomeEditor({ data, onChange }: { data: any; onChange: (data: any) => void }) {
  const [workItems, setWorkItems] = useState<any[]>([])
  const [loadingWork, setLoadingWork] = useState(false)
  const [posts, setPosts] = useState<any[]>([])
  const [loadingPosts, setLoadingPosts] = useState(false)
  const [ventures, setVentures] = useState<any[]>([])
  const [loadingVentures, setLoadingVentures] = useState(false)
  const [projects, setProjects] = useState<any[]>([])
  const [loadingProjects, setLoadingProjects] = useState(false)
  const [videoUrlInput, setVideoUrlInput] = useState('')

  useEffect(() => {
    const loadWorkItems = async () => {
      setLoadingWork(true)
      try {
        const response = await fetch('/api/admin/content?type=work', {
          credentials: 'include',
        })
        const result = await response.json()
        if (response.ok) {
          setWorkItems(Array.isArray(result.data) ? result.data : [])
        }
      } catch (error) {
        console.error('Error loading work items:', error)
      } finally {
        setLoadingWork(false)
      }
    }
    loadWorkItems()
  }, [])

  useEffect(() => {
    const loadPosts = async () => {
      setLoadingPosts(true)
      try {
        const response = await fetch('/api/admin/posts', {
          credentials: 'include',
        })
        const result = await response.json()
        if (response.ok && Array.isArray(result.posts)) {
          setPosts(result.posts.filter((p: any) => p.published !== false))
        }
      } catch (error) {
        console.error('Error loading posts:', error)
      } finally {
        setLoadingPosts(false)
      }
    }
    loadPosts()
  }, [])

  useEffect(() => {
    const loadVentures = async () => {
      setLoadingVentures(true)
      try {
        const response = await fetch('/api/admin/content?type=ventures', {
          credentials: 'include',
        })
        const result = await response.json()
        if (response.ok) {
          setVentures(Array.isArray(result.data) ? result.data : [])
        }
      } catch (error) {
        console.error('Error loading ventures:', error)
      } finally {
        setLoadingVentures(false)
      }
    }
    loadVentures()
  }, [])

  useEffect(() => {
    const loadProjects = async () => {
      setLoadingProjects(true)
      try {
        const response = await fetch('/api/admin/content?type=projects', {
          credentials: 'include',
        })
        const result = await response.json()
        if (response.ok) {
          setProjects(Array.isArray(result.data) ? result.data : [])
        }
      } catch (error) {
        console.error('Error loading projects:', error)
      } finally {
        setLoadingProjects(false)
      }
    }
    loadProjects()
  }, [])

  const updateField = (path: string[], value: any) => {
    const newData = { ...data }
    let current: any = newData
    for (let i = 0; i < path.length - 1; i++) {
      if (!current[path[i]]) {
        current[path[i]] = {}
      }
      current = current[path[i]] = { ...current[path[i]] }
    }
    current[path[path.length - 1]] = value
    onChange(newData)
  }

  const addFeaturedWork = (slug: string) => {
    const featuredWork = Array.isArray(data.featuredWork) ? data.featuredWork : []
    if (featuredWork.length >= 3) {
      alert('Maximum 3 featured work items allowed')
      return
    }
    if (featuredWork.includes(slug)) {
      alert('This work item is already featured')
      return
    }
    updateField(['featuredWork'], [...featuredWork, slug])
  }

  const removeFeaturedWork = (index: number) => {
    const featuredWork = Array.isArray(data.featuredWork) ? data.featuredWork : []
    updateField(['featuredWork'], featuredWork.filter((_: any, i: number) => i !== index))
  }

  const addFeaturedBlog = (slug: string) => {
    const featuredBlogs = Array.isArray(data.featuredBlogs) ? data.featuredBlogs : []
    if (featuredBlogs.length >= 3) {
      alert('Maximum 3 featured blogs allowed')
      return
    }
    if (featuredBlogs.includes(slug)) {
      alert('This blog is already featured')
      return
    }
    updateField(['featuredBlogs'], [...featuredBlogs, slug])
  }

  const removeFeaturedBlog = (index: number) => {
    const featuredBlogs = Array.isArray(data.featuredBlogs) ? data.featuredBlogs : []
    updateField(['featuredBlogs'], featuredBlogs.filter((_: any, i: number) => i !== index))
  }

  const addFeaturedVenture = (index: number) => {
    const featuredVentures = Array.isArray(data.featuredVentures) ? data.featuredVentures : []
    if (featuredVentures.length >= 3) {
      alert('Maximum 3 featured ventures allowed')
      return
    }
    if (featuredVentures.includes(index)) {
      alert('This venture is already featured')
      return
    }
    updateField(['featuredVentures'], [...featuredVentures, index])
  }

  const removeFeaturedVenture = (index: number) => {
    const featuredVentures = Array.isArray(data.featuredVentures) ? data.featuredVentures : []
    updateField(['featuredVentures'], featuredVentures.filter((_: any, i: number) => i !== index))
  }

  const addFeaturedProject = (index: number) => {
    const featuredProjects = Array.isArray(data.featuredProjects) ? data.featuredProjects : []
    if (featuredProjects.length >= 3) {
      alert('Maximum 3 featured projects allowed')
      return
    }
    if (featuredProjects.includes(index)) {
      alert('This project is already featured')
      return
    }
    updateField(['featuredProjects'], [...featuredProjects, index])
  }

  const removeFeaturedProject = (index: number) => {
    const featuredProjects = Array.isArray(data.featuredProjects) ? data.featuredProjects : []
    updateField(['featuredProjects'], featuredProjects.filter((_: any, i: number) => i !== index))
  }

  const addFeaturedVideo = (url: string) => {
    try {
      const featuredVideos = Array.isArray(data.featuredVideos) ? data.featuredVideos : []
      if (featuredVideos.length >= 3) {
        alert('Maximum 3 featured videos allowed')
        return
      }
      if (featuredVideos.includes(url)) {
        alert('This video is already featured')
        return
      }
      const newVideos = [...featuredVideos, url]
      updateField(['featuredVideos'], newVideos)
      console.log('Video added successfully:', url, 'Total videos:', newVideos.length)
    } catch (error) {
      console.error('Error in addFeaturedVideo:', error)
      throw error
    }
  }

  const removeFeaturedVideo = (index: number) => {
    const featuredVideos = Array.isArray(data.featuredVideos) ? data.featuredVideos : []
    updateField(['featuredVideos'], featuredVideos.filter((_: any, i: number) => i !== index))
  }

  const handleAddVideo = () => {
    const url = videoUrlInput.trim()
    if (!url) {
      alert('Please enter a video URL')
      return
    }
    
    // Improved URL validation - handle query parameters and various formats
    const cleanUrl = url.trim()
    
    // More lenient validation - check for YouTube domain or video ID pattern
    const hasYouTubeDomain = cleanUrl.includes('youtube.com') || cleanUrl.includes('youtu.be')
    const isVideoId = /^[a-zA-Z0-9_-]{11}$/.test(cleanUrl)
    const hasYouTubePattern = /youtube\.com|youtu\.be/.test(cleanUrl)
    
    const isValid = hasYouTubeDomain || hasYouTubePattern || isVideoId
    
    if (!isValid) {
      alert('Please enter a valid YouTube URL or video ID\n\nExamples:\n- https://www.youtube.com/watch?v=VIDEO_ID\n- https://youtu.be/VIDEO_ID\n- https://youtu.be/VIDEO_ID?si=...\n- VIDEO_ID (11 characters)')
      return
    }
    
    // Ensure featuredVideos array exists
    if (!data.featuredVideos) {
      data.featuredVideos = []
    }
    
    // Check if already added
    const featuredVideos = Array.isArray(data.featuredVideos) ? data.featuredVideos : []
    if (featuredVideos.includes(cleanUrl)) {
      alert('This video is already in the featured list')
      return
    }
    
    // Check max limit
    if (featuredVideos.length >= 3) {
      alert('Maximum 3 featured videos allowed')
      return
    }
    
    try {
      addFeaturedVideo(cleanUrl)
      setVideoUrlInput('') // Clear input after successful add
    } catch (error) {
      console.error('Error adding video:', error)
      alert('Failed to add video. Please try again.')
    }
  }

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-xl font-semibold text-navy mb-4">Hero Section</h2>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-navy mb-1">Title</label>
            <input
              type="text"
              value={data.hero?.title || ''}
              onChange={(e) => updateField(['hero', 'title'], e.target.value)}
              className="w-full px-4 py-3 border border-navy/20 rounded-lg"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-navy mb-1">Subtitle</label>
            <textarea
              value={data.hero?.subtitle || ''}
              onChange={(e) => updateField(['hero', 'subtitle'], e.target.value)}
              rows={2}
              className="w-full px-4 py-3 border border-navy/20 rounded-lg"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-navy mb-1">Profile Image</label>
            <ImageUpload
              value={data.hero?.image || ''}
              onChange={(url) => updateField(['hero', 'image'], url)}
            />
          </div>
        </div>
      </div>

      <div>
        <div className="flex justify-between items-center mb-4">
          <div>
            <h2 className="text-xl font-semibold text-navy">Featured Work</h2>
            <p className="text-sm text-navy/60 mt-1">Select up to 3 work items to feature on the homepage</p>
          </div>
        </div>
        
        {/* Selected Featured Work */}
        <div className="space-y-3 mb-6">
          {(Array.isArray(data.featuredWork) ? data.featuredWork : []).map((slug: string, index: number) => {
            const workItem = workItems.find((w: any) => w.slug === slug)
            return (
              <div key={index} className="bg-offwhite p-4 rounded-lg border border-navy/10 flex items-center justify-between">
                <div className="flex-1">
                  <div className="font-semibold text-navy mb-1">
                    {workItem ? workItem.title : slug}
                  </div>
                  {workItem && (
                    <div className="text-sm text-navy/60">
                      {workItem.category} • {workItem.client}
                    </div>
                  )}
                </div>
                <button
                  onClick={() => removeFeaturedWork(index)}
                  className="text-red-600 hover:text-red-700 text-sm font-medium px-3 py-1"
                >
                  Remove
                </button>
              </div>
            )
          })}
          {(!Array.isArray(data.featuredWork) || data.featuredWork.length === 0) && (
            <div className="text-center py-8 text-navy/50 border border-dashed border-navy/20 rounded-lg">
              <p>No featured work selected</p>
              <p className="text-sm mt-1">Select from the list below</p>
            </div>
          )}
        </div>

        {/* Available Work Items */}
        <div>
          <h3 className="text-lg font-semibold text-navy mb-4">Select Work Items</h3>
          {loadingWork ? (
            <div className="text-center py-8 text-navy/60">Loading work items...</div>
          ) : workItems.length === 0 ? (
            <div className="text-center py-8 text-navy/60">
              <p>No work items available.</p>
              <p className="text-sm mt-1">Add work items in the &quot;Work/Projects&quot; tab first.</p>
            </div>
          ) : (
            <div className="space-y-2 max-h-96 overflow-y-auto">
              {workItems.map((work: any) => {
                const isFeatured = Array.isArray(data.featuredWork) && data.featuredWork.includes(work.slug)
                const canAdd = !Array.isArray(data.featuredWork) || data.featuredWork.length < 3
                return (
                  <div
                    key={work.slug}
                    className={`p-4 rounded-lg border ${
                      isFeatured
                        ? 'bg-violet/5 border-violet/30'
                        : 'bg-white border-navy/10 hover:border-navy/20'
                    } transition-colors`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <div className="font-semibold text-navy">{work.title}</div>
                        <div className="text-sm text-navy/60 mt-1">
                          {work.category} • {work.client} • {work.year}
                        </div>
                      </div>
                      {isFeatured ? (
                        <span className="text-sm font-medium text-violet px-3 py-1">Featured</span>
                      ) : (
                        <button
                          onClick={() => addFeaturedWork(work.slug)}
                          disabled={!canAdd}
                          className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                            canAdd
                              ? 'bg-violet text-white hover:bg-violet/90'
                              : 'bg-navy/10 text-navy/40 cursor-not-allowed'
                          }`}
                        >
                          {canAdd ? 'Add' : 'Max 3'}
                        </button>
                      )}
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </div>
      </div>

      {/* Featured Blogs */}
      <div>
        <div className="flex justify-between items-center mb-4">
          <div>
            <h2 className="text-xl font-semibold text-navy">Featured Blogs</h2>
            <p className="text-sm text-navy/60 mt-1">Select up to 3 blog posts to feature on the homepage</p>
          </div>
        </div>
        
        <div className="space-y-3 mb-6">
          {(Array.isArray(data.featuredBlogs) ? data.featuredBlogs : []).map((slug: string, index: number) => {
            const post = posts.find((p: any) => p.slug === slug)
            return (
              <div key={index} className="bg-offwhite p-4 rounded-lg border border-navy/10 flex items-center justify-between">
                <div className="flex-1">
                  <div className="font-semibold text-navy mb-1">
                    {post ? post.title : slug}
                  </div>
                </div>
                <button
                  onClick={() => removeFeaturedBlog(index)}
                  className="text-red-600 hover:text-red-700 text-sm font-medium px-3 py-1"
                >
                  Remove
                </button>
              </div>
            )
          })}
          {(!Array.isArray(data.featuredBlogs) || data.featuredBlogs.length === 0) && (
            <div className="text-center py-8 text-navy/50 border border-dashed border-navy/20 rounded-lg">
              <p>No featured blogs selected</p>
              <p className="text-sm mt-1">Select from the list below</p>
            </div>
          )}
        </div>

        <div>
          <h3 className="text-lg font-semibold text-navy mb-4">Select Blog Posts</h3>
          {loadingPosts ? (
            <div className="text-center py-8 text-navy/60">Loading posts...</div>
          ) : posts.length === 0 ? (
            <div className="text-center py-8 text-navy/60">
              <p>No blog posts available.</p>
            </div>
          ) : (
            <div className="space-y-2 max-h-96 overflow-y-auto">
              {posts.map((post: any) => {
                const isFeatured = Array.isArray(data.featuredBlogs) && data.featuredBlogs.includes(post.slug)
                const canAdd = !Array.isArray(data.featuredBlogs) || data.featuredBlogs.length < 3
                return (
                  <div
                    key={post.slug}
                    className={`p-4 rounded-lg border ${
                      isFeatured
                        ? 'bg-violet/5 border-violet/30'
                        : 'bg-white border-navy/10 hover:border-navy/20'
                    } transition-colors`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <div className="font-semibold text-navy">{post.title}</div>
                      </div>
                      {isFeatured ? (
                        <span className="text-sm font-medium text-violet px-3 py-1">Featured</span>
                      ) : (
                        <button
                          onClick={() => addFeaturedBlog(post.slug)}
                          disabled={!canAdd}
                          className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                            canAdd
                              ? 'bg-violet text-white hover:bg-violet/90'
                              : 'bg-navy/10 text-navy/40 cursor-not-allowed'
                          }`}
                        >
                          {canAdd ? 'Add' : 'Max 3'}
                        </button>
                      )}
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </div>
      </div>

      {/* Featured Ventures */}
      <div>
        <div className="flex justify-between items-center mb-4">
          <div>
            <h2 className="text-xl font-semibold text-navy">Featured Ventures</h2>
            <p className="text-sm text-navy/60 mt-1">Select up to 3 ventures to feature on the homepage</p>
          </div>
        </div>
        
        <div className="space-y-3 mb-6">
          {(Array.isArray(data.featuredVentures) ? data.featuredVentures : []).map((idx: number, index: number) => {
            const venture = ventures[idx]
            return (
              <div key={index} className="bg-offwhite p-4 rounded-lg border border-navy/10 flex items-center justify-between">
                <div className="flex-1">
                  <div className="font-semibold text-navy mb-1">
                    {venture ? venture.title : `Venture ${idx}`}
                  </div>
                </div>
                <button
                  onClick={() => removeFeaturedVenture(index)}
                  className="text-red-600 hover:text-red-700 text-sm font-medium px-3 py-1"
                >
                  Remove
                </button>
              </div>
            )
          })}
          {(!Array.isArray(data.featuredVentures) || data.featuredVentures.length === 0) && (
            <div className="text-center py-8 text-navy/50 border border-dashed border-navy/20 rounded-lg">
              <p>No featured ventures selected</p>
              <p className="text-sm mt-1">Select from the list below</p>
            </div>
          )}
        </div>

        <div>
          <h3 className="text-lg font-semibold text-navy mb-4">Select Ventures</h3>
          {loadingVentures ? (
            <div className="text-center py-8 text-navy/60">Loading ventures...</div>
          ) : ventures.length === 0 ? (
            <div className="text-center py-8 text-navy/60">
              <p>No ventures available.</p>
            </div>
          ) : (
            <div className="space-y-2 max-h-96 overflow-y-auto">
              {ventures.map((venture: any, idx: number) => {
                const isFeatured = Array.isArray(data.featuredVentures) && data.featuredVentures.includes(idx)
                const canAdd = !Array.isArray(data.featuredVentures) || data.featuredVentures.length < 3
                return (
                  <div
                    key={idx}
                    className={`p-4 rounded-lg border ${
                      isFeatured
                        ? 'bg-violet/5 border-violet/30'
                        : 'bg-white border-navy/10 hover:border-navy/20'
                    } transition-colors`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <div className="font-semibold text-navy">{venture.title}</div>
                      </div>
                      {isFeatured ? (
                        <span className="text-sm font-medium text-violet px-3 py-1">Featured</span>
                      ) : (
                        <button
                          onClick={() => addFeaturedVenture(idx)}
                          disabled={!canAdd}
                          className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                            canAdd
                              ? 'bg-violet text-white hover:bg-violet/90'
                              : 'bg-navy/10 text-navy/40 cursor-not-allowed'
                          }`}
                        >
                          {canAdd ? 'Add' : 'Max 3'}
                        </button>
                      )}
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </div>
      </div>

      {/* Featured Projects */}
      <div>
        <div className="flex justify-between items-center mb-4">
          <div>
            <h2 className="text-xl font-semibold text-navy">Featured Projects</h2>
            <p className="text-sm text-navy/60 mt-1">Select up to 3 projects to feature on the homepage</p>
          </div>
        </div>
        
        <div className="space-y-3 mb-6">
          {(Array.isArray(data.featuredProjects) ? data.featuredProjects : []).map((idx: number, index: number) => {
            const project = projects[idx]
            return (
              <div key={index} className="bg-offwhite p-4 rounded-lg border border-navy/10 flex items-center justify-between">
                <div className="flex-1">
                  <div className="font-semibold text-navy mb-1">
                    {project ? project.title : `Project ${idx}`}
                  </div>
                </div>
                <button
                  onClick={() => removeFeaturedProject(index)}
                  className="text-red-600 hover:text-red-700 text-sm font-medium px-3 py-1"
                >
                  Remove
                </button>
              </div>
            )
          })}
          {(!Array.isArray(data.featuredProjects) || data.featuredProjects.length === 0) && (
            <div className="text-center py-8 text-navy/50 border border-dashed border-navy/20 rounded-lg">
              <p>No featured projects selected</p>
              <p className="text-sm mt-1">Select from the list below</p>
            </div>
          )}
        </div>

        <div>
          <h3 className="text-lg font-semibold text-navy mb-4">Select Projects</h3>
          {loadingProjects ? (
            <div className="text-center py-8 text-navy/60">Loading projects...</div>
          ) : projects.length === 0 ? (
            <div className="text-center py-8 text-navy/60">
              <p>No projects available.</p>
            </div>
          ) : (
            <div className="space-y-2 max-h-96 overflow-y-auto">
              {projects.map((project: any, idx: number) => {
                const isFeatured = Array.isArray(data.featuredProjects) && data.featuredProjects.includes(idx)
                const canAdd = !Array.isArray(data.featuredProjects) || data.featuredProjects.length < 3
                return (
                  <div
                    key={idx}
                    className={`p-4 rounded-lg border ${
                      isFeatured
                        ? 'bg-violet/5 border-violet/30'
                        : 'bg-white border-navy/10 hover:border-navy/20'
                    } transition-colors`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <div className="font-semibold text-navy">{project.title}</div>
                      </div>
                      {isFeatured ? (
                        <span className="text-sm font-medium text-violet px-3 py-1">Featured</span>
                      ) : (
                        <button
                          onClick={() => addFeaturedProject(idx)}
                          disabled={!canAdd}
                          className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                            canAdd
                              ? 'bg-violet text-white hover:bg-violet/90'
                              : 'bg-navy/10 text-navy/40 cursor-not-allowed'
                          }`}
                        >
                          {canAdd ? 'Add' : 'Max 3'}
                        </button>
                      )}
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </div>
      </div>

      <div>
        <div className="flex justify-between items-center mb-4">
          <div>
            <h2 className="text-xl font-semibold text-navy">Featured Videos</h2>
            <p className="text-sm text-navy/60 mt-1">Add up to 3 YouTube video URLs to feature on the homepage</p>
          </div>
        </div>
        
        {/* Selected Featured Videos */}
        <div className="space-y-3 mb-6">
          {(Array.isArray(data.featuredVideos) ? data.featuredVideos : []).map((url: string, index: number) => {
            // Extract video ID for display - handle various URL formats
            let videoId = url
            const patterns = [
              /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([^&\n?#]+)/,
              /^([a-zA-Z0-9_-]{11})$/,
            ]
            for (const pattern of patterns) {
              const match = url.match(pattern)
              if (match && match[1]) {
                videoId = match[1]
                break
              }
            }
            
            return (
              <div key={index} className="bg-offwhite p-4 rounded-lg border border-navy/10 flex items-center justify-between">
                <div className="flex-1">
                  <div className="font-medium text-navy mb-1 break-all text-sm">
                    {url.length > 60 ? url.substring(0, 60) + '...' : url}
                  </div>
                  <div className="text-xs text-navy/60">
                    Video ID: {videoId.length > 11 ? videoId.substring(0, 11) : videoId} • Video {index + 1}
                  </div>
                </div>
                <button
                  onClick={() => removeFeaturedVideo(index)}
                  className="text-red-600 hover:text-red-700 text-sm font-medium px-3 py-1"
                >
                  Remove
                </button>
              </div>
            )
          })}
          {(!Array.isArray(data.featuredVideos) || data.featuredVideos.length === 0) && (
            <div className="text-center py-8 text-navy/50 border border-dashed border-navy/20 rounded-lg">
              <p>No featured videos added</p>
              <p className="text-sm mt-1">Add YouTube video URLs below</p>
            </div>
          )}
        </div>

        {/* Add New Video */}
        <div className="border-2 border-dashed border-navy/20 rounded-lg p-6">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-navy mb-2">YouTube Video URL</label>
              <p className="text-xs text-navy/60 mb-2">
                Enter a YouTube video URL or video ID (e.g., https://www.youtube.com/watch?v=VIDEO_ID, https://youtu.be/VIDEO_ID, or just the VIDEO_ID)
              </p>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={videoUrlInput}
                  onChange={(e) => setVideoUrlInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault()
                      handleAddVideo()
                    }
                  }}
                  placeholder="https://www.youtube.com/watch?v=... or https://youtu.be/..."
                  className="flex-1 px-4 py-3 border border-navy/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-violet focus:border-transparent"
                />
                <button
                  onClick={handleAddVideo}
                  disabled={!Array.isArray(data.featuredVideos) || data.featuredVideos.length >= 3}
                  className={`px-6 py-3 rounded-lg text-sm font-medium transition-colors ${
                    (!Array.isArray(data.featuredVideos) || data.featuredVideos.length < 3)
                      ? 'bg-violet text-white hover:bg-violet/90'
                      : 'bg-navy/10 text-navy/40 cursor-not-allowed'
                  }`}
                >
                  {(!Array.isArray(data.featuredVideos) || data.featuredVideos.length < 3) ? 'Add Video' : 'Max 3'}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div>
        <div className="flex justify-between items-center mb-4">
          <div>
            <h2 className="text-xl font-semibold text-navy">Institution Logos</h2>
            <p className="text-sm text-navy/60 mt-1">Upload logos to display in a banner on the homepage</p>
          </div>
        </div>
        
        <div className="space-y-4">
          {/* Current Logos */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            {(Array.isArray(data.institutions) ? data.institutions : []).map((institution: any, index: number) => {
              const logoUrl = typeof institution === 'string' ? institution : institution?.image || institution
              const logoName = typeof institution === 'object' ? institution?.name : ''
              
              return (
                <div key={index} className="relative group bg-offwhite p-4 rounded-lg border border-navy/10 hover:border-navy/20 transition-colors">
                  <div className="w-full h-20 flex items-center justify-center mb-2">
                    {logoUrl ? (
                      <img 
                        src={logoUrl} 
                        alt={logoName || `Logo ${index + 1}`}
                        className="w-full h-full object-contain"
                      />
                    ) : (
                      <div className="text-navy/30 text-sm">No image</div>
                    )}
                  </div>
                  {logoName && (
                    <div className="text-xs text-navy/60 text-center truncate">{logoName}</div>
                  )}
                  <button
                    onClick={() => {
                      const institutions = Array.isArray(data.institutions) ? data.institutions : []
                      updateField(['institutions'], institutions.filter((_: any, i: number) => i !== index))
                    }}
                    className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs hover:bg-red-600"
                    title="Remove logo"
                  >
                    ×
                  </button>
                </div>
              )
            })}
          </div>

          {/* Add New Logo */}
          <div className="border-2 border-dashed border-navy/20 rounded-lg p-6">
            <LogoUpload
              onUpload={(url) => {
                const institutions = Array.isArray(data.institutions) ? data.institutions : []
                updateField(['institutions'], [...institutions, { image: url, name: '' }])
              }}
            />
          </div>

          {(!Array.isArray(data.institutions) || data.institutions.length === 0) && (
            <div className="text-center py-8 text-navy/50 border border-dashed border-navy/20 rounded-lg">
              <p>No logos uploaded yet</p>
              <p className="text-sm mt-1">Upload logos using the form above</p>
            </div>
          )}
        </div>
      </div>

      <div>
        <h2 className="text-xl font-semibold text-navy mb-4">Social Links</h2>
        <p className="text-sm text-navy/60 mb-4">Add your social media links to display in the footer</p>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-navy mb-1">Twitter URL</label>
            <input
              type="url"
              value={data.socialLinks?.twitter || ''}
              onChange={(e) => updateField(['socialLinks', 'twitter'], e.target.value)}
              placeholder="https://twitter.com/username"
              className="w-full px-4 py-3 border border-navy/20 rounded-lg"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-navy mb-1">LinkedIn URL</label>
            <input
              type="url"
              value={data.socialLinks?.linkedin || ''}
              onChange={(e) => updateField(['socialLinks', 'linkedin'], e.target.value)}
              placeholder="https://linkedin.com/in/username"
              className="w-full px-4 py-3 border border-navy/20 rounded-lg"
            />
          </div>
        </div>
      </div>
    </div>
  )
}


