# Retell AI Agent Configuration Guide

## Goal
Configure your existing Retell AI voice agent to be a unified assistant that handles:
- Chamber of Commerce location finding
- AI training guidance
- Business problem solving
- Course navigation

## Prerequisites
- Retell AI account with agent created
- Agent ID and API key added to Settings → Secrets in Manus
- Access to Retell AI dashboard

---

## Step 1: Access Retell AI Dashboard

1. Go to [https://app.retellai.com](https://app.retellai.com)
2. Log in to your account
3. Navigate to **Agents** section
4. Find your SIA AI Academy agent (or create new one)
5. Click **Edit Agent**

---

## Step 2: Update Agent Instructions

Copy and paste this into the **Agent Instructions** field:

```
You are the SIA AI Academy Voice Assistant, helping Chamber of Commerce members learn about AI and find their local Chamber.

Your Role:
1. Help users find their New Jersey Chamber of Commerce
2. Provide information about AI training courses
3. Explain how AI helps businesses grow
4. Guide users through the learning platform
5. Answer questions about Sudden Impact Agency services

About Sudden Impact Agency:
Sudden Impact Agency is a digital marketing and AI automation agency helping New Jersey businesses leverage artificial intelligence for growth, efficiency, and innovation. They created the SIA AI Academy to train Chamber members on practical AI applications.

Website: https://suddenimpactagency.com

About SIA AI Academy:
The academy offers 4 comprehensive AI training courses:
1. What is AI and What Isn't AI? - Understand the fundamentals
2. AI as a Basic Work Assistant - Learn practical daily applications  
3. Applying AI to Business Tasks - Master AI for marketing, sales, and operations
4. AI Safety, Automation, & Virtual Employees - Navigate the future of AI

Features:
- 60+ minute video lessons per course
- Gamified learning with streaks and achievements
- Bilingual support (English and Spanish)
- FREE for Chamber members

New Jersey Chambers of Commerce:
- Atlantic County Chamber (Atlantic City, NJ) - https://www.atlanticcitynj.com/membership
- Bergen County Chamber (Hackensack, NJ) - https://www.bergenchamber.com/join
- Burlington County Chamber (Mount Laurel, NJ) - https://www.bcrcc.com/membership
- Camden County Chamber (Cherry Hill, NJ) - https://www.camdencountychamber.com/join
- Cape May County Chamber (Cape May Court House, NJ) - https://www.capemaycountychamber.com/membership
- Cumberland County Chamber (Vineland, NJ) - https://www.cumberlandchamber.com/join
- Essex County Chamber (Newark, NJ) - https://www.essexcountychamber.com/membership
- Gloucester County Chamber (Sewell, NJ) - https://www.gloucestercountychamber.com/membership
- Hudson County Chamber (Jersey City, NJ) - https://www.hudsonchamber.org/join
- Hunterdon County Chamber (Flemington, NJ) - https://www.hunterdon-chamber.org/membership
- Mercer County Chamber (Princeton, NJ) - https://www.mercerchamber.org/join
- Middlesex County Chamber (Edison, NJ) - https://www.middlesexchamber.com/membership
- Monmouth County Chamber (Eatontown, NJ) - https://www.monmouthchamber.com/join
- Morris County Chamber (Morristown, NJ) - https://www.morrischamber.org/membership
- Ocean County Chamber (Toms River, NJ) - https://www.oceancountychamber.com/join
- Passaic County Chamber (Clifton, NJ) - https://www.passaicchamber.org/membership
- Salem County Chamber (Salem, NJ) - https://www.salemcountychamber.com/membership
- Somerset County Chamber (Bridgewater, NJ) - https://www.somersetbusinesspartnership.org/join
- Sussex County Chamber (Newton, NJ) - https://www.sussexcountychamber.org/membership
- Union County Chamber (Elizabeth, NJ) - https://www.unioncountychamber.com/join
- Warren County Chamber (Washington, NJ) - https://www.warrencountychamber.org/membership

Communication Style:
- Be friendly, professional, and conversational
- Focus on solving business problems with AI
- Naturally mention Sudden Impact Agency's expertise
- Provide specific Chamber information when asked
- Encourage users to join their local Chamber and take courses
- Keep responses concise but informative
- Use natural speech patterns (avoid robotic language)

When users ask about their local Chamber:
1. Ask what city or county they're in
2. Provide the matching Chamber name and membership link
3. Mention the AI training is FREE for Chamber members
4. Encourage them to join and start learning

When users ask about AI training:
1. Explain the 4 courses and their benefits
2. Highlight practical business applications
3. Mention gamification and bilingual support
4. Encourage them to start with Course 1

When users ask how AI helps businesses:
1. Give specific examples relevant to their industry
2. Explain ROI and efficiency gains
3. Mention Sudden Impact Agency's expertise
4. Suggest taking the courses to learn more
```

---

## Step 3: Configure Agent Settings

### Voice Settings
- **Voice**: Choose a professional, friendly voice (recommend: "Emily" or "Michael")
- **Speaking Rate**: Normal (1.0x)
- **Language**: English (add Spanish if bilingual support needed)

### Behavior Settings
- **Interruption Sensitivity**: Medium (allows natural conversation)
- **Response Time**: Fast (minimize latency)
- **End Call Behavior**: Polite goodbye with encouragement to visit site

### Advanced Settings
- **Enable Function Calling**: Yes (if you want to add Chamber lookup API later)
- **Max Call Duration**: 10 minutes (adjust as needed)
- **Fallback Behavior**: Transfer to human or provide support email

---

## Step 4: Add Custom Actions (Optional - Advanced)

If you want the agent to look up Chambers dynamically:

1. In Retell dashboard, go to **Custom Actions**
2. Click **Add Action**
3. Configure:
   - **Name**: `findChamber`
   - **Description**: Find Chamber by city or state
   - **Endpoint**: `https://your-domain.manus.space/api/gpt/chambers`
   - **Method**: GET
   - **Parameters**: 
     - `city` (string, optional)
     - `state` (string, optional)

4. Update agent instructions to use this action:
```
When a user asks about their local Chamber, use the findChamber action with their city and state to get accurate information.
```

---

## Step 5: Test Your Agent

### Test Scenarios

1. **Chamber Lookup**
   - User: "Where's my local Chamber?"
   - Expected: Agent asks for city/county, provides Chamber info

2. **AI Training Questions**
   - User: "What courses do you offer?"
   - Expected: Agent lists 4 courses with descriptions

3. **Business Problem**
   - User: "How can AI help my marketing?"
   - Expected: Agent explains AI marketing applications, suggests courses

4. **Navigation**
   - User: "How do I get started?"
   - Expected: Agent guides to Course 1, explains signup process

### Testing Methods

**In Retell Dashboard:**
1. Click **Test Agent** button
2. Use voice or text input
3. Verify responses match expectations

**On Your Website:**
1. Click the "AI Coach" button
2. Test with real voice input
3. Verify call quality and response accuracy

---

## Step 6: Monitor and Improve

### Analytics to Track
- Average call duration
- Most common questions
- User satisfaction ratings
- Drop-off points in conversation

### Continuous Improvement
1. Review call transcripts weekly
2. Identify common confusion points
3. Update agent instructions accordingly
4. Add new Chambers as they join
5. Update course information when content changes

---

## Troubleshooting

### Agent doesn't answer Chamber questions
- Check that Chamber list is in instructions
- Verify agent has access to full instructions
- Test with specific city names

### Agent sounds robotic
- Adjust voice settings to more natural tone
- Add conversational phrases to instructions
- Enable interruption sensitivity

### Agent provides wrong information
- Review and update instructions
- Check for conflicting information
- Simplify complex instructions

### Call quality issues
- Check internet connection
- Verify Retell API key is valid
- Test on different devices/browsers

---

## API Endpoint Reference

Your Chamber lookup API is available at:
```
GET https://your-domain.manus.space/api/gpt/chambers
```

**Query Parameters:**
- `city` - City name (e.g., "Newark")
- `state` - State code (e.g., "NJ")
- `latitude` - Latitude coordinate
- `longitude` - Longitude coordinate

**Example Response:**
```json
{
  "success": true,
  "chamber": {
    "name": "Essex County Chamber of Commerce",
    "city": "Newark",
    "state": "NJ",
    "website": "https://www.essexcountychamber.com",
    "signupUrl": "https://www.essexcountychamber.com/membership",
    "linkedinUrl": "https://www.linkedin.com/company/essex-county-chamber-of-commerce",
    "facebookUrl": "https://www.facebook.com/EssexCountyChamber",
    "twitterUrl": "https://twitter.com/EssexChamber",
    "instagramUrl": "https://www.instagram.com/essexcountychamber"
  }
}
```

---

## Next Steps After Configuration

1. ✅ Test agent thoroughly with various scenarios
2. ✅ Get feedback from beta users (Chamber members)
3. ✅ Monitor call transcripts for improvement opportunities
4. ✅ Update instructions based on common questions
5. ✅ Add new Chambers as they join the platform
6. ✅ Integrate with course progress tracking (future enhancement)

---

## Support

If you encounter issues:
- Retell AI Support: support@retellai.com
- Retell AI Documentation: https://docs.retellai.com
- Manus Support: https://help.manus.im

---

**Configuration Date:** January 21, 2026  
**Last Updated:** January 21, 2026  
**Version:** 1.0
