import { query, transaction } from './client'

export interface LegalProfessional {
  id?: string
  firstName: string
  lastName: string
  fullName: string
  email?: string
  phone?: string
  address?: string
  city?: string
  state?: string
  country?: string
  postalCode?: string
  barNumber?: string
  lawFirm?: string
  position?: string
  yearsExperience?: number
  bio?: string
  profileImageUrl?: string
  profileUrl: string
  source: string
  sourceId?: string
  isActive?: boolean
  verified?: boolean
  practiceAreas?: string[]
  education?: Education[]
  barAdmissions?: BarAdmission[]
  languages?: Language[]
  rating?: number
  reviewCount?: number
}

export interface Education {
  institution: string
  degree?: string
  fieldOfStudy?: string
  graduationYear?: number
  honors?: string
}

export interface BarAdmission {
  jurisdiction: string
  admissionDate?: Date
  barNumber?: string
  status?: string
}

export interface Language {
  code: string
  name: string
  proficiency?: string
}

// Insert or update professional
export async function upsertProfessional(
  profile: LegalProfessional
): Promise<string> {
  return transaction(async (client) => {
    // Insert or update main profile
    const result = await client.query(
      `
      INSERT INTO legal_professionals (
        first_name, last_name, full_name, email, phone,
        address, city, state, country, postal_code,
        bar_number, law_firm, position, years_experience,
        bio, profile_image_url, profile_url,
        source, source_id, is_active, verified,
        last_scraped_at
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19, $20, $21, CURRENT_TIMESTAMP)
      ON CONFLICT (profile_url)
      DO UPDATE SET
        first_name = EXCLUDED.first_name,
        last_name = EXCLUDED.last_name,
        full_name = EXCLUDED.full_name,
        email = COALESCE(EXCLUDED.email, legal_professionals.email),
        phone = COALESCE(EXCLUDED.phone, legal_professionals.phone),
        address = COALESCE(EXCLUDED.address, legal_professionals.address),
        city = COALESCE(EXCLUDED.city, legal_professionals.city),
        state = COALESCE(EXCLUDED.state, legal_professionals.state),
        country = COALESCE(EXCLUDED.country, legal_professionals.country),
        postal_code = COALESCE(EXCLUDED.postal_code, legal_professionals.postal_code),
        bar_number = COALESCE(EXCLUDED.bar_number, legal_professionals.bar_number),
        law_firm = COALESCE(EXCLUDED.law_firm, legal_professionals.law_firm),
        position = COALESCE(EXCLUDED.position, legal_professionals.position),
        years_experience = COALESCE(EXCLUDED.years_experience, legal_professionals.years_experience),
        bio = COALESCE(EXCLUDED.bio, legal_professionals.bio),
        profile_image_url = COALESCE(EXCLUDED.profile_image_url, legal_professionals.profile_image_url),
        is_active = EXCLUDED.is_active,
        last_scraped_at = CURRENT_TIMESTAMP
      RETURNING id
      `,
      [
        profile.firstName,
        profile.lastName,
        profile.fullName,
        profile.email,
        profile.phone,
        profile.address,
        profile.city,
        profile.state,
        profile.country || 'United States',
        profile.postalCode,
        profile.barNumber,
        profile.lawFirm,
        profile.position,
        profile.yearsExperience,
        profile.bio,
        profile.profileImageUrl,
        profile.profileUrl,
        profile.source,
        profile.sourceId,
        profile.isActive !== false,
        profile.verified || false,
      ]
    )

    const professionalId = result.rows[0].id

    // Add practice areas
    if (profile.practiceAreas && profile.practiceAreas.length > 0) {
      await addPracticeAreas(client, professionalId, profile.practiceAreas)
    }

    // Add education
    if (profile.education && profile.education.length > 0) {
      await addEducation(client, professionalId, profile.education)
    }

    // Add bar admissions
    if (profile.barAdmissions && profile.barAdmissions.length > 0) {
      await addBarAdmissions(client, professionalId, profile.barAdmissions)
    }

    // Add languages
    if (profile.languages && profile.languages.length > 0) {
      await addLanguages(client, professionalId, profile.languages)
    }

    // Add rating if present
    if (profile.rating !== undefined) {
      await addRating(
        client,
        professionalId,
        profile.source,
        profile.rating,
        profile.reviewCount
      )
    }

    return professionalId
  })
}

// Helper: Add practice areas
async function addPracticeAreas(
  client: any,
  professionalId: string,
  areas: string[]
): Promise<void> {
  // Delete existing
  await client.query(
    'DELETE FROM professional_practice_areas WHERE professional_id = $1',
    [professionalId]
  )

  // Add new
  for (const area of areas) {
    // Find or create practice area
    const areaResult = await client.query(
      `INSERT INTO practice_areas (name) VALUES ($1)
       ON CONFLICT (name) DO UPDATE SET name = EXCLUDED.name
       RETURNING id`,
      [area]
    )
    const areaId = areaResult.rows[0].id

    // Link to professional
    await client.query(
      `INSERT INTO professional_practice_areas (professional_id, practice_area_id)
       VALUES ($1, $2)
       ON CONFLICT DO NOTHING`,
      [professionalId, areaId]
    )
  }
}

// Helper: Add education
async function addEducation(
  client: any,
  professionalId: string,
  education: Education[]
): Promise<void> {
  // Delete existing
  await client.query('DELETE FROM education WHERE professional_id = $1', [
    professionalId,
  ])

  // Add new
  for (const edu of education) {
    await client.query(
      `INSERT INTO education (professional_id, institution, degree, field_of_study, graduation_year, honors)
       VALUES ($1, $2, $3, $4, $5, $6)`,
      [
        professionalId,
        edu.institution,
        edu.degree,
        edu.fieldOfStudy,
        edu.graduationYear,
        edu.honors,
      ]
    )
  }
}

// Helper: Add bar admissions
async function addBarAdmissions(
  client: any,
  professionalId: string,
  admissions: BarAdmission[]
): Promise<void> {
  // Delete existing
  await client.query('DELETE FROM bar_admissions WHERE professional_id = $1', [
    professionalId,
  ])

  // Add new
  for (const admission of admissions) {
    await client.query(
      `INSERT INTO bar_admissions (professional_id, jurisdiction, admission_date, bar_number, status)
       VALUES ($1, $2, $3, $4, $5)`,
      [
        professionalId,
        admission.jurisdiction,
        admission.admissionDate,
        admission.barNumber,
        admission.status || 'Active',
      ]
    )
  }
}

// Helper: Add languages
async function addLanguages(
  client: any,
  professionalId: string,
  languages: Language[]
): Promise<void> {
  // Delete existing
  await client.query(
    'DELETE FROM professional_languages WHERE professional_id = $1',
    [professionalId]
  )

  // Add new
  for (const lang of languages) {
    // Find or create language
    const langResult = await client.query(
      `INSERT INTO languages (code, name) VALUES ($1, $2)
       ON CONFLICT (code) DO UPDATE SET name = EXCLUDED.name
       RETURNING id`,
      [lang.code, lang.name]
    )
    const langId = langResult.rows[0].id

    // Link to professional
    await client.query(
      `INSERT INTO professional_languages (professional_id, language_id, proficiency)
       VALUES ($1, $2, $3)`,
      [professionalId, langId, lang.proficiency || 'Professional']
    )
  }
}

// Helper: Add rating
async function addRating(
  client: any,
  professionalId: string,
  source: string,
  rating: number,
  reviewCount?: number
): Promise<void> {
  await client.query(
    `INSERT INTO ratings (professional_id, source, rating, review_count, rating_date)
     VALUES ($1, $2, $3, $4, CURRENT_DATE)
     ON CONFLICT (professional_id, source)
     DO UPDATE SET
       rating = EXCLUDED.rating,
       review_count = EXCLUDED.review_count,
       rating_date = EXCLUDED.rating_date`,
    [professionalId, source, rating, reviewCount || 0]
  )
}

// Search professionals
export async function searchProfessionals(
  searchTerm: string,
  limit: number = 20,
  offset: number = 0
): Promise<LegalProfessional[]> {
  const result = await query(
    `
    SELECT lp.*, STRING_AGG(DISTINCT pa.name, ', ') as practice_areas
    FROM legal_professionals lp
    LEFT JOIN professional_practice_areas ppa ON lp.id = ppa.professional_id
    LEFT JOIN practice_areas pa ON ppa.practice_area_id = pa.id
    WHERE lp.is_active = true
      AND (
        lp.full_name ILIKE $1
        OR lp.bio ILIKE $1
        OR lp.law_firm ILIKE $1
        OR pa.name ILIKE $1
      )
    GROUP BY lp.id
    ORDER BY lp.last_name, lp.first_name
    LIMIT $2 OFFSET $3
    `,
    [`%${searchTerm}%`, limit, offset]
  )

  return result.rows.map(rowToProfessional)
}

// Get professional by ID
export async function getProfessionalById(
  id: string
): Promise<LegalProfessional | null> {
  const result = await query(
    'SELECT * FROM legal_professionals WHERE id = $1',
    [id]
  )

  if (result.rows.length === 0) return null
  return rowToProfessional(result.rows[0])
}

// Mark as inactive (soft delete)
export async function deactivateProfessional(id: string): Promise<void> {
  await query(
    'UPDATE legal_professionals SET is_active = false WHERE id = $1',
    [id]
  )
}

// Get scraping stats
export async function getScrapingStats(source: string) {
  const result = await query(
    `
    SELECT
      COUNT(*) FILTER (WHERE DATE(last_scraped_at) = CURRENT_DATE) as scraped_today,
      COUNT(*) FILTER (WHERE DATE(created_at) = CURRENT_DATE) as added_today,
      COUNT(*) FILTER (WHERE DATE(updated_at) = CURRENT_DATE AND DATE(created_at) != CURRENT_DATE) as updated_today,
      COUNT(*) as total_active
    FROM legal_professionals
    WHERE source = $1 AND is_active = true
    `,
    [source]
  )

  return result.rows[0]
}

// Helper: Convert row to Professional object
function rowToProfessional(row: any): LegalProfessional {
  return {
    id: row.id,
    firstName: row.first_name,
    lastName: row.last_name,
    fullName: row.full_name,
    email: row.email,
    phone: row.phone,
    address: row.address,
    city: row.city,
    state: row.state,
    country: row.country,
    postalCode: row.postal_code,
    barNumber: row.bar_number,
    lawFirm: row.law_firm,
    position: row.position,
    yearsExperience: row.years_experience,
    bio: row.bio,
    profileImageUrl: row.profile_image_url,
    profileUrl: row.profile_url,
    source: row.source,
    sourceId: row.source_id,
    isActive: row.is_active,
    verified: row.verified,
    practiceAreas: row.practice_areas?.split(', ').filter(Boolean),
  }
}
