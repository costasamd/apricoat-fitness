<!--
Sync Impact Report
- Version change: 0.0.0 → 1.0.0
- Modified principles: initial constitution established for Apricot Fitness Center
- Added sections: Engineering Standards; Team Collaboration & Quality Gates
- Removed sections: none
- Templates requiring updates: ✅ .specify/templates/plan-template.md, ✅ .specify/templates/spec-template.md, ✅ .specify/templates/tasks-template.md
- Follow-up TODOs: none
-->

# Apricot Fitness Center Constitution

## Core Principles

### I. Member Outcomes Over Feature Count
Apricot Fitness Center exists to help users achieve health goals through professional coaching, personalized plans, and trusted fitness products. Every product decision, feature, and workflow MUST improve member experience, support sustainable progression, or improve operational clarity. Features that do not directly help members train smarter, stay motivated, or make purchase and coaching experiences easier are not justified.

### II. Evidence-Based Fitness Guidance and Safety
Coaching content, recommendations, and program logic MUST be grounded in sound fitness principles and transparent assumptions. The platform MUST avoid unsafe or misleading guidance, especially around recovery, medical constraints, nutrition claims, and progression. When uncertainty exists, the system MUST default to safe, conservative guidance and direct users to appropriate professional support rather than over-claiming outcomes.

### III. Reliable, Accessible Product Experience
The platform MUST be usable, responsive, and dependable across desktop and mobile contexts. Core journeys such as onboarding, membership and plan selection, coaching access, and checkout must remain reliable under normal network and device constraints. Accessibility, clarity, and consistency are non-negotiable; every user-facing flow must be understandable and operable without unnecessary friction or ambiguity.

### IV. Strong Engineering Standards for the Required Stack
The implementation stack is Next.js with the App Router, TypeScript, and Tailwind CSS. All product work MUST follow these standards:
- TypeScript MUST be used in strict mode with no explicit `any` usage unless a narrowly justified exception is documented and approved.
- Tailwind MUST be the default styling system; utility-first composition is preferred and custom CSS should be avoided unless required for a genuine design or browser constraint.
- Next.js patterns MUST be followed: server components are the default, client components are used only when interactivity or browser APIs are required, and routing follows the file-based App Router conventions.
- Components, utilities, and modules MUST be organized for readability and reusability, with naming consistent with the project conventions below.

### V. Testability, Clear Ownership, and Team Collaboration
Every feature MUST be testable, reviewable, and understandable by the people who maintain it. Product and engineering work MUST be built in small, reversible increments with explicit ownership, documented intent, and measurable validation. We prefer clarity over cleverness, accountability over ambiguity, and continuous improvement over ad hoc delivery.

## Engineering Standards

- All application code MUST use TypeScript strict mode and avoid implicit `any`, unsafe casts, or silent fallback logic that hides type errors.
- Tailwind utility classes MUST be used as the primary styling approach. Custom CSS should only be introduced when Tailwind cannot express the requirement without adding unnecessary complexity or when required by a framework constraint.
- Next.js App Router conventions MUST be respected: route files, layouts, loading states, and metadata should follow the framework defaults; component boundaries must be chosen intentionally to keep server and client responsibilities clear.
- Server components are the default for data fetching and non-interactive rendering; client components SHOULD be limited to stateful UI, event handling, browser APIs, and interactive user flows.
- Components and hooks MUST use consistent naming conventions: PascalCase for React components, camelCase for variables and functions, kebab-case for route segments and file names, and UPPER_SNAKE_CASE for constants where appropriate.
- All critical user actions, especially flows involving coaching, plan access, purchases, and member data, MUST be covered by appropriate tests before merge or release.
- Test coverage MUST include the main happy path, the critical failure path, and any regression scenario that materially affects user trust or system reliability.
- Code quality checks, linting, and tests MUST run before release; no merge should ship known regressions in primary user journeys.

## Team Collaboration & Quality Gates

- Work MUST be broken into clear, feature-oriented tasks with explicit acceptance criteria and a clear owner.
- Pull requests MUST include a concise summary of purpose, affected areas, risk, and validation performed.
- Reviews MUST verify correctness, maintainability, and alignment to bundle standards such as TypeScript strictness, Tailwind usage, and App Router patterns.
- Design and implementation decisions MUST be documented when they affect the member experience, the product architecture, or the quality gate requirements.
- When a change impacts user trust, pricing, plan logic, or member data, it MUST be reviewed by the appropriate project stakeholder before release.
- A feature is not considered complete until it is tested, reviewed, and confirmed to meet the stated acceptance criteria.

## Governance

This constitution governs product, architecture, and delivery decisions for Apricot Fitness Center. It supersedes local preferences that conflict with it. Amendments require a documented rationale, a version bump, and review by the maintainers or designated project owners before enforcement.

Compliance with this constitution is required during planning, implementation, and release review. Teams MUST check that new work supports member outcomes, meets the required stack standards, and preserves reliability, safety, and clarity for the platform.

Versioning policy:
- MAJOR: backward-incompatible governance or principle changes
- MINOR: new principle or materially expanded guidance
- PATCH: wording, clarification, or non-semantic fixes

**Version**: 1.0.0 | **Ratified**: 2026-11-07 | **Last Amended**: 2026-11-07
