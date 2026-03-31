// Quick Tailwind Config Check (No Build Required)
// Run: node test-tailwind-quick.mjs

import fs from 'fs'
import path from 'path'

console.log('🧪 Quick Tailwind CSS Config Check\n')

const issues = []

// Check 1: tailwind.config.ts
console.log('✅ Check 1: tailwind.config.ts')
const configPath = path.join(process.cwd(), 'tailwind.config.ts')
if (fs.existsSync(configPath)) {
  const config = fs.readFileSync(configPath, 'utf-8')

  // Check for CSS variables (problematic in Tailwind v3)
  if (config.includes('var(--color')) {
    issues.push('❌ ISSUE: Using CSS variables in colors (var(--color-primary))')
    console.log('   ❌ Using CSS variables - this breaks opacity modifiers!')
  } else if (config.includes('primary: {') || config.includes("primary: {")) {
    console.log('   ✓ Using direct color values (good for opacity)')
  }

  // Check content paths
  if (config.includes('./src/app/**')) {
    console.log('   ✓ src/app/** in content paths')
  } else {
    issues.push('❌ ISSUE: src/app/** missing from content paths')
    console.log('   ❌ src/app/** NOT in content paths')
  }

  if (config.includes('./src/components/**')) {
    console.log('   ✓ src/components/** in content paths')
  } else {
    issues.push('❌ ISSUE: src/components/** missing from content paths')
    console.log('   ❌ src/components/** NOT in content paths')
  }
} else {
  issues.push('❌ CRITICAL: tailwind.config.ts not found')
  console.log('   ❌ File not found!')
}

// Check 2: postcss.config.js
console.log('\n✅ Check 2: postcss.config.js')
const postcssPath = path.join(process.cwd(), 'postcss.config.js')
if (fs.existsSync(postcssPath)) {
  const postcss = fs.readFileSync(postcssPath, 'utf-8')
  if (postcss.includes('tailwindcss') && postcss.includes('autoprefixer')) {
    console.log('   ✓ Tailwind and Autoprefixer configured')
  } else {
    issues.push('❌ ISSUE: Missing tailwindcss or autoprefixer in postcss.config.js')
    console.log('   ❌ Missing plugins!')
  }
} else {
  issues.push('❌ CRITICAL: postcss.config.js not found')
  console.log('   ❌ File not found!')
}

// Check 3: globals.css
console.log('\n✅ Check 3: src/app/globals.css')
const globalsPath = path.join(process.cwd(), 'src/app/globals.css')
if (fs.existsSync(globalsPath)) {
  const globals = fs.readFileSync(globalsPath, 'utf-8')
  if (globals.includes('@tailwind base')) {
    console.log('   ✓ @tailwind base directive found')
  } else {
    issues.push('❌ ISSUE: Missing @tailwind base in globals.css')
    console.log('   ❌ Missing @tailwind base')
  }

  if (globals.includes('@tailwind components')) {
    console.log('   ✓ @tailwind components directive found')
  } else {
    issues.push('❌ ISSUE: Missing @tailwind components in globals.css')
    console.log('   ❌ Missing @tailwind components')
  }

  if (globals.includes('@tailwind utilities')) {
    console.log('   ✓ @tailwind utilities directive found')
  } else {
    issues.push('❌ ISSUE: Missing @tailwind utilities in globals.css')
    console.log('   ❌ Missing @tailwind utilities')
  }
} else {
  issues.push('❌ CRITICAL: src/app/globals.css not found')
  console.log('   ❌ File not found!')
}

// Check 4: Sample component using Tailwind
console.log('\n✅ Check 4: Verify Tailwind classes in components')
const heroPath = path.join(process.cwd(), 'src/components/sections/HeroSection.tsx')
if (fs.existsSync(heroPath)) {
  const hero = fs.readFileSync(heroPath, 'utf-8')

  const tailwindClasses = [
    'text-primary',
    'bg-primary',
    'text-neutral',
    'rounded',
    'shadow'
  ]

  let foundCount = 0
  tailwindClasses.forEach(cls => {
    if (hero.includes(cls)) {
      foundCount++
    }
  })

  console.log(`   ✓ Found ${foundCount}/${tailwindClasses.length} common Tailwind patterns`)

  if (foundCount === 0) {
    issues.push('❌ ISSUE: No Tailwind classes found in components')
  }
} else {
  console.log('   ⚠️  HeroSection.tsx not found (may not be created yet)')
}

// Summary
console.log('\n' + '='.repeat(60))
if (issues.length === 0) {
  console.log('✅ All checks PASSED - Tailwind config looks good!')
  console.log('='.repeat(60))
  console.log('\n🎯 Next steps:')
  console.log('   1. Run: npm run build')
  console.log('   2. Run: npm run test')
  console.log('   3. If both pass, commit + push')
} else {
  console.log('❌ ISSUES FOUND:')
  console.log('='.repeat(60))
  issues.forEach(issue => console.log('   ' + issue))
  console.log('\n⚠️  Fix these issues before committing!')
  process.exit(1)
}
