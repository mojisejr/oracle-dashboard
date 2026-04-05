'use client'

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'

interface Recipe {
  id: string
  name: string
  recipe_type: string
  target_diseases?: string[]
  target_pests?: string[]
  effectiveness_rating: number
  times_used: number
  phi_days: number
  avoid_conditions?: string[]
}

export function PharmacyWidget() {
  const [recipes, setRecipes] = useState<Recipe[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')

  useEffect(() => {
    async function loadRecipes() {
      try {
        setLoading(true)

        // Get all active recipes (simplified)
        const { data } = await supabase
          .from('spraying_recipes')
          .select('*')
          .eq('is_active', true)
          .order('effectiveness_rating', { ascending: false })
          .limit(5)

        setRecipes(data || [])
      } catch (error) {
        console.error('Error loading recipes:', error)
      } finally {
        setLoading(false)
      }
    }

    loadRecipes()
  }, [searchTerm])

  const filteredRecipes = recipes.filter(recipe => {
    if (!searchTerm) return true
    
    const searchLower = searchTerm.toLowerCase()
    const nameMatch = recipe.name.toLowerCase().includes(searchLower)
    const diseaseMatch = recipe.target_diseases?.some(d => d.toLowerCase().includes(searchLower)) || false
    const pestMatch = recipe.target_pests?.some(p => p.toLowerCase().includes(searchLower)) || false
    
    return nameMatch || diseaseMatch || pestMatch
  })

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow p-4 mb-6">
        <p className="text-gray-500">⏳ กำลังโหลด...</p>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-lg shadow p-4 mb-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-bold">💊 สูตรยาที่แนะนำ</h2>
      </div>

      {/* Search */}
      <input
        type="text"
        placeholder="🔍 ค้นหา..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="w-full px-3 py-2 border rounded mb-4"
      />

      {/* Recipes */}
      {filteredRecipes.length === 0 ? (
        <p className="text-gray-500 text-center py-4">ไม่มีสูตรยา</p>
      ) : (
        <div className="space-y-3">
          {filteredRecipes.map(recipe => (
            <div key={recipe.id} className="border rounded-lg p-3">
              <div className="flex items-start justify-between mb-2">
                <h3 className="font-semibold">🧪 {recipe.name}</h3>
                <span className="text-sm">⭐ {recipe.effectiveness_rating}/5</span>
              </div>

              {/* Targets */}
              <div className="mb-2">
                <span className="text-sm text-gray-600">
                  🎯 {recipe.target_diseases?.join(', ') || recipe.target_pests?.join(', ')}
                </span>
              </div>

              {/* Stats */}
              <div className="mb-2 text-sm text-gray-500">
                ใช้ {recipe.times_used} ครั้ง
              </div>

              {/* Safety Info */}
              <div className="mb-3 p-2 bg-gray-50 rounded text-sm">
                <div className="flex gap-4">
                  <span>⚠️ PHI {recipe.phi_days} วัน</span>
                  {recipe.avoid_conditions && recipe.avoid_conditions.length > 0 && (
                    <span>ไม่แนะนำ: {recipe.avoid_conditions.join(', ')})
                  </span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
