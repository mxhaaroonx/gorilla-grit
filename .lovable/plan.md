

# GorillaDo: Gamified Productivity App

## Overview
A gamified productivity app where your discipline fuels a gorilla mascot's power. Complete real-life tasks to level up your gorilla and take on multi-day boss challenges that test your consistency.

---

## Core Features (MVP)

### 1. User Authentication
- Email/password signup and login
- User profile to track progress, level, and earned badges
- Data syncs across devices

### 2. Task System

**Daily Tasks**
- Repeating tasks you must complete each day (workout, study, etc.)
- User sets difficulty: Easy, Medium, or Hard
- Tasks reset at midnight

**Time-Frame Tasks**
- One-time tasks with a specific deadline
- Complete before deadline for full XP reward
- Late completion = reduced or no XP

### 3. XP & Leveling System
- XP awarded based on task difficulty:
  - Easy = small XP
  - Medium = moderate XP  
  - Hard = significant XP
- Accumulated XP increases gorilla's level
- Level displayed prominently on main screen

### 4. Streak System
- Complete ALL daily tasks in a day = streak continues
- Consecutive days build streak count
- Streaks give small XP multiplier bonus
- Breaking a streak:
  - XP penalty
  - Gorilla mood drops to sad/angry

### 5. Gorilla Mascot (Animated)

**Always visible on the main dashboard**

**Mood States with idle animations:**
- **Happy** (bouncing, flexing) → User is consistent
- **Neutral** (calm, occasional stretches) → Mixed performance
- **Sad/Angry** (slouched, frustrated) → Missed tasks or broken streak

**Reactions:**
- Celebration animation when tasks completed
- Mood transitions based on performance
- Visual strength indicator grows with level

### 6. Boss Fight System

**Boss #1: "The Shadow of Sloth"**
- **Unlock requirement:** Level 5 + 5-day streak
- **Challenge rule:** Complete all daily tasks for 5 consecutive days
- **Duration:** 5 real-world days
- **Boss HP bar:** Decreases when user completes daily tasks, regenerates on missed days
- **Progress display:** HP bar only (no countdown timer)

**Win condition:** Reduce boss HP to zero
**Lose condition:** Boss still has HP after 5 days

**Consequences of losing:**
- Streak reset
- Temporary boss fight lockout

**Reward for winning:**
- "First Victory" profile badge

---

## Visual Design
- Cartoon/playful aesthetic
- Friendly, expressive gorilla character
- Vibrant colors that shift with gorilla mood
- Celebratory particle effects for achievements

---

## Technical Requirements
- Supabase for authentication and database
- Store tasks, XP, levels, streaks, and boss fight progress
- Profile badges stored per user

---

## Screens

1. **Auth Page** - Login/signup
2. **Dashboard** - Gorilla + today's tasks + streak counter + level display
3. **Add/Edit Task** - Create daily or time-frame tasks with difficulty
4. **Boss Arena** - View available bosses, start challenges, track active fight
5. **Profile** - Level, XP, streak history, earned badges

---

## Future Scope (Not in MVP)
- Multiple bosses with unique rules
- Cosmetic rewards (gorilla outfits/accessories)
- Passive bonuses from boss victories
- Social features (friend challenges)
- Task difficulty validation to prevent abuse

