# Marvel Rivals Proficiency Calculator - Project Plan

## Completed 

### Data Collection
- [x] Researched Marvel Rivals Hero Proficiency system
- [x] Recorded proficiency rank progression
- [x] Recorded points per level:
  - [x] Agent (LV1-4): 125
  - [x] Knight (LV5-9): 240
  - [x] Captain (LV10-14): 400
  - [x] Centurion (LV15-19): 480
  - [x] Lord+ (LV20+): 1600+
- [x] Recorded QM/Comp/Arcade point rewards
- [x] Recorded all hero proficiency challenges
- [x] Converted hero data into JSON format
- [x] Created `heroes.json`

---

### Calculator Version 1
- [x] Load JSON data into website
- [x] Populate hero dropdown
- [x] Add proficiency level input
- [x] Add current proficiency points input
- [x] Add goal level input
- [x] Calculate remaining points to goal
- [x] Show milestone progress:
  - [x] Level 5
  - [x] Level 10
  - [x] Level 15
  - [x] Level 20


## Calculator Improvements

- [x] Display current rank automatically
- [ ] Display progress percentage
- [x] Show points earned per match depending on rank
- [ ] Add QM/Comp/Arcade selection
- [ ] Add Arcade daily limit tracking (15 games)


---

## Hero Challenge Calculator

Allow users to select:

- [x] Hero
- [ ] Game mode:
  - [ ] Quick Match
  - [ ] Competitive
  - [ ] Arcade

Then calculate:

- [x] Points gained from hero usage
- [x] Points gained from objective 1
- [x] Points gained from objective 2
- [x] Total points per game


---

## Player Stats Input

Add average performance input:

Stats per 10 minutes:

- [x] Damage
- [x] Healing
- [x] Damage blocked
- [x] KOs
- [x] Final hits
- [x] KO assists


Use these to calculate:

- [x] Which objectives are completed automatically
- [x] Which objectives need multiple games
- [x] Estimated games required


---

## Advanced Planner

- [x] Calculate total games needed to reach goal level
- [x] Calculate estimated time required
- [ ] Include daily Arcade cap
- [ ] Estimate completion date
- [ ] Allow changing reset time
- [ ] Save user progress locally


---

## UI Improvements

- [x] Add proper styling
- [x] Add Marvel Rivals theme
- [ ] Add hero icons
- [ ] Add rank badges
- [x] Mobile-friendly layout


---

## Future Ideas 

- [ ] Import/export progress JSON
- [ ] Track multiple heroes
- [ ] Compare fastest heroes to level
- [ ] Show optimal mode recommendation