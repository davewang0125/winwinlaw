LEGAL_ANALYSIS_SYSTEM_PROMPT = """You are an expert legal analyst with deep knowledge of US law across multiple jurisdictions.
Your role is to provide preliminary case assessments for potential clients seeking legal representation.

Your analysis should be:
- Professional and objective
- Based on legal principles and case law
- Tailored to the specific jurisdiction mentioned
- Clear about limitations and the need for formal legal counsel
- Honest about both strengths and weaknesses

Remember: This is a preliminary assessment, not formal legal advice. Always recommend consultation with a licensed attorney."""


def create_case_analysis_prompt(case_data: dict) -> str:
    """Generate a detailed prompt for case analysis based on intake data."""

    prompt = f"""Please analyze the following legal case intake and provide a comprehensive preliminary assessment:

**Case Details:**
- Case Type: {case_data['case_type']}
- Jurisdiction: {case_data['jurisdiction']}
- Opposing Party: {case_data['opposing_party']}
- Estimated Damages: {case_data['estimated_damage']}

**Case Description:**
{case_data['case_description']}

**Evidence Available:**
{case_data['evidence_available']}

**Required Analysis:**

1. **Case Summary**: Provide a concise 2-3 sentence summary of the legal issue.

2. **Legal Assessment**: Analyze the case under applicable {case_data['jurisdiction']} law for {case_data['case_type']} cases. Consider:
   - Applicable statutes and legal precedents
   - Elements that must be proven
   - Potential legal theories
   - Jurisdictional considerations

3. **Merit Score** (0-10): Rate the overall strength of the case where:
   - 0-3: Weak case with significant challenges
   - 4-6: Moderate case with both strengths and concerns
   - 7-8: Strong case with good prospects
   - 9-10: Very strong case with excellent prospects

4. **Win Probability** (0-100%): Estimate the likelihood of a favorable outcome based on the information provided.

5. **Key Strengths**: List 3-5 specific strengths of this case.

6. **Key Weaknesses**: List 3-5 specific weaknesses or challenges.

7. **Recommended Actions**: Provide 4-6 specific next steps the client should take.

8. **Estimated Timeline**: Provide a realistic timeline for case resolution (e.g., "6-12 months for settlement, 18-24 months if goes to trial").

9. **Estimated Costs**: Provide a cost range for pursuing this case (attorney fees, court costs, etc.).

10. **Jurisdiction Notes**: Any specific considerations for {case_data['jurisdiction']} law.

11. **Additional Evidence Needed**: List 3-5 types of evidence or documentation that would strengthen the case.

Format your response as valid JSON with the following structure:
{{
    "case_summary": "...",
    "legal_assessment": "...",
    "merit_score": 7.5,
    "win_probability": 75.0,
    "key_strengths": ["...", "..."],
    "key_weaknesses": ["...", "..."],
    "recommended_actions": ["...", "..."],
    "estimated_timeline": "...",
    "estimated_costs": "...",
    "jurisdiction_notes": "...",
    "additional_evidence_needed": ["...", "..."]
}}

Ensure all analysis is specific to this case and jurisdiction."""

    return prompt
